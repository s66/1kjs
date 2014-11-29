function $show(node){
    node.style.display = 'block';
    return this;
}
;;;;;
function $hide(node){
    node.style.display = 'none';
    return this;
}
;;;;;
function $opacity(node, opacity){
    if($browser.ie && $browser.ie < 9){
        var 
        filter = node.currentStyle.filter,
        hasAlpha = filter && /alpha/i.test(filter),
        filterStr;
        if(opacity === undefined){
            if(hasAlpha){
                return +filter.match(/opacity[\s:=]+(\d+)/i)[1]/100;
            }
            return 1;
        }
        
        if(opacity >= 1 || opacity == null){
            // IE6-8设置alpha(opacity=100)会造成文字模糊
            filterStr = filter.replace(/alpha[^\)]+\)/i, '');
        }else{
            opacity = Math.round(opacity * 100);//必须转成整数
            if(hasAlpha){
                filterStr = filter.replace(/(opacity\D+)\d+/i, 'opacity='+ opacity);
            }else{
                filterStr = filter +' '+ 'alpha(opacity=' + opacity + ')';
            }
        } 
        node.style.filter = filterStr;
    }else{
        if(opacity === undefined){
            return (opacity = +$css(node, 'opacity')) > -1 ? opacity : 1;
        }
        node.style.opacity = opacity;
    }
    return this;
}
;;;;;
function $hcls(node, cls){
    return RegExp('(^|\\s)' + cls + '($|\\s)').test(node.className);
}
;;;;;
function $cls(node, cls, cls2){
    
    if(cls2){
        if(node.className){
            node.className = (' ' + node.className + ' ')
                .replace(RegExp('\\s+(' + cls2 + ')(?=\\s+)'), cls)
                .replace(/^\s+|\s+$/g, '');//清除头尾空格;
        }
        
    }else if(cls){
        var _exp = cls.charAt(0),
            _cls = cls.substr(1);
        if(/[+~-]/.test(_exp)){
            var 
            ncls = node.className;
            _cls = _cls.split(',');
            switch(_exp){
                case '+':
                    if(ncls){//假如不为空，需要判断是否已经存在
                    
                        $each(_cls, function(val, i){
                            if(!$hcls(node, val)){
                                node.className += ' ' + val;
                            }
                        });
                    }else{
                        node.className = _cls.join(' ');
                    }
                    break;
                case '-':
                    if(ncls){
                        node.className = (' ' + ncls + ' ')
                            .replace(RegExp('\\s+(' + _cls.join('|') + ')(?=\\s+)', 'g'), '')//替换存在的className
                            .replace(/^\s+|\s+$/g, '');//清除头尾空格
                    }
                    break;
                case '~':
                    if(ncls){
                        $each(_cls, function(val, i){
                            if(!$hcls(node, val)){
                                node.className += ' ' + val;
                            }else{
                                $cls(node, '-'+ val);
                            }
                        });
                    }else{
                        node.className = _cls.join(' ');
                    }
                    break;
            }
        }else if(_exp == '='){
            node.className = _cls;
            return this;
        }else{
            _cls = cls.split(',');
            var ret = true;
            $each(_cls, function(val, i){
                return !(ret = ret && $hcls(node, val));
            });
            return ret;
        }
    }else{
        return node.className;
    }
    return this;
}
;;;;;
function $addpx(attr,val){
    return val + (
        /width|height|left|top|right|bottom|margin|padding/.test(attr) 
        && /^[\-\d.]+$/.test(val)
        ? 'px' : '');
}
;;;;;
function $rmvpx(val){
    return /px$/.test(val) ? parseFloat(val) : val;
}
;;;;;
function $fixStyleName(name){
    if(name == 'float'){
        return $WIN.getComputedStyle ? 'cssFloat' : 'styleFloat';
    }
    return name.replace(/-(\w)/g, function(_, $1){
        return $1.toUpperCase();
    });
}
;;;;;
function $css(node, name, value){
    if(value !== undefined){
        
        name == 'opacity' && $browser.ie < 9
            ? $opacity(node, value)
            : (node.style[name = $fixStyleName(name)] = 
                value < 0 && /width|height|padding|border/.test(name) 
                    ? 0 //修正负值
                    : value + (/width|height|left|top|right|bottom|margin|padding/.test(name) && /^[\-\d.]+$/.test(value) 
                        ? 'px'  //增加省略的px
                        : '')
            );        
    }else if(typeof name == 'object'){
        for(var key in name){
            $css(node, key, name[key]);
        }
    }else{
        if(~name.indexOf(':')){ //存在:,比如'background:red'
            $each(name.replace(/;$/, '').split(';'), function(cssText){      
                cssText = cssText.split(':');
                $css(node, cssText.shift(), cssText.join(':'));
                //?$css(node,cssText[0],cssText[1]);//background:url(http://www....)bug
            });
        }else{
            return name == 'opacity' && $browser.ie < 9
                ? $opacity(node)
                : node.style && node.style[name = $fixStyleName(name)]
                    || (node.currentStyle || getComputedStyle(node, null))[name];
        }
    }
    return this;
}