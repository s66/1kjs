function $isArray(obj){
    return $type(obj) == 'array';
}
;;;;;
function $isFunction(obj){
    return typeof obj == 'function';
}
;;;;;
function $isElement(obj){
    return $type(obj) == 'element';
}
;;;;;
function $isDom(obj){
    return obj && obj.__DOM__;
}
;;;;;
function $isUndefined(obj){
    return obj === undefined;
}
;;;;;
function $isObject(obj){
    return $type(obj) == 'object';
}
;;;;;
function $type(obj){
    var type = typeof obj;      
    if(type == 'object'){
        if(obj === null ){
            return 'null';
        }else if(obj == $WIN || obj == obj.window){
            return 'window';
        }else if(obj == $DOC || obj.nodeType === 9){
            return 'document';
        }
        type = {}.toString.call(obj).match(/\w+(?=\])/)[0].toLowerCase();
        if(~type.indexOf('element') || type == 'object' && obj.nodeType === 1){
            return 'element';
        }
    }
    return type;
}
/*
    alert($type(/a/));
    alert($type(document.getElementsByTagName('div')[0]));
    alert($type(null));
    alert($type(void 0));
    alert($type(new Date));
    alert($type(function(){}));
    alert($type([]));
    alert($type(2121));
    alert($type(true));
    alert($type(window));
    alert($type(document));
*/