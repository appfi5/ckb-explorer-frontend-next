import classNames from "classnames";
import { isNil } from "lodash";
import type { ReactNode } from "react";


type PropertyPlainValue = string | number | boolean | null | undefined;

type PropertyField = [string | number | undefined, PropertyPlainValue | object | Array<PropertyPlainValue | object>];


type JsonViewerProps = {
  source: PropertyField['1'];
  rootName?: string;
  propertyClassName?: string;
  /**
   * path always start with rootName || "root"
   */
  onRenderTags?: (path: string, value: any) => ReactNode
  /**
   * 
   * only works at plain value type
   */
  onRenderValue?: (path: string, value: any) => ReactNode
}

const defalutOnRenderValue = (_: string, a: PropertyPlainValue) => `${a}`
export default function SimpleJsonViewer(props: JsonViewerProps) {
  const { source, rootName, onRenderTags, onRenderValue = defalutOnRenderValue, propertyClassName } = props;
  return (
    <RenderProperty
      field={[rootName, source]}
      onRenderTags={onRenderTags}
      onRenderValue={onRenderValue}
      propertyClassName={propertyClassName}
    />
  )
}


type RenderPropertyProps = Pick<JsonViewerProps, "onRenderTags" | "onRenderValue" | "propertyClassName"> & {
  parentPath?: string,
  field: PropertyField,
  showPropertyName?: boolean
}

function RenderProperty(props: RenderPropertyProps) {
  const { showPropertyName = true, field, parentPath, onRenderTags, onRenderValue, propertyClassName } = props;
  const [key, value] = field;
  const valueType = typeof value;
  const rootPath = [parentPath, key].filter(path => !isNil(path)).join(".") || "root"
  const valueIsArray = Array.isArray(value);
  const valueIsObject = !valueIsArray && !isNil(value) && valueType === 'object';
  const [bracketLeft, bracketRight] = valueIsArray
    ? ['[', ']']
    : valueIsObject
      ? ['{', '}']
      : [];
  const isPlainValueType = valueType !== 'object' || isNil(value);
  const emptyObjectType = valueType === 'object' && !isNil(value) && (Object.keys(value || {}).length === 0);
  return (
    <div className={classNames("flex", isPlainValueType || emptyObjectType ? "flex-row items-start" : "flex-col")}>
      <div className={classNames("flex-none flex flex-row items-center gap-2", propertyClassName)}>
        {!isNil(key) && showPropertyName ? (<span>{key}:</span>) : null}
        <div className="flex flex-row items-center gap-2">
          <span>{bracketLeft}</span>
          {bracketLeft && onRenderTags?.(rootPath, value)}
        </div>
      </div>
      <div
        className={classNames("min-w-0 flex flex-col", !emptyObjectType ? "flex-1" : "w-2")}
        style={{
          paddingLeft: !isPlainValueType && !emptyObjectType ? "var(--jsonviewer-padding-left, 20px)" : "",
        }}
      >
        {
          valueIsArray
            ? (
              <div className="flex flex-col">
                {
                  value.map((item, index) => {
                    return (
                      <RenderProperty
                        showPropertyName={false}
                        key={index}
                        propertyClassName={propertyClassName}
                        parentPath={rootPath}
                        field={[index, item]}
                        onRenderTags={onRenderTags}
                        onRenderValue={onRenderValue}
                      />
                    )
                  })
                }
              </div>
            )
            : valueIsObject
              ? (
                <div className="flex flex-col">
                  {
                    Object.entries(value).map(([key, item]) => {
                      return (
                        <RenderProperty
                          key={key}
                          propertyClassName={propertyClassName}
                          parentPath={rootPath}
                          field={[key, item]}
                          onRenderTags={onRenderTags}
                          onRenderValue={onRenderValue}
                        />
                      )
                    })
                  }
                </div>
              )
              : (
                <>
                  <div className="min-w-0 break-all">
                    {onRenderValue?.(rootPath, value)}
                  </div>
                  {
                    onRenderTags?.(rootPath, value)
                  }
                </>
              )
        }

      </div>
      {bracketRight
        ? <span>{bracketRight}</span>
        : null}
    </div>
  )
}