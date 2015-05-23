/*
for module code easy
v1.01
2015.5.1
*/
!function(){
  var
  modules = {
    
  },
  end;
    
  this.module = module;
    
  function module(id, depends, callback){
    if(typeof depends == 'function'){
      callback = depends;
      depends = null;
    }
    
    if(typeof id != 'string'){
      return error('error id');
    }
    if(depends && {}.toString.call(depends) != '[object Array]'){
      return error('error depends');
    }
    if(typeof callback != 'function'){
      return error('error callback');
    }
    var module = modules[id] = modules[id] || {};
    module.id = id;
    ;;;log('load module.'+id);
    if(depends){
      module.use = [];
      for(var i = 0; i < depends.length; i++){
        var useModule = modules[depends[i]] = modules[depends[i]] || {
          beuse: []  
        };
            
        if(useModule.beuse){
          module.use.push(useModule);
          useModule.beuse.push(module);
        }
      }
      if(module.use.length == 0){
        evalModule(depends, callback);
      }else{
          module.evalModule = function(){
          evalModule(depends, callback);
          module.evalModule = null;
        };
      }
        
    }else{
      evalModule([], callback);
    }
    
    function evalModule(depends, callback){
      var args = [];
      for(var i = 0; i < depends.length; i++){
        args.push(modules[depends[i]].hook);
      }
      module.hook = callback.apply(this, args);
      ;;;log('eval module.'+id);
      if(module.beuse){
        for(var i = 0; i < module.beuse.length; i++){
          var beUseModule = module.beuse[i];
          if(beUseModule.use.length == 1){
            beUseModule.evalModule();
          
          }else{
            for(var j = 0; j < beUseModule.use.length; j++){
              if(beUseModule.use[j] == module){
                beUseModule.use.splice(j, 1);
                break;
              }
              
            }
          }
      
        }
        module.beuse = null;
      }
    }

  }

  function error(msg){
    log(msg);
  }
  function log(msg){
    if(typeof console != 'undefined' && console.log){
      console.log(msg);
    }
  }
  module.setLog = function(fn){
    log = fn;
  };
}();

