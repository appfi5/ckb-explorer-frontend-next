import type { Compiler, WebpackPluginInstance } from "webpack";

import fs from "node:fs";
import path from "node:path";
import Muban from "muban.js";
import fg from "fast-glob";

type I18nResourcePluginOptions = {
  entry: string;
  locales?: string[];
  namespaces?: string[];
};

type NSModule = { ns: string; id: string; path: string };

type EntryFileMetaData = {
  locale: string;
  modules: NSModule[];
};

class I18nResourcePlugin implements WebpackPluginInstance {
  private readonly name = "I18nResourcePlugin";
  private readonly options: I18nResourcePluginOptions;
  private isWatching = false;
  private watchers: fs.FSWatcher[] = [];

  constructor(options: Partial<I18nResourcePluginOptions>) {
    this.options = this.initOptions(options);
  }

  initOptions(
    options: Partial<I18nResourcePluginOptions> = {},
  ): I18nResourcePluginOptions {
    const { entry = "locales", locales, namespaces } = options;

    return { entry, locales, namespaces };
  }

  getLocales(root: string) {
    return fg.sync("*", {
      cwd: root,
      onlyDirectories: true,
    });
  }

  getNamespaces(root: string) {
    return Array.from(
      new Set(
        fg
          .sync("*/*.json", {
            cwd: root,
            onlyFiles: true,
          })
          .map((file) => path.basename(file, ".json")),
      ),
    );
  }

  apply(compiler: Compiler): void {
    compiler.hooks.initialize.tap(this.name, () => {
      try {
        this.generateResource();
      } catch (err) {
        console.warn(err);
      }
    });
    compiler.hooks.watchRun.tap(this.name, () => {
      const isDevelopment = compiler.options.mode === "development";

      if (!this.isWatching && isDevelopment) {
        console.log(
          `[${this.name}] Setting up file watchers in development mode`,
        );
        this.isWatching = true;
        this.setupWatchers();
      }
    });

    compiler.hooks.watchClose.tap(this.name, () => {
      this.cleanupWatchers();
      this.isWatching = false;
    });
  }

  private setupWatchers(): void {
    const localesDir = path.resolve(process.cwd(), this.options.entry);

    if (!fs.existsSync(localesDir)) {
      console.warn(`[${this.name}] Locales directory not found: ${localesDir}`);
      return;
    }

    const watcher = fs.watch(
      localesDir,
      { recursive: true },
      (_eventType, filename) => {
        if (filename && filename.endsWith(".json")) {
          this.generateResource();
        }
      },
    );

    this.watchers.push(watcher);
  }

  private cleanupWatchers(): void {
    this.watchers.forEach((watcher) => watcher.close());
    this.watchers = [];
  }

  private generateResource() {
    const {
      entry,
      locales = this.getLocales(entry),
      namespaces = this.getNamespaces(entry),
    } = this.options;

    const data: EntryFileMetaData[] = locales.map((locale) => {
      return {
        locale,
        modules: namespaces
          .filter((ns) =>
            fs.existsSync(path.resolve(entry, locale, `${ns}.json`)),
          )
          .map((ns) => {
            const id = `${locale.replace(/-/g, "_")}_${ns.replace(/[-\.]/g, "_")}`;
            const path = `./${locale}/${ns}.json`;
            return { id, ns, path };
          }),
      };
    });

    const resourceTemplate = fs.readFileSync(
      path.resolve(__dirname, "resource.tpl"),
      "utf-8",
    );
    fs.writeFileSync(
      path.resolve(entry, "index.ts"),
      new Muban(resourceTemplate).render({ data }),
    );
  }
}

export default I18nResourcePlugin;
