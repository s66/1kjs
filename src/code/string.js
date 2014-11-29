function $encodeHTML(str){
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
;;;;;
function $decodeHTML(str){
    return str.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}
;;;;;
function $encodeURL(str){
    return str
        .replace(/%/g, '%25')
        .replace(/ /g, '%20')
        .replace(/#/g, '%23')
        .replace(/&/g, '%26')
        .replace(/=/g, '%3D')
        .replace(/\//g, '%2F')
        .replace(/\?/g, '%3F')
        .replace(/\+/g, '%2B');
}
;;;;;
function $tirm(str){
    return str.replace(/^\s+|\s+$/g, '');
}
;;;;;
function $parseJson(str){
    try{
        str = $tirm(str);
        if(!str.replace(/"(?:\\\\|\\\"|[^"])*"|[\s{}\[\]:\d.,]+|true|false/g, '')){ //说明JSON数据符合要求
            return Function('return ' + str)();
        }
    }catch(e){}
    throw new SyntaxError('JSON.parse');
}
