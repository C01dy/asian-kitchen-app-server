const vm = require("vm");
const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");
const EventEmitter = require("events");

const db = require("./pg/Database");

class Application {
  constructor(rootDir) {
    this.rootDir = rootDir;
    // this.namespaces = ["db"
    this.domainPath = path.resolve(rootDir, "layers", "domain");
    this.infraPath = path.resolve(rootDir, "layers", "infra");
    this.isInit = true;
  }

  async init() {
    if (this.isInit) {
      await this.loadDomain();
      return this;
    }
  }

  async loadDomain() {
    const modulePath = path.resolve(this.domainPath, "module");
    const domainModules = await fsp.readdir(modulePath);
    const domain = {};

    for (const moduleName of domainModules) {
      const moduleItems = await fsp.readdir(
        path.resolve(modulePath, moduleName),
      );
      domain[moduleName.toLowerCase()] = {};

      for (const moduleItem of moduleItems) {
        const [entityName, kind] = path.parse(moduleItem).name.split(".");
        const moduleFilePath = path.resolve(modulePath, moduleName, moduleItem);
        const moduleSrc = await fsp.readFile(moduleFilePath, "utf-8");
        const moduleScript = new vm.Script(moduleSrc);
        const RUN_OPTIONS = { timeout: 5000, displayErrors: false };

        domain[entityName][kind] = moduleScript.runInThisContext(RUN_OPTIONS);
      }
    }

    this.domain = domain;
  }

  async loadInfra() {
    const modulePath = path.resolve(this.domainPath, "module");
    const domainModules = await fsp.readdir(modulePath);
    const domain = {};

    for (const moduleName of domainModules) {
      const moduleItems = await fsp.readdir(
        path.resolve(modulePath, moduleName),
      );
      domain[moduleName.toLowerCase()] = {};

      for (const moduleItem of moduleItems) {
        const [entityName, kind] = path.parse(moduleItem).name.split(".");
        const moduleFilePath = path.resolve(modulePath, moduleName, moduleItem);
        const moduleSrc = await fsp.readFile(moduleFilePath, "utf-8");
        const moduleScript = new vm.Script(moduleSrc);
        const RUN_OPTIONS = { timeout: 5000, displayErrors: false };

        domain[entityName][kind] = moduleScript.runInThisContext(RUN_OPTIONS);
      }
    }
  }

  async loadModules() {
    const domainModules = await fsp.readdir(modulePath);
    const domain = {};

    for (const moduleName of domainModules) {
      const moduleItems = await fsp.readdir(
        path.resolve(modulePath, moduleName),
      );

      for (const moduleItem of moduleItems) {
        const [entityName, kind] = path.parse(moduleItem).name.split(".");

        const sandbox = { fsp: fsp, db: db(entityName), require };
        const context = vm.createContext(sandbox);

        console.log(">>> ", entityName, kind);
      }
    }
  }
}

async function run() {
  const createApp = new Application(
    "/home/vladm/pet_projects_2023/asian-kitchen-app-server/src",
  );
  const app = await createApp.init();

  const domainApp = app.domain;
  console.log("domainApp :>> ", domainApp);
}

(async function () {
  await run();
})();
