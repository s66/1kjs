function $ready(fn){
    var 
    isReady = false, //判断是否触发onDOMReady
    readyList = [], //把需要执行的方法先暂存在这个数组里
    ready = function(fn) {
        isReady ? fn($1k) : readyList.push(fn);
    },
    onReady = function(){
        if(isReady)return;
        isReady = true;
        for(var i = 0, lg = readyList.length; i < lg; i++){
            readyList[i]($1k);
        } 
        if($DOC.removeEventListener){
            $DOC.removeEventListener('DOMContentLoaded', onReady, false);
        }else if($DOC.attachEvent){
            $DOC.detachEvent('onreadystatechange', onReady);
            if(timer){
                clearInterval(timer);
                timer = null;
            }
        }
        readyList = null;
        onReady = null;
    };
    if($DOC.readyState == 'complete'){
        onReady();
    }else if($DOC.addEventListener){
        $DOC.addEventListener('DOMContentLoaded', onReady, false);
    }else if($DOC.attachEvent){
        $DOC.attachEvent('onreadystatechange', function(){
            /loaded|complete/.test($DOC.readyState) && onReady && onReady();
        });
        
        try {
            var toplevel = $WIN.frameElement == null;
        }catch(e){}
        
        if(toplevel){
            var timer = setInterval(function(){
                try{
                    isReady || $DOC.documentElement.doScroll('left'); //在IE下用能否执行doScroll判断dom是否加载完毕
                    //http://javascript.nwbox.com/IEContentLoaded/
                }catch(e){
                    return;
                }
                onReady();
            }, 16);
        }
    }
    ($ready = ready)(fn);
};
;;;;;
$EventHook = {};
;;;;;
$addEvent = function(){
    ($addEvent = $DOC.addEventListener ? function(node, type, fn){
        node.addEventListener(type == 'mousewheel' && $DOC.mozHidden !== undefined ? 'DOMMouseScroll' : type, fn, false); 
    } : function(node, type, fn){
        node.attachEvent('on' + type,fn); 
    }).apply(null, arguments);

};
;;;;;
$removeEvent = function(){
    ($removeEvent = $DOC.removeEventListener ? function(node, type, fn){
        node.removeEventListener(type == 'mousewheel' && $DOC.mozHidden !== undefined ? 'DOMMouseScroll' : type, fn, false); 
    } : function(node, type, fn){
        node.detachEvent('on' + type, fn);
    }).apply(null, arguments);
};
;;;;;
function $Evt(evt){
    var _evt = {
        origin: evt,
        type: evt.type,
        keyCode: evt.keyCode,
        clientX: evt.clientX,
        clientY: evt.clientY,
        target: evt.target || evt.srcElement,
        fromTarget: evt.fromElement || (evt.type == 'mouseover' ? evt.relatedTarget : null),
        toTarget: evt.toElement || (evt.type == 'mouseout' ? evt.relatedTarget : null),
        stopPropagation: function(){
            evt.stopPropagation 
                ? evt.stopPropagation() 
                : (evt.cancelBubble = true);
        },
        mouseKey: ($browser.ie < 9 ? {1: 'L', 4: 'M', 2: 'R'} : {0: 'L', 1: 'M', 2: 'R'})[evt.button],
        preventDefault: function(){
            evt.preventDefault 
                ? evt.preventDefault()
                : (evt.returnValue = false);
        },
        delta: evt.type == 'mousewheel' 
            ? evt.wheelDelta
            : evt.type == 'DOMMouseScroll'
                ? evt.detail * -40
                : null
    };
    return _evt;
}
;;;;;
function $bind(node, type, func, context){
    if(!node.__EVENTID__){//没有有事件队列
        $EventHook[node.__EVENTID__ = ++$GUID] = [];
    }
    var EQ = $EventHook[node.__EVENTID__];
    if(!EQ[type]){//无该类型的事件队列
        EQ[type] = [];
        $addEvent(node, type, function(evt){
            var Q = EQ[type].slice(0);
            while(Q[0]){
                Q[0].func.call(Q[0].context, $Evt(evt));
                Q.shift();
            }
        });
    }
    EQ[type].push({
        func: func,
        context: context || node
    });
    return this;
}
;;;;;
function $unbind(node, type, func, context){
    var Q = $EventHook[node.__EVENTID__][type], i = 0;
    while(Q[i]){
        if(Q[i].func == func && (Q[i].context == (context || node) || (context.__DOM__ && context.elem == Q[i].context.elem))){
            Q.splice(i, 1);
            break;
        }
        i++;
    }
    return this;
}
