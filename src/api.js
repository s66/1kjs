{
/**
    @module Core 核心
*/
    Core: {
        /**
			@syntax Class(prop,source) 创建一个具有继承接口的类
			@params
				prop Object 原型成员的数据源
				,source Object 静态成员的数据源

			@title 接口说明
			@data [
                ['值','描述'],
                ['extend','使用同Class(prop,source)，返回从当前类继承的子类']
			]
			@ret Class 返回从基类中继承的类，基类是一个没有任何方法的空类
         */
        Class_s: function(prop, source){
			return $Class.extend(prop, source);
        },
        
        /**
			@syntax widget(name,fn) 标准创建组件
			@params
            name String 组件名称
            fn Function 组件运算函数，函数必须返回组件对象
			@ret All 返回任何类型的值，一般是返回组件的接口或者类
		 */
		widget_s: function(name, fn, source){
            if(typeof fn == 'function'){
                return $1k[name] = fn($1k);
            }else if(typeof fn == 'object'){
                return $1k[name] = $Class.extend(fn, source);
                
            }
            
		}
    },
    /**
        @module DOM DOM
     */
    DOM: {
        /**
            @module DOM.Query 查询
         */
        /**
            @syntax selector 选择器表达式
            @title 表达式说明
            @data [
                ['表达式','说明'],
                ['#id','id选择器'],
                ['tag','tagName选择器'],
                ['.cls','className选择器'],
                ['[key=val]','attribute选择器'],
                ['#id tag.cls[key=val]','tag，cls，attr可以同时出现，也可以只出现一种']
            ]
            @title 简单的选择器
            @data 简单的选择器配合其他查询方法基本上能满足大多数应用的节点查询，使用简洁的选择器有利于设计出结构简单的html，不建议过多使用伪类和CSS3选择器，JS选择器使用的过于复杂就会造成逻辑混乱和程序难以维护。
         */
        Query: {
            /**
				@syntax query(selector[,context]) dom选择器
                @params
                    selector String 选择器表达式，选择器表达式详情查看
                    ,context Element 查询范围
				@ret Element,ElementArray,null 返回节点，节点数组或者null
			*/
            query_s: '$query',
            /**
                
				@syntax eq(index) 使用下标以当前节点作为范围进行查寻
                @type #
				@params
                index Integer index为正时，获取第n+1个节点，为负数时，获取倒数第n个，超出返回null
				@ret $1k,null 包装的节点对象，查询不到返回null
			 */
			eq_p: function(i){
				if(i < 0)i = this.elems.length + i;
				return $1k(this.elems[i]);
			},
            /**
				@syntax find(selector) 使用查询表达式以当前节点作为范围进行查找
				@type #
                @params
                selector string 选择器表达式
				@ret $1k,Null 包装的节点对象，查询不到返回null
			 */
			find_p: function(selector){
				return $1k(selector, this.elem);
			},
            /**
				@syntax parent([index|selector]) 查询父节点
				@type #
                @params
                ,无参数 . 返回最近的父节点
                ,index Integer 返回第n层的父节点
                ,selector String 根据选择器返回最近父节点
                
				@ret $1k,Null 包装的节点对象，查询不到返回null
			 */
			parent_p: function(index){
				return $1k($parent(this.elem, index));
			},         
            /**
				@syntax child([index]) 查询所有子节点
				@type #
                @params
                ,无参数 . 返回全部子节点
                ,index Integer index为正时，获取第n+1个节点，为负数时，获取倒数第n个，超出返回null
				@ret $1k,Null 包装的节点对象，查询不到返回null
			 */
			child_p: function(index){
				return $1k($child(this.elem, index));
			},
            /**
				@syntax prev() 查询上一个兄弟节点
				@type #
				@ret $1k,Null 包装的节点对象，查询不到返回null
			 */
			prev_p: function(){
				return $1k($prev(this.elem));
			},
            /**
				@syntax next() 查询下一个兄弟节点
				@type #
				@ret $1k,Null 包装的节点对象，查询不到返回null
			 */
			next_p: function(){
				return $1k($next(this.elem));
			},
            /**
				@syntax filter(fn) 根据条件对查询的结果进行过滤
				@type #
                @params
                fn Function 执行过滤运算的函数，返回false则过滤掉当前项
                @title fn参数
                @data [
                ['参数','说明'],
                    ['val','当前项的值'],
                    ['i','当前过滤项的下标'],
                ]
				@ret $1k,Null 返回过滤的结果
			 */
            filter_p: function(fn){
                if(this.elems){
                    var elems = [];
                    $each(this.elems, function(elem, i){
                        var Zelem = $1k(elem);
                        if(fn.call(null, Zelem, i)){
                            elems.push(elem);
                        }
                        
                    });
                    if(elems.length){
                        return $1k(elems);
                    }
                    return null;
                }else{
                    if(!fn.call(null, this, 0)){
                        return null;
                    }
                    return $1k(this.elem);
                }
            }
            
        },
        /**
			@module DOM.Operate 操作
		 */
		Operate: {
            /**
				@syntax elem(str) 创建非文本节点
				@params
                str String 节点的nodeName或者htmlstr，htmlstr必须包含唯一根节点
				@ret $1k 节点包装对象
			 */
			elem_s: function(html){
				return $1k($elem(html));
			},
            /**
				@syntax append(elem[,index]|htmlstr[,index]) 添加子节点
                @type #
				@params
                elem Element,$1k 待添加的节点
                htmlstr String 待添加的html字符串
                ,index Integer 子节点插入的位置，默认为-1，即添加到最后，取值可以是正数或者负数，正数超出则添加到尾部，负数超出则添加到头部
				@ret $1k 节点包装对象
			 */
			append_p: function(newNode, index){
				return $box.call(this, $append, newNode, index);
			},
            /**
                
				@syntax insert(elem|htmlstr[,insertAfter]) 插入兄弟节点
                @type #
				@params
                elem Element,$1k 待添加的节点
                htmlstr String 待添加的html字符串
                ,insertAfter Boolean 判断是否插入到节点后面，默认为false，即在当前节点前面插入节点
				@ret $1k 节点包装对象
			 */
			insert_p: function(newNode, insertAfter){
				return $box.call(this, $insert, newNode, insertAfter);
			},
            /**
				@syntax remove() 删除当前节点，并返回该节点
                @type #
				@ret $1k 返回被移除的对象
			 */
			remove_p: function(){
				return $box.call(this, $remove);
			},
            /**
				@syntax clone([deepCopy]) 克隆节点
                @type #
				@params
                ,deepCopy Boolean 是否深度克隆节点，默认为false
				@ret $1k 新克隆的节点包装对象
			 */
			clone_p: function(deepCopy){
				return $1k($clone(this.elem, deepCopy));
			},
            /**
                
				@syntax replace(newNode) 替换当前节点
                @type #
				@params
                newNode Element,$1k 目标节点
				@ret $1k 被替换下来的节点包装对象
			 */
			replace_p: function(newNode){
				return $box.call(this, $replace, newNode);
			},
            /**
				@syntax each(callback) 遍历执行callback
                @type #
				@params
                callback Function 回调函数，this指向对应节点包装对象，参数i为节点所在集合的下标
				@title 回调说明
				@data 回调函数返回为true时，则跳出循环
				@ret $1k 返回自己
			 */
			each_p: function(func){
				if(this.elems){
					$each(this.elems, function(elem, i){
						return func.call($1k(elem), i);
					});
                }else if(this.elem){
					func.call(this, 0);
				}
				return this;
			}
        },
        /**
			@module DOM.Style 样式
		 */
        Style: {
			/**
                @syntax cls([cls,cls2]) className获取，判断，操作
                @type #
                @params
                ,无参数 . 获取当前节点的className
                ,cls String 判断节点中是否含有cls
                ,cls String 当一个字符是+，-，~，=时表示操作className；+代表添加，-代表移除，~代表切换，=代表覆盖，多个cls用逗号隔开
                ,cls2 String 替换cls为cls2
				@ret String,Boolean,$1k 返回className或者是否包含class的判断，或者在操作完成后返回节点包装对象
			 */
			cls_p: function(cls1, cls2){
				return $box.call(this, $cls, cls1, cls2);
			},
            /**
				@syntax css(name[,value]|csstext|hash) 样式获取和操作
                @type #
                
				@params
                name String 返回style.name的样式值
                csstext String 设置css，标准的csstext字符串，比如margin-left:12px;color:red;
                hash Object 设置css，Object的key作为样式名，value作为样式值
                ,value String 设置样式，value为值，可以使用中划线也可以采用驼峰
                
				@ret String,$1k 返回样式值或者节点包装对象
			 */
			css_p: function(name, value){
				return $box.call(this, $css, name, value);
			},
            /**
                
				@syntax px(name) 返回节点可计算的样式px值
				@params
                name string 取值可以是:[left,top,width,height,border,padding,margin]等相关属性
				@ret Number 所有返回的值都是px为单位
			 */
			px_p: function(name){
				return $cssnum(this.elem, name);
			},
            /**
				@syntax left([px]) 获取和设置节点style.left的数值
				@type #
				@params
                无参数 . 获取节点的style.left
                ,px Number 设置节点的style.left的值
				@ret $1k,Number 节点包装对象，left的像素值
			 */
			left_p: function(value){
				return $box.call(this, $left, value);
			},
            /**
				@syntax top([px]) 同left
				@type #
			 */
			top_p: function(value){
				return $box.call(this, $top, value);
			},
            /**
				@syntax width([px]) 同left
				@type #
			 */
			width_p: function(value){
				return $box.call(this, $width, value);
			},
            /**
				@syntax height([px]) 同left
				@type #
			 */
			height_p: function(value){
				return $box.call(this, $height, value);
			},
            /**
				@syntax offset() 获取节点离开文档的距离
                @type #
				@ret Object {x:left,y:top}包含offsetWidth和offsetHeight的数据
			 */
			offset_p: function(){
				return $offset(this.elem);
			},
            /**
                
				@syntax offsetLeft() 获取节点离开文档左侧的距离
                @type #
				@ret Number 单位为px
			 */
			offsetLeft_p: function(){
				return $offset(this.elem).left;
			},
            /**
				@syntax offsetTop() 获取节点离开文档顶部的距离
                @type #
				@ret Number 单位为px
			 */
			offsetTop_p: function(){
				return $offset(this.elem).top;
			},
            
            /**
				@syntax offsetWidth() 获取节点offsetWidth值
                @type #
				@ret Number 单位为px
			 */
			offsetWidth_p: function(){
				return this.elem.offsetWidth;
			},
            /**
				@syntax offsetHeight() 获取节点offsetHeight值
                @type #
				@ret Number 单位为px
			 */
			offsetHeight_p: function(){
				return this.elem.offsetHeight;
			},
            /**
				@syntax opacity([opacity]) 获取和设置透明度
				@type #
				@params
                
                ,无参数 . 获取节点的透明度，取值0-1
                ,opacity Number 设置节点的透明度，取值0-1
				@ret $1k,Number 返回自己，节点透明度
			 */
			opacity_p: function(opacity){
				return $box.call(this, $opacity, opacity);
			},
			
			/**
				@syntax show() 设置节点的display为''
				@type #
				@ret $1k 返回自己
			 */
			show_p: function(){
				return $box.call(this, $show);
			},
			/**
				@syntax hide() 设置节点的display为none
				@type #
				@ret $1k 返回自己
			 */
			hide_p: function(){
				return $box.call(this, $hide);
			}
        },
        /**
            @module DOM.Event 事件
         */
        event: {
            /**
				@syntax Event 格式化后的事件对象
				@title 事件API列表
				@data [
                ['名称','类型','描述'],
                ['origin','Object','原始的Event对象'],
                ['type','String','Event事件的类型，比如click,mouseover等'],
                ['clientX','Number','鼠标的坐标位置'],
                ['clientY','Number','鼠标的坐标位置'],
                ['target','Element','事件发生的节点'],
                ['fromTarget','Element','鼠标事件的来源节点'],
                ['toTarget','Element','鼠标事件的目标节点'],
                ['stopPropagation','Function','阻止冒泡'],
                ['preventDefault','Function','阻止默认事件'],
                ['mouseKey','String','鼠标的点击键返回 左键（L）,中键（M）,右键（R）'],
                ['keyCode','Number','键盘的按下的键']
				]
				@ret 事件对象
			 */
            /**
                @syntax ready(fn) 将函数添加到onDOMReady事件队列中
                @params
                fn Function 待添加的函数
             */
            ready_s: function(fn){
                $ready(fn);
            },
            /**
				@syntax on(type,callback[,context]) 事件绑定
				@params
                type String 事件类型
                callback Function 回调函数
                ,context All 回调函数中this的指向,默认指向当前节点的包装对象
				@ret $1k 返回自己
			 */
			on_p: function(type, func, context){
				var result = $bind.call(this, this.elem, type, func, context || this);
				if(this.elems && result == this){
					var i = 1;
					while(this.elems[i]){
						$bind.call(this, this.elems[i], type, func, context || this.eq(i));
						i++;
					}
					return this;
                }else{
					return result;
				}
			},
			
			/**
				@syntax un(type,callback[,context]) 解除事件绑定
				@params
                type String 事件类型
                callback Function 回调函数
                ,context All 回调函数中this的指向,默认指向当前节点的包装对象
				@ret $1k 返回自己
			 */
			un_p: function(type, func, context){
				var result = $unbind.call(this, this.elem, type, func, context || this);
				if(this.elems && result == this){
					var i = 1;
					while(this.elems[i]){
						$unbind.call(this, this.elems[i], type, func, context || this.eq(i));
						i++;
					}
					return this;
                }else{
					return result;
				}
			},
			
			/**
				@syntax click(callback[,context]) 鼠标点击事件绑定
				@params
                callback Function 回调函数
                ,context All 回调函数中this的指向,默认指向当前节点的包装对象
				@ret $1k 返回自己
			 */
			click_p: function(func, context){
				var result = $bind.call(this, this.elem, 'click', func, context || this);
				if(this.elems && result == this){
					var i = 1;
					while(this.elems[i]){
						$bind.call(this, this.elems[i], 'click', func, context || this.eq(i));
						i++;
					}
					return this;
                }else{
					return result;
				}
			},
			
			/**
				@syntax hover(hover,out[,context]) 鼠标hover事件绑定
				@params
                hover Function 鼠标hover回调函数
                out Function 鼠标out回调函数
                ,context All 回调函数中this的指向,默认指向当前节点的包装对象
				@ret $1k 返回自己
			 */
			hover_p: function(hover, out, context){
				var elem,
				self = this;
				if(this.elems){
                    
					var i = 0;
					while(elem = this.elems[i]){
						!function(_who){
							var elem = _who.elem;
							$bind(elem, 'mouseover', function(evt){
								if(evt.fromTarget && !$contains(elem, evt.fromTarget) || !evt.fromTarget)hover.call(context || _who, evt);
							}, context || _who);
							$bind(elem, 'mouseout', function(evt){
								if(!evt.toTarget || !$contains(elem, evt.toTarget))out.call(context || _who, evt);
							}, context || _who);
						}(this.eq(i));
						i++;
					}
                    
                }else{
                    
					elem = this.elem;
					$bind(elem, 'mouseover', function(evt){
						if(evt.fromTarget && !$contains(elem, evt.fromTarget) || !evt.fromTarget)hover.call(context || self, evt);
					}, context || self);
                    
					$bind(elem, 'mouseout', function(evt){
						if(!evt.toTarget || !$contains(elem, evt.toTarget))out.call(context || self, evt);
					}, context || self);
                    
				}
				return this;
			}
            
        }, 
        /**
			@module DOM.Other 其他
		 */
        Other: {
            /**
				@syntax attr(name[,value]|hash) 获取和设置节点的属性值
                @type #
				@params
                name String 节点的属性名
                ,value String 节点的属性值
                hash Object 以key为节点属性名，value为节点属性值
				@ret String,Undefined,$1k 当value为null时，执行删除属性
			 */
			attr_p: function(name, value){
				return $box.call(this, $attr, name, value);
			},
            /**
				@syntax html([htmlstr|htmlArray|fn]) 获取和设置节点的innerHTML
				@type #
				@params
                无参数 . 获取节点的innerHTML 
                ,htmlstr String 设置节点的innerHTML 
                ,htmlArray Array 将自动调用Array.join('')作为htmlstr
                ,fn Function 将函数的返回值作为htmlStr 
                
				@ret String,$1k
			 */
			html_p: function(html){
				return $box.call(this, $html, html);	
			},
			
			/**
				@syntax tag([tagName]) 获取和判断节点名
                @type #
				@params
                无参数 . 获取当前节点名
                ,tagName String 节点名，判断当前节点名称是否等于tagName
				@ret String,Boolean 返回的节点名称是大写的
			 */
			tag_p: function(nodeName){
				return $tag(this.elem, nodeName);
			},
			
			/**
				@syntax contains(elem) 判断节点是否包含elem
                @type #
				@params
                elem Element,$1k 待判断的节点
				@ret Number elem是他自己返回1，elem被包含在内返回2，否则返回0
			 */
			contains_p: function(elem){
				return $contains(this.elem, elem);
			},
			
			/**
				@syntax val([value]) 获取和设置表单的值
				@type #
				@params
                无参数 . 获取当前表单的值
                ,value String 设置表单的值
				@ret String,$1k
			 */		
			val_p: function(value){
				return $box.call(this, $val, value);
			},
			length_p: function(){
				return this.elems.length || 1;
			}
        }
    },
    /**
        @module BOM 浏览器
     */
    BOM: {
        
        /**
            @syntax browser 获取指定浏览器的版本号
            @title 支持获取的浏览器
            @data [
                ['浏览器'],
                ['ie'],
                ['firefox'],
                ['chrome'],
                ['opera'],
                ['safari']
            ]
            @title 使用说明
            @data 例如：browser.ie 假如浏览器为ie6，将返回6.0，假如为firefox，则返回undefined
            @ret String,Undefined 浏览器版本号（字符串类型）,假如不是指定的浏览器，则返回undefined
         */
        browser_s: '$browser',
        
        /**
            @syntax isIE6 判断浏览器是否为ie6
            @ret Boolean 
         */
        isIE6_s: '$isIE6',
        
        /**
            @syntax cookie(name[,value,options]|data[,options]) 操作cookie
            @params
            name String 获取cookie的值
            ,value String 设置cookie的值，当value为null时，则删除当前的cookie
            ,options Object|Integer 设置cookie的其他配置或者是有效期
            data Object 以hashmap的key和value设置cookie的值
            @ret String,
            
            @title options配置信息
            @data [
                ['key','value说明'],
                ['expires','cookie有效期，默认是浏览器关闭则失效，单位是分钟'],
                ['path','cookie的路径范围，默认是根目录'],
                ['domain','cookie的domain权限，默认是当前domain']
            ]
            @ret String
         */
        cookie_s: '$cookie',
        /**
            @syntax scrollTop(top[,time,type]) 获取或者设置滚动条的top值
            @params
            top Number scrollTop的值
            ,time Number 默认0，执行动画所需时间，单位为ms
            ,type String 缓动类型，默认为circOut
         */
        scrollTop_s: function(){
            return $scrollTop.apply(this, arguments);
        },
        /**
            @syntax scrollLeft(left[,time,type]) 同scrollTop
         */
        scrollLeft_s: function(){
            return $DE.scrollLeft + $DOC.body.scrollLeft;
        },
        
        docWidth_s: function(){
            return $DE.clientWidth;
        },
        docHeight_s: function(){
            return $DE.clientHeight;
        },
        /**
            @syntax scrollWidth() 获取滚动条的scrollWidth
            @ret Number
         */
        scrollWidth_s: function(){
            return $DE.scrollWidth;
        },
        /**
            @syntax scrollHeight() 获取滚动条的scrollHeight
            @ret Number
         */
        scrollHeight_s: function(){
            return Math.max($DE.scrollHeight, $DOC.body.scrollHeight);
        }
        
    }, 
    /**
        @module Request 资源请求
     */
    Request: {
        /**
            @syntax ajax(options) 创建一个功能完整的ajax
            @params
            options Object 配置参数
           @title options配置说明
           @data [
               ['key','描述'],
               ['url','请求地址'],
               ['type','请求类型，get或者post'],
               ['data','发送的数据'],
               ['callback','回调函数，函数的参数由responseType决定，默认是xhr对象'],
               ['responseType','响应的类型，决定callback的参数类型'],
               ['headers','设置请求头']
           
           ]
         */
        ajax_s: '$ajax',
        /**
            @syntax post(url,callback,data) 调用ajax的post请求
            @params
            url String url地址
            callback Function 回调函数
            data Object,String json对象或者URL查询字符串
         */
        post_s: '$post',
        /**
            @syntax get(url,callback,data) 同ajax的post 
         */
        get_s: '$get',
        /**
            @syntax img(url[,callback]) 动态加载img并执行回调
            @params
            url String img的url地址
            ,callback Function 图片加载完成时的回调函数
         */
        img_s: '$img',
        /**
            @syntax js(url,callback,data,charset) 动态加载js，使用可发起jsonp
            @params
            url String js文件的地址
            callback Function 回调函数
            data Object,String json对象或者URL查询字符串
            charset String 返回内容使用的编码
         */
        js_s: '$js',
        jsonp2_s: '$jsonp2',
        /**
            @syntax style(url|csstext) 加载css文件或者csstext
            @params
            url String css文件的地址
            csstext String 标准的csstext
         */
        style_s: '$style'
    },
    /**
        @module Other 其他方法
     */
    Other: {
        /**
            @syntax type(data) 返回类型
            @params
            data All 待计算的变量
            @ret String 返回数据类型字符串
            @title 返回值取值
            @data [
            ['值','描述'],
            ['string','字符串'],
            ['array','数组'],
            ['function','函数'],
            ['regexp','正则'],
            ['boolean','布尔值'],
            ['date','Date对象'],
            ['number','数字'],
            ['undefined','未定义'],
            ['null','null'],
            ['element','节点'],
            ['window','window对象'],
            ['document','document对象'],
            ['object','对象']
			]
         */
        type_s: '$type',
        /**
            @syntax isArray(data) 判断是否为数组
            @params
                data All 待判断的变量
            @ret Boolean 返回判断结果
         */
        isArray_s: '$isArray',
        /**
            @syntax isFunction(data) 判断是否为函数
            @params
            data All 待判断的变量
            @ret Boolean 返回判断结果
         */
        isFunction_s: '$isFunction',
        echo_s: function(){}
    },
    /**
        @module Object 对象
     */
    Object: {
        /**
            @syntax each(hash,callback) 遍历hash或数组并且执行回调
            @params
            hash Object,Array 待遍历的数据
            callback Function 回调函数
            @title 回调函数callback(val, key)
            @data 参数key为hash的key或数组下标，val为当前数据项的值，当callback返回为true时，将跳出遍历
            @ret 无
         */
        each_s: '$each',
        /**
            @syntax toJson(data) 对象转换成json字符串
            @params
            data Object 待转换的对象
            @ret json字符串
         */
        toJson_s: function(obj){
            if($WIN.JSON && JSON.stringify){
                return JSON.stringify(obj);
            }
            return $toJson(obj);
        },
        /**
            @syntax param(data) 序列化对象为URL查询字符串
            @params
            data Object 待转换的对象
            @ret URL查询字符串
         */
        param_s: '$param',
        /**
            @syntax mix(target,source) 浅混合数据对象
            @params
            target Object 目标数据源
            source Object 来源数据源
            @ret 
         */
        mix_s: '$mix'
    },
    /**
        @module String 字符串
     */
    String: {
        /**
            @syntax tirm(str) 去除首尾空格
            @params
            str String 待处理的字符串
            @ret String
         */
        tirm_s: '$tirm',
        /**
            @syntax parseJson(str) 解析json字符串到对象
            @params
            str String Json字符串
            @ret Object,Null
         */
        parseJson_s: function(str){
            if($WIN.JSON && JSON.parse){
                return JSON.parse(str);
            }
            return $parseJson(str);
        },
        /**
            @syntax encodeURL(str) 编码特殊字符以便进行传输
            @params
            str String 待编码的字符串
            @title 可编码字符
            @data [
            ['原始字符','编码字符'],
            ['%','%25'],
            ['空格','%20'],
            ['#','%23'],
            ['&','%26'],
            ['=','%3D'],
            ['/','%2F'],
            ['?','%3F'],
            ['+','%2B']
            ]
            @ret String 编码后的字符串
         */
        encodeURL_s: '$encodeURL',
        /**
            @syntax encodeHTML(htmlstr) 编码html字符串
            @params
            htmlstr String 待编码html字符串
            @ret String
         */
        encodeHTML_s: '$encodeHTML',
        /**
            
            @syntax decodeHTML(htmlstr) 待解码html字符串
            @params
            htmlstr string 待解码html字符串
            @ret String
         */
        decodeHTML_s: '$decodeHTML'  
    },
    /**
        @module Widget 内部组件
     */
    widget: {
        /**
            @syntax Anim(attrs,options) 创建动画对象
            @params
            attrs Object css属性和值
            ,options Object 动画配置对象
            @title attrs配置参数
            @data 取值left,top,right,bottom,margin,padding,opacity等，不支持color，当属性前面带x,则表示相对运动，比如xleft:-10,表示left左移10px
            
            @title options配置参数
            @data [
            ['key','类型','说明'],
            ['dur','Integer','动画执行的时间，单位ms，默认800ms'],
            ['easing','string','动画公式，默认Both'],
            ['onbefore','function','动画开始时执行的回调函数'],
            ['onplay','function','动画执行中的回调函数'],
            ['ondone','function','动画执行完的回调函数'],
            ['onstop','function','动画被手动终止的回调函数']
            ]
    
            @title easing公式
            @data [
            ['值','描述'],
            ['Linear','匀速'],
            ['slowIn','缓慢渐入'],
            ['slowOut','缓慢渐出'],
            ['slowBoth','--'],
            ['In','--'],
            ['Out','--'],
            ['Both','--'],
            ['elasticIn','弹簧效果'],
            ['elasticOut','--'],
            ['elasticBoth','--'],
            ['backIn','返回效果'],
            ['backOut','--'],
            ['backBoth','--'],
            ['bounceIn','撞击效果'],
            ['bounceOut','--'],
            ['bounceBoth','--']
            ]
            @ret Anim 动画对象
         */
        
        
            Anim_p: function(attrs, options){
                $each(this.elems || [this.elem], function(elem, i){
                    var animId = elem.__ANIMID__;
                    if(!animId){
                        animId = elem.__ANIMID__ = ++$GUID
                    }else{
                        $AnimHook[animId].stop();
                    }
                    $AnimHook[animId] = $Anim(elem, attrs, options);
                });
                return this;
            },
        /**
            @syntax Drag(options) 创建拖放对象
            @params
            options Object 拖拽配置对象
            @title options配置参数
            @data [
            ['key','类型','说明'],
            ['before','function','拖动前回调'],
            ['running','function','拖动中回调'],
            ['after','function','拖动完成后'],
            ['limitNode','Node','限制范围的节点，参数为window则限定为浏览器可见屏幕内'],
            ['lockx','1|0','锁定横向拖动'],
            ['locky','1|0','锁定纵向拖动'],
            ['hand','Node|NodeList','拖动的句柄容器']
            ]
            @title 接口说明
            @data [
            ['值','描述'],
            ['addHand','添加拖放句柄'],
            ['rmvHand','移除拖放句柄，参数为节点']
            ]
            @ret Drag 拖拽对象
         */
            Drag_p: function(options){
                if(!this.elem.__DRAGID__){
                    $DragHook[this.elem.__DRAGID__ = ++$GUID] = $Drag(this.elem, options || {});
                }
                return $DragHook[this.elem.__DRAGID__];
            },
        /*
           @syntax anim(cssAttr,callback) 快速执行一个简单动画
           @params
           cssAttr Object css属性的hashmap
           callback function  动画完成后的回调
        */  
            anim_p: function(cssAttr, callback){
                //console.info(cssAttr);
                $anim(this.elem, cssAttr, callback)
                //return $box.call(this, $anim, cssAttr, callback);
            }
    },
    end:{}
}