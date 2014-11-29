$PID = 1;
;;;;;
$GUID = 1;
;;;;;
$WIN = window;
;;;;;
$DOC = document;
;;;;;
$DE = $DOC.documentElement;
;;;;;
$HEAD = $DOC.head || $query('head')[0];
;;;;;
$DP = $Dom.prototype;
;;;;;
$queryAll = $DOC.querySelectorAll;
;;;;;
$Class = function(){
    return{
        extend: extend
    };
    function extend(){
        function Class(args){
            if(this instanceof Class){ //已经实例化，调用init
                if(this.init){ //自动new的情况，所有参数都会存在args.____中，否则取全部参数，注意args中不能传递args.____
                    this.init.apply(this, args && args.____ ? args.____ : arguments);
                }
            }else{
                return new Class({
                    ____: arguments
                });
            }
        }

        Class.prototype = function(prop, source){
            empty.prototype = this.prototype;
            var 
            method,
            superMethod,
            superProp = new empty, //通过空函数实现只继承原型
            i;
            for(i in prop){
                method = prop[i];
                superMethod = superProp[i];
                superProp[i] = //需要调用父类的方法，则使用闭包进行包装
                $isFunction(method) 
                && $isFunction(superMethod) 
                && /\._super\(/.test(method) //函数体包含._super(      
                ? pack(method, superMethod) : method;
            }
            if(source){
                for(i in source){
                    Class[i] = source[i];
                }
            }
            superProp.constructor = Class;
            superProp.superclass = this;
            return superProp;
            
            function empty(){}
            function pack(method, superMethod){
                return function(){
                    this._super = superMethod;
                    var ret = method.apply(this, arguments);
                    this._super = null;
                    return ret;
                };
            }
        }.apply(this, arguments);
        
        Class.extend = extend; //实现链式，执行Class.extend()时，this自动指向Class
        return Class;
    }
}();
;;;;;
function $Erro(msg){
    return {msg:msg};
}
;;;;;
function $noop(){}