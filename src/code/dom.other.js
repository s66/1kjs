
function $attr(node, name, value){
    if(value === null){
        node.removeAttribute(name);
    }else if(value != undefined){
        if(typeof name == 'object'){
            for(var attr in name){
                $attr(node, attr, name[attr]);
            }
        }else{
            if(name == 'style'){
                node.style.cssText = value;
            }else{
                if(node[name] != undefined){//优先设置js属性
                    node[name] = value;
                }else{
                    node.setAttribute(name, value, 2);
                }
            }
        }
    }else{
        if(name == 'style'){
            return node.style.cssText;
        }else{
            if(name == 'href' && node.nodeName == 'A'){
                return node.getAttribute(name, 2);
            }else{	
                if(node[name] != undefined){//优先获取js属性
                    return node[name];
                }else{
                    var val = node.getAttribute(name);
                    return val == null ? void(0) : val;
                }
            }
        }
    }
    return this;
}
;;;;;
function $contains(pnode, cnode){
    if(cnode == pnode)return 1;
    return pnode.contains 
        ? pnode.contains(cnode) 
            ? 2 : 0
        : pnode.compareDocumentPosition(cnode)
            ? 2 : 0;
    /*
    if(pnode.contains){//ie下判断是不是属于contains容器中的节点
        console.info(pnode,cnode);
        if(pnode.contains(cnode)){
            return 2;
        }
    }else if(pnode.compareDocumentPosition){//非ie下判断
        if(pnode.compareDocumentPosition(cnode) == 20){
            return 2;
        }
    }//*/
    return 0;
}