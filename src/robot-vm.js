const ivm = require('isolated-vm');
const fs = require('fs');
const ivmInspect = require('ivm-inspect')
const Robot = require('./robot')

class RobotVM {

    constructor() {
        this.vm = new ivm.Isolate()
        this.context = this.vm.createContextSync()
        this.modules = {}
        this.isLoaded = false;
    }

    //Recursively loads all modules
    loadModule(path, filename) {
        //Compile module
        let code = fs.readFileSync(path + filename, 'utf-8');
        let mod = this.vm.compileModuleSync(code, {filename: path + filename});

        //Modules are stored with the root path included to avoid conflicts
        let modPath = path + filename;
        this.modules[modPath] = mod;

        //Does this module have any dependencies?
        if (mod.dependencySpecifiers.length > 0) {
            for (let dependency of mod.dependencySpecifiers) {
                //If we haven't loaded this module yet
                if (this.modules[path + dependency] === undefined) {
                    //Load it
                    this.loadModule(path, dependency);
                }
            }
        }

        //All dependencies should be resolved, we can now instantiate and evaluate
        mod.instantiateSync(this.context, (dependency) => {
            if (this.modules[path + dependency] === undefined) {
                //Something went horribly wrong
                throw Error('Could not initiate module "' + filename + '", dependency "' + dependency + '" not loaded.');
            }

            return this.modules[path + dependency];
        });
        mod.evaluateSync();
        this.modules[filename] = mod;
    }

    async installGlobals() {
        let jail = this.context.global;

        jail.setSync('global', jail.derefInto());
        
        const util = await ivmInspect.create(this.vm, this.context)
        await ivmInspect.forwardConsole(this.context, util);


    }
}

module.exports = RobotVM;