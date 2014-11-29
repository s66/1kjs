function $query(){
    var
    rQuickExpr = /^([#.])?([\w\-]+|\*)$/,
    rChildExpr = /^(?:#([\w\-]+))|([\w-]+)?(?:\.([\w\-]+))?(?:\[(.+)\])?$/, //[id,tag,cls,attr]
    rChildExpr2 = /(?:[\w\-]+)?(?:\.[\w\-]+)?(?:\[.+\])?/.source,
    rAllExpr = RegExp('^(#[\\w\\-]+|'+rChildExpr2+')(?:\\s+('+rChildExpr2+'))$'),
    suportSel = $DOC.querySelectorAll,
    uid = 0;
    return ($query = query).apply(null, arguments);
    function query(selector, context){
        var
        result,
        elems,
        match = rQuickExpr.exec(selector),
        m1, m2;
        if(match){ //快速匹配 #id,.cls,tag
            m1 = match[1];
            m2 = match[2];
            if(m1 == '#'){
                return $DOC.getElementById(m2);
            }
            if(m1 == '.'){
                if($DOC.getElementsByClassName){
                    return makeArray((context || $DOC).getElementsByClassName(m2));
                }else{
                   return filterByClassName(query('*', context), m2);
                }
            }
            return makeArray((context || $DOC).getElementsByTagName(m2));
        }
        if(suportSel){
            
            if(context && context.nodeType != 9 ){
                var 
                oldid = context.id,
                fixid = '_queryFix_';
                selector = '#' + (context.id = fixid) + ' '+ selector;
            }
            
            (elems = (context || $DOC).querySelectorAll(selector)) && (elems = unique(elems));
            fixid && (oldid ? (context.id = oldid) : context.removeAttribute('id'));
            return elems.length ? elems : null;
        }else{
            
            if(~selector.indexOf(',')){
                result = [];
                forEach(selector.split(','), function(selector){
                    (elems = query(selector, context)) && (elems.length ? (result = result.concat(elems)) : result.push(elems));
                });
                return result.length ? unique(result) : null;
            }else{
                match = rAllExpr.exec(selector);

                if(match){ //#id tag
                    m1 = match[1];
                    m2 = match[2];
                    elems = query(m1, context);
                    
                    if(elems){
                        if(m2){ //=> #id tag.cls[attr=val] 
                            result = [];
                            var ret;
                            forEach(elems.length ? elems : [elems], function(context){
                                (ret = query(m2, context)) && (ret.length ? (result = result.concat(ret)) : result.push(ret));
                            });
                            
                            return result.length ? unique(result) : null;
                        }else{
                            return elems;
                        }
                    }
                    return null; 
                }else{
                    match = rChildExpr.exec(selector);
                    if(match){
                        var 
                        id = match[1],
                        tag = match[2],
                        cls = match[3],
                        attr = match[4];
                        if(id){
                            return query(id);
                        }
                        elems = query(tag || '*', context);
                        cls && (elems = filterByClassName(elems, cls));
                        attr && (elems = filterByAttr(elems, attr));
                        return elems;
                    }
                    return null;
                } 
            }
        }
    }
    function forEach(arr, fn){
        if(arr && arr.length){
            for(var i = 0, lg = arr.length; i < lg; i++){
                fn(arr[i], i);
            }
        }
    }
    function makeArray(elems){
        if(!elems){
            return null;
        }
        var result = [];
        if(+[1,]){
            result = [].slice.call(elems, 0);
        }else{
            forEach(elems, function(elem){
                result.push(elem);
            });
        }
        return result.length ? result : null;
    }
    function unique(elems){
        ++uid;
        var result = [];
        forEach(elems, function(elem){
            if(elem._forUnique_ != uid){
                elem._forUnique_ = uid;
                result.push(elem);
            }
        });
        return result;
    }
    function filterByClassName(elems, className){
        var
        rClassName = RegExp('(^|\\s+)'+ className +'($|\\s+)'),
        result = [];
        forEach(elems, function(elem){
            rClassName.test(elem.className) && result.push(elem); 
        });
        return result.length ? result : null;
    }
    function filterByAttr(elems, attr){
        var 
        result = [],
        key, val;
        attr = attr.split('=');
        if(attr.length == 2){
            key = attr[0];
            val = attr[1] || '';
        }
        forEach(elems, function(elem){
            if(val){
                (elem.getAttribute(key) == val) && result.push(elem);
            }else{
                elem.hasAttribute(attr) && result.push(elem);
            }
            
        });
        return result.length ? result : null;  
    }
}
;;;;;
function $prev(node){
    while(node = node.previousSibling){
        if(node.nodeType == 1){
            return node;
        }
    }
}
;;;;;
function $next(node){
    while(node = node.nextSibling){
        if(node.nodeType == 1){
            return node;
        }
    }
}
;;;;;
function $child(node, index){
    var child = node.children;
    if(index > -1){
        child = child[index];
    }else if(index < 0){
        child = child[child.length + index];
    }else if(typeof index == 'string'){
        var returns = [];
        $each($query(index, node) || returns, function(elem){
            (elem.parentNode == node) && returns.push(elem);
        });
        return returns.length ? returns : null;
    }
    return child;
}