import { mol } from '@ckb-ccc/core'
import { type CodecMap, builtinCodecs } from './constants'

interface SchemaDefinition {
  type: 'struct' | 'table' | 'vector' | 'option' | 'array'
  fields?: Record<string, string>
  itemType?: string
  itemCount?: number
}

class MoleculeSchemaParser {
  private definitions: Map<string, SchemaDefinition> = new Map()
  private codecs: CodecMap = { ...builtinCodecs }
  private codecsTasks: Array<{ key: string, condition: () => boolean; run: () => void }> = []
  private appendCodecsTask(depTypes: string[], task: () => void) {
    if (depTypes.every(type => !!this.getCodec(type))) {
      task();
    } else {
      this.codecsTasks.push({
        key: depTypes.join(','),
        condition: () => depTypes.every(type => !!this.getCodec(type)),
        run: task
      })
    }
  }

  private registCodec(name: string, codec: mol.CodecLike<any>) {
    this.codecs[name] = codec;
    const [remainTasks, tasksToRun] = this.codecsTasks.reduce(([remainTasks, tasksToRun], task) => {
      if (task.condition()) {
        tasksToRun.push(task);
      } else {
        remainTasks.push(task);
      }
      return [remainTasks, tasksToRun];
    }, [[] as typeof this.codecsTasks, [] as typeof this.codecsTasks]);

    this.codecsTasks = remainTasks;
    tasksToRun.forEach(task => {
      task.run()
    })
  }

  parseSchema(schema: string): CodecMap {
    this.definitions.clear()
    this.codecs = { ...builtinCodecs }
    this.codecsTasks = [];

    // Remove comments and normalize whitespace
    const cleaned = schema
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('//'))
      .join(' ')
      .replace(/\s+/g, ' ')

    // First pass: collect all type definitions using block parsing
    this.parseBlocks(cleaned)

    // Second pass: create codecs for all definitions
    for (const [typeName, definition] of this.definitions) {
      this.createCodec(typeName, definition)
    }


    if(this.codecsTasks.length !== 0) {
      console.warn("codec register not complete", {
        remainTasks: this.codecsTasks
      })
    }

    return this.codecs
  }

  private parseBlocks(schema: string) {
    let pos = 0

    while (pos < schema.length) {
      // Skip whitespace
      while (pos < schema.length && /\s/.test(schema[pos])) {
        pos++
      }

      if (pos >= schema.length) break

      // Try to parse each type of definition
      const remaining = schema.substring(pos)

      // Parse struct: struct TypeName { ... }
      const structMatch = remaining.match(/^struct\s+(\w+)\s*\{/)
      if (structMatch) {
        const typeName = structMatch[1]
        const braceStart = pos + structMatch[0].length - 1
        const braceEnd = this.findMatchingBrace(schema, braceStart)
        if (braceEnd !== -1) {
          const fieldsStr = schema.substring(braceStart + 1, braceEnd)
          const fields = this.parseFields(fieldsStr)
          this.definitions.set(typeName, { type: 'struct', fields })
          pos = braceEnd + 1
          continue
        }
      }

      // Parse table: table TypeName { ... }
      const tableMatch = remaining.match(/^table\s+(\w+)\s*\{/)
      if (tableMatch) {
        const typeName = tableMatch[1]
        const braceStart = pos + tableMatch[0].length - 1
        const braceEnd = this.findMatchingBrace(schema, braceStart)
        if (braceEnd !== -1) {
          const fieldsStr = schema.substring(braceStart + 1, braceEnd)
          const fields = this.parseFields(fieldsStr)
          this.definitions.set(typeName, { type: 'table', fields })
          pos = braceEnd + 1
          continue
        }
      }

      // Parse vector: vector TypeName <ItemType>
      const vectorMatch = remaining.match(/^vector\s+(\w+)\s*<(\w+)>/)
      if (vectorMatch) {
        const [fullMatch, typeName, itemType] = vectorMatch
        this.definitions.set(typeName, { type: 'vector', itemType })
        pos += fullMatch.length
        continue
      }

      // Parse option: option TypeName (InnerType)
      const optionMatch = remaining.match(/^option\s+(\w+)\s*\((\w+)\)/)
      if (optionMatch) {
        const [fullMatch, typeName, itemType] = optionMatch
        this.definitions.set(typeName, { type: 'option', itemType })
        pos += fullMatch.length
        continue
      }

      // Parse array: array TypeName [Type; count]
      const arrayMatch = remaining.match(/^array\s+(\w+)\s*\[(\w+);\s*(\d+)\]/)
      if (arrayMatch) {
        const [fullMatch, typeName, itemType, countStr] = arrayMatch
        this.definitions.set(typeName, { type: 'array', itemType, itemCount: parseInt(countStr, 10) })
        pos += fullMatch.length
        continue
      }

      // Skip semicolons and other separators
      if (schema[pos] === ';') {
        pos++
        continue
      }

      // If we can't parse anything, advance by one character to avoid infinite loop
      pos++
    }
  }

  private findMatchingBrace(text: string, startPos: number): number {
    let depth = 0
    for (let i = startPos; i < text.length; i++) {
      if (text[i] === '{') {
        depth++
      } else if (text[i] === '}') {
        depth--
        if (depth === 0) {
          return i
        }
      }
    }
    return -1
  }

  private parseFields(fieldsStr: string): Record<string, string> {
    const fields: Record<string, string> = {}

    // Split by comma, but be careful about commas within type definitions
    const fieldPairs = this.splitFields(fieldsStr)

    for (const pair of fieldPairs) {
      const colonIndex = pair.indexOf(':')
      if (colonIndex > 0) {
        const fieldName = pair.substring(0, colonIndex).trim()
        const fieldType = pair
          .substring(colonIndex + 1)
          .trim()
          .replace(/[,;]$/, '') // Remove trailing comma or semicolon

        if (fieldName && fieldType) {
          fields[fieldName] = fieldType
        }
      }
    }

    return fields
  }

  private splitFields(fieldsStr: string): string[] {
    const fields: string[] = []
    let current = ''
    let depth = 0

    for (let i = 0; i < fieldsStr.length; i++) {
      const char = fieldsStr[i]

      if (char === '<' || char === '(' || char === '[') {
        depth++
      } else if (char === '>' || char === ')' || char === ']') {
        depth--
      } else if (char === ',' && depth === 0) {
        if (current.trim()) {
          fields.push(current.trim())
        }
        current = ''
        continue
      }

      current += char
    }

    if (current.trim()) {
      fields.push(current.trim())
    }

    return fields
  }

  private createCodec(typeName: string, definition: SchemaDefinition) {
    switch (definition.type) {
      case 'struct':
        this.appendCodecsTask(
          Object.entries(definition.fields).map(field => field[1]),
          () => {
            const codecLayout: any = {}
            for (const [fieldName, fieldType] of Object.entries(definition.fields)) {
              const codec = this.getCodec(fieldType)
              codecLayout[fieldName] = codec
            }
            this.registCodec(typeName, mol.struct(codecLayout))
          }
        )
        break

      case 'table':
        this.appendCodecsTask(
          Object.entries(definition.fields).map(field => field[1]),
          () => {
            const codecLayout: any = {}
            for (const [fieldName, fieldType] of Object.entries(definition.fields!)) {
              const codec = this.getCodec(fieldType)
              codecLayout[fieldName] = codec
            }
            this.registCodec(typeName, mol.table(codecLayout))
          }
        )
        break

      case 'vector':
        this.appendCodecsTask(
          [definition.itemType!],
          () => {
            const itemCodec = this.getCodec(definition.itemType!)
            this.registCodec(typeName, mol.vector(itemCodec))
          }
        )
        break

      case 'option':
        this.appendCodecsTask(
          [definition.itemType!],
          () => {
            const itemCodec = this.getCodec(definition.itemType!)
            this.registCodec(typeName, mol.option(itemCodec))
          }
        )
        break

      case 'array':
        if(!definition.itemCount) {
          throw new Error(`Array type ${typeName} should have itemCount`);
        }
        this.appendCodecsTask(
          [definition.itemType!],
          () => {
            const itemCodec = this.getCodec(definition.itemType!)
            this.registCodec(typeName, mol.array(itemCodec, definition.itemCount!))
          }
        )
        break
      default:
        break
    }
  }

  private getCodec(typeName: string): any {
    return this.codecs[typeName]
  }
}

// Export the parser instance
export const moleculeParser = new MoleculeSchemaParser()

// Function to parse schema and get codecs
export function parseSchema(schema: string): CodecMap {
  return moleculeParser.parseSchema(schema)
}
