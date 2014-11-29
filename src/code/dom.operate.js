function $clone(node, flag){
    node = node.cloneNode(flag);
    return node;
}
;;;;;
function $replace(node, newNode){
    node.parentNode.replaceChild($elem(newNode), node);
    return this;
}
;;;;;
function $append(node, newNode, index){
    if($isArray(newNode)){
        var root = $DOC.createDocumentFragment();
        $each(newNode, function(elem){
            root.appendChild($elem(elem));
        });
        newNode = root;
    }else{
        newNode = $elem(newNode);
    }
    if(index == undefined){
        node.appendChild(newNode);
        return this;
    }
    var child = node.children;
    if(index > -1){
        child = child[index];
    }else if(index < 0){
        child = child[Math.max(child.length + index + 1, 0)];
    }
    if(child){
        child.parentNode.insertBefore(newNode, child);
    }else{
        node.appendChild(newNode);
    }
    return this;
}
;;;;;
function $html(node, html){
    var type = typeof html,
        _html = '';
    if(type == 'undefined'){
        return node.innerHTML;
    }else if(type == 'function'){
        _html = html();
    }else if(type == 'object'){
        $each(html, function(html){
            _html += html;
        });
    }else{
        _html = html;
    }
    if(node.nodeName == 'SELECT' && type != 'undefined' && $browser.ie){
        var s = document.createElement('span');
        s.innerHTML = '<select>' + _html + '</select>';
        node.innerHTML = '';
        $each($query('option', s), function(option){
            node.appendChild(option);
        });
    }else{
        node.innerHTML = _html;
    }
    return this;
}
;;;;;
function $remove(node){
    node.parentNode.removeChild(node);
    return this;
}