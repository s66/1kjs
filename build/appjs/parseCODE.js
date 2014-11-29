var code;

module.exports = {
    CODE: getCode
};

function getCode(){
    if(code){
        return code;
    }
    code = {};
    
    
    Fs.eachFiles($mappath('../code'), { //遍历解析code
        matchFile: /\.js$/,
        skipFile: /\.res\.js$/
    }, function(file){
       
        Fs.readText(file.path).split(';;;;;').forEach(function(kv){
            code[kv.match(/\$[\w]+/)] = {
                source: kv.replace(/^\s+|\s+$/g, '')
            };
        });
    });
    
    for(var key in code){
        var use = function(source){ //生成依赖关系图
            var use;
            source.replace(/\$[\w]+/g, function(name){ //获取所有依赖
                if(name in code && name != key){ //不能依赖自己，否则造成死链
                    if(!use){
                        use = {};
                    }
                    use[name] = 1;
                }
            });
            return use;
        }(code[key].source);
        
        if(use){
            code[key].use = use;
        }
    }
    return code;
}