<?updateJs();function updateJs(){    var    $HEADERstr = Fs.readText($mappath('../header.txt'), 65001),    jscode,    totalApi = API2Hash($API, {}),    useApi;    if(typeof $use == 'object'){        if($use.length){            useApi = {};            $use.forEach(function(api){                useApi[api] = totalApi[api];             });                    }else{            useApi = totalApi;        }            }else{        useApi = totalApi;    }    jscode = getCodeByUse(useApi);    if(this.$packjs){        jscode = Packer.pack(jscode);    }    if(this.$use == 'object'){        jscode = $HEADERstr + jscode;    }else{        jscode = $HEADERstr + '$1k = ' + jscode + ';';    }    $push(jscode);}       function API2Hash(api, hash){ //转换APi数据为key:value形式    hash = hash || {};    $each(api, function(val, key){        var val = val.valueOf();        if(typeof val == 'object'){            API2Hash(val, hash);        }else{            hash[key] = val;        }    });    return hash;}function getCodeByUse(useQueue){    var tabChar = '    ',        apiCode = [],        imports = {}, //已经导入的api标志        iptVars = {}, //已经导入的变量        iptFuns = {}, //已经导入的函数        selCode = 0; //是否使用选择器    $each(useQueue, function(fn, key){        key = key.split('_');        if(key[0]){//生成对外接口的代码，s为静态，p为原型            if(key[1] == 's'){                apiCode.push(tabChar +'$1k.'+ key[0] +' = '+ fn +';');                            }else if(key[1] == 'p'){                apiCode.push(tabChar +'$DP.'+ key[0] +' = '+ (''+ fn).replace(/\n(\t|    )/g, '\n') +';');                selCode = 1;            }                                    if(key[1] == 'p'){                selCode = 1;            }        }    });    apiCode = apiCode.join('\n') +'\n';    if(!selCode){        imports['$1k'] = 1;        apiCode = tabChar +'function $1k(){}\n'+ apiCode;    }    $each(useQueue, function(code){//为什么不在第一个each中完成，主要是因为selCode必须全遍历才能得出最终结果        parseCode(code);    });    if(selCode && !imports['$1k']){//未加载$1k        apiCode = tabChar + $CODE['$1k'].source +'\n'+ tabChar + $CODE['$Dom'].source +'\n'+ apiCode;    }    var vars = [],        funs = [];    for(var key in $CODE){//这个遍历是为了保持各API创建的顺序        if(key in iptVars){            vars.push(iptVars[key].replace(/;(\s*|\/\/.*)$/, ''));//去除尾部的分号和空白        }else if(key in iptFuns){            funs.push(iptFuns[key]);        }    }    if(vars.length){        vars[0] = vars[0].replace(/^\s*/, '');        vars = tabChar +'var '+ vars.join(',\n') +';\n';    }else{        vars = '';    }    return (''        +'function(){\n'        + vars + funs.join('') + apiCode        + tabChar +'return $1k;\n'        +'}()').replace(/\t/g, tabChar);        function parseCode(code){        (code +'').replace(/\$[\w]+/g, function(key){            if(key in $CODE && !(key in imports)){//在API中并且还未导入                                imports[key] = 1;                if(/^\s*function\s*/.test($CODE[key].source)){//是函数还是变量                    iptFuns[key] = (tabChar + $CODE[key].source.replace(/\n/g,'\n'+ tabChar) +'\n');                }else{                    iptVars[key] = (tabChar + $CODE[key].source.replace(/\n/g,'\n'+ tabChar) +'\n');                }                parseCode($CODE[key].source);            }        });    }}    ?>