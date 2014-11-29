$XHR = function(){
    return $WIN.XMLHttpRequest || function(){ //ie6下使用遍历来获得最高版本的xmlhttp
        var xhrProgid = [0, 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP', 'Msxml2.XMLHTTP.6.0'],
            i = 4,
            xhr;
        while(--i){
            try{
                new ActiveXObject(xhr = xhrProgid[i]);
                return function(){return new ActiveXObject(xhr)};
            }catch(e){}
        }
    }();
}();
;;;;;
function $ajax(options){
    var 
    t1 = +new Date,
    xhr = new $XHR,
    callback = options.callback,
    headers = options.headers,
    key;
    xhr.open(options.type || 'get', options.url, options.async || true);
    for(key in headers) { //设置发送的头
        xhr.setRequestHeader(key, headers[key]);
    }
    xhr.onreadystatechange = function(){
        xhr.readyState == 4 && callback && callback(
            xhr.status == 200 
            ? options.responseType 
                ? xhr[options.responseType] 
                : xhr
            : null
        );
    };
    xhr.send(options.data || null);
}
function $post(url, callback, data){ //post经典版封装
    $ajax({
        url: url,
        type: 'post',
        data: $isObject(data) ? $param(data) : data,
        callback: function(responseText){
            //try{
                callback($parseJson(responseText));
            //}catch(e){
              //  callback(null);
           // }
        },
        responseType: 'responseText',
        headers: { //post必须给http头设置Content-Type
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}
;;;;;
function $get(url, callback, data){ //get经典版封装
    $ajax({
        url: url + (data ? '?'+ ($isObject(data) ? $param(data) : data) : ''),
        callback: function(responseText){
            
            //try{
                callback($parseJson(responseText));
            //}catch(e){
                //console.info(e.message);
                //callback(null);
            //}
        },
        responseType: 'responseText'
    });
}
;;;;
function $img(url, callback){
    var img = new Image;
    img.src = url;
    
    if(img.complete){
        return done(img);
    }
    img.onload = function () {
        done(img);
    };
    img.onerror = function(){
        done(null);
    };
    function done(result){
        img.onload = img.onerror = null;
        callback && callback(result, result);
    }
    return this;
}
;;;;;
function $js(url, callback, data, charset){
    var script = $DOC.createElement('script');
    data && (url += '?' + (typeof data == 'object' ? $param(data) : data));
    charset && (script.charset = charset);
    script.src = url;
    script.readyState
        ? script.onreadystatechange = function(){
            /loaded|complete/.test(script.readyState) && done();
        }
        : script.onload = done;
    $HEAD.appendChild(script);
    return this;
    function done(){
        callback && callback();
        $HEAD.removeChild(script);
        script.onload = script.onreadystatechange = null;
    }
}
;;;;;
function $style(cssText){
    $isArray(cssText) && (cssText = cssText.join(''));
    if(/{[\w\W]+?}/.test(cssText)){ //cssText
        var style = $DOC.createElement('style');
        style.type = 'text/css';
        style.styleSheet && (style.styleSheet.cssText = cssText) || style.appendChild($DOC.createTextNode(cssText));	
    }else{
        style = $DOC.createElement('link');
        style.rel = 'stylesheet';
        style.href = arg1;
    }
    $HEAD.appendChild(style);
    return this;
}
;;;;;
function $jsonp2(url, callback, charset, timeout){
    var s = $DOC.createElement('script'),
        callbackName = 'json' + (++$GUID),
        tr = setTimeout(function(){//超时则放弃请求
            $HEAD.removeChild(s);
            delete $WIN[callbackName];
        }, timeout || 10000);
    
    $WIN[callbackName] = function(result){
        clearTimeout(tr);
        callback(result);
    };
    s.src = 'http://jsonp2.1kjs.com/?' + $param({
        charset: charset || 'utf-8',
        callback: callbackName,
        e_url: url
    }, true);
    charset && (s.charset = charset);
    $HEAD.appendChild(s);
    if(s.readyState){
        s.onreadystatechange = function(){
            if(s.readyState == 'loaded' || s.readyState == 'complete'){
                //callback&&callback();
                $HEAD.removeChild(s);
            }
        };
    }else{
        s.onload = function(){
            //callback&&callback();
            $HEAD.removeChild(s);
        };
    }
    return this;
}