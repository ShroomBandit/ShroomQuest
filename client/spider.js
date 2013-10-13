spider = (function() {

    // General note:
    // a module's name is the same as its path minus what is set in the private basePath property
    // this is also the first argument of the public define(), import(), and execute() methods
 
        // storage for the modules' names that need to be executed as threads
    var executeOnReady = {},

        // storage for the modules' information
        registry = {},    

        settings = {
            // the base path to the modules
            basePath:'/',

            // a setting for indicating if the modules are all defined in the same file
            // should be set to false until all the js is concatenated
            concat:false
        },

    config = function(newSettings) {
        for(var option in newSettings) {
            settings[option] = newSettings[option];
        };
    },

    // print the registry in the console for testing
    debug = function() {
        console.log(registry);
    },

    // define a module using a constructor function
    // if a module is imported before it is defined,
    //   then it has been added to the registry,
    //   and it's importedBy property will not be empty,
    //   and it's ready property will be false
    define = function(module, constructor) {
        if(typeof registry[module] === 'undefined') {
            // module was not imported by any previously defined modules
            registry[module] = {
                importedBy:[]
            };
        };
        // add more information pertinent to the module
        var dependencies = findDependencies(constructor);
        registry[module].constructor = constructor;
        registry[module].dependencies = dependencies;
        // register each of the module's dependencies, loading them if needed
        for(var i = 0, ilen = dependencies.length; i < ilen; i++) {
            if(typeof registry[dependencies[i]] === 'undefined') {
                // dependency module was not imported by any previously defined modules
                registry[dependencies[i]] = {
                    importedBy:[],
                    ready:false
                };
                if(!settings.concat) {
                    load(dependencies[i]);
                };
            };
            // the module name is saved in each dependency module so that
            //   readiness can propagate up the module tree
            registry[dependencies[i]].importedBy.push(module);
        };
        propagateReadiness(module);
    },

    // build the application once all modules are resolved
    execute = function(module) {
        if(typeof registry[module] !== 'undefined' && registry[module].ready) {
            registry[module].constructor();
        }else{
            executeOnReady[module] = true;
            if(!settings.concat) {
                load(module);
            };
        };
    },

    // determine a module's dependencies by looking for the module.import() method
    //   and extracting the argument
    // returns an array of module modules
    findDependencies = function(constructor) {
        var dependencies = [],
            constructorString = constructor.toString(),
            regex = /spider\.import\('([\w\/]*)'\)/g,
            match = regex.exec(constructorString);
        while(match) {
            dependencies.push(match[1]);
            match = regex.exec(constructorString);
        };
        return dependencies;
    },
    
    // load a script from the server in a new script tag
    // delete the script tag once the js has been parsed
    load = function(module) {
        var script = document.createElement('script');
        script.src = settings.basePath + module + '.js';
        script.addEventListener('load', function() {
            script.parentNode.removeChild(script);
        });
        document.getElementsByTagName('head')[0].appendChild(script);
    },

    // resolve the readiness of any modules that import the given module
    // will atttempt to propagate up the module tree
    // also checks ready modules against the list of modules to be executed when ready,
    //   as are determined by the module.exec() method
    propagateReadiness = function(module) {
        var ready = testReadiness(module);
        registry[module].ready = ready;
        if(ready) {
            if(executeOnReady[module]) {
                delete executeOnReady[module];
                registry[module].constructor();
            }else{
                var requestingModules = registry[module].importedBy;
                for(var i = 0, ilen = requestingModules.length; i < ilen; i++) {
                    propagateReadiness(requestingModules[i]);
                };
            };
        };
    },

    // look at the readiness of all the dependencies of a module
    // return true if all dependencies are ready, false otherwise
    testReadiness = function(module) {
        var dependencies = registry[module].dependencies;
        for(var i = 0, ilen = dependencies.length; i < ilen; i++) {
            if(!registry[dependencies[i]].ready) {
                return false;   
            };
        };
        return true;
    };
    
    return {
        config:config,
        debug:debug,
        define:define,
        execute:execute,

        // import a module into the app
        // return the module object
        // can only be called inside the constructor passed to the define() method
        import:function(module) {
            if(typeof registry[module].obj === 'undefined') {
                registry[module].obj = registry[module].constructor();
            };
            return registry[module].obj;
        }
    };

}());
