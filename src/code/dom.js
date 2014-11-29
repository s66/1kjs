function $1k(selector, context){
    switch($type(selector)){
        case 'function':
            return $ready(selector);
        case 'element':    
        case 'window':    
        case 'document':    
        case 'array':
            return new $Dom(selector);
        case 'string':
            if(selector.indexOf('<') == 0){ //html
                return $1k($elem(selector));
            }
            return $1k($query(selector, context));
        
    }
    return null;
}
;;;;;
function $Dom(elements){
    //$DP
    if($isArray(elements)){
        this.elems = elements;
        this.elem = elements[0];
    }else{
        this.elem = elements;
    }
    this.__DOM__ = 1;
}
;;;;;
function $box(func, arg1, arg2, arg3){
    var result = func.call(this, this.elem, arg1, arg2, arg3);
    if(this.elems && result == this){
        var i = 1;
        while(this.elems[i]){
            func.call(this, this.elems[i], arg1, arg2, arg3);
            i++;
        }
        return this;
    }else{
        return result;
    }
}
;;;;;
function $elem(node){
    if($isElement(node))return node;
    if($isDom(node))return node.elem;
    
    if(~node.indexOf('<')){ //非标准创建节点
        var prarent = $DOC.createElement('div');
        prarent.innerHTML = $tirm(node);
        return prarent.firstChild;
    }else{
        return $DOC.createElement(node);
    }
}

;;;;;
function $parent(node, selector){
    if(selector == undefined){
        return node.parentNode;
    }else if(selector > 0){
        selector++;
        while(selector--){
            node = node.parentNode;
        }
        return node;
    }else{
        selector = selector.match(/^(?:#([\w\-]+))?\s*(?:(\w+))?(?:.([\w\-]+))?(?:\[(.+)\])?$/);
        if(selector){
            var id = selector[1],
                tag = selector[2],
                cls = selector[3],
                attr = selector[4];
            tag = tag && tag.toUpperCase();
            attr = attr && attr.split('=');
        }else{
            return null;
        }
        
        while(node = node.parentNode){
            if(
                (!id || node.id == id)
                && (!cls || cls && $hcls(node, cls))
                && (!tag || node.nodeName == tag)
                && (!attr || $attr(node, attr[0]) == attr[1])
            ){
                return node;
            }
        }	
        
    }
    return null;
}
;;;;;
function $offset(node){
    var top = 0, left = 0;
    if ('getBoundingClientRect' in $DE){
        //jquery方法
        var 
        box = node.getBoundingClientRect(), 
        body = $DOC.body, 
        clientTop = $DE.clientTop || body.clientTop || 0, 
        clientLeft = $DE.clientLeft || body.clientLeft || 0,
        top  = box.top  + ($WIN.pageYOffset || $DE && $DE.scrollTop  || body.scrollTop ) - clientTop,
        left = box.left + ($WIN.pageXOffset || $DE && $DE.scrollLeft || body.scrollLeft) - clientLeft;
    }else{
        do{
            top += node.offsetTop || 0;
            left += node.offsetLeft || 0;
            node = node.offsetParent;
        } while (node);
    }
    return {left: left, top: top, width: node.offsetWidth, height: node.offsetHeight};
}
;;;;;
function $cssnum(node, attr){
    var val = +$rmvpx($css(node, attr)) || 0;
    if(/^width|height|left|top$/.test(attr)){
        switch(attr){
            case 'left': return val || node.offsetLeft - $cssnum(node, 'marginLeft');
            case 'top': return val || node.offsetTop - $cssnum(node, 'marginTop');
            case 'width': return val
                || (node.offsetWidth
                    - $cssnum(node, 'paddingLeft')
                    - $cssnum(node, 'paddingRight')
                    - $cssnum(node, 'borderLeftWidth')
                    - $cssnum(node, 'borderRightWidth')
                );
            case 'height': return val
                || (node.offsetHeight
                    - $cssnum(node, 'paddingTop')
                    - $cssnum(node, 'paddingBottom')
                    - $cssnum(node, 'borderTopWidth')
                    - $cssnum(node, 'borderBottomWidth')
                );
        }
    }
    return val;
}
;;;;;
function $left(node, value){
    if(value != undefined){
        $css(node, 'left', value);
        return this;
    }
    return $cssnum(node, 'left');
}
;;;;;
function $top(node, value){
    if(value != undefined){
        $css(node, 'top', value);
        return this;
    }
    return $cssnum(node, 'top');
}
;;;;;
function $width(node, value){
    if(value != undefined){
        $css(node, 'width', value);
        return this;
    }
    return $cssnum(node, 'width');
}
;;;;;
function $height(node, value){
    if(value != undefined){
        $css(node, 'height', value);
        return this;
    }
    return $cssnum(node, 'height');
}

;;;;;
function $tag(node, nodeName){
    if(typeof nodeName != 'undefined'){
        return nodeName == node.nodeName;
    }
    return node.nodeName;
}
;;;;;
function $val(node, val){
    if(val == undefined)return node.value.replace(/^\s+|\s+$/g, '');
    node.value = val;
    return this;
}