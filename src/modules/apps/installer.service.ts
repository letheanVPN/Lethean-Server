import { PluginConfig, PluginType } from "../../interfaces/apps/plugin-config.ts";
import { StoredObjectService } from "../../services/config/store.ts";
import { LetheanDownloadService } from "../../services/download.service.ts";
import { FileSystemService } from "../../services/fileSystemService.ts";
import { ensureDir, path } from "../../../deps.ts";
import { AppManagerConfig } from "./config.service.ts";


export class AppManagerInstaller {

  public apps: any;

  constructor() {
    this.apps = new AppManagerConfig()
  }
  /**
   * Attempts to install the package locally
   *
   * @returns {Promise<boolean>}
   */
  async install(name: string, pkg: string) {
    try {

      // obviously lots wrong here, i know, validation
      const jsonResponse = await fetch(pkg, { cache: "no-cache" });
      const pluginConfig = await jsonResponse.json() as PluginConfig;


      if (pluginConfig["code"] == name) {
        /**
         * for types bin and core, we are just downloading backend services to be used by te server
         */
        await this.installDependants(pluginConfig);
        await this.installDownload(pluginConfig);
        StoredObjectService.setObject({ group: "apps", object: pluginConfig["code"], data: JSON.stringify(pluginConfig) });

        this.apps[pluginConfig["code"]] = { "name": pluginConfig["name"], "version": pluginConfig["version"], "pkg": pkg };

        if (pluginConfig["type"] == "app") {
          this.apps[pluginConfig["code"]]["directory"] = `apps/${pluginConfig["code"].split("-").join("/")}`;

          if (pluginConfig["menu"]) {
            await this.installMenu(pluginConfig);
          }
          return;
        }
      } else {
        // @todo finish cleaning this up
        console.log(`Package code miss match. ${pluginConfig["code"]} ${name}`);
        return false;
      }

    } catch (e) {
      console.log(e);
      return false;
    }
    return true;
  }

  /**
   *
   * @param {PluginConfig} plugin
   * @returns {Promise<void>}
   */
  async installDownload(plugin: PluginConfig) {

    if (plugin["type"] === PluginType.BIN || plugin["type"] === PluginType.CORE) {

      let installDir = "";

      if (Deno.build.arch == "aarch64" && plugin["downloads"] && plugin["downloads"]["aarch64"]) {

        await LetheanDownloadService.downloadContents(
          plugin["downloads"]["x86_64"][Deno.build.os]["url"],
          installDir
        );
      } else if (plugin["downloads"]) {
        await LetheanDownloadService.downloadContents(
          plugin["downloads"][Deno.build.arch][Deno.build.os]["url"],
          installDir
        );

      }

      if (plugin["namespace"]) {
        await ensureDir(FileSystemService.path(path.join("data", plugin["namespace"])));
        await ensureDir(FileSystemService.path(path.join("conf", plugin["namespace"])));
      }

    } else if (plugin["type"] && PluginType.APP) {

      if (plugin["downloads"]) {
        await LetheanDownloadService.downloadContents(
          plugin["downloads"]["app"],
          `apps/${plugin["code"].split("-").join("/")}`
        );
      } else if (plugin["app"]) {
        await LetheanDownloadService.downloadContents(
          plugin["app"]["url"],
          `apps/${plugin["code"].split("-").join("/")}`
        );
        if (plugin["app"]["hooks"] && plugin["app"]["hooks"]["rename"] &&
          plugin["app"]["hooks"]["rename"]["from"] &&
          plugin["app"]["hooks"]["rename"]["to"]) {
          Deno.renameSync(`apps/${plugin["code"].split("-").join("/")}/${plugin["app"]["hooks"]["rename"]["from"]}`,
            `apps/${plugin["code"].split("-").join("/")}/${plugin["app"]["hooks"]["rename"]["to"]}`);
        }
      }


    } else {
      console.log("Plugin type not known");
      return false;
    }

  }

  installDependants(plugin: PluginConfig) {
    if (plugin["depends"] && plugin["depends"].length > 0) {
      plugin["depends"].forEach((item: string) => {
        console.log(item);
      });
    }
  }


  /**
   * adds menu entries to application menu
   *
   * @param {PluginConfig} plugin
   * @returns {boolean}
   */
  installMenu(plugin: PluginConfig) {
    let menu = JSON.parse(StoredObjectService.getObject({ group: "apps", object: "menu" }) as string);
    if (!menu.forEach((item: any) => {
      if (item["title"]) {
        return true;
      }
    })) {
      menu.push({ app: plugin["code"], ...plugin["menu"]["main"] });
    }
    return StoredObjectService.setObject({ group: "apps", object: "menu", data: JSON.stringify(menu) });

  }

  /**
   * Uninstall user installed application
   *
   * @param {string} code
   * @returns {boolean | boolean}
   */
  uninstall(code: string): boolean {
    if (this.apps[code] && this.apps[code]["directory"]) {
      FileSystemService.delete(this.apps[code]["directory"]);
      try {
        let menu = JSON.parse(StoredObjectService.getObject({ group: "apps", object: "menu" }) as string);
        let newMenu: string[] = menu.map((item: any) => {
          if (item["title"] !== code) {
            return item;
          }
        });
        return StoredObjectService.setObject({ group: "apps", object: menu, data: JSON.stringify(newMenu) });
      } catch (e) {
        return false;
      }
    }





    return false;

  }

}