$browser = function(){
    var 
    ua = navigator.userAgent.toLowerCase(),
    sys = {},
    s;
    (s = ua.match(/msie ([\d.]+)/)) ? sys.ie = s[1] :
    (s = ua.match(/firefox\/([\d.]+)/)) ? sys.firefox = s[1] :
    (s = ua.match(/(?:opera.|opr\/)([\d.]+)/)) ? sys.opera = s[1] :
    (s = ua.match(/chrome\/([\d.]+)/)) ? sys.chrome = s[1] :
    (s = ua.match(/version\/([\d.]+).*safari/)) ? sys.safari = s[1] : 0;
    return sys;
}();
;;;;;
$isIE6 = /MSIE\s*6.0/i.test(navigator.appVersion);
;;;;;
function $cookie(name, value, options){
    if(typeof name == 'object'){ //setCookies
        for(var e in name){
            $cookie(e, name[e], value);
        }
    }else{
        if(typeof value != 'undefined'){ //setCookie or deleteCookie
        
            var str = name + "=" + encodeURIComponent(value);
            if(value === null){ //value === null ,则设置cookie为过期
                options.expires = -1;
            }else if(typeof options == 'number'){
                options = {expires: options};
            }else{
                options = options || {};
            }
            if(options.expires){
                var exp = new Date;
                exp.setTime(+exp + options.expires * 60 * 1000); //以分钟为单位
                str += "; expires=" + exp.toUTCString();
            }
            if(options.path){
                str += "; path=" + options.path;
            }
            if(options.domain){
                str += "; domain=" + options.domain;
            }
            $DOC.cookie = str;
        }else{ //getCookie
            return (v = $DOC.cookie.match('(?:^|;)\\s*' + name + '=([^;]*)'))
                ? decodeURIComponent(v[1]) : null;
        }
    }
}
;;;;;
$scrollTop = function(){
    var tr,
        cr = $browser.chrome;
    return function(y, t, tp){
        var ds = cr ? $DOC.body : $DE;
        switch(arguments.length){
            case 0: return ds['scrollTop'];
            case 1: return ds['scrollTop'] = y;
            default:
                var s0 = 0,
                    s1 = Math.ceil(t/15),
                    z0 = ds['scrollTop'],
                    tp = function(t,b,c,d){
                        return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
                    },
                    zc = y - z0;
                clearTimeout(tr);
                function run(){
                    tr = setTimeout(function(){
                        if(s0 < s1){ 
                            ds['scrollTop'] = tp(s0, z0, zc, s1);
                            run();
                        }else{
                            ds['scrollTop'] = y;
                            clearTimeout(tr);
                        }
                        s0 ++;
                    }, 15);
                }
                run();
        }
    
    };
}();