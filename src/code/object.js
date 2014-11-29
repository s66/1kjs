
function $each(obj, fn, context){
    if($isArray(obj)){
        for(var i = 0, lg = obj.length; i < lg; i++){
            if(fn.call(context, obj[i], i)){
                break;
            }
        }
    }else{
        for(var i in obj){
            if(fn.call(context, obj[i], i)){
                break;
            }
        }
    }
}
;;;;;
function $toJson(obj){
    switch(typeof obj){
        case 'object':
            if(obj == null){
                return obj;
            }
            var E, _json = [];
            if(Object.prototype.toString.apply(obj) == '[object Array]'){
                for(var e = 0, L = obj.length; e < L; e++){
                    _json[e] = arguments.callee(obj[e]);
                }
                return '[' + _json.join(',') + ']';
            }
            for(e in obj){
                _json.push('"' + e + '":' + arguments.callee(obj[e]));
            }
            return '{' + _json.join(',') + '}';
        case 'function':
            obj = '' + obj;
        case 'string':
            return '"' + obj.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\r/g, '\\r').replace(/\n/g, '\\n') + '"';
        case 'number':
        case 'boolean':
        case 'undefined':
            return obj;
    }    
    return obj;
}
;;;;;
function $param(obj, nocache){
    var query = [];
    if(typeof obj == 'object'){
        for(var E in obj){
            if(/^e_/.test(E)){
                query.push(E.substr(2) + '=' + $encodeURL(obj[E]));
            }else{
                query.push(E + '=' + obj[E]);
            }
        }
    }
    if(nocache)query.push('t=' + (+new Date));
    return query.join('&');
}
;;;;;
function $mix(target, source){
    for(var key in source){
        target[key] = source[key];
    }
}

