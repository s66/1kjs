
!function(J){
	var Lib = function(){
		var $each = J.each;
		var header = <?$push(JSON.stringify(Fs.readText($mappath('../header.txt'), 65001)))?>;
		var API = <?$push($require('parseAPI.js').APIinfo().APIstr)?>;
		var CODE = <?$push(JSON.stringify($require('parseCODE.js').CODE()))?>;
		var Hash = API2Hash(API);
		var useAPI = {};
		var unUseAPI = deepCopy(API);
		return{
			showAPI: showAPI,
			setEvent: function(){
				J('#unuseapi').click(function(e){
					change(J(e.target), 'add');
				});
				J('#useapi').click(function(e){
					change(J(e.target), 'remove');
				});
				J('#pkgall').click(function(){
					unUseAPI = {};
					useAPI = deepCopy(API);
					showAPI();
				});
				J('#clearall').click(function(){
					unUseAPI = deepCopy(API);
					useAPI = {};
					showAPI();
				});
				J('#pkgdiy').click(function(){
					
					var jscode = getCodeByUse(API2Hash(useAPI));
					var doc = open('', '_blank');
					doc.document.write('<!doctype html><html><head><meta charset="utf-8"/><title>1k</title><script src="/js/1k.js"></'+'script><script src="/js/highlight.js?skin=default"></'+'script><script>$1k.highlight.init()</'+'script></head><body><textarea class="lang-js">'+ jscode +'</textarea></body></html>');
					doc.document.close();
				});
				
			}
			
		};
		function showAPI(){
			J('#unuseapi').html(APIhtml(unUseAPI));
			J('#useapi').html(APIhtml(useAPI));
			
		}
		function APIhtml(api){
			if(typeof api=='object'){
				var ht = [];
				$each(api, function(val, key){
					var jid = key;
					if(typeof val.valueOf() == 'object'){
						key='<li jid="'+ jid +'"><h3>'+ key +'</h3>'+ APIhtml(val) +'</li>';
					}else{
						key = key.split('_');
						key = ({
							s: 'J.'+ key[0],
							p: 'J(~).'+ key[0]
						})[key[1]];
						key = '<li class="item" jid="'+ jid +'">'+ key +'</li>';
					}
					ht.push(key);
				});
				return '<ul>'+ ht.join('') +'</ul>';
			}
			return '';
			
		}
		function deepCopy(obj){//深度拷贝
			var _obj = {};
			if(typeof obj == 'object'){
				for(var key in obj){
					_obj[key] = deepCopy(obj[key]);
				}
				return _obj;
			}
			return obj;
		}
		function change(btn, type){
			if(btn.cls('item')){
				var ApiKey = btn.attr('jid'),
					ApiPath = [], //对应的接口路径
					end;
				while((btn = btn.parent(1)) && btn.tag('LI')){
					ApiPath.unshift(btn.attr('jid'));
				}
				var unuse = unUseAPI,
					use = useAPI,
					key,
					i = 0;
				
				if(type == 'add'){
					while(key = ApiPath[i++]){ //一层层的读取Api
						unuse = unuse[key];
						use = !use[key] ? (use[key] = {}) : use[key];
					}
					use[ApiKey] = unuse[ApiKey];
					delete unuse[ApiKey];
				}else{
					while(key = ApiPath[i++]){
						use = use[key];
						unuse = !unuse[key] ? (unuse[key] = {}) : unuse[key];
					}
					unuse[ApiKey] = use[ApiKey];
					delete use[ApiKey];
				}
				showAPI();
			}
		}
		function API2Hash(api, hash){ //转换APi数据为key:value形式
			hash = hash || {};
			$each(api, function(val, key){
				if(typeof val == 'object'){
					API2Hash(val, hash);
				}else{
					hash[key] = val;
				}
			});
			return hash;
		}
		function getCodeByUse(useQueue){
			var apiCode = [],
				imports = {},//已经导入的api标志
				iptVars = {},//已经导入的变量
				iptFuns = {},//已经导入的函数
				selCode = 0;//是否使用选择器
			$each(useQueue, function(val, key){
				key = key.split('_');
				if(key[0]){//生成对外接口的代码，s为静态，p为原型
					apiCode.push(({
						s: '\t$1k.'+ key[0] +' = '+ val,
						p: '\t$DP.'+ key[0] +' = '+ clearBlank(val)
					})[key[1]] + ';');
					if(key[1] == 'p'){
						selCode = 1;
					}
				}
			});
			function clearBlank(fn){//清空前缀空白。实现对齐
				fn = ''+ fn;
				var blank;
				fn.replace(/^\t+/gm, function(all){
					if(!blank || all.length < blank.length){
						blank = all;
					}
				});
				return fn.replace(new RegExp('^\\' + blank, 'gm'), '\t');
				
			}
			apiCode = apiCode.join('\n') + '\n';
			if(!selCode){
				imports['$1k'] = 1;
				apiCode = '\tfunction $1k(){}\n'+ apiCode;
			}
			$each(useQueue, function(val, key){ //为什么不在第一个each中完成，主要是因为selCode必须全遍历才能得出最终结果
				parseCode(val);
			});
			if(selCode && !imports['$1k']){ //未加载$1k
				apiCode = '\t'+ CODE['$1k'].source + '\n\t'+ CODE['$Dom'].source +'\n'+ apiCode;
			}
			var vars = [],
				funs = [];
			for(var key in CODE){ //这个遍历是为了保持各API创建的顺序
				if(key in iptVars){
					vars.push(iptVars[key].replace(/;(\s*|\/\/.*)$/, '')); //去除尾部的分号和空白
				}else if(key in iptFuns){
					funs.push(iptFuns[key]);
				}
			}
			if(vars.length){
				vars[0] = vars[0].replace(/^\s*/, '');
				vars = '\tvar '+vars.join(',\n') + ';\n';
			}else{
				vars = '';
			}
			return header + '\n'
			+ '!function(){\n'
			+ vars + funs.join('') + apiCode
			+ '\tthis.$1k = $1k;\n'
			+ '}();\n';
			
			function parseCode(code){
				(code +'').replace(/\$[\w]+/g, function(key){
					if(key in CODE && !(key in imports)){//在API中并且还未导入
						imports[key] = 1;
						if(/^\s*function\s*/.test(CODE[key].source)){//是函数还是变量
							iptFuns[key] = ('\t'+ CODE[key].source +'\n');
						}else{
							iptVars[key] = ('\t'+ CODE[key].source +'\n');
						}
						parseCode(CODE[key].source);
					}
				});
			}
		}
	}();
	
	Lib.showAPI();
	Lib.setEvent();
	
}($1k);