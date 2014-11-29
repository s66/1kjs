var 
CODE = $require('appjs/parseCODE.js').CODE(),
APIinfo = $require('appjs/parseAPI.js').APIinfo(),
API = APIinfo.API;

module.exports = {
    code: function(use){
        return $require('appjs/packCODE.js').jsCode(CODE, API, use);
    },
    
    header: function(){
        return Fs.readText($mappath('header.txt'), 65001);
    }
    
};
