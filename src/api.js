{
/**
    @module Core ����
*/
    Core: {
        /**
			@syntax Class(prop,source) ����һ�����м̳нӿڵ���
			@params
				prop Object ԭ�ͳ�Ա������Դ
				,source Object ��̬��Ա������Դ

			@title �ӿ�˵��
			@data [
                ['ֵ','����'],
                ['extend','ʹ��ͬClass(prop,source)�����شӵ�ǰ��̳е�����']
			]
			@ret Class ���شӻ����м̳е��࣬������һ��û���κη����Ŀ���
         */
        Class_s: function(prop, source){
			return $Class.extend(prop, source);
        },
        
        /**
			@syntax widget(name,fn) ��׼�������
			@params
            name String �������
            fn Function ������㺯�����������뷵���������
			@ret All �����κ����͵�ֵ��һ���Ƿ�������Ľӿڻ�����
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
            @module DOM.Query ��ѯ
         */
        /**
            @syntax selector ѡ�������ʽ
            @title ���ʽ˵��
            @data [
                ['���ʽ','˵��'],
                ['#id','idѡ����'],
                ['tag','tagNameѡ����'],
                ['.cls','classNameѡ����'],
                ['[key=val]','attributeѡ����'],
                ['#id tag.cls[key=val]','tag��cls��attr����ͬʱ���֣�Ҳ����ֻ����һ��']
            ]
            @title �򵥵�ѡ����
            @data �򵥵�ѡ�������������ѯ��������������������Ӧ�õĽڵ��ѯ��ʹ�ü���ѡ������������Ƴ��ṹ�򵥵�html�����������ʹ��α���CSS3ѡ������JSѡ����ʹ�õĹ��ڸ��Ӿͻ�����߼����Һͳ�������ά����
         */
        Query: {
            /**
				@syntax query(selector[,context]) domѡ����
                @params
                    selector String ѡ�������ʽ��ѡ�������ʽ����鿴
                    ,context Element ��ѯ��Χ
				@ret Element,ElementArray,null ���ؽڵ㣬�ڵ��������null
			*/
            query_s: '$query',
            /**
                
				@syntax eq(index) ʹ���±��Ե�ǰ�ڵ���Ϊ��Χ���в�Ѱ
                @type #
				@params
                index Integer indexΪ��ʱ����ȡ��n+1���ڵ㣬Ϊ����ʱ����ȡ������n������������null
				@ret $1k,null ��װ�Ľڵ���󣬲�ѯ��������null
			 */
			eq_p: function(i){
				if(i < 0)i = this.elems.length + i;
				return $1k(this.elems[i]);
			},
            /**
				@syntax find(selector) ʹ�ò�ѯ���ʽ�Ե�ǰ�ڵ���Ϊ��Χ���в���
				@type #
                @params
                selector string ѡ�������ʽ
				@ret $1k,Null ��װ�Ľڵ���󣬲�ѯ��������null
			 */
			find_p: function(selector){
				return $1k(selector, this.elem);
			},
            /**
				@syntax parent([index|selector]) ��ѯ���ڵ�
				@type #
                @params
                ,�޲��� . ��������ĸ��ڵ�
                ,index Integer ���ص�n��ĸ��ڵ�
                ,selector String ����ѡ��������������ڵ�
                
				@ret $1k,Null ��װ�Ľڵ���󣬲�ѯ��������null
			 */
			parent_p: function(index){
				return $1k($parent(this.elem, index));
			},         
            /**
				@syntax child([index]) ��ѯ�����ӽڵ�
				@type #
                @params
                ,�޲��� . ����ȫ���ӽڵ�
                ,index Integer indexΪ��ʱ����ȡ��n+1���ڵ㣬Ϊ����ʱ����ȡ������n������������null
				@ret $1k,Null ��װ�Ľڵ���󣬲�ѯ��������null
			 */
			child_p: function(index){
				return $1k($child(this.elem, index));
			},
            /**
				@syntax prev() ��ѯ��һ���ֵܽڵ�
				@type #
				@ret $1k,Null ��װ�Ľڵ���󣬲�ѯ��������null
			 */
			prev_p: function(){
				return $1k($prev(this.elem));
			},
            /**
				@syntax next() ��ѯ��һ���ֵܽڵ�
				@type #
				@ret $1k,Null ��װ�Ľڵ���󣬲�ѯ��������null
			 */
			next_p: function(){
				return $1k($next(this.elem));
			},
            /**
				@syntax filter(fn) ���������Բ�ѯ�Ľ�����й���
				@type #
                @params
                fn Function ִ�й�������ĺ���������false����˵���ǰ��
                @title fn����
                @data [
                ['����','˵��'],
                    ['val','��ǰ���ֵ'],
                    ['i','��ǰ��������±�'],
                ]
				@ret $1k,Null ���ع��˵Ľ��
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
			@module DOM.Operate ����
		 */
		Operate: {
            /**
				@syntax elem(str) �������ı��ڵ�
				@params
                str String �ڵ��nodeName����htmlstr��htmlstr�������Ψһ���ڵ�
				@ret $1k �ڵ��װ����
			 */
			elem_s: function(html){
				return $1k($elem(html));
			},
            /**
				@syntax append(elem[,index]|htmlstr[,index]) ����ӽڵ�
                @type #
				@params
                elem Element,$1k ����ӵĽڵ�
                htmlstr String ����ӵ�html�ַ���
                ,index Integer �ӽڵ�����λ�ã�Ĭ��Ϊ-1������ӵ����ȡֵ�������������߸�����������������ӵ�β����������������ӵ�ͷ��
				@ret $1k �ڵ��װ����
			 */
			append_p: function(newNode, index){
				return $box.call(this, $append, newNode, index);
			},
            /**
                
				@syntax insert(elem|htmlstr[,insertAfter]) �����ֵܽڵ�
                @type #
				@params
                elem Element,$1k ����ӵĽڵ�
                htmlstr String ����ӵ�html�ַ���
                ,insertAfter Boolean �ж��Ƿ���뵽�ڵ���棬Ĭ��Ϊfalse�����ڵ�ǰ�ڵ�ǰ�����ڵ�
				@ret $1k �ڵ��װ����
			 */
			insert_p: function(newNode, insertAfter){
				return $box.call(this, $insert, newNode, insertAfter);
			},
            /**
				@syntax remove() ɾ����ǰ�ڵ㣬�����ظýڵ�
                @type #
				@ret $1k ���ر��Ƴ��Ķ���
			 */
			remove_p: function(){
				return $box.call(this, $remove);
			},
            /**
				@syntax clone([deepCopy]) ��¡�ڵ�
                @type #
				@params
                ,deepCopy Boolean �Ƿ���ȿ�¡�ڵ㣬Ĭ��Ϊfalse
				@ret $1k �¿�¡�Ľڵ��װ����
			 */
			clone_p: function(deepCopy){
				return $1k($clone(this.elem, deepCopy));
			},
            /**
                
				@syntax replace(newNode) �滻��ǰ�ڵ�
                @type #
				@params
                newNode Element,$1k Ŀ��ڵ�
				@ret $1k ���滻�����Ľڵ��װ����
			 */
			replace_p: function(newNode){
				return $box.call(this, $replace, newNode);
			},
            /**
				@syntax each(callback) ����ִ��callback
                @type #
				@params
                callback Function �ص�������thisָ���Ӧ�ڵ��װ���󣬲���iΪ�ڵ����ڼ��ϵ��±�
				@title �ص�˵��
				@data �ص���������Ϊtrueʱ��������ѭ��
				@ret $1k �����Լ�
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
			@module DOM.Style ��ʽ
		 */
        Style: {
			/**
                @syntax cls([cls,cls2]) className��ȡ���жϣ�����
                @type #
                @params
                ,�޲��� . ��ȡ��ǰ�ڵ��className
                ,cls String �жϽڵ����Ƿ���cls
                ,cls String ��һ���ַ���+��-��~��=ʱ��ʾ����className��+������ӣ�-�����Ƴ���~�����л���=�����ǣ����cls�ö��Ÿ���
                ,cls2 String �滻clsΪcls2
				@ret String,Boolean,$1k ����className�����Ƿ����class���жϣ������ڲ�����ɺ󷵻ؽڵ��װ����
			 */
			cls_p: function(cls1, cls2){
				return $box.call(this, $cls, cls1, cls2);
			},
            /**
				@syntax css(name[,value]|csstext|hash) ��ʽ��ȡ�Ͳ���
                @type #
                
				@params
                name String ����style.name����ʽֵ
                csstext String ����css����׼��csstext�ַ���������margin-left:12px;color:red;
                hash Object ����css��Object��key��Ϊ��ʽ����value��Ϊ��ʽֵ
                ,value String ������ʽ��valueΪֵ������ʹ���л���Ҳ���Բ����շ�
                
				@ret String,$1k ������ʽֵ���߽ڵ��װ����
			 */
			css_p: function(name, value){
				return $box.call(this, $css, name, value);
			},
            /**
                
				@syntax px(name) ���ؽڵ�ɼ������ʽpxֵ
				@params
                name string ȡֵ������:[left,top,width,height,border,padding,margin]���������
				@ret Number ���з��ص�ֵ����pxΪ��λ
			 */
			px_p: function(name){
				return $cssnum(this.elem, name);
			},
            /**
				@syntax left([px]) ��ȡ�����ýڵ�style.left����ֵ
				@type #
				@params
                �޲��� . ��ȡ�ڵ��style.left
                ,px Number ���ýڵ��style.left��ֵ
				@ret $1k,Number �ڵ��װ����left������ֵ
			 */
			left_p: function(value){
				return $box.call(this, $left, value);
			},
            /**
				@syntax top([px]) ͬleft
				@type #
			 */
			top_p: function(value){
				return $box.call(this, $top, value);
			},
            /**
				@syntax width([px]) ͬleft
				@type #
			 */
			width_p: function(value){
				return $box.call(this, $width, value);
			},
            /**
				@syntax height([px]) ͬleft
				@type #
			 */
			height_p: function(value){
				return $box.call(this, $height, value);
			},
            /**
				@syntax offset() ��ȡ�ڵ��뿪�ĵ��ľ���
                @type #
				@ret Object {x:left,y:top}����offsetWidth��offsetHeight������
			 */
			offset_p: function(){
				return $offset(this.elem);
			},
            /**
                
				@syntax offsetLeft() ��ȡ�ڵ��뿪�ĵ����ľ���
                @type #
				@ret Number ��λΪpx
			 */
			offsetLeft_p: function(){
				return $offset(this.elem).left;
			},
            /**
				@syntax offsetTop() ��ȡ�ڵ��뿪�ĵ������ľ���
                @type #
				@ret Number ��λΪpx
			 */
			offsetTop_p: function(){
				return $offset(this.elem).top;
			},
            
            /**
				@syntax offsetWidth() ��ȡ�ڵ�offsetWidthֵ
                @type #
				@ret Number ��λΪpx
			 */
			offsetWidth_p: function(){
				return this.elem.offsetWidth;
			},
            /**
				@syntax offsetHeight() ��ȡ�ڵ�offsetHeightֵ
                @type #
				@ret Number ��λΪpx
			 */
			offsetHeight_p: function(){
				return this.elem.offsetHeight;
			},
            /**
				@syntax opacity([opacity]) ��ȡ������͸����
				@type #
				@params
                
                ,�޲��� . ��ȡ�ڵ��͸���ȣ�ȡֵ0-1
                ,opacity Number ���ýڵ��͸���ȣ�ȡֵ0-1
				@ret $1k,Number �����Լ����ڵ�͸����
			 */
			opacity_p: function(opacity){
				return $box.call(this, $opacity, opacity);
			},
			
			/**
				@syntax show() ���ýڵ��displayΪ''
				@type #
				@ret $1k �����Լ�
			 */
			show_p: function(){
				return $box.call(this, $show);
			},
			/**
				@syntax hide() ���ýڵ��displayΪnone
				@type #
				@ret $1k �����Լ�
			 */
			hide_p: function(){
				return $box.call(this, $hide);
			}
        },
        /**
            @module DOM.Event �¼�
         */
        event: {
            /**
				@syntax Event ��ʽ������¼�����
				@title �¼�API�б�
				@data [
                ['����','����','����'],
                ['origin','Object','ԭʼ��Event����'],
                ['type','String','Event�¼������ͣ�����click,mouseover��'],
                ['clientX','Number','��������λ��'],
                ['clientY','Number','��������λ��'],
                ['target','Element','�¼������Ľڵ�'],
                ['fromTarget','Element','����¼�����Դ�ڵ�'],
                ['toTarget','Element','����¼���Ŀ��ڵ�'],
                ['stopPropagation','Function','��ֹð��'],
                ['preventDefault','Function','��ֹĬ���¼�'],
                ['mouseKey','String','���ĵ�������� �����L��,�м���M��,�Ҽ���R��'],
                ['keyCode','Number','���̵İ��µļ�']
				]
				@ret �¼�����
			 */
            /**
                @syntax ready(fn) ��������ӵ�onDOMReady�¼�������
                @params
                fn Function ����ӵĺ���
             */
            ready_s: function(fn){
                $ready(fn);
            },
            /**
				@syntax on(type,callback[,context]) �¼���
				@params
                type String �¼�����
                callback Function �ص�����
                ,context All �ص�������this��ָ��,Ĭ��ָ��ǰ�ڵ�İ�װ����
				@ret $1k �����Լ�
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
				@syntax un(type,callback[,context]) ����¼���
				@params
                type String �¼�����
                callback Function �ص�����
                ,context All �ص�������this��ָ��,Ĭ��ָ��ǰ�ڵ�İ�װ����
				@ret $1k �����Լ�
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
				@syntax click(callback[,context]) ������¼���
				@params
                callback Function �ص�����
                ,context All �ص�������this��ָ��,Ĭ��ָ��ǰ�ڵ�İ�װ����
				@ret $1k �����Լ�
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
				@syntax hover(hover,out[,context]) ���hover�¼���
				@params
                hover Function ���hover�ص�����
                out Function ���out�ص�����
                ,context All �ص�������this��ָ��,Ĭ��ָ��ǰ�ڵ�İ�װ����
				@ret $1k �����Լ�
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
			@module DOM.Other ����
		 */
        Other: {
            /**
				@syntax attr(name[,value]|hash) ��ȡ�����ýڵ������ֵ
                @type #
				@params
                name String �ڵ��������
                ,value String �ڵ������ֵ
                hash Object ��keyΪ�ڵ���������valueΪ�ڵ�����ֵ
				@ret String,Undefined,$1k ��valueΪnullʱ��ִ��ɾ������
			 */
			attr_p: function(name, value){
				return $box.call(this, $attr, name, value);
			},
            /**
				@syntax html([htmlstr|htmlArray|fn]) ��ȡ�����ýڵ��innerHTML
				@type #
				@params
                �޲��� . ��ȡ�ڵ��innerHTML 
                ,htmlstr String ���ýڵ��innerHTML 
                ,htmlArray Array ���Զ�����Array.join('')��Ϊhtmlstr
                ,fn Function �������ķ���ֵ��ΪhtmlStr 
                
				@ret String,$1k
			 */
			html_p: function(html){
				return $box.call(this, $html, html);	
			},
			
			/**
				@syntax tag([tagName]) ��ȡ���жϽڵ���
                @type #
				@params
                �޲��� . ��ȡ��ǰ�ڵ���
                ,tagName String �ڵ������жϵ�ǰ�ڵ������Ƿ����tagName
				@ret String,Boolean ���صĽڵ������Ǵ�д��
			 */
			tag_p: function(nodeName){
				return $tag(this.elem, nodeName);
			},
			
			/**
				@syntax contains(elem) �жϽڵ��Ƿ����elem
                @type #
				@params
                elem Element,$1k ���жϵĽڵ�
				@ret Number elem�����Լ�����1��elem���������ڷ���2�����򷵻�0
			 */
			contains_p: function(elem){
				return $contains(this.elem, elem);
			},
			
			/**
				@syntax val([value]) ��ȡ�����ñ���ֵ
				@type #
				@params
                �޲��� . ��ȡ��ǰ����ֵ
                ,value String ���ñ���ֵ
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
        @module BOM �����
     */
    BOM: {
        
        /**
            @syntax browser ��ȡָ��������İ汾��
            @title ֧�ֻ�ȡ�������
            @data [
                ['�����'],
                ['ie'],
                ['firefox'],
                ['chrome'],
                ['opera'],
                ['safari']
            ]
            @title ʹ��˵��
            @data ���磺browser.ie ���������Ϊie6��������6.0������Ϊfirefox���򷵻�undefined
            @ret String,Undefined ������汾�ţ��ַ������ͣ�,���粻��ָ������������򷵻�undefined
         */
        browser_s: '$browser',
        
        /**
            @syntax isIE6 �ж�������Ƿ�Ϊie6
            @ret Boolean 
         */
        isIE6_s: '$isIE6',
        
        /**
            @syntax cookie(name[,value,options]|data[,options]) ����cookie
            @params
            name String ��ȡcookie��ֵ
            ,value String ����cookie��ֵ����valueΪnullʱ����ɾ����ǰ��cookie
            ,options Object|Integer ����cookie���������û�������Ч��
            data Object ��hashmap��key��value����cookie��ֵ
            @ret String,
            
            @title options������Ϣ
            @data [
                ['key','value˵��'],
                ['expires','cookie��Ч�ڣ�Ĭ����������ر���ʧЧ����λ�Ƿ���'],
                ['path','cookie��·����Χ��Ĭ���Ǹ�Ŀ¼'],
                ['domain','cookie��domainȨ�ޣ�Ĭ���ǵ�ǰdomain']
            ]
            @ret String
         */
        cookie_s: '$cookie',
        /**
            @syntax scrollTop(top[,time,type]) ��ȡ�������ù�������topֵ
            @params
            top Number scrollTop��ֵ
            ,time Number Ĭ��0��ִ�ж�������ʱ�䣬��λΪms
            ,type String �������ͣ�Ĭ��ΪcircOut
         */
        scrollTop_s: function(){
            return $scrollTop.apply(this, arguments);
        },
        /**
            @syntax scrollLeft(left[,time,type]) ͬscrollTop
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
            @syntax scrollWidth() ��ȡ��������scrollWidth
            @ret Number
         */
        scrollWidth_s: function(){
            return $DE.scrollWidth;
        },
        /**
            @syntax scrollHeight() ��ȡ��������scrollHeight
            @ret Number
         */
        scrollHeight_s: function(){
            return Math.max($DE.scrollHeight, $DOC.body.scrollHeight);
        }
        
    }, 
    /**
        @module Request ��Դ����
     */
    Request: {
        /**
            @syntax ajax(options) ����һ������������ajax
            @params
            options Object ���ò���
           @title options����˵��
           @data [
               ['key','����'],
               ['url','�����ַ'],
               ['type','�������ͣ�get����post'],
               ['data','���͵�����'],
               ['callback','�ص������������Ĳ�����responseType������Ĭ����xhr����'],
               ['responseType','��Ӧ�����ͣ�����callback�Ĳ�������'],
               ['headers','��������ͷ']
           
           ]
         */
        ajax_s: '$ajax',
        /**
            @syntax post(url,callback,data) ����ajax��post����
            @params
            url String url��ַ
            callback Function �ص�����
            data Object,String json�������URL��ѯ�ַ���
         */
        post_s: '$post',
        /**
            @syntax get(url,callback,data) ͬajax��post 
         */
        get_s: '$get',
        /**
            @syntax img(url[,callback]) ��̬����img��ִ�лص�
            @params
            url String img��url��ַ
            ,callback Function ͼƬ�������ʱ�Ļص�����
         */
        img_s: '$img',
        /**
            @syntax js(url,callback,data,charset) ��̬����js��ʹ�ÿɷ���jsonp
            @params
            url String js�ļ��ĵ�ַ
            callback Function �ص�����
            data Object,String json�������URL��ѯ�ַ���
            charset String ��������ʹ�õı���
         */
        js_s: '$js',
        jsonp2_s: '$jsonp2',
        /**
            @syntax style(url|csstext) ����css�ļ�����csstext
            @params
            url String css�ļ��ĵ�ַ
            csstext String ��׼��csstext
         */
        style_s: '$style'
    },
    /**
        @module Other ��������
     */
    Other: {
        /**
            @syntax type(data) ��������
            @params
            data All ������ı���
            @ret String �������������ַ���
            @title ����ֵȡֵ
            @data [
            ['ֵ','����'],
            ['string','�ַ���'],
            ['array','����'],
            ['function','����'],
            ['regexp','����'],
            ['boolean','����ֵ'],
            ['date','Date����'],
            ['number','����'],
            ['undefined','δ����'],
            ['null','null'],
            ['element','�ڵ�'],
            ['window','window����'],
            ['document','document����'],
            ['object','����']
			]
         */
        type_s: '$type',
        /**
            @syntax isArray(data) �ж��Ƿ�Ϊ����
            @params
                data All ���жϵı���
            @ret Boolean �����жϽ��
         */
        isArray_s: '$isArray',
        /**
            @syntax isFunction(data) �ж��Ƿ�Ϊ����
            @params
            data All ���жϵı���
            @ret Boolean �����жϽ��
         */
        isFunction_s: '$isFunction',
        echo_s: function(){}
    },
    /**
        @module Object ����
     */
    Object: {
        /**
            @syntax each(hash,callback) ����hash�����鲢��ִ�лص�
            @params
            hash Object,Array ������������
            callback Function �ص�����
            @title �ص�����callback(val, key)
            @data ����keyΪhash��key�������±꣬valΪ��ǰ�������ֵ����callback����Ϊtrueʱ������������
            @ret ��
         */
        each_s: '$each',
        /**
            @syntax toJson(data) ����ת����json�ַ���
            @params
            data Object ��ת���Ķ���
            @ret json�ַ���
         */
        toJson_s: function(obj){
            if($WIN.JSON && JSON.stringify){
                return JSON.stringify(obj);
            }
            return $toJson(obj);
        },
        /**
            @syntax param(data) ���л�����ΪURL��ѯ�ַ���
            @params
            data Object ��ת���Ķ���
            @ret URL��ѯ�ַ���
         */
        param_s: '$param',
        /**
            @syntax mix(target,source) ǳ������ݶ���
            @params
            target Object Ŀ������Դ
            source Object ��Դ����Դ
            @ret 
         */
        mix_s: '$mix'
    },
    /**
        @module String �ַ���
     */
    String: {
        /**
            @syntax tirm(str) ȥ����β�ո�
            @params
            str String ��������ַ���
            @ret String
         */
        tirm_s: '$tirm',
        /**
            @syntax parseJson(str) ����json�ַ���������
            @params
            str String Json�ַ���
            @ret Object,Null
         */
        parseJson_s: function(str){
            if($WIN.JSON && JSON.parse){
                return JSON.parse(str);
            }
            return $parseJson(str);
        },
        /**
            @syntax encodeURL(str) ���������ַ��Ա���д���
            @params
            str String ��������ַ���
            @title �ɱ����ַ�
            @data [
            ['ԭʼ�ַ�','�����ַ�'],
            ['%','%25'],
            ['�ո�','%20'],
            ['#','%23'],
            ['&','%26'],
            ['=','%3D'],
            ['/','%2F'],
            ['?','%3F'],
            ['+','%2B']
            ]
            @ret String �������ַ���
         */
        encodeURL_s: '$encodeURL',
        /**
            @syntax encodeHTML(htmlstr) ����html�ַ���
            @params
            htmlstr String ������html�ַ���
            @ret String
         */
        encodeHTML_s: '$encodeHTML',
        /**
            
            @syntax decodeHTML(htmlstr) ������html�ַ���
            @params
            htmlstr string ������html�ַ���
            @ret String
         */
        decodeHTML_s: '$decodeHTML'  
    },
    /**
        @module Widget �ڲ����
     */
    widget: {
        /**
            @syntax Anim(attrs,options) ������������
            @params
            attrs Object css���Ժ�ֵ
            ,options Object �������ö���
            @title attrs���ò���
            @data ȡֵleft,top,right,bottom,margin,padding,opacity�ȣ���֧��color��������ǰ���x,���ʾ����˶�������xleft:-10,��ʾleft����10px
            
            @title options���ò���
            @data [
            ['key','����','˵��'],
            ['dur','Integer','����ִ�е�ʱ�䣬��λms��Ĭ��800ms'],
            ['easing','string','������ʽ��Ĭ��Both'],
            ['onbefore','function','������ʼʱִ�еĻص�����'],
            ['onplay','function','����ִ���еĻص�����'],
            ['ondone','function','����ִ����Ļص�����'],
            ['onstop','function','�������ֶ���ֹ�Ļص�����']
            ]
    
            @title easing��ʽ
            @data [
            ['ֵ','����'],
            ['Linear','����'],
            ['slowIn','��������'],
            ['slowOut','��������'],
            ['slowBoth','--'],
            ['In','--'],
            ['Out','--'],
            ['Both','--'],
            ['elasticIn','����Ч��'],
            ['elasticOut','--'],
            ['elasticBoth','--'],
            ['backIn','����Ч��'],
            ['backOut','--'],
            ['backBoth','--'],
            ['bounceIn','ײ��Ч��'],
            ['bounceOut','--'],
            ['bounceBoth','--']
            ]
            @ret Anim ��������
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
            @syntax Drag(options) �����ϷŶ���
            @params
            options Object ��ק���ö���
            @title options���ò���
            @data [
            ['key','����','˵��'],
            ['before','function','�϶�ǰ�ص�'],
            ['running','function','�϶��лص�'],
            ['after','function','�϶���ɺ�'],
            ['limitNode','Node','���Ʒ�Χ�Ľڵ㣬����Ϊwindow���޶�Ϊ������ɼ���Ļ��'],
            ['lockx','1|0','���������϶�'],
            ['locky','1|0','���������϶�'],
            ['hand','Node|NodeList','�϶��ľ������']
            ]
            @title �ӿ�˵��
            @data [
            ['ֵ','����'],
            ['addHand','����Ϸž��'],
            ['rmvHand','�Ƴ��Ϸž��������Ϊ�ڵ�']
            ]
            @ret Drag ��ק����
         */
            Drag_p: function(options){
                if(!this.elem.__DRAGID__){
                    $DragHook[this.elem.__DRAGID__ = ++$GUID] = $Drag(this.elem, options || {});
                }
                return $DragHook[this.elem.__DRAGID__];
            },
        /*
           @syntax anim(cssAttr,callback) ����ִ��һ���򵥶���
           @params
           cssAttr Object css���Ե�hashmap
           callback function  ������ɺ�Ļص�
        */  
            anim_p: function(cssAttr, callback){
                //console.info(cssAttr);
                $anim(this.elem, cssAttr, callback)
                //return $box.call(this, $anim, cssAttr, callback);
            }
    },
    end:{}
}