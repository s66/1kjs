$Easing = {
    Linear: function(p) {
        return p;
    },
    slowIn: function(p) {
        return p * p;
    },
    slowOut: function(p) {
        return p * (2 - p);
    },
    slowBoth: function(p) {
        if ((p /= 0.5) < 1) return 1 / 2 * p * p;
        return -1 / 2 * ((--p) * (p - 2) - 1);
    },
    In: function(p) {
        return p * p * p * p;
    },
    Out: function(p) {
        return -((p -= 1) * p * p * p - 1);
    },
    Both: function(p) {
        if ((p /= 0.5) < 1) return 1 / 2 * p * p * p * p;
        return -1 / 2 * ((p -= 2) * p * p * p - 2);
    },
    fastIn: function(p) {
        return p * p * p * p * p * p;
    },
    fastOut: function(p) {
        return -((p -= 1) * p * p * p * p * p - 1);
    },
    fastBoth: function(p) {
        if ((p /= 0.5) < 1) return 1 / 2 * p * p * p * p * p * p;
        return -1 / 2 * ((p -= 2) * p * p * p * p * p - 2);
    },
    elasticIn: function(p) {
        if (p == 0) return 0;
        if (p == 1) return 1;
        var x = 0.3,
        //y = 1,
        z = x / 4;
        return -(Math.pow(2, 10 * (p -= 1)) * Math.sin((p - z) * (2 * Math.PI) / x));
    },
    elasticOut: function(p) {
        if (p == 0) return 0;
        if (p == 1) return 1;
        var x = 0.3,
        //y = 1,
        z = x / 4;
        return Math.pow(2, -10 * p) * Math.sin((p - z) * (2 * Math.PI) / x) + 1;
    },
    elasticBoth: function(p) {
        if (p == 0) return 0;
        if ((p /= 0.5) == 2) return 1;
        var x = 0.3 * 1.5,
        //y = 1,
        z = x / 4;
        if (p < 1) return -0.5 * (Math.pow(2, 10 * (p -= 1)) * Math.sin((p - z) * (2 * Math.PI) / x));
        return Math.pow(2, -10 * (p -= 1)) * Math.sin((p - z) * (2 * Math.PI) / x) * 0.5 + 1;
    },
    backIn: function(p) {
        var s = 1.70158;
        return p * p * ((s + 1) * p - s);
    },
    backOut: function(p) {
        var s = 1.70158;
        return ((p = p - 1) * p * ((s + 1) * p + s) + 1);
    },
    backBoth: function(p) {
        var s = 1.70158;
        if ((p /= 0.5) < 1) return 1 / 2 * (p * p * (((s *= (1.525)) + 1) * p - s));
        return 1 / 2 * ((p -= 2) * p * (((s *= (1.525)) + 1) * p + s) + 2);
    },
    bounceIn: function(p) {
        return 1 - $Easing.bounceOut(1 - p);
    },
    bounceOut: function(p) {
        if (p < (1 / 2.75)) {
            return (7.5625 * p * p);
        } else if (p < (2 / 2.75)) {
            return (7.5625 * (p -= (1.5 / 2.75)) * p + 0.75);
        } else if (p < (2.5 / 2.75)) {
            return (7.5625 * (p -= (2.25 / 2.75)) * p + 0.9375);
        }
        return (7.5625 * (p -= (2.625 / 2.75)) * p + 0.984375);
    },
    bounceBoth: function(p) {
        if (p < 0.5) return $Easing.bounceIn(p * 2) * 0.5;
        return $Easing.bounceOut(p * 2 - 1) * 0.5 + 0.5;
    }
};
;;;;;
$AnimHook = {};
;;;;;
function $Anim(elem, attrs, options){
    
    var drawId;
    var onstop;
    play(attrs, options || {});
    
    return {
        play: play,
        stop: function(){
            stop();
            onstop && onstop();
        }
    };
    
    function play(attrs, options){
        if(typeof options == 'number'){
            options = {
                dur: options
            };
        }
        options.onbefore && options.onbefore();
        onstop = options.onstop;
        
        var style = elem.style;
        var easing = $Easing[options.easing] || $Easing.Both;
        var onplay = options.onplay;
        var ondone = options.ondone;
        var dur = options.dur || 800;
        var time0 = +new Date;
        var per;
        var cache_per = 0;
        var attrsObj = fromatAttrs(attrs);
        var attrs = attrsObj.attrs;
        var from = attrsObj.from;
        var by = attrsObj.by;
        var fixAttrs = attrsObj.fixAttrs;
        var ceil = Math.ceil;
        drawId = $draw(function(){
            
            per = (+new Date - time0) / dur;
            if(per >= 1){ //完成进度，则清除draw
                per = 1;
                stop();
            }else{
                per = ~~(easing(per) *10000)/10000; //精确保留4位小数
            }
            
            if(cache_per != per){ //由于定时器存在精度问题，所以在下一帧中per未必发生改变
                cache_per = per;
                
                var attr, i = 0;
                while(attr = attrs[i]){
                    style[attr] = ceil(from[i] + per * by[i++]) + 'px';
                }
                if(attr = fixAttrs.opacity){
                    $opacity(elem, attr.from + per * attr.by);
                }
                onplay && onplay();
                if(per == 1){
                    ondone && ondone();
                }
            }
            
        });
    }
    
    function fromatAttrs(attrsIn){
        var attrs = [];
        var from = [];
        var by = [];
        var fixAttrs = {};
        var value; //传入参数
        var fromValue; //起始位置
        var byValue; //改变量
        var isRelative; //是否是相对改变
        
        for(var attr in attrsIn){
            value = attrsIn[attr];
            if(typeof value != 'number'){
                value = parseInt(value);
            }

            if(isRelative = attr.indexOf('x') == 0){
                attr = attr.substr(1);
                fromValue = $cssnum(elem, attr);
                byValue = value;
            }else{
                fromValue = $cssnum(elem, attr);
                byValue = value - fromValue;

            }
            
            if(/opacity/.test(attr)){
                var fromValue = $opacity(elem);
                fixAttrs['opacity'] = {
                    from: fromValue,
                    by: isRelative ? byValue : value - fromValue
                };
            }else{
                attrs.push(attr);
                from.push(fromValue);
                by.push(byValue);
            }
            
        }
        return{
            attrs: attrs,
            from: from,
            by: by,
            fixAttrs: fixAttrs
        };
    }

    function stop(){
        $draw.clear(drawId);
    }

}
;;;;;
function $draw(fn, hook){
    var list = [], //函数列表
        ids = {}, //hooks
        tr, //定时器句柄
        fpsClick = [], //帧打点
        info = { //监控数据
            execTime: 0,
            list: [],
            fps: 0
        };
        
    $draw = draw;
    draw.clear = clear;
    draw.info = getInfo;
    
    return draw(fn, hook);
    
    function draw(fn, hook){
        clear(hook);
        
        var id = ++$GUID;
        ids[id] = 1;
        list.push({
            id: id,
            fn: fn
        });
        if(list.length == 1){
            start();
        }
        return id;
    }
    
    function clear(hook){
        if(ids[hook]){
            delete ids[hook];
            var item, i = 0;
            while(item = list[i++]){
                if(item.id == hook){
                    list.splice(i-1, 1);
                    break;
                }
            }

            if(list.length == 0){
                stop();
            }
        }
    }
    
    function start(){

        function fns(){

            for(var i = 0, lg = list.length; i < lg; i++){
                var item = list[i]; //由于在item.fn中可能会执行clear操作，所以list[i]可能已经不存在了
                item && item.fn();
            }
            
        }
        function run(){
            var t0 = +new Date;
            fns();
            var t1 = +new Date;
            
            //取15ms是因为ie浏览器16ms精度问题,基本上达到60fps，差不多需要40fps+动画才能流畅
            //t1 - t0 为程序执行时间，进行相应的修正
            tr = setTimeout(run, Math.max(0, 15 - (t1 - t0)));                       
            return;
            var fpsItem, i = 0;
            while(fpsItem = fpsClick[i++]){ //更新帧数
                if(t1 - fpsItem < 1000){ //清除已经过期的打点
                    break;
                }
                fpsClick.shift();
            }
            
            fpsClick.push(t1);
            info.execTime = t1 - t0;
            info.fps = fpsClick.length;
            info.list = list;
        }
        
        run();
    }
    
    function stop(){
        clearTimeout(tr);
    }
    
    function getInfo(){
        return info;
    }
}
$draw.clear = $noop;
;;;;;
$DragHook = {};
;;;;;
$Drag = $Class.extend({
    init: function(elem, options){
        this.elem = elem;
        this.time = 0;
        var config = {
            before: 0,//拖动前
            after: 0,//拖动完成
            runing: 0,//拖动中
            clone: 0,//是否clone节点
            lockx: 0,//锁定x方向
            locky: 0,//锁定y方向
            range: -1//拖动范围控制
        };
        
        for(var ex in config){
            this['_'+ ex] = (ex in options ? options : config)[ex];
        }

        this.addHand(options.hand || elem);
        
    },
    
    addHand: function(hand){
        $bind(hand, 'mousedown', this._beforeDrag, this);
    },
    
    rmvHand: function(hand){
        $bind(hand, 'mousedown', this._beforeDrag, this);
    },
    _init: function(evt){
        this._hasInit = 1;
        var elem = this.elem, box = elem,
            offset = $offset(elem),
            marginLeft = $cssnum(elem, 'marginLeft'),
            marginTop = $cssnum(elem, 'marginTop');
        
        if(this._clone){
            var clone = $clone(elem, true);
            $css(clone, {
                position: 'absolute',
                zIndex: 9999,
                left: offset.left - marginLeft,
                top: offset.top - marginTop,
                width: $cssnum(elem, 'width'),
                height: $cssnum(elem, 'height')
            });
            $append($DOC.body, clone);
            box = this._clone = clone;
        }
        this._style = box.style;
        
        this._offsetX = evt.clientX - box.offsetLeft + marginLeft;
        this._offsetY = evt.clientY - box.offsetTop + marginTop;
        this._before && this._before.call(this, evt);
        if(this._range == -1){//限制在窗口内
            this._minX = 0;
            this._minY = 0;
            this._maxX = $DE.clientWidth - box.offsetWidth - marginLeft - $cssnum(box, 'marginRight');
            this._maxY = $DE.clientHeight - box.offsetHeight - marginTop - $cssnum(box, 'marginBottom');
        }else if(this._range){
            var range = $query(this._range),
                ro = $offset(range),
                rw = range.offsetWidth,
                rh = range.offsetHeight,
                bl = $cssnum(range, 'borderLeftWidth'),
                br = $cssnum(range, 'borderRightWidth'),
                bt = $cssnum(range, 'borderTopWidth'),
                bb = $cssnum(range, 'borderBottomWidth');
            this._minX = ro.left + bl;
            this._minY = ro.top + bt;
            this._maxX = ro.left + rw - br - box.offsetWidth - marginLeft - $cssnum(box, 'marginRight');
            this._maxY = ro.top + rh - bb - box.offsetHeight - marginTop- $cssnum(box, 'marginBottom');
            
            
        }
        
    },
    
    _beforeDrag: function(evt){
        if(evt.mouseKey != 'L' || (this._lockx && this._locky)){
            return;
        }
        
        evt.stopPropagation();
        evt.preventDefault();
        this._hasInit = 0;
        
        if($browser.ie){
            this._focusHand = evt.target;
            $bind(this._focusHand, 'losecapture', this._drop, this);
            this._focusHand.setCapture(false);
        }else{
            $bind($WIN, 'blur', this._drop, this);
        }
        
        $bind($DOC, 'mousemove', this._draging, this);
        $bind($DOC, 'mouseup', this._drop, this);
    },
    
    _draging: function(evt){
        
        ///*进行过滤
        var now = +new Date;
        if(now - this.time > 15){
            this.time = now;
        }else{
            return;
        }
        //*/

        $WIN.getSelection ? $WIN.getSelection().removeAllRanges() : $DOC.selection.empty();
        !this._hasInit && this._init(evt);
        
        var left = evt.clientX - this._offsetX,
            top = evt.clientY - this._offsetY;
        if(this._range){

            left = Math.max(this._minX, Math.min(left, this._maxX));
            top = Math.max(this._minY, Math.min(top, this._maxY));
        }
        
        !this._lockx && (this._style.left = left +'px');
        !this._locky && (this._style.top = top +'px');
        this._runing && this._runing.call(this, evt);
    },
    _drop:function(evt){
        $unbind($DOC, 'mousemove', this._draging, this);
        $unbind($DOC, 'mouseup', this._drop, this);
        
        if($browser.ie){
            $unbind(this._focusHand, 'losecapture', this._drop, this);
            this._focusHand.releaseCapture();
        }else{
            $unbind($WIN, 'blur', this._drop, this);
        }
        this._after && this._after.call(this, evt);
        if(this._clone && this._clone.parentNode){
            $remove(this._clone);
        }
        
    },
    set: function(options){
        for(var e in options){
            this[e] = options[e];
        }  
    },
    lock: function(){
        this._lockx = true;
        this._locky = true;
    },
    unlock: function(){
        this._lockx = false;
        this._locky = false;
    }
    

});

;;;;;
function $anim(elem, cssAttr, callback){
    
    var 
    property,
    cssAttrCache = {};
    
    for(property in cssAttr){
        cssAttrCache[property] = $cssnum(elem, property);
    }
    if(cssAttr.opacity > -1){
        cssAttr.opacity = Math.round(cssAttr.opacity * 100);
        cssAttrCache.opacity = Math.round(cssAttrCache.opacity * 100);
    }
    clearInterval(elem._animTimer_);
    elem._animTimer_ = setInterval(function(){
        var
        complete = 1,
        property,
        speed;
        for(property in cssAttr){
            if(cssAttr[property] != cssAttrCache[property]){
                complete = 0;
                speed = (cssAttr[property] - cssAttrCache[property]) / 8;
                cssAttrCache[property] += speed > 0 ? Math.ceil(speed) : Math.floor(speed);
                $css(elem, property, property == 'opacity' ? cssAttrCache[property] / 100 : cssAttrCache[property]);
            }
        }
        if(complete){
            clearInterval(elem._animTimer_);
            callback && callback();
        }
    }, 15);
    
}