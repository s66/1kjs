function $query(selector, context){
    if($type(selector) == 'element'){
        return selector; //����ڵ�
    }
    if(/^#[\w\-]+$/.test(selector)){
        return $DOC.getElementById(selector.substr(1));
    }
    var selectorMatch = selector.match(/^(?:#([\w\-]+))?\s*(?:(\w+))?(?:\.([\w\-]+))?(?:\[(.+)\])?$/);
    if(selectorMatch){ //[id,tag,cls,attr]
        var 
        id = selectorMatch[1],
        tag = selectorMatch[2],
        cls = selectorMatch[3],
        attr = selectorMatch[4];
    }else{
        ;;;throw $Erro('��������');
        return null;
    }
    if(id){ //idѡ�����޶���Χ
        context = $DOC.getElementById(id);
        if(!context){
            return null;
        }
    }
    var nodes;
    if($DOC.querySelectorAll){
        if(!id && context && context.nodeType != 9){ //ѡ��������id���������޶���Χ���ֶ����id�޶���Χ
            var fixid = context.id ? context.id : (context.id = '__queryfix__');
            selector = '#'+ fixid +' '+ selector;      
        }
        
        nodes = (context || $DOC).querySelectorAll(selector);
        
        if(fixid && ~fixid.indexOf('__queryfix__')){
            context.removeAttribute('id');
        }
        return makeArray(nodes);
    }else{
        
        var reNodes = [];
        nodes = (context || $DOC).getElementsByTagName(tag || '*');
        
        
        if(cls || attr){
            if(cls){
                var re = RegExp('(^|\\s)' + cls + '($|\\s)');
                for(var i = 0, lg = nodes.length; i < lg; i++){
                    re.test(nodes[i].className) && reNodes.push(nodes[i]);
                }
            }
            
            if(attr){
                if(cls)nodes = reNodes;
                reNodes = [];
                attr = attr.split('=');
                if(attr.length == 2){
                    var key = attr[0].split('!'),
                    val = attr[1] || '';
                    if(key.length > 1){//=ǰ���!
                        key = key[0];
                        for(var i = 0, l = nodes.length; i < l; i++){
                            nodes[i].getAttribute(key) != val && reNodes.push(nodes[i]);
                        }
                    }else{
                        for(var i = 0, l = nodes.length; i < l; i++){
                            nodes[i].getAttribute(key) == val && reNodes.push(nodes[i]);
                        }
                    }
                }else{
                    for(var i = 0, l = nodes.length; i < l; i++){
                        nodes[i].hasAttribute(attr) && reNodes.push(nodes[i]);
                    }    
                }
                
            }
            return reNodes.length ? reNodes : null;
        }else{
            return makeArray(nodes);
        }
    }
    function makeArray(list){
        if(!list || !list.length){
            return null;
        }
        if($browser.ie){
            var arr = [], i = 0, lg = list.length;
            while(i < lg){
                arr.push(list[i++]);
            }
            return arr;
        }
        return [].slice.call(list);
    }
}