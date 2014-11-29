<?
    $CODE = {};

    var folder = Fs.getFolder($mappath('../code.res'));
    
    var files = folder.files;
    for(var i = 1; i <= files.count; i++){
        if(!/\.res/.test(files(i).name)){
            parse(Fs.readText(files(i).path, 65001));
        }
    }
    
    for(var key in $CODE){
        
        var use = function(source){ //����������ϵͼ
            var use;
            source.replace(/\$[\w]+/g, function(name){ //��ȡ��������
                if(name in $CODE && name != key){ //���������Լ��������������
                    if(!use){
                        use = {};
                    }
                    use[name] = 1;
                }
            });
            return use;
        }($CODE[key].source);
        
        if(use){
            $CODE[key].use = use;
        }
    }
    
    $CODEstr = JSON.stringify($CODE);
    
    function parse(code){
        var arr = code.split(';;;;;');
        for(var i = 0; i < arr.length; i++){
            var kv = arr[i];
            $CODE[kv.match(/\$[\w]+/)] = {
                source: kv.replace(/^\s+|\s+$/g, '')
            };
        }
    }
?>