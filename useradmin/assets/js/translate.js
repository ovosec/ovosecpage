
    var translate = {
        
        version:'3.1.5.20240318',
        useVersion:'v2',	
        setUseVersion2:function(){
            translate.useVersion = 'v2';
            console.log('提示：自 v2.10 之后的版本默认就是使用V2版本（当前版本为:'+translate.version+'）， translate.setUseVersion2() 可以不用再加这一行了。当然加了也无所谓，只是加了跟不加是完全一样的。');
        
        },

        translate:null,
        includedLanguages:'zh-CN,zh-TW,en',

        resourcesUrl:'//res.zvo.cn/translate',
    

        selectLanguageTag:{

            documentId:'translate',
            
            show:true,
            languages:'',
            alreadyRender:false, 
            selectOnChange:function(event){
                var language = event.target.value;
                translate.changeLanguage(language);
            },
            
            refreshRender:function(){
                
                let element = document.getElementById(translate.selectLanguageTag.documentId+"SelectLanguage");
    
                
                if (element) {
                    element.parentNode.removeChild(element);
                }
    
                
                translate.selectLanguageTag.alreadyRender = false;	
    
                translate.selectLanguageTag.render();
            },
            render:function(){ 
                if(translate.selectLanguageTag.alreadyRender){
                    return;
                }
                translate.selectLanguageTag.alreadyRender = true;
                
                
                if(!translate.selectLanguageTag.show){
                    return;
                }
                
                
                if(document.getElementById(translate.selectLanguageTag.documentId) == null){
                    var body_trans = document.getElementsByTagName('body')[0];
                    var div = document.createElement("div");  
                    div.id=translate.selectLanguageTag.documentId;
                    body_trans.appendChild(div);
                }else{
                    
                    if(document.getElementById(translate.selectLanguageTag.documentId+'SelectLanguage') != null){
                        
                        return;
                    }
                }
    
                
                translate.request.post(translate.request.api.language, {}, function(data){
                    if(data.result == 0){
                        console.log('load language list error : '+data.info);
                        return;
                    }
                
                    
                    var onchange = function(event){ translate.selectLanguageTag.selectOnChange(event); }
                    
                    
                    var selectLanguage = document.createElement("select"); 
                    selectLanguage.id = translate.selectLanguageTag.documentId+'SelectLanguage';
                    selectLanguage.className = translate.selectLanguageTag.documentId+'SelectLanguage';
                    for(var i = 0; i<data.list.length; i++){
                        var option = document.createElement("option"); 
                        option.setAttribute("value",data.list[i].id);
    
                        
    
                        if(translate.selectLanguageTag.languages.length > 0){
                            
    
                            
                            var langs_indexof = (','+translate.selectLanguageTag.languages+',').toLowerCase();
                            //console.log(langs_indexof)
                            if(langs_indexof.indexOf(','+data.list[i].id.toLowerCase()+',') < 0){
                                
                                continue
                            }
                        }
    
                        
                        if(translate.to != null && typeof(translate.to) != 'undefined' && translate.to.length > 0){
                            
                            
                            if(translate.to == data.list[i].id){
                                option.setAttribute("selected",'selected');
                            }
                        }else{
                            
                            if(data.list[i].id == translate.language.getLocal()){
                                option.setAttribute("selected",'selected');
                            }
                        }
                        
                        option.appendChild(document.createTextNode(data.list[i].name)); 
                        selectLanguage.appendChild(option);
                    }
                    
                    if(window.addEventListener){ // Mozilla, Netscape, Firefox 
                        selectLanguage.addEventListener('change', onchange,false); 
                    }else{ // IE 
                        selectLanguage.attachEvent('onchange',onchange); 
                    } 
                    
                    document.getElementById(translate.selectLanguageTag.documentId).appendChild(selectLanguage);

                });
                
                
            }
        },
        

        localLanguage:'zh-CN',
        

        googleTranslateElementInit:function(){
            var selectId = '';
            if(document.getElementById('translate') != null){	// && document.getElementById('translate').innerHTML.indexOf('translateSelectLanguage') > 0
                
                selectId = 'translate';
            }
            
            translate.translate = new google.translate.TranslateElement(
                {
                    
                    pageLanguage: 'zh-CN',
                    
                    includedLanguages: translate.selectLanguageTag.languages,
                    
                    layout: 0,
                }, 
                selectId 
            );
        },
        
        
        execute_v1:function(){
            console.log('=====ERROR======');
            console.log('The v1 version has been discontinued since 2022. Please use the latest V3 version and refer to: http://translate.zvo.cn/41162.html');
        },
        
        
        setCookie:function (name,value){
            var cookieString=name+"="+escape(value); 
            document.cookie=cookieString; 
        },
    
        
        /
        to:'', 
        autoDiscriminateLocalLanguage:false,
        documents:[], 

        inProgressNodes:[], 
        
        ignore:{
            tag:['style', 'script', 'link', 'pre', 'code'],
            class:['ignore','translateSelectLanguage'],
            id:[],
            
            isIgnore:function(ele){
                if(ele == null || typeof(ele) == 'undefined'){
                    return false;
                }
    
                var parentNode = ele;
                var maxnumber = 100;	
                while(maxnumber-- > 0){
                    if(parentNode == null || typeof(parentNode) == 'undefined'){
                        
                        return false;
                    }
    
                    
                    
                    var nodename = translate.element.getNodeName(parentNode).toLowerCase(); 
                    if(nodename.length > 0){
                        
                        if(nodename == 'body' || nodename == 'html' || nodename == '#document'){
                            
                            return false;
                        }
                        if(translate.ignore.tag.indexOf(nodename) > -1){
                            
                            return true;
                        }
                    }
                    
    
                    
                    if(parentNode.className != null){
                        var classNames = parentNode.className;
                        if(classNames == null || typeof(classNames) != 'string'){
                            continue;
                        }
                        //console.log('className:'+typeof(classNames));
                        //console.log(classNames);
                        classNames = classNames.trim().split(' ');
                        for(var c_index = 0; c_index < classNames.length; c_index++){
                            if(classNames[c_index] != null && classNames[c_index].trim().length > 0){
                                
                                if(translate.ignore.class.indexOf(classNames[c_index]) > -1){
                                    
                                    return true;
                                }
                            }
                        }					
                    }
    
                    
                    if(parentNode.id != null && typeof(parentNode.id) != 'undefined'){
                        
                        if(translate.ignore.id.indexOf(parentNode.id) > -1){
                            
                            return true;
                        }
                    }
    
                    
                    parentNode = parentNode.parentNode;
                }
    
                return false;
            }
        },
        
        nomenclature:{
            data:new Array(),
            
            old_Data:[],

            set:function(data){
                alert('请将 translate.nomenclature.set 更换为 append，具体使用可参考： https://github.com/xnx3/translate ');
            },
            append:function(from, to, properties){
                if(typeof(translate.nomenclature.data[from]) == 'undefined'){
                    translate.nomenclature.data[from] = new Array();
                }
                if(typeof(translate.nomenclature.data[from][to]) == 'undefined'){
                    translate.nomenclature.data[from][to] = new Array();
                }
                
                
                
                var line = properties.split('\n');
                //console.log(line)
                for(var line_index = 0; line_index < line.length; line_index++){
                    var item = line[line_index].trim();
                    if(item.length < 1){
                        
                        continue;
                    }
                    var kvs = item.split('=');
                    //console.log(kvs)
                    if(kvs.length != 2){
                        
                        continue;
                    }
                    var key = kvs[0].trim();
                    var value = kvs[1].trim();
                    //console.log(key)
                    if(key.length == 0 || value.length == 0){
                        
                        continue;
                    }
                    
                    translate.nomenclature.data[from][to][key] = value;
                    //console.log(local+', '+target+', key:'+key+', value:'+value);
                }
    
                
                translate.nomenclature.data[from][to] = translate.util.objSort(translate.nomenclature.data[from][to]);
    
            },
            
            get:function(){
                return translate.nomenclature.data;
            },
            
            dispose:function(str){
                if(str == null || str.length == 0){
                    return str;
                }

                if(typeof(translate.nomenclature.data[translate.language.getLocal()]) == 'undefined' || typeof(translate.nomenclature.data[translate.language.getLocal()][translate.to]) == 'undefined'){
                    return str;
                }
                //console.log(str)
                for(var originalText in translate.nomenclature.data[translate.language.getLocal()][translate.to]){
                    var translateText = translate.nomenclature.data[translate.language.getLocal()][translate.to][originalText];
                    if(typeof(translateText) == 'function'){
                        
                        continue;
                    }
    
                    var index = str.indexOf(originalText);
                    if(index > -1){
                        //console.log('find -- '+originalText+', \t'+translateText);
                        if(translate.language.getLocal() == 'english'){
                            
                            
                            
                            var beforeChar = '';	
                            if(index == 0){
                                
                            }else{
                                
                                beforeChar = str.substr(index-1,1);
                                //console.log('beforeChar:'+beforeChar+', str:'+str)
                                var lang = translate.language.getCharLanguage(beforeChar);
                                //console.log(lang);
                                if(lang == 'english'){
                                    
                                    continue;
                                }
                            }
    
                            
                            var afterChar = ''; 
                            if(index + originalText.length == str.length ){
                                
                                //console.log(originalText+'， meile '+str)
                            }else{
                                
                                afterChar = str.substr(index+originalText.length,1);
                                var lang = translate.language.getCharLanguage(afterChar);
                                if(lang == 'english'){
                                    
                                    continue;
                                }
                            }
    
                            str = str.replace(new RegExp(beforeChar+originalText+afterChar,'g'), beforeChar+translateText+afterChar);
                        }else{
                            
                            str = str.replace(new RegExp(originalText,'g'), translateText);
                        }
    
                    }
                }
    
                return str;
            },
            
        },
        office:{

            export:function(){
                if(translate.language.getLocal() == translate.language.getCurrent()){
                    alert('本地语种跟要翻译的语种一致，无需导出');
                    return;
                }
    
                var text = '';
                for(var uuid in translate.nodeQueue){
                    var queueValue = translate.nodeQueue[uuid];
                    for(var lang in translate.nodeQueue[uuid].list){
                        //console.log('------'+lang)
                        if(typeof(lang) != 'string' || lang.length < 1){
                            continue;
                        }
                        //if(translate.language.getLocal() == lang){
                            //console.log(translate.nodeQueue[uuid].list[lang]);
                            for(var hash in translate.nodeQueue[uuid].list[lang]){
                                text = text + '\n' + translate.nodeQueue[uuid].list[lang][hash].original + '='+translate.storage.get('hash_'+translate.language.getCurrent()+'_'+hash);
                            }
                        //}
                    }
                    
                }
    
                if(text.length > 0){
                    
                    text = 'translate.office.append(\''+translate.language.getCurrent()+'\',`'+text+'\n`);';
                    //console.log(text);
                    translate.util.loadMsgJs();
                    msg.popups({
                        text:'<textarea id="msgPopupsTextarea" style="width:100%; height:100%; color: black; padding: 8px;">loaing...</textarea>',
                        width:'750px',
                        height:'600px',
                        padding:'1px',
                    });	
                    document.getElementById('msgPopupsTextarea').value = text;
                }else{
                    msg.alert('无有效内容！');
                }
    
    
            },
            
            showPanel:function(){
                let panel = document.createElement('div');
                panel.setAttribute('id', 'translate_export');
                panel.setAttribute('class','ignore');
    
                
                let button = document.createElement('button');
                button.onclick = function() {
                  translate.office.export();
                };
                button.innerHTML = '导出配置信息';
                button.setAttribute('style', 'margin-left: 72px; margin-top: 30px; margin-bottom: 20px; font-size: 25px; background-color: blue; padding: 15px; padding-top: 3px; padding-bottom: 3px; border-radius: 3px;');
                panel.appendChild(button);
    
                
                let textdiv = document.createElement('div');
                textdiv.innerHTML = '1. 首先将当前语种切换为你要翻译的语种<br/>2. 点击导出按钮，将翻译的配置信息导出<br/>3. 将导出的配置信息粘贴到代码中，即可完成<br/><a href="asd" target="_black" style="color: aliceblue;">点此进行查阅详细使用说明</a>';
                textdiv.setAttribute('style','font-size: 14px; padding: 12px;');
    
                panel.appendChild(textdiv);			
                
                panel.setAttribute('style', 'background-color: black; color: #fff; width: 320px; height: 206px; position: fixed; bottom: 50px; right: 50px;');
                
                document.body.appendChild(panel);
    
                translate.util.loadMsgJs();
            },
            append:function(to, properties){
                //console.log(properties)
                
                
                var line = properties.split('\n');
                //console.log(line)
                for(var line_index = 0; line_index < line.length; line_index++){
                    var item = line[line_index].trim();
                    if(item.length < 1){
                        
                        continue;
                    }
                    var kvs = item.split('=');
                    //console.log(kvs)
                    if(kvs.length != 2){
                        
                        continue;
                    }
                    var key = kvs[0];
                    var value = kvs[1];
                    //console.log(key)
                    if(key.length == 0 || value.length == 0){
                        
                        continue;
                    }
                    //console.log('set---'+key);
                    
                    translate.storage.set('hash_'+to+'_'+translate.util.hash(key), value);
                }
            },
        },
        setAutoDiscriminateLocalLanguage:function(){
            translate.autoDiscriminateLocalLanguage = true;
        },
        nodeQueue:{},

        setDocuments:function(documents){
            if (documents == null || typeof(documents) == 'undefined') {
                return;
            }
            
            if(typeof(documents.length) == 'undefined'){
                
                translate.documents[0] = documents;
            }else{
                
                translate.documents = documents;
            }
            
            translate.nodeQueue = {};
            //console.log('set documents , clear translate.nodeQueue');
        },
        
        
        getDocuments:function(){
            if(translate.documents != null && typeof(translate.documents) != 'undefined' && translate.documents.length > 0){
                
                return translate.documents;
            }else{
                
                return document.all; 
            }
        },
        listener:{

            isStart:false,
           
            start:function(){
                
                translate.temp_linstenerStartInterval = setInterval(function(){
                    if(document.readyState == 'complete'){
                        
                        clearInterval(translate.temp_linstenerStartInterval);
                        translate.listener.addListener();
                    }
                }, 300);
                
                
            },
            
            addListener:function(){
                translate.listener.isStart = true; 
                
                
                translate.listener.config = { attributes: true, childList: true, subtree: true, characterData: true, attributeOldValue:true, characterDataOldValue:true };
                
                translate.listener.callback = function(mutationsList, observer) {
                    var documents = []; 
                    
                    // Use traditional 'for loops' for IE 11
                    for(let mutation of mutationsList) {
                        let addNodes = [];
                        if (mutation.type === 'childList') {
                            if(mutation.addedNodes.length > 0){
                                
                                addNodes = mutation.addedNodes;
                                //documents.push.apply(documents, mutation.addedNodes);
                            }else if(mutation.removedNodes.length > 0){
                            }else{
                            }
                        }else if (mutation.type === 'attributes') {
                            //console.log('The ' + mutation.attributeName + ' attribute was modified.');
                        }else if(mutation.type === 'characterData'){
                            
                            addNodes = [mutation.target];
                            //documents.push.apply(documents, [mutation.target]);
                        }
    
                        
                        for(let item of addNodes){
                            //console.log(item);
    
                            
                            var isFind = false;
                            for(var di = 0; di < documents.length; di++){
                                if(documents[di].isSameNode(item)){
                                    isFind = true;
                                    break;
                                }
                            }
                            if(isFind){
                                break;
                            }
                            documents.push.apply(documents, [item]);
                        }
                      }
                    
                    //console.log(documents.length);
                    if(documents.length > 0){
                        
                        
                        
                        var translateNodes = [];
                        //console.log(translate.inProgressNodes.length);
                        for(let ipnode of documents){
                            //console.log('---type:'+ipnode.nodeType);
    
                            var find = false;
                            for(var ini = 0; ini < translate.inProgressNodes.length; ini++){
                                if(translate.inProgressNodes[ini].node.isSameNode(ipnode)){
                                    
                                    
                                    find = true;
                                    break;
                                }
                            }
                            if(find){
                                continue;
                            }
    
                            
                            translateNodes.push(ipnode);
                        }
                        if(translateNodes.length < 1){
                            return;
                        }
                        //console.log('translateNodeslength: '+translateNodes.length);
    
    
                        setTimeout(function() {
                            //console.log(translateNodes);
                            translate.execute(translateNodes); 
                        }, 10); 
                    }
                };
                
                translate.listener.observer = new MutationObserver(translate.listener.callback);
                
                var docs = translate.getDocuments();
                for(var docs_index = 0; docs_index < docs.length; docs_index++){
                    var doc = docs[docs_index];
                    if(doc != null){
                        translate.listener.observer.observe(doc, translate.listener.config);
                    }
                }
            },
            renderTaskFinish:function(renderTask){
                //console.log(renderTask);
            }
        },
        
        renderTask:class{
            constructor(){

                this.taskQueue = [];
                
                this.nodes = [];
            }
            
            add(node, originalText, resultText, attribute){
                var nodeAnaly = translate.element.nodeAnalyse.get(node, attribute); 
                
                var hash = translate.util.hash(nodeAnaly['text']);

                if(typeof(this.nodes[hash]) == 'undefined'){
                    this.nodes[hash] = new Array();
                }
                this.nodes[hash].push(node);
                //console.log(node)
                
                
                var tasks = this.taskQueue[hash];
                if(tasks == null || typeof(tasks) == 'undefined'){
                    //console.log(node.nodeValue);
                    tasks = new Array(); 
                }
                var task = new Array();
                
                if (originalText.substr(0, 1) == ' ') {
                    
                    if(resultText.substr(0, 1) != ' '){
                        
                        resultText = ' ' + resultText;
                    }
                }
                if (originalText.substr(originalText.length - 1, 1) === ' ') {
                    
                    if(resultText.substr(0, 1) != ' '){
                        
                        resultText = resultText + ' ';
                    }
                }
                
    
                task['originalText'] = originalText;
                task['resultText'] = resultText;
                task['attribute'] = attribute;
    
                //console.log(task);
                tasks.push(task);
                this.taskQueue[hash] = tasks;
                
            }
            
            execute(){
                
                for(var hash in this.taskQueue){
                    var tasks = this.taskQueue[hash];
                    if(typeof(tasks) == 'function'){
                        
                        continue;
                    }
    
                    
                    tasks.sort((a, b) => b.originalText.length - a.originalText.length);
                    
                    this.taskQueue[hash] = tasks;
                }
                
    
                
                for(var hash in this.nodes){
                    var tasks = this.taskQueue[hash]; 
                    
                    //console.log(tasks);
                    for(var node_index = 0; node_index < this.nodes[hash].length; node_index++){
                        
                        for(var task_index=0; task_index<tasks.length; task_index++){
                            var task = tasks[task_index];
                            if(typeof(tasks) == 'function'){
                                
                                continue;
                            }
                            
                            
                            var ipnode = this.nodes[hash][task_index];
                            //console.log('int-----++'+ipnode.nodeValue);
                            setTimeout(function(ipnode){
                                //console.log('int-----'+ipnode.nodeValue);
                                for(var ini = 0; ini < translate.inProgressNodes.length; ini++){
                                    if(translate.inProgressNodes[ini].node.isSameNode(ipnode)){

                                        translate.inProgressNodes[ini].number = translate.inProgressNodes[ini].number - 1;
                                        //console.log("inProgressNodes -- number: "+translate.inProgressNodes[ini].number+', text:'+ipnode.nodeValue);
                                        if(translate.inProgressNodes[ini].number < 1){
                                            
                                            
                                                //console.log('ini-'+ini)
                                                translate.inProgressNodes.splice(ini,1);	
                                                
                                            //
                                        }
                                        break;
                                    }
                                }
                            }, 50, ipnode);
    
                            
                            translate.element.nodeAnalyse.set(this.nodes[hash][task_index], task.originalText, task.resultText, task['attribute']);
    
                        }
                    }
                }
                
                //console.log('---listen');
    
                
                if(typeof(this.taskQueue) != 'undefined' && Object.keys(this.taskQueue).length > 0){
                    
                    var renderTask = this;
                    setTimeout(function() {
    
                        
                        
                        for(var hash in renderTask.nodes){
                            //console.log(translate.nodeQueue[uuid].list[lang][hash])
                            for(var nodeindex in renderTask.nodes[hash]){

                                var analyse = translate.element.nodeAnalyse.get(renderTask.nodes[hash][0]);
                                //analyse.text  analyse.node
                                var nodeid = nodeuuid.uuid(analyse.node);
                                
                                if(nodeid.length == 0){
                                    
                                    continue;
                                }
    
                                translate.nodeHistory[nodeid] = {};
                                translate.nodeHistory[nodeid].node = analyse.node;
                                translate.nodeHistory[nodeid].translateText = analyse.text;
                            }
                            
                        }
                        //console.log(translate.nodeHistory);
    
                        
                        translate.listener.renderTaskFinish(renderTask);
    
                    }, 50);
                    
                }else{
                    //console.log(this.taskQueue);
                    //console.log('---this.taskQueue is null');
                }
            }
        },
        

        execute:function(docs){
            if(typeof(docs) != 'undefined'){
                
                translate.useVersion = 'v2';
            }
            
            if(translate.useVersion == 'v1'){
            //if(this.to == null || this.to == ''){
                
                //translate.execute_v1();
                //return;
                
                console.log('提示：https://github.com/xnx3/translate 在 v2.5 版本之后，由于谷歌翻译调整，免费翻译通道不再支持，所以v1版本的翻译接口不再被支持，v1全线下架。考虑到v1已不能使用，当前已自动切换到v2版本。如果您使用中发现什么异常，请针对v2版本进行适配。');
                translate.useVersion = 'v2';
            }
            
            
            try{
                translate.init();
            }catch(e){  }
    
            
            
    
            
            var uuid = translate.util.uuid();
            
            
            if(translate.to == null || translate.to == ''){
                var to_storage = translate.storage.get('to');
                if(to_storage != null && typeof(to_storage) != 'undefined' && to_storage.length > 0){
                    translate.to = to_storage;
                }
            }
            
            
            try{
                translate.selectLanguageTag.render();	
            }catch(e){
                console.log(e);
            }
            
            
            if(translate.to == null || typeof(translate.to) == 'undefined' || translate.to.length == 0){
                
                if(translate.autoDiscriminateLocalLanguage){
                    translate.executeByLocalLanguage();
                }
                
                
                return;
            }
            
            
            if(translate.to == translate.language.getLocal()){
                return;
            }
            
            
            
            
            translate.images.execute();
            

            var all;
            if(typeof(docs) != 'undefined'){
                
                
                if(docs == null){
                    
                    console.log('translate.execute(...) 中传入的要翻译的目标区域不存在。');
                    return;
                }
                
                if(typeof(docs.length) == 'undefined'){
                    
                    all = new Array();
                    all[0] = docs;
                }else{
                    
                    all = docs;
                }
                
            }else{
                //2、3
                all = translate.getDocuments();
            }
            
            //console.log(all)
            
            
            for(var i = 0; i< all.length & i < 20; i++){
                var node = all[i];
                translate.element.whileNodes(uuid, node);	
            }
    
            
            if(translate.language.translateLanguagesRange.length > 0){
                
                for(var lang in translate.nodeQueue[uuid].list){
                    if(translate.language.translateLanguagesRange.indexOf(lang) < 0){
                        
                        delete translate.nodeQueue[uuid].list[lang];
                    }
                }
            }
            
            
            
            for(var lang in translate.nodeQueue[uuid].list){
                //console.log('lang:'+lang)
                for(var hash in translate.nodeQueue[uuid].list[lang]){
                    //console.log(hash)
                    if(typeof(translate.nodeQueue[uuid].list[lang][hash]) == 'function'){
                        
                        continue;
                    }
                    for(var nodeindex = translate.nodeQueue[uuid].list[lang][hash].nodes.length-1; nodeindex > -1; nodeindex--){
                        //console.log(translate.nodeQueue[uuid].list[lang][hash].nodes);
                        var analyse = translate.element.nodeAnalyse.get(translate.nodeQueue[uuid].list[lang][hash].nodes[nodeindex].node);
                        //analyse.text  analyse.node
                        var nodeid = nodeuuid.uuid(analyse.node);
                        //translate.nodeQueue[uuid].list[lang][hash].nodes.splice(nodeindex, 1);
                        //console.log(nodeid+'\t'+analyse.text);
                        if(typeof(translate.nodeHistory[nodeid]) != 'undefined'){
                            

                            if(translate.nodeHistory[nodeid].translateText == analyse.text){
                                
                                translate.nodeQueue[uuid].list[lang][hash].nodes.splice(nodeindex, 1);
                                
                            }else{
 
                            }
                        }else{
                            
                            //console.log(analyse.node)
                        }
                    }
                    if(translate.nodeQueue[uuid].list[lang][hash].nodes.length == 0){
                        
                        delete translate.nodeQueue[uuid].list[lang][hash];
                    }
                }
                if(Object.keys(translate.nodeQueue[uuid].list[lang]).length == 0){
                    
                    delete translate.nodeQueue[uuid].list[lang];
                }
            }
            
            //translateTextArray[lang][0]
            var translateTextArray = {};	
            var translateHashArray = {};	
            
            var twoScanNodes = {};
            var cacheScanNodes = []; 
            for(var lang in translate.nodeQueue[uuid]['list']){ 
                
                if(lang == null || typeof(lang) == 'undefined' || lang.length == 0 || lang == 'undefined'){
                    //console.log('lang is null : '+lang);
                    continue;
                }
    
                translateTextArray[lang] = [];
                translateHashArray[lang] = [];
                
                let task = new translate.renderTask();
                //console.log(translate.nodeQueue);
                
                twoScanNodes[lang] = [];
                
                for(var hash in translate.nodeQueue[uuid]['list'][lang]){
                    if(typeof(translate.nodeQueue[uuid]['list'][lang][hash]) == 'function'){
                        
                        continue;
                    }
    
                    
                    //var originalWord = translate.nodeQueue[uuid]['list'][lang][hash]['original'];	
    
                    
                    var originalWord = translate.nodeQueue[uuid]['list'][lang][hash]['original'];	
                    
                    var translateText = translate.nodeQueue[uuid]['list'][lang][hash]['translateText'];
                    //console.log(originalWord);
                    //console.log(originalWord == translateText ? '1':'xin：'+translateText);
                    
                    var cacheHash = originalWord == translateText ? hash:translate.util.hash(translateText); 
                    translate.nodeQueue[uuid]['list'][lang][hash]['cacheHash'] = cacheHash; 
                    var cache = translate.storage.get('hash_'+translate.to+'_'+cacheHash);
                    //console.log(cacheHash+', '+cache);
    
                    
                    if(cache != null && cache.length > 0){
    
                            for(var node_index = 0; node_index < translate.nodeQueue[uuid]['list'][lang][hash]['nodes'].length; node_index++){
                                //console.log(translate.nodeQueue[uuid]['list'][lang][hash]['nodes'][node_index]);
    
    
                                
                                
                                var ipnode = translate.nodeQueue[uuid]['list'][lang][hash]['nodes'][node_index]['node'];
    
                                
                                var isFind = false;
                                for(var ini = 0; ini < translate.inProgressNodes.length; ini++){
                                    if(translate.inProgressNodes[ini].node.isSameNode(ipnode)){
                                        
                                        translate.inProgressNodes[ini].number++;
                                        isFind = true;
                                        //console.log('cache - find - ++ ');
                                        //console.log(ipnode);
                                    }
                                }
                                
                                if(!isFind){
                                    //console.log('cache - find - add -- lang:'+lang+', hash:'+hash+' node_index:'+node_index);
                                    //console.log(ipnode.nodeValue);
                                    translate.inProgressNodes.push({node: ipnode, number:1});
                                }
    
                                //console.log(translate.inProgressNodes);
                                
    
                                
                                var translateResultText = translate.nodeQueue[uuid]['list'][lang][hash]['nodes'][node_index]['beforeText']+cache+translate.nodeQueue[uuid]['list'][lang][hash]['nodes'][node_index]['afterText'];
                                task.add(translate.nodeQueue[uuid]['list'][lang][hash]['nodes'][node_index]['node'], originalWord, translateResultText, translate.nodeQueue[uuid]['list'][lang][hash]['nodes'][node_index]['attribute']);
                                //this.nodeQueue[lang][hash]['nodes'][node_index].nodeValue = this.nodeQueue[lang][hash]['nodes'][node_index].nodeValue.replace(new RegExp(originalWord,'g'), cache);
                                //console.log(translateResultText);
    
                                var twoScanIndex = -1; 
                                for(var i = 0; i<twoScanNodes[lang].length; i++){
                                    if(translate.nodeQueue[uuid]['list'][lang][hash]['nodes'][node_index]['node'].isSameNode(twoScanNodes[lang][i]['node'])){
                                    //if(translate.nodeQueue[uuid]['list'][lang][hash]['nodes'][node_index]['node'].isSameNode(cacheScanNodes[i]['node'])){
                                        
                                        twoScanIndex = i;
                                        break;
                                    }
                                }
                                var twoScanIndex_cache = -1; 
                                for(var i = 0; i<cacheScanNodes.length; i++){
                                    //if(translate.nodeQueue[uuid]['list'][lang][hash]['nodes'][node_index]['node'].isSameNode(twoScanNodes[lang][i]['node'])){
                                    if(translate.nodeQueue[uuid]['list'][lang][hash]['nodes'][node_index]['node'].isSameNode(cacheScanNodes[i]['node'])){
                                        
                                        twoScanIndex_cache = i;
                                        break;
                                    }
                                }
    
                                if(twoScanIndex == -1){
                                    //console.log(translate.nodeQueue[uuid]['list'][lang][hash]['nodes'][node_index]['node']);
                                    twoScanIndex = twoScanNodes[lang].length;
                                    twoScanNodes[lang][twoScanIndex] = {};
                                    twoScanNodes[lang][twoScanIndex]['node'] = translate.nodeQueue[uuid]['list'][lang][hash]['nodes'][node_index]['node'];
                                    twoScanNodes[lang][twoScanIndex]['array'] = [];
                                }
    
                                if(twoScanIndex_cache == -1){
                                    twoScanIndex_cache = cacheScanNodes.length;
                                    cacheScanNodes[twoScanIndex_cache] = {};
                                    cacheScanNodes[twoScanIndex_cache]['node'] = translate.nodeQueue[uuid]['list'][lang][hash]['nodes'][node_index]['node'];
                                    cacheScanNodes[twoScanIndex_cache]['array'] = [];
                                }
    
                                
                                var arrayIndex = twoScanNodes[lang][twoScanIndex]['array'].length;
                                twoScanNodes[lang][twoScanIndex]['array'][arrayIndex] = translateResultText;
                                
                                var arrayIndex_cache = cacheScanNodes[twoScanIndex_cache]['array'].length;
                                cacheScanNodes[twoScanIndex_cache]['array'][arrayIndex_cache] = translateResultText;
                                
                                //twoScanNodes[lang][twoScanIndex]['array'][arrayIndex] = translate.nodeQueue[uuid]['list'][lang][hash]['beforeText']+cache+translate.nodeQueue[uuid]['list'][lang][hash]['afterText'];
                            }
                        //}
    
    
                            
                        continue;	
                    }
                    
                    
                    
                    translateTextArray[lang].push(translateText);
                    translateHashArray[lang].push(hash); 
                }
    
                task.execute(); 
            }
    
            
            for(var lang in twoScanNodes){
                
                var firstScan = Object.keys(translate.nodeQueue[uuid]['list'][lang]);
                var firstScan_lang_langth = firstScan.length; 
    
                //console.log(twoScanNodes[lang]);
                for(var i = 0; i<twoScanNodes[lang].length; i++){
                    
                    
                    for(var ci = 0; ci<cacheScanNodes.length; ci++){
                        if(twoScanNodes[lang][i].node.isSameNode(cacheScanNodes[ci]['node'])){
                            
                            twoScanNodes[lang][i].array = cacheScanNodes[ci].array;
                            break;
                        }
                    }
    
                    twoScanNodes[lang][i].array.sort(function(a, b) { return b.length - a.length; });
                    //console.log(twoScanNodes[lang][i].array);
    
                    var nodeAnaly = translate.element.nodeAnalyse.get(twoScanNodes[lang][i].node);
                    //console.log(nodeAnaly);
                    var text = nodeAnaly.text;
                    //console.log(text.indexOf(twoScanNodes[lang][i].array[0]));
    
                    for(var ai = 0; ai < twoScanNodes[lang][i].array.length; ai++){
                        if(twoScanNodes[lang][i].array[ai] < 1){
                            continue;
                        }
                        text = text.replace(new RegExp(translate.util.regExp.pattern(twoScanNodes[lang][i].array[ai]),'g'), translate.util.regExp.resultText('\n'));
                    }
                    
                    //console.log(text);
                    var textArray = text.split('\n');
                    //console.log(textArray);
                    for(var tai = 0; tai < textArray.length; tai++){
                        if(textArray[tai] < 1){
                            continue;
                        }
                        //console.log(textArray[tai]);
                        
                        translate.addNodeToQueue(uuid, nodeAnaly['node'], textArray[tai]);
                    }
                }
    
    
                
                var twoScan = Object.keys(translate.nodeQueue[uuid]['list'][lang]);
                var twoScan_lang_langth = twoScan.length; 
                //console.log(firstScan_lang_langth+ '=='+twoScan_lang_langth);
                if(firstScan_lang_langth - twoScan_lang_langth == 0){
                    
                    continue;
                }
    
                //console.log(translate.nodeQueue[uuid]['list'][lang]);
                //console.log(firstScan);
                for(var ti=0; ti<twoScan.length; ti++){
                    twoHash = twoScan[ti];
                    //console.log(twoHash + '-- '+firstScan.indexOf(twoHash));
                    if(firstScan.indexOf(twoHash) == -1){
                        
                        var item = translate.nodeQueue[uuid]['list'][lang][twoHash];
    
                        var cacheHash = item.original == item.translateText ? twoHash:translate.util.hash(item.translateText); 
                        translate.nodeQueue[uuid]['list'][lang][twoHash]['cacheHash'] = cacheHash; 
                        
                        translateTextArray[lang].push(item.translateText);
                        translateHashArray[lang].push(twoHash);
                    }
                }
                
            }
            
    
            
            //window.translateHashArray = translateHashArray;
            
            
            var fanyiLangs = []; 
            //console.log(translateTextArray)
            for(var lang in translate.nodeQueue[uuid]['list']){ 
                if(typeof(translateTextArray[lang]) == 'undefined'){
                    continue;
                }
                if(translateTextArray[lang].length < 1){
                    continue;
                }
                fanyiLangs.push(lang);
            }
            
    
            //console.log(translate.nodeQueue[uuid]['list'])
            if(fanyiLangs.length == 0){
                
                return;
            }
            
            
            for(var lang in translateHashArray){
                if(typeof(translateHashArray[lang]) == 'undefined'){
                    continue;
                }
                if(translateHashArray[lang].length < 1){
                    continue;
                }
                for(var hai = 0; hai<translateHashArray[lang].length; hai++){
                    var thhash = translateHashArray[lang][hai];
                    
                    //var ipnode = translate.nodeQueue[uuid]['list'][lang][thhash].nodes[ipni].node;
                    for(var ipni = 0; ipni < translate.nodeQueue[uuid]['list'][lang][thhash].nodes.length; ipni++){
                        
                        var ipnode = translate.nodeQueue[uuid]['list'][lang][thhash].nodes[ipni].node;
    
                        
                        var isFind = false;
                        for(var ini = 0; ini < translate.inProgressNodes.length; ini++){
                            if(translate.inProgressNodes[ini].node.isSameNode(ipnode)){
                                
                                //console.log('net request ++');
                                //console.log(ipnode);
                                translate.inProgressNodes[ini].number++;
                                isFind = true;
                            }
                        }
                        
                        if(!isFind){
                            //console.log('net request add');
                            //console.log(ipnode);
                            translate.inProgressNodes.push({node: ipnode, number:1});
                        }
    
                    }
    
                }
            }
            
    
    
    
            
            for(var lang_index in fanyiLangs){ 
                var lang = fanyiLangs[lang_index];
                //console.log(typeof(translateTextArray[lang]))
                
                if(typeof(translateTextArray[lang]) == 'undefined' || translateTextArray[lang].length < 1){
                    return;
                }

    
                
                var url = translate.request.api.translate;
                var data = {
                    from:lang,
                    to:translate.to,
                    //text:JSON.stringify(translateTextArray[lang])
                    text:encodeURIComponent(JSON.stringify(translateTextArray[lang]))
                };
                //console.log(data);
                translate.request.post(url, data, function(data){
                    //console.log(data); 
                    //console.log(translateTextArray[data.from]);
                    if(data.result == 0){
                        console.log('=======ERROR START=======');
                        console.log(translateTextArray[data.from]);
                        //console.log(encodeURIComponent(JSON.stringify(translateTextArray[data.from])));
                        
                        console.log('response : '+data.info);
                        console.log('=======ERROR END  =======');
                        
                        return;
                    }
                    
                    
                    //console.log('response:'+uuid);
                    let task = new translate.renderTask();
                    
                    for(var i=0; i<translateHashArray[data.from].length; i++){
                        
                        var lang = data.from;	
                        
                        var text = data.text[i];	
                        
                        if(text == null){
                            continue;
                        }
    
                        
                        
                        if(text.toLowerCase().indexOf(translateTextArray[data.from][i].toLowerCase()) > -1){
                            
                            text = translateTextArray[data.from][i];
                        }
    
    
                        
                        var hash = translateHashArray[data.from][i];	
                        var cacheHash = translate.nodeQueue[uuid]['list'][lang][hash]['cacheHash'];
    
    
                        
                        
                        var originalWord = '';
                        try{
                            originalWord = translate.nodeQueue[uuid]['list'][lang][hash]['original'];
                            //console.log('bef:'+translate.nodeQueue[uuid]['list'][lang][hash]['beforeText']);
                        }catch(e){
                            console.log('uuid:'+uuid+', originalWord:'+originalWord+', lang:'+lang+', hash:'+hash+', text:'+text+', queue:'+translate.nodeQueue[uuid]);
                            console.log(e);
                            continue;
                        }
                        
                        //for(var index = 0; index < translate.nodeQueue[lang][hash].length; index++){
                        for(var node_index = 0; node_index < translate.nodeQueue[uuid]['list'][lang][hash]['nodes'].length; node_index++){
                            //translate.nodeQueue[lang][hash]['nodes'][node_index].nodeValue = translate.nodeQueue[lang][hash]['nodes'][node_index].nodeValue.replace(new RegExp(originalWord,'g'), text);
                            
                            task.add(translate.nodeQueue[uuid]['list'][lang][hash]['nodes'][node_index]['node'], originalWord, translate.nodeQueue[uuid]['list'][lang][hash]['nodes'][node_index]['beforeText']+text+translate.nodeQueue[uuid]['list'][lang][hash]['nodes'][node_index]['afterText'], translate.nodeQueue[uuid]['list'][lang][hash]['nodes'][node_index]['attribute']);
                        }
                        
                        
                        translate.storage.set('hash_'+data.to+'_'+cacheHash,text);
                    }
                    task.execute(); 
                    
    
                });
                
    
                
            }
        },

        nodeHistory:{},
        element:{
            
            nodeAnalyse:{

                get:function(node, attribute){
                    return translate.element.nodeAnalyse.analyse(node,'','', attribute);
                },

                set:function(node, originalText, resultText, attribute){
                    translate.element.nodeAnalyse.analyse(node,originalText,resultText, attribute);
                },

                analyse:function(node, originalText, resultText, attribute){
                    var result = new Array(); 
                    result['node'] = node;
                    result['text'] = '';
    
                    var nodename = translate.element.getNodeName(node);
    
                    if(attribute != null && typeof(attribute) == 'string' && attribute.length > 0){
                        
                        result['text'] = node[attribute];
    
                        
                        if(typeof(originalText) != 'undefined' && originalText.length > 0){
                            if(typeof(node[attribute]) != 'undefined'){
                                node[attribute] = node[attribute].replace(new RegExp(translate.util.regExp.pattern(originalText),'g'), translate.util.regExp.resultText(resultText));	
                            }else{
                                console.log(node);
                            }
                            
                        }
                        return result;
                    }
    
                    
    
                    //console.log(typeof(node)+node);
                    if(nodename == '#text'){
                        
                        if(typeof(node.parentNode) != 'undefined'){
                            var parentNodename = translate.element.getNodeName(node.parentNode);
                            //console.log(parentNodename)
                            if(parentNodename == 'TEXTAREA'){
                                
                                nodename = 'TEXTAREA';
                                node = node.parentNode;
                            }
                        }
                    }
    
                    if(nodename == 'INPUT' || nodename == 'TEXTAREA'){
                        //console.log(node.attributes)
                        
                        if(node.attributes == null || typeof(node.attributes) == 'undefined'){
                            result['text'] = '';
                            return result;
                        }
    
                        
                        if(nodename == 'INPUT'){
                            if(typeof(node.attributes.type) != 'undefined' && typeof(node.attributes.type.nodeValue) != null && (node.attributes.type.nodeValue.toLowerCase() == 'button' || node.attributes.type.nodeValue.toLowerCase() == 'submit')){
                                
                                
                                var input_value_node = node.attributes.value;
                                if(input_value_node != null && typeof(input_value_node) != 'undefined' && typeof(input_value_node.nodeValue) != 'undefined' && input_value_node.nodeValue.length > 0){
                                    
                                    if(typeof(originalText) != 'undefined' && originalText.length > 0){
                                        //this.nodes[hash][task_index].nodeValue = this.nodes[hash][task_index].nodeValue.replace(new RegExp(translate.util.regExp.pattern(task.originalText),'g'), translate.util.regExp.resultText(task.resultText));
                                        input_value_node.nodeValue = input_value_node.nodeValue.replace(new RegExp(translate.util.regExp.pattern(originalText),'g'), translate.util.regExp.resultText(resultText));
                                    }
    
                                    result['text'] = input_value_node.nodeValue;
                                    result['node'] = input_value_node;
                                    return result;
                                }
                            }
                        }
                        //console.log(node)
    
                        
                        if(typeof(node.attributes['placeholder']) != 'undefined'){
                            //console.log(node);
                            
                            if(typeof(originalText) != 'undefined' && originalText.length > 0){
                                //this.nodes[hash][task_index].nodeValue = this.nodes[hash][task_index].nodeValue.replace(new RegExp(translate.util.regExp.pattern(task.originalText),'g'), translate.util.regExp.resultText(task.resultText));
                                node.attributes['placeholder'].nodeValue = node.attributes['placeholder'].nodeValue.replace(new RegExp(translate.util.regExp.pattern(originalText),'g'), translate.util.regExp.resultText(resultText));
                            }
    
                            result['text'] = node.attributes['placeholder'].nodeValue;
                            result['node'] = node.attributes['placeholder'];
                            return result;
                            //return node.attributes['placeholder'].nodeValue;
                        }
                        //console.log(node)
                        result['text'] = '';
                        return result;
                    }
                    if(nodename == 'META'){
                        
                        if(typeof(node.name) != 'undefined' && node.name != null){
                            var nodeAttributeName = node.name.toLowerCase();  
                            if(nodeAttributeName == 'keywords' || nodeAttributeName == 'description'){
                                
                                if(typeof(originalText) != 'undefined' && originalText != null && originalText.length > 0){
                                    //this.nodes[hash][task_index].nodeValue = this.nodes[hash][task_index].nodeValue.replace(new RegExp(translate.util.regExp.pattern(task.originalText),'g'), translate.util.regExp.resultText(task.resultText));
                                    node.content = node.content.replace(new RegExp(translate.util.regExp.pattern(originalText),'g'), translate.util.regExp.resultText(resultText));
                                }
    
                                result['text'] = node.content;
                                return result;
                            }
                        }
    
                        result['text'] = '';
                        return result;
                    }
                    if(nodename == 'IMG'){
                        if(typeof(node.alt) == 'undefined' || node.alt == null){
                            result['text'] = '';
                            return result;
                        }
    
                        
                        if(typeof(originalText) != 'undefined' && originalText.length > 0){
                            //this.nodes[hash][task_index].nodeValue = this.nodes[hash][task_index].nodeValue.replace(new RegExp(translate.util.regExp.pattern(task.originalText),'g'), translate.util.regExp.resultText(task.resultText));
                            node.alt = node.alt.replace(new RegExp(translate.util.regExp.pattern(originalText),'g'), translate.util.regExp.resultText(resultText));
                        }
                        result['text'] = node.alt;
                        return result;
                    }
                    
                    
                    
                    if(node.nodeValue == null || typeof(node.nodeValue) == 'undefined'){
                        result['text'] = '';
                    }else if(node.nodeValue.trim().length == 0){
                        
                        result['text'] = '';
                    }else{
                        
                        if(typeof(originalText) != 'undefined' && originalText != null && originalText.length > 0){
                            //this.nodes[hash][task_index].nodeValue = this.nodes[hash][task_index].nodeValue.replace(new RegExp(translate.util.regExp.pattern(task.originalText),'g'), translate.util.regExp.resultText(task.resultText));
                            node.nodeValue = node.nodeValue.replace(new RegExp(translate.util.regExp.pattern(originalText),'g'), translate.util.regExp.resultText(resultText));
                        }
                        result['text'] = node.nodeValue;
                    }
                    return result;
                }
            },
            
            getNodeName:function(node){
                if(node == null || typeof(node) == 'undefined'){
                    return '';
                }
    
                if(node.nodeName == null || typeof(node.nodeName) == 'undefined'){
                    return '';
                }
    
                var nodename = node.nodeName;
                //console.log('nodename:'+nodename+', node:'+node);
                return nodename;
            },
            
            whileNodes:function(uuid, node){
                if(node == null || typeof(node) == 'undefined'){
                    return;
                }
    
                
                if(typeof(translate.nodeQueue[uuid]) == 'undefined' || translate.nodeQueue[uuid] == null){
                    translate.nodeQueue[uuid] = new Array(); 
                    translate.nodeQueue[uuid]['expireTime'] = Date.now() + 120*1000; 
                    translate.nodeQueue[uuid]['list'] = new Array(); 
                    
                    //console.log(uuid)
                }
    
                //console.log('---'+typeof(node)+', ');
                
                if(typeof(node) == 'object' && typeof(node['title']) == 'string' && node['title'].length > 0){
                    
                    
                    
                    if(!translate.ignore.isIgnore(node)){
                        
                        translate.addNodeToQueue(uuid, node, node['title'], 'title');
                    }
                }
                
                var childNodes = node.childNodes;
                if(childNodes.length > 0){
                    for(var i = 0; i<childNodes.length; i++){
                        translate.element.whileNodes(uuid, childNodes[i]);
                    }
                }else{
                    
                    translate.element.findNode(uuid, node);
                }
            },
            findNode:function(uuid, node){
                if(node == null || typeof(node) == 'undefined'){
                    return;
                }
                //console.log(node)
                if(node.parentNode == null){
                    return;
                }
    
                //console.log('-----parent')
                var parentNodeName = translate.element.getNodeName(node.parentNode);
                //node.parentNode.nodeName;
                if(parentNodeName == ''){
                    return;
                }
                if(translate.ignore.tag.indexOf(parentNodeName.toLowerCase()) > -1){
                    
                    
                    return;
                }
        
                
                
                if(translate.ignore.isIgnore(node)){
                    
                    //console.log(node);
                    return;
                }
    
                
                var nodeAnaly = translate.element.nodeAnalyse.get(node);
                if(nodeAnaly['text'].length > 0){
                    
                    //console.log('addNodeToQueue -- '+nodeAnaly['node']+', text:' + nodeAnaly['text']);
                    translate.addNodeToQueue(uuid, nodeAnaly['node'], nodeAnaly['text']);
                }
    
            },
        },
    
        
        addNodeToQueue:function(uuid, node, text, attribute){
            if(node == null || text == null || text.length == 0){
                return;
            }
    
            var nodename = translate.element.getNodeName(node);
            
            
            if(nodename.toLowerCase() == '#comment'){
                return;
            }
            //console.log('\t\t'+text);
            
            var key = translate.util.hash(text);
            
            
            if(translate.util.findTag(text)){
                
                
                if(node.parentNode == null){
                    
                    return;
                }
                
                var parentNodeName = translate.element.getNodeName(node.parentNode);
                //node.parentNode.nodeName;
                if(parentNodeName == 'SCRIPT' || parentNodeName == 'STYLE'){
                    
                    return;
                }
            }
            //console.log(node.nodeValue);
        
            
            //var langs = translate.language.get(text);
            var textRecognition = translate.language.recognition(text);
            langs = textRecognition.languageArray;
            //console.log('langs');
            //console.log(langs);
    
            
            
            if(typeof(langs[translate.to]) != 'undefined'){
                delete langs[translate.to];
            }
            
            var isWhole = translate.whole.isWhole(node);
            //console.log('isWhole:'+isWhole+', '+text);
    
            if(!isWhole){
                
    
                
                for(var lang in langs) {
                    
                    
                    //console.log('|'+langs[lang].length);
                    
                    for(var word_index = 0; word_index < langs[lang].list.length; word_index++){
                        //console.log('start:'+word_index)
                        //console.log(langs[lang].list[word_index]);
                        if(typeof(langs[lang].list[word_index]) == 'undefined' || typeof(langs[lang].list[word_index]['text']) == 'undefined'){
                            
                            continue;
                        }
                        var word = langs[lang].list[word_index]['text']; 
                        var beforeText = langs[lang].list[word_index]['beforeText'];
                        var afterText = langs[lang].list[word_index]['afterText'];
    
                        translate.addNodeQueueItem(uuid, node, word, attribute, lang, beforeText, afterText);
    
                    }
                    
                }
                
    
    
    
            }else{
                
                var lang = textRecognition.languageName;
                translate.addNodeQueueItem(uuid, node, text, attribute, lang, '', '');
            }
    
            
            
            
        },

        addNodeQueueItem:function(uuid, node, word, attribute, lang, beforeText, afterText){
            
            if(translate.nodeQueue[uuid]['list'][lang] == null || typeof(translate.nodeQueue[uuid]['list'][lang]) == 'undefined'){
                translate.nodeQueue[uuid]['list'][lang] = new Array();
            }
    
            
            var hash = translate.util.hash(word); 	
    
            
            if(translate.nodeQueue[uuid]['list'][lang][hash] == null || typeof(translate.nodeQueue[uuid]['list'][lang][hash]) == 'undefined'){
                translate.nodeQueue[uuid]['list'][lang][hash] = new Array();
                
                translate.nodeQueue[uuid]['list'][lang][hash]['nodes'] = new Array();
                translate.nodeQueue[uuid]['list'][lang][hash]['original'] = word;
                translate.nodeQueue[uuid]['list'][lang][hash]['translateText'] = translate.nomenclature.dispose(word); 
    
                
            }
    
    
            var isEquals = false; 
            if(typeof(node.isSameNode) != 'undefined'){	
                for(var node_index = 0; node_index < translate.nodeQueue[uuid]['list'][lang][hash]['nodes'].length; node_index++){
                    if(node.isSameNode(translate.nodeQueue[uuid]['list'][lang][hash]['nodes'][node_index]['node'])){
                        
                        
                        isEquals = true;
                        //console.log(node)
                        continue;
                    }
                }
            }
            if(isEquals){
                
                return;
            }
    
            
            var nodesIndex = translate.nodeQueue[uuid]['list'][lang][hash]['nodes'].length;
            translate.nodeQueue[uuid]['list'][lang][hash]['nodes'][nodesIndex] = new Array();
            translate.nodeQueue[uuid]['list'][lang][hash]['nodes'][nodesIndex]['node']=node; 
            translate.nodeQueue[uuid]['list'][lang][hash]['nodes'][nodesIndex]['attribute']=attribute;
            translate.nodeQueue[uuid]['list'][lang][hash]['nodes'][nodesIndex]['beforeText'] = beforeText;
            translate.nodeQueue[uuid]['list'][lang][hash]['nodes'][nodesIndex]['afterText'] = afterText;
            
    
        },
    
        
        whole:{
            class:[],
            tag:[],
            id:[],
    
            
            
            executeTip:function(){
                if(translate.whole.class.length == 0 && translate.whole.tag.length == 0 && translate.whole.id.length == 0){
                    
                }else{
                    console.log('您开启了 translate.whole 此次行为避开了浏览器端的文本语种自动识别，而是暴力的直接对某个元素的整个文本进行翻译，很可能会产生非常大的翻译量，请谨慎！有关每日翻译字符的说明，可参考： http://translate.zvo.cn/42557.html ');
                }
    
                if(translate.whole.tag.indexOf('html') > -1){
                    console.log('自检发现您设置了 translate.whole.tag 其中有 html ，这个是不生效的，最大只允许设置到 body ');
                }
            },
    
            
            
            isWhole:function(ele){
                if(translate.whole.class.length == 0 && translate.whole.tag.length == 0 && translate.whole.id.length == 0){
                    
                    return false;
                }
                if(ele == null || typeof(ele) == 'undefined'){
                    return false;
                }
    
                var parentNode = ele;
                var maxnumber = 100;	
                while(maxnumber-- > 0){
                    if(parentNode == null || typeof(parentNode) == 'undefined'){
                        
                        return false;
                    }
    
                    
                    
                    var nodename = translate.element.getNodeName(parentNode).toLowerCase(); 
                    if(nodename.length > 0){
                        
                        if(nodename == 'html' || nodename == '#document'){
                            
                            return false;
                        }
                        if(translate.whole.tag.indexOf(nodename) > -1){
                            
                            return true;
                        }
                    }
                    
    
                    
                    if(parentNode.className != null){
                        var classNames = parentNode.className;
                        if(classNames == null || typeof(classNames) != 'string'){
                            continue;
                        }
                        //console.log('className:'+typeof(classNames));
                        //console.log(classNames);
                        classNames = classNames.trim().split(' ');
                        for(var c_index = 0; c_index < classNames.length; c_index++){
                            if(classNames[c_index] != null && classNames[c_index].trim().length > 0){
                                
                                if(translate.whole.class.indexOf(classNames[c_index]) > -1){
                                    
                                    return true;
                                }
                            }
                        }					
                    }
    
                    
                    if(parentNode.id != null && typeof(parentNode.id) != 'undefined'){
                        
                        if(translate.whole.id.indexOf(parentNode.id) > -1){
                            
                            return true;
                        }
                    }
    
                    
                    parentNode = parentNode.parentNode;
                }
    
                return false;
            }
        },
    
        language:{
            
            local:'',
            
            translateLanguagesRange: [], 
            
            setLocal:function(languageName){
                //translate.setUseVersion2(); //Set to use v2.x version
                translate.useVersion = 'v2';
                translate.language.local = languageName;
            },
            
            getLocal:function(){
                
                if(translate.language.local == null || translate.language.local.length < 1){
                    translate.language.autoRecognitionLocalLanguage();
                }
                return translate.language.local;
            },
            
            getCurrent:function(){
                var to_storage = translate.storage.get('to');
                if(to_storage != null && typeof(to_storage) != 'undefined' && to_storage.length > 0){
                    
                    return to_storage;
                }
                return translate.language.getLocal();
            },
            
            
            setDefaultTo:function(languageName){
                var to_storage = translate.storage.get('to');
                if(to_storage != null && typeof(to_storage) != 'undefined' && to_storage.length > 0){
                    
                }else{
                    
                    translate.storage.set('to', languageName);
                    translate.to = languageName;
                }
            },
            
            clearCacheLanguage:function(){
                translate.to = '';
                translate.storage.set('to','');
            },
            
            
            
            setUrlParamControl:function(paramName){
                if(typeof(paramName) == 'undefined' || paramName.length < 1){
                    paramName = 'language';
                }
                var paramValue = translate.util.getUrlParam(paramName);
                if(typeof(paramValue) == 'undefined'){
                    return;
                }
                if(paramValue == '' || paramValue == 'null' || paramValue == 'undefined'){
                    return;
                }
    
                translate.storage.set('to', paramValue);
                translate.to = paramValue;
            },
            
            autoRecognitionLocalLanguage:function(){
                if(translate.language.local != null && translate.language.local.length > 2){
                    
                    return;
                }
    
                var bodyText = document.body.outerText;
                if(bodyText == null || typeof(bodyText) == 'undefined' || bodyText.length < 1){
                    
                    translate.language.local = 'chinese_simplified';
                    return;
                }
    
                bodyText = bodyText.replace(/\n|\t|\r/g,''); 
    
                
                translate.language.local = 'chinese_simplified';
                var recognition = translate.language.recognition(bodyText);
                translate.language.local = recognition.languageName;
                return translate.language.local;

            },
            

            get:function(str){
                
    
                var langs = new Array(); 
                var langStrs = new Array();	
                var upLangs = []; 
                var upLangsTwo = []; 
                
                
                for(var i=0; i<str.length; i++){
                    var charstr = str.charAt(i);
                    //console.log('charstr:'+charstr)
                    var lang = translate.language.getCharLanguage(charstr);
                    if(lang == ''){
                        
                        //continue;
                        lang = 'unidentification';
                    }
                    var result = translate.language.analyse(lang, langStrs, upLangs, upLangsTwo, charstr);
                    //console.log(result)
                    langStrs = result['langStrs'];
                    
                    if(typeof(upLangs['language']) != 'undefined'){
                        upLangsTwo['language'] = upLangs['language'];
                        upLangsTwo['charstr'] = upLangs['charstr'];
                        upLangsTwo['storage_language'] = upLangs['storage_language'];
                    }
                    //upLangs['language'] = lang;
                    upLangs['language'] = result['storage_language'];
                    upLangs['charstr'] = charstr;
                    upLangs['storage_language'] = result['storage_language'];
                    //console.log(result['storage_language'])
                    //console.log(upLangs['language']);
                    langs.push(lang);
                }
                
 
                //console.log(langStrs);
                if(typeof(langStrs['unidentification']) != 'undefined'){
                    delete langStrs['unidentification'];
                }
                if(typeof(langStrs['specialCharacter']) != 'undefined'){
                    delete langStrs['specialCharacter'];
                }
                if(typeof(langStrs['number']) != 'undefined'){
                    delete langStrs['number'];
                }
                
                
                //console.log('get end');
                return langStrs;
            },
    

            recognition:function(str){
                var langs = translate.language.get(str);
                //var langkeys = Object.keys(langs);
                //console.log(langkeys);
                var langsNumber = []; 
                var langsNumberOriginal = []; 
                var allNumber = 0;
                for(var key in langs){
                    var langStrLength = 0;
                    for(var ls = 0; ls < langs[key].length; ls++){
                        langStrLength = langStrLength + langs[key][ls].text.length;
                    }
                    allNumber = allNumber + langStrLength;
                    langsNumber[key] = langStrLength;
                    langsNumberOriginal[key] = langStrLength;
                }
    
                
                var langkeys = [];
                for(var lang in langsNumber){
                    if(langsNumber[lang]/allNumber > 0.05){
                        langkeys[langkeys.length] = lang+'';
                    }
                }
    
    
                if(langkeys.length > 1 && langkeys.indexOf('english') > -1){
                    
                    //langkeys.splice(langkeys.indexOf('english'), 1); 
                    langsNumber['english'] = 0;
                }
    
                if(langkeys.indexOf('chinese_simplified') > -1 && langkeys.indexOf('chinese_traditional') > -1){
                    
                    //langkeys.splice(langkeys.indexOf('chinese_simplified'), 1); 
                    langsNumber['chinese_simplified'] = 0;
                }
    
    
                
                var maxLang = ''; 
                var maxNumber = 0;
                for(var lang in langsNumber){
                    if(langsNumber[lang] > maxNumber){
                        maxLang = lang;
                        maxNumber = langsNumber[lang];
                    }
                }
    
                
                var languageArray = {};
                for(var lang in langs){
                    languageArray[lang] = {};
                    languageArray[lang].number = langsNumberOriginal[lang];
                    languageArray[lang].list = langs[lang];
                }
    
                var result = {
                    languageName: maxLang,
                    languageArray: languageArray
                };
                return result;
            },
            
            getCharLanguage:function(charstr){
                if(charstr == null || typeof(charstr) == 'undefined'){
                    return '';
                }
                
                if(this.italian(charstr)){
                    return 'italian';
                }
                if(this.english(charstr)){
                    return 'english';
                }
                if(this.specialCharacter(charstr)){
                    return 'specialCharacter';
                }
                if(this.number(charstr)){
                    return 'number';	
                }
    
                
                var chinesetype = this.chinese(charstr);
                if(chinesetype == 'simplified'){
                    return 'chinese_simplified';
                }else if(chinesetype == 'traditional'){
                    return 'chinese_traditional';
                }
    
                if(this.japanese(charstr)){
                    return 'japanese';
                }
                if(this.korean(charstr)){
                    return 'korean';
                }
    
                
                //console.log('not find is language , char : '+charstr+', unicode: '+charstr.charCodeAt(0).toString(16));
                return '';
                
            },

            analyse:function(language, langStrs, upLangs, upLangsTwo, charstr){
                if(typeof(langStrs[language]) == 'undefined'){
                    langStrs[language] = new Array();
                }
                var index = 0; 
                if(typeof(upLangs['storage_language']) == 'undefined'){
                    
                    
                    //console.log(upLangs['language'])
                }else{
 
    
                        
                        if(translate.language.connector(charstr)){
                            language = upLangs['storage_language'];

                        }

    
                    
                    if(upLangs['storage_language'] == language){
                        index = langStrs[language].length-1; 
                    }else{
                        
                        
                        index = langStrs[language].length;
                    }
                }
                if(typeof(langStrs[language][index]) == 'undefined'){
                    langStrs[language][index] = new Array();
                    langStrs[language][index]['beforeText'] = '';
                    langStrs[language][index]['afterText'] = '';
                    langStrs[language][index]['text'] = '';
                }
                langStrs[language][index]['text'] = langStrs[language][index]['text'] + charstr;

                if( translate.language.wordBlankConnector(translate.language.getLocal()) == false && translate.language.wordBlankConnector(translate.to)){	
                    if((upLangs['storage_language'] != null && typeof(upLangs['storage_language']) != 'undefined' && upLangs['storage_language'].length > 0)){
                        
                        //console.log(upLangs['storage_language']);
                        if(upLangs['storage_language'] != 'specialCharacter'){
                            
    
                            //if( upLangs['storage_language'] != 'english' && language == 'english'){
                            
                            if( translate.language.wordBlankConnector(upLangs['storage_language']) == false && translate.language.wordBlankConnector(language) ){
                                
                                //console.log(upLangs['language']);
                                langStrs[upLangs['storage_language']][langStrs[upLangs['storage_language']].length-1]['afterText'] = ' ';
                            }else if(upLangs['storage_language'] == 'english' && language != 'english'){
                                
                                langStrs[language][index]['beforeText'] = ' ';
                            }
                        }
    
                        
                    }
                }
    
                var result = new Array();
                result['langStrs'] = langStrs;
                result['storage_language'] = language;	
                //console.log(result);
                //console.log(langStrs)
                //console.log(charstr);
                return result;
            },
            
            
            connector:function(str){
                

                if(/.*[\u0020\u00A0\u202F\u205F\u3000]+.*$/.test(str)){
                    return true;
                }

                if(/.*[\u0030-\u0039]+.*$/.test(str)){ 
                    return true
                }
                

                if(/.*[\u0021\u0022\u0023\u0024\u0025\u0026\u0027\u002C\u002D\u002E\u003A\u003B\u003F\u0040]+.*$/.test(str)){
                    return true;
                }
                
                if(/.*[\u3002\uFF1F\uFF01\uFF0C\u3001\uFF1B\uFF1A\u300C\u300D\u300E\u300F\u2018\u2019\u201C\u201D\uFF08\uFF09\u3014\u3015\u3010\u3011\u2014\u2026\u2013\uFF0E\u300A\u300B\u3008\u3009\u00b7]+.*$/.test(str)){
                    return true;
                }
    
    
    
                
                
                return false;
            },
            
            
            
            wordBlankConnector:function(language){
                if(language == null || typeof(language) == 'undefined'){
                    return true;
                }
                switch (language.trim().toLowerCase()){
                      case 'chinese_simplified':
                          return false;
                      case 'chinese_traditional':
                          return false;
                      case 'korean':
                          return false;
                      case 'japanese':
                          return false;
                  }
                  
                  return true;
            },
            
            chinese_traditional_dict: '皚藹礙愛翺襖奧壩罷擺敗頒辦絆幫綁鎊謗剝飽寶報鮑輩貝鋇狽備憊繃筆畢斃閉邊編貶變辯辮鼈癟瀕濱賓擯餅撥缽鉑駁蔔補參蠶殘慚慘燦蒼艙倉滄廁側冊測層詫攙摻蟬饞讒纏鏟産闡顫場嘗長償腸廠暢鈔車徹塵陳襯撐稱懲誠騁癡遲馳恥齒熾沖蟲寵疇躊籌綢醜櫥廚鋤雛礎儲觸處傳瘡闖創錘純綽辭詞賜聰蔥囪從叢湊竄錯達帶貸擔單鄲撣膽憚誕彈當擋黨蕩檔搗島禱導盜燈鄧敵滌遞締點墊電澱釣調叠諜疊釘頂錠訂東動棟凍鬥犢獨讀賭鍍鍛斷緞兌隊對噸頓鈍奪鵝額訛惡餓兒爾餌貳發罰閥琺礬釩煩範販飯訪紡飛廢費紛墳奮憤糞豐楓鋒風瘋馮縫諷鳳膚輻撫輔賦複負訃婦縛該鈣蓋幹趕稈贛岡剛鋼綱崗臯鎬擱鴿閣鉻個給龔宮鞏貢鈎溝構購夠蠱顧剮關觀館慣貫廣規矽歸龜閨軌詭櫃貴劊輥滾鍋國過駭韓漢閡鶴賀橫轟鴻紅後壺護滬戶嘩華畫劃話懷壞歡環還緩換喚瘓煥渙黃謊揮輝毀賄穢會燴彙諱誨繪葷渾夥獲貨禍擊機積饑譏雞績緝極輯級擠幾薊劑濟計記際繼紀夾莢頰賈鉀價駕殲監堅箋間艱緘繭檢堿鹼揀撿簡儉減薦檻鑒踐賤見鍵艦劍餞漸濺澗漿蔣槳獎講醬膠澆驕嬌攪鉸矯僥腳餃繳絞轎較稭階節莖驚經頸靜鏡徑痙競淨糾廄舊駒舉據鋸懼劇鵑絹傑潔結誡屆緊錦僅謹進晉燼盡勁荊覺決訣絕鈞軍駿開凱顆殼課墾懇摳庫褲誇塊儈寬礦曠況虧巋窺饋潰擴闊蠟臘萊來賴藍欄攔籃闌蘭瀾讕攬覽懶纜爛濫撈勞澇樂鐳壘類淚籬離裏鯉禮麗厲勵礫曆瀝隸倆聯蓮連鐮憐漣簾斂臉鏈戀煉練糧涼兩輛諒療遼鐐獵臨鄰鱗凜賃齡鈴淩靈嶺領餾劉龍聾嚨籠壟攏隴樓婁摟簍蘆盧顱廬爐擄鹵虜魯賂祿錄陸驢呂鋁侶屢縷慮濾綠巒攣孿灤亂掄輪倫侖淪綸論蘿羅邏鑼籮騾駱絡媽瑪碼螞馬罵嗎買麥賣邁脈瞞饅蠻滿謾貓錨鉚貿麽黴沒鎂門悶們錳夢謎彌覓綿緬廟滅憫閩鳴銘謬謀畝鈉納難撓腦惱鬧餒膩攆撚釀鳥聶齧鑷鎳檸獰甯擰濘鈕紐膿濃農瘧諾歐鷗毆嘔漚盤龐國愛賠噴鵬騙飄頻貧蘋憑評潑頗撲鋪樸譜臍齊騎豈啓氣棄訖牽扡釺鉛遷簽謙錢鉗潛淺譴塹槍嗆牆薔強搶鍬橋喬僑翹竅竊欽親輕氫傾頃請慶瓊窮趨區軀驅齲顴權勸卻鵲讓饒擾繞熱韌認紉榮絨軟銳閏潤灑薩鰓賽傘喪騷掃澀殺紗篩曬閃陝贍繕傷賞燒紹賒攝懾設紳審嬸腎滲聲繩勝聖師獅濕詩屍時蝕實識駛勢釋飾視試壽獸樞輸書贖屬術樹豎數帥雙誰稅順說碩爍絲飼聳慫頌訟誦擻蘇訴肅雖綏歲孫損筍縮瑣鎖獺撻擡攤貪癱灘壇譚談歎湯燙濤縧騰謄銻題體屜條貼鐵廳聽烴銅統頭圖塗團頹蛻脫鴕馱駝橢窪襪彎灣頑萬網韋違圍爲濰維葦偉僞緯謂衛溫聞紋穩問甕撾蝸渦窩嗚鎢烏誣無蕪吳塢霧務誤錫犧襲習銑戲細蝦轄峽俠狹廈鍁鮮纖鹹賢銜閑顯險現獻縣餡羨憲線廂鑲鄉詳響項蕭銷曉嘯蠍協挾攜脅諧寫瀉謝鋅釁興洶鏽繡虛噓須許緒續軒懸選癬絢學勳詢尋馴訓訊遜壓鴉鴨啞亞訝閹煙鹽嚴顔閻豔厭硯彥諺驗鴦楊揚瘍陽癢養樣瑤搖堯遙窯謠藥爺頁業葉醫銥頤遺儀彜蟻藝億憶義詣議誼譯異繹蔭陰銀飲櫻嬰鷹應纓瑩螢營熒蠅穎喲擁傭癰踴詠湧優憂郵鈾猶遊誘輿魚漁娛與嶼語籲禦獄譽預馭鴛淵轅園員圓緣遠願約躍鑰嶽粵悅閱雲鄖勻隕運蘊醞暈韻雜災載攢暫贊贓髒鑿棗竈責擇則澤賊贈紮劄軋鍘閘詐齋債氈盞斬輾嶄棧戰綻張漲帳賬脹趙蟄轍鍺這貞針偵診鎮陣掙睜猙幀鄭證織職執紙摯擲幟質鍾終種腫衆謅軸皺晝驟豬諸誅燭矚囑貯鑄築駐專磚轉賺樁莊裝妝壯狀錐贅墜綴諄濁茲資漬蹤綜總縱鄒詛組鑽緻鐘麼為隻兇準啟闆裡靂餘鍊洩',
 
            chinese:function(str){
                if(/.*[\u4e00-\u9fa5]+.*$/.test(str)){ 
                    if(this.chinese_traditional_dict.indexOf(str) > -1){ 
                        return 'traditional';
                    } else {
                        return 'simplified';
                    }
                } else {
                    return '';
                }
            },
            
            english:function(str){
                if(/.*[\u0041-\u005a]+.*$/.test(str)){ 
                    return true;
                } else if(/.*[\u0061-\u007a]+.*$/.test(str)){
                    return true;
                } else {
                    return false;
                }
            },
            
            japanese:function(str){
                if(/.*[\u3040-\u309F\u30A0-\u30FF]+.*$/.test(str)){ 
                    return true
                } else {
                    return false;
                }
            },
            
            korean:function(str){
                if(/.*[\uAC00-\uD7AF]+.*$/.test(str)){ 
                    return true
                } else {
                    return false;
                }
            },
            
            number:function(str){
                if(/.*[\u0030-\u0039]+.*$/.test(str)){
                    return true;
                }
                return false;
            },
            
            italian:function(str){
                if(/.*[\u00E0-\u00F6]+.*$/.test(str)){
                    return true;
                }
                return false;
            },
    
            
            specialCharacter:function(str){
                
                if(/.*[\u2460-\u24E9]+.*$/.test(str)){ 
                    return true
                }
    
                
                if(/.*[\u2500-\u25FF]+.*$/.test(str)){ 
                    return true
                }
    
                
                if(/.*[\u3200-\u33FF]+.*$/.test(str)){ 
                    return true
                }
                
                
                if(/.*[\uFF00-\uFF5E]+.*$/.test(str)){ 
                    return true
                }
    
                
                if(/.*[\u2000-\u22FF]+.*$/.test(str)){ 
                    return true
                }
    
                
                if(/.*[\u3001-\u3036]+.*$/.test(str)){
                    return true;
                }
    
                
                

                if(/.*[\u0020-\u002F]+.*$/.test(str)){
                    return true;
                }
    

                if(/.*[\u003A-\u007E]+.*$/.test(str)){
                    return true;
                }
                
                
                if(/.*[\u0009\u000a\u0020\u00A0\u1680\u180E\u202F\u205F\u3000\uFEFF]+.*$/.test(str)){
                    return true;
                }
                if(/.*[\u2000-\u200B]+.*$/.test(str)){
                    return true;
                }
                

                if(/.*[\u00A1-\u0105]+.*$/.test(str)){
                    return true;
                }
                if(/.*[\u2C60-\u2C77]+.*$/.test(str)){
                    return true;
                }
                
                
                return false;
            }
        },
        
        
        executeByLocalLanguage:function(){
            translate.request.post(translate.request.api.ip, {}, function(data){
                //console.log(data); 
                if(data.result == 0){
                    console.log('==== ERROR 获取当前用户所在区域异常 ====');
                    console.log(data.info);
                    console.log('==== ERROR END ====');
                }else{
                    translate.storage.set('to',data.language);	
                    translate.to = data.language; 
                    translate.selectLanguageTag
                    translate.execute(); 
                }
            });
        },
        
        util:{
            
            uuid:function() {
                var d = new Date().getTime();
                if (window.performance && typeof window.performance.now === "function") {
                    d += performance.now(); //use high-precision timer if available
                }
                var uuid = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = (d + Math.random() * 16) % 16 | 0;
                    d = Math.floor(d / 16);
                    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
                });
                return uuid;
            },
    
            
            findTag:function(str) {
                var reg = /<[^>]+>/g;
                return reg.test(str);
            },
            
            arrayFindMaxNumber:function(arr){
    
                
                var numbers = {}
    
                
                var maxStr = []
    
                
                var maxNum = 0
    
                for(var i =0,len=arr.length;i<len;i++){
                    if(!numbers[arr[i]]){
                          numbers[arr[i]] = 1  
                    }else{
                        numbers[arr[i]]++
                    }
    
                    if(numbers[arr[i]]>maxNum){
                        maxNum = numbers[arr[i]]
                    }
                }
    
                for(var item in numbers){
                    if(numbers[item]===maxNum){
                        maxStr.push(item)
                    }
                }
                
                return maxStr;
            },
            
            hash:function(str){
                if(str == null || typeof(str) == 'undefined'){
                    return str;
                }
                var hash = 0, i, chr;
                if (str.length === 0){
                    return hash;
                }
    
                for (i = 0; i < str.length; i++) {
                    chr   = str.charCodeAt(i);
                    hash  = ((hash << 5) - hash) + chr;
                    hash |= 0; // Convert to 32bit integer
                }
                return hash+'';
            },
            
            charReplace:function(str){
    
                if(str == null){
                    return '';
                }
                str = str.trim();
                str = str.replace(/\t|\n|\v|\r|\f/g,'');	
                
                return str;
            },
            
            regExp:{
                
                pattern:function(str){
                    str = str.replace(/\\/g,'\\\\'); 
                    //str = str.replace(/'/g,'\\\'');
                    str = str.replace(/\"/g,'\\\"');
                    //str = str.replace(/./g,'\\\.');
                    str = str.replace(/\?/g,'\\\?');
                    str = str.replace(/\$/g,'\\\$');
                    str = str.replace(/\(/g,'\\\(');
                    str = str.replace(/\)/g,'\\\)');
                    str = str.replace(/\|/g,'\\\|');
                    str = str.replace(/\+/g,'\\\+');
                    str = str.replace(/\*/g,'\\\*');
                    str = str.replace(/\[/g,'\\\[');
                    str = str.replace(/\]/g,'\\\]');
                    str = str.replace(/\^/g,'\\\^');
                    str = str.replace(/\{/g,'\\\{');
                    str = str.replace(/\}/g,'\\\}');
                    return str;
                },
                
                resultText:function(str){
                    //str = str.replace(/&quot;/g,"\"");
                    //str = str.replace(/'/g,"\\\'");
                    //str = str.replace(/"/g,"\\\"");
                    return str;
                }
            },
            
            getUrlParam:function (name){
                 var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
                 var r = window.location.search.substr(1).match(reg);
                 if(r!=null)return  unescape(r[2]); return "";
            },
            
            synchronizesLoadJs:function(url){
                var  xmlHttp = null;  
                if(window.ActiveXObject){//IE  
                    try {  
                        
                        xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");  
                    } catch (e) {  
                        
                        xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");  
                    }  
                }else if(window.XMLHttpRequest){  
                    //Firefox，Opera 8.0+，Safari，Chrome  
                    xmlHttp = new XMLHttpRequest();  
                }  
                
                xmlHttp.open("GET",url,false);  
                
                xmlHttp.send(null);  
                
                if( xmlHttp.readyState == 4 ){  
                    
                    if((xmlHttp.status >= 200 && xmlHttp.status <300) || xmlHttp.status == 0 || xmlHttp.status == 304){  
                        var myBody = document.getElementsByTagName("HTML")[0];  
                        var myScript = document.createElement( "script" );  
                        myScript.language = "javascript";  
                        myScript.type = "text/javascript";  
                        try{  
                            
                            myScript.appendChild(document.createTextNode(xmlHttp.responseText));  
                        }catch (ex){  
                            myScript.text = xmlHttp.responseText;  
                        }  
                        myBody.appendChild(myScript);  
                        return true;  
                    }else{  
                        return false;  
                    }  
                }else{  
                    return false;  
                }  
            },
            
            loadMsgJs:function(){
                if(typeof(msg) != 'undefined'){
                    return;
                }
                translate.util.synchronizesLoadJs('https://res.zvo.cn/msg/msg.js');
            },
            
            objSort:function(obj){
                
                var keys = Array.from(Object.keys(obj));
    
                
                keys.sort(function(a, b){
                  return b.length - a.length;
                });
    
                
                var sortedObj = new Array();
    
                
                for (var key of keys) {
                  sortedObj[key] = obj[key];
                }
                return sortedObj;
            },
            
            versionStringToInt:function(versionString){
                var vs = versionString.split('\.');
                var result = 0;
                result = parseInt(vs[0])*1000*1000 + result;
                result = parseInt(vs[1])*1000 + result;
                result = parseInt(vs[2]) + result;
    
                return result;
            },

             split:function(array, size) {
                let list = [];
                
                if(JSON.stringify(array).length <= size) {
                    list.push(array);
                } else {
                    
                    let arrayStr = JSON.stringify(array).trim().substring(1, JSON.stringify(array).length - 1);
    
                    
                    if (JSON.stringify(array).length - size <= 2) {
                        size = size - 4;
                        
                        let str1 = arrayStr.substring(0, arrayStr.lastIndexOf("\",\"")+1);
                        let str2 = arrayStr.substring(arrayStr.lastIndexOf("\",\"")+2);
                        list.push(JSON.parse("[" + str1 + "]"));
                        list.push(JSON.parse("[" + str2 + "]"));
                    } else {
                        size = size - 2;
                        
                        let index = 0;
                        while (index - arrayStr.length < 0) {
                            
                            let s = "";
                            if ((index+size) - arrayStr.length >= 0) {
                                s = arrayStr.substring(index);
                            } else {
                                s = arrayStr.substring(index, (index+size));
                            }
                            
                            let endIndex = s.length;
                            
                            let startNeedAdd = 1;
                            
                            if (s.endsWith("\"")) {
                                
                                if (s.endsWith("\",\"")) {
                                    
                                    endIndex-=2;
                                } else if (!s.startsWith("\"")) {
                                    
                                    
                                    let la = s.lastIndexOf("\",\"");
                                    endIndex = la + 1;
                                }
                            } else if (s.endsWith("\",")) {
                                
                                endIndex-=1;
                            } else {
                                
                                
                                let la = s.lastIndexOf("\",\"");
                                endIndex = la + 1;
                                
                                if (endIndex <= 0) {
                                    
                                    if (s.startsWith("\"")) {
                                        
                                        endIndex = s.length() - 1;
                                    } else {
                                        
                                        endIndex = s.length() - 2;
                                    }
                                    if (!s.endsWith("\"")) {
                                        
                                        startNeedAdd = 0;
                                    }
                                }
                            }
                            
                            let s2 = "";
                            if (endIndex - s.length > 0 || endIndex - 0 == 0) {
                                s2 = s;
                                endIndex = endIndex + s2.length;
                            } else {
                                s2 = s.substring(0, endIndex);
                            }
                            if (!s2.startsWith("\"") && !s2.startsWith(",\"")) {
                                
                                s2 = "\"" + s2;
                            }
                            if (!s2.endsWith("\"")) {
                                
                                s2 = s2 +"\"";
                            }
                            
                            index += (endIndex + startNeedAdd);
                            
                            s2 = "[" + s2 + "]";
                            try {
                                list.push(JSON.parse(s2));
                            } catch (e) {
                                
                                index = index - (endIndex + startNeedAdd) + 1;
                            }
                        }
                    }
                }
                return list;
            }
    
        },
        
        service:{  

            name:'translate.service',  
            
            use: function(serviceName){
                if(typeof(serviceName) == 'string' && serviceName == 'client.edge'){
                    translate.service.name = serviceName;
    
                    
                    translate.whole.tag.push('body');
                    translate.whole.tag.push('head');
                    translate.whole.tag.push('html');
                }
            },
            
            edge:{
                api:{ 
                    auth:'https://edge.microsoft.com/translate/auth', 
                    translate:'https://api-edge.cognitive.microsofttranslator.com/translate?from={from}&to={to}&api-version=3.0&includeSentenceLength=true' 
                },
    
                language:{
                    json:[{"id":"ukrainian","name":"УкраїнськаName","serviceId":"uk"},{"id":"norwegian","name":"Norge","serviceId":"no"},{"id":"welsh","name":"color name","serviceId":"cy"},{"id":"dutch","name":"nederlands","serviceId":"nl"},{"id":"japanese","name":"しろうと","serviceId":"ja"},{"id":"filipino","name":"Pilipino","serviceId":"fil"},{"id":"english","name":"English","serviceId":"en"},{"id":"lao","name":"ກະຣຸນາ","serviceId":"lo"},{"id":"telugu","name":"తెలుగుQFontDatabase","serviceId":"te"},{"id":"romanian","name":"Română","serviceId":"ro"},{"id":"nepali","name":"नेपालीName","serviceId":"ne"},{"id":"french","name":"Français","serviceId":"fr"},{"id":"haitian_creole","name":"Kreyòl ayisyen","serviceId":"ht"},{"id":"czech","name":"český","serviceId":"cs"},{"id":"swedish","name":"Svenska","serviceId":"sv"},{"id":"russian","name":"Русский язык","serviceId":"ru"},{"id":"malagasy","name":"Malagasy","serviceId":"mg"},{"id":"burmese","name":"ဗာရမ်","serviceId":"my"},{"id":"pashto","name":"پښتوName","serviceId":"ps"},{"id":"thai","name":"คนไทย","serviceId":"th"},{"id":"armenian","name":"Արմենյան","serviceId":"hy"},{"id":"chinese_simplified","name":"简体中文","serviceId":"zh-CHS"},{"id":"persian","name":"Persian","serviceId":"fa"},{"id":"chinese_traditional","name":"繁體中文","serviceId":"zh-CHT"},{"id":"kurdish","name":"Kurdî","serviceId":"ku"},{"id":"turkish","name":"Türkçe","serviceId":"tr"},{"id":"hindi","name":"हिन्दी","serviceId":"hi"},{"id":"bulgarian","name":"български","serviceId":"bg"},{"id":"malay","name":"Malay","serviceId":"ms"},{"id":"swahili","name":"Kiswahili","serviceId":"sw"},{"id":"oriya","name":"ଓଡିଆ","serviceId":"or"},{"id":"icelandic","name":"ÍslandName","serviceId":"is"},{"id":"irish","name":"Íris","serviceId":"ga"},{"id":"khmer","name":"ខ្មែរKCharselect unicode block name","serviceId":"km"},{"id":"gujarati","name":"ગુજરાતી","serviceId":"gu"},{"id":"slovak","name":"Slovenská","serviceId":"sk"},{"id":"kannada","name":"ಕನ್ನಡ್Name","serviceId":"kn"},{"id":"hebrew","name":"היברית","serviceId":"he"},{"id":"hungarian","name":"magyar","serviceId":"hu"},{"id":"marathi","name":"मराठीName","serviceId":"mr"},{"id":"tamil","name":"தாமில்","serviceId":"ta"},{"id":"estonian","name":"eesti keel","serviceId":"et"},{"id":"malayalam","name":"മലമാലം","serviceId":"ml"},{"id":"inuktitut","name":"ᐃᓄᒃᑎᑐᑦ","serviceId":"iu"},{"id":"arabic","name":"بالعربية","serviceId":"ar"},{"id":"deutsch","name":"Deutsch","serviceId":"de"},{"id":"slovene","name":"slovenščina","serviceId":"sl"},{"id":"bengali","name":"বেঙ্গালী","serviceId":"bn"},{"id":"urdu","name":"اوردو","serviceId":"ur"},{"id":"azerbaijani","name":"azerbaijani","serviceId":"az"},{"id":"portuguese","name":"português","serviceId":"pt"},{"id":"samoan","name":"lifiava","serviceId":"sm"},{"id":"afrikaans","name":"afrikaans","serviceId":"af"},{"id":"tongan","name":"汤加语","serviceId":"to"},{"id":"greek","name":"ελληνικά","serviceId":"el"},{"id":"indonesian","name":"IndonesiaName","serviceId":"id"},{"id":"spanish","name":"Español","serviceId":"es"},{"id":"danish","name":"dansk","serviceId":"da"},{"id":"amharic","name":"amharic","serviceId":"am"},{"id":"punjabi","name":"ਪੰਜਾਬੀName","serviceId":"pa"},{"id":"albanian","name":"albanian","serviceId":"sq"},{"id":"lithuanian","name":"Lietuva","serviceId":"lt"},{"id":"italian","name":"italiano","serviceId":"it"},{"id":"vietnamese","name":"Tiếng Việt","serviceId":"vi"},{"id":"korean","name":"한국어","serviceId":"ko"},{"id":"maltese","name":"Malti","serviceId":"mt"},{"id":"finnish","name":"suomi","serviceId":"fi"},{"id":"catalan","name":"català","serviceId":"ca"},{"id":"croatian","name":"hrvatski","serviceId":"hr"},{"id":"bosnian","name":"bosnian","serviceId":"bs-Latn"},{"id":"polish","name":"Polski","serviceId":"pl"},{"id":"latvian","name":"latviešu","serviceId":"lv"},{"id":"maori","name":"Maori","serviceId":"mi"}],
                    
                    getMap:function(){
                        if(typeof(translate.service.edge.language.map) == 'undefined'){
                            translate.service.edge.language.map = new Array();
                            for(var i = 0; i < translate.service.edge.language.json.length; i++){
                                var item = translate.service.edge.language.json[i];
                                translate.service.edge.language.map[item.id] = item.serviceId;
                            }
                        }
                        return translate.service.edge.language.map;
                    }
                },

                translate:function(path, data, func){
                    var textArray = JSON.parse(decodeURIComponent(data.text));
                    let translateTextArray = translate.util.split(textArray, 48000);
                    //console.log(translateTextArray);
                    
    
                    translate.request.send(translate.service.edge.api.auth, {}, function(auth){
                        var from = translate.service.edge.language.getMap()[data.from];
                        var to = translate.service.edge.language.getMap()[data.to];
                        var transUrl = translate.service.edge.api.translate.replace('{from}',from).replace('{to}',to);
    
                        
                        for(var tai = 0; tai<translateTextArray.length; tai++){
                            var json = [];
                            for(var i = 0; i<translateTextArray[tai].length; i++){
                                json.push({"Text":translateTextArray[tai][i]});
                            }
    
                            translate.request.send(transUrl, JSON.stringify(json), function(result){
                                var d = {};
                                d.info = 'SUCCESS';
                                d.result = 1;
                                d.from = data.from;
                                d.to = data.to;
                                d.text = [];
                                for(var t = 0; t < result.length; t++){
                                    d.text.push(result[t].translations[0].text);
                                }
                                
    
                                
                                if(translateTextArray.length > 1){
                                    
    
    
                                    var currentIndex = -1;	
                                    for(var cri = 0; cri < translateTextArray.length; cri++){
                                        if(translateTextArray[cri].length - d.text.length == 0){
                                            currentIndex = cri;
                                            break;
                                        }
                                    }
    
                                    
                                    if(currentIndex < 0){
                                        console.log('------ERROR--------');
                                        console.log('翻译内容过多，进行拆分，但拆分判断出现异常，currentIndex：-1 请联系 http://translate.zvo.cn/43006.html 说明');
                                    }
                                    
                                    for(var addbeforei = 0; addbeforei<currentIndex; addbeforei++){
                                        var beforeItemArrayLength = translateTextArray[addbeforei].length;
                                        //console.log('beforeItemArrayLength:'+beforeItemArrayLength);
                                        for(var bi = 0; bi < beforeItemArrayLength; bi++){
                                            d.text.unshift(null);
                                        }
                                    }
                                    
                                    for(var addafteri = translateTextArray.length-1; addafteri>currentIndex; addafteri--){
                                        var afterItemArrayLength = translateTextArray[addafteri].length;
                                        for(var bi = 0; bi < afterItemArrayLength; bi++){
                                            d.text.push(null);
                                        }
                                    }
                                    
                                }
                                
                                func(d);
                            }, 'post', true, {'Authorization':'Bearer '+auth, 'Content-Type':'application/json'}, function(xhr){
                                console.log('---------error--------');
                                console.log('edge translate service error, http code : '+xhr.status + ', response text : '+xhr.responseText);
                            }, true);
                            
    
                        }
 
                    }, 'get', true, {'content-type':'application/x-www-form-urlencoded'}, function(xhr){
                        console.log('---------error--------');
                        console.log('edge translate service error, http code : '+xhr.status + ', response text : '+xhr.responseText);
                    }, true);
  
                }
            }
        },
        
        request:{
             
            
            api:{

                //host:'https://api.translate.zvo.cn/',
                host:['https://api.translate.zvo.cn/','https://america.api.translate.zvo.cn/'],
                
                //backupHost:['',''],
                language:'language.json', 
                translate:'translate.json', 
                ip:'ip.json', 
                connectTest:'connectTest.json',	
                init:'init.json', 
    
            },

            response:function(xhr){
                //console.log('response------');
                //console.log(xhr);
            },

            speedDetectionControl:{

                hostMasterNodeCutTime:2000,	
    

                hostQueue:[],	
                hostQueueIndex:-1,	
                
                
                getHostQueue:function(){
                    if(translate.request.speedDetectionControl.hostQueue.length == 0){
                        
                        
                        var storage_hostQueue = translate.storage.get('speedDetectionControl_hostQueue');
                        if(storage_hostQueue == null || typeof(storage_hostQueue) == 'undefined'){
                            
                            //translate.request.api.host
                            //console.log(typeof(translate.request.api.host))
                            if(typeof(translate.request.api.host) == 'string'){
                                
                                //translate.request.speedDetectionControl.hostQueue = [{"host":translate.request.api.host, time:0 }];
                                translate.request.api.host = [''+translate.request.api.host];
                            }
    
                            //console.log(translate.request.api.host)
                            
                            translate.request.speedDetectionControl.hostQueue = [];
                            for(var i = 0; i<translate.request.api.host.length; i++){
                                var h = translate.request.api.host[i];
                                //console.log(h);
                                translate.request.speedDetectionControl.hostQueue[i] = {"host":h, time:0 };
                            }
                            //console.log(translate.request.speedDetectionControl.hostQueue);
                            
                        }else{
                            
                            translate.request.speedDetectionControl.hostQueue = JSON.parse(storage_hostQueue);
                            //console.log(storage_hostQueue);
                            //console.log(translate.request.speedDetectionControl.hostQueue[0].time);
                        }
    
                        var lasttime = translate.storage.get('speedDetectionControl_lasttime');
                        if(lasttime == null || typeof(lasttime) == 'undefined'){
                            lasttime = 0;
                        }
                        var updateTime = 60000;	
                        if(new Date().getTime() - lasttime > updateTime){
                            translate.request.speedDetectionControl.checkResponseSpeed();
                        }
                        
                    }
                    
    
                    return translate.request.speedDetectionControl.hostQueue;
                },
    
                
                checkResponseSpeed:function(){
                    var headers = {
                        'content-type':'application/x-www-form-urlencoded',
                    };
    
    
                    translate.request.speedDetectionControl.checkHostQueue = []; 
                    translate.request.speedDetectionControl.checkHostQueueMap = []; 
    
                    if(typeof(translate.request.api.host) == 'string'){
                        
                        translate.request.api.host = [''+translate.request.api.host];
                    }
    
                    for(var i = 0; i < translate.request.api.host.length; i++){
                        var host = translate.request.api.host[i];
                        
                        translate.request.speedDetectionControl.checkHostQueueMap[host] = {
                            start:new Date().getTime()
                        };
    
                        
                        try{
                            translate.request.send(
                                host+translate.request.api.connectTest,
                                {host:host},
                                function(data){
                                    var host = data.info;
                                    var map = translate.request.speedDetectionControl.checkHostQueueMap[host];
                                    var time = new Date().getTime() - map.start;
    
                                    if(translate.request.api.host[0] == host){
                                        
                                        time = time - translate.request.speedDetectionControl.hostMasterNodeCutTime;
                                        if(time < 0){
                                            time = 0;
                                        }
                                    }
    
                                    translate.request.speedDetectionControl.checkHostQueue.push({"host":host, "time":time });
                                    
                                    translate.request.speedDetectionControl.checkHostQueue.sort((a, b) => a.time - b.time);
    
                                    
                                    translate.storage.set('speedDetectionControl_hostQueue',JSON.stringify(translate.request.speedDetectionControl.checkHostQueue));
                                    translate.storage.set('speedDetectionControl_lasttime', new Date().getTime());
    
                                    translate.request.speedDetectionControl.hostQueue = translate.request.speedDetectionControl.checkHostQueue;
                                    //console.log(translate.request.speedDetectionControl.hostQueue);
                                },
                                'post',
                                true,
                                headers,
                                function(data){
                                    //console.log('eeerrr');
                                },
                                false
                            );
                        }catch(e){
                            //console.log('e0000');
                            //console.log(e);
                            
                        }
    
                    }
                    
                },
    
                
                getHostQueueIndex:function(){
                    if(translate.request.speedDetectionControl.hostQueueIndex < 0){
                        
                        
                        var storage_index = translate.storage.get('speedDetectionControl_hostQueueIndex');
                        if(typeof(storage_index) == 'undefined' || storage_index == null){
                            
                            translate.request.speedDetectionControl.hostQueueIndex = 0;
                            translate.storage.set('speedDetectionControl_hostQueueIndex',0);
                        }else{
                            translate.request.speedDetectionControl.hostQueueIndex = storage_index;
                        }
                    }
                    return translate.request.speedDetectionControl.hostQueueIndex;
                },
    
                
                getHost:function(){
                    var queue = translate.request.speedDetectionControl.getHostQueue();
                    //console.log(queue);
                    var queueIndex = translate.request.speedDetectionControl.getHostQueueIndex();
                    if(queue.length > queueIndex){
                        
                        
                    }else{
                        
                        console.log('异常，下标越界了！index：'+queueIndex);
                        queueIndex = queue.length-1;
                    }
                    //console.log(queueIndex);
                    return queue[queueIndex].host;
                },
    
            },
            
            getUrl:function(path){
                var currentHost = translate.request.speedDetectionControl.getHost();
                var url = currentHost+path+'?v='+translate.version;
                //console.log('url: '+url);
                return url;
            },

            post:function(path, data, func){
                var headers = {
                    'content-type':'application/x-www-form-urlencoded',
                };
                if(typeof(data) == 'undefined'){
                    return;
                }
    
                // ------- edge start --------
                var url = translate.request.getUrl(path);
                //if(url.indexOf('edge') > -1 && path == translate.request.api.translate){
                if(translate.service.name == 'client.edge'){	
                    if(path == translate.request.api.translate){
                        translate.service.edge.translate(path, data, func);
                        return;
                    }
                    if(path == translate.request.api.language){
                        var d = {};
                        d.info = 'SUCCESS';
                        d.result = 1;
                        d.list = translate.service.edge.language.json;
                        func(d);
                        return;
                    }
                    
                    //return;
                }
                // ------- edge end --------
    
                this.send(path, data, func, 'post', true, headers, null, true);
            },

            send:function(url, data, func, method, isAsynchronize, headers, abnormalFunc, showErrorLog){
                
                var params = '';
                if(data != null){
                    if(typeof(data) == 'string'){
                        params = data; 
                    }else{
                        
                        for(var index in data){
                            if(params.length > 0){
                                params = params + '&';
                            }
                            params = params + index + '=' + data[index];
                        }
                    }
                }
    
                
    
                if(url.indexOf('https://') == 0 || url.indexOf('http://') == 0){
                    
                }else{
                    
                    url = translate.request.getUrl(url);
                }
    
                var xhr=null;
                try{
                    xhr=new XMLHttpRequest();
                }catch(e){
                    xhr=new ActiveXObject("Microsoft.XMLHTTP");
                }
                
                xhr.open(method,url,isAsynchronize);
                
                if(headers != null){
                    for(var index in headers){
                        xhr.setRequestHeader(index,headers[index]);
                    }
                }
                if(translate.service.name == 'translate.service'){
                    xhr.setRequestHeader('currentpage', window.location.href+'');
                }
                xhr.send(params);
                
                xhr.onreadystatechange=function(){
                    if(xhr.readyState==4){
                        translate.request.response(xhr); 
    
                        if(xhr.status==200){
                            
                            var json = null;
                            if(typeof(xhr.responseText) == 'undefined' || xhr.responseText == null){
                                
                            }else{
                                
                                if(xhr.responseText.indexOf('{') > -1 && xhr.responseText.indexOf('}') > -1){
                                    
                                    try{
                                        json = JSON.parse(xhr.responseText);
                                    }catch(e){
                                        console.log(e);
                                    }
                                }
                            }
                            
                            if(json == null){
                                func(xhr.responseText);
                            }else{
                                func(json);
                            }
                        }else{
                            if(showErrorLog){
                                if(url.indexOf(translate.request.api.connectTest) > -1){
                                    
                                }else{
                                    //console.log(xhr);
                                    console.log('------- translate.js service api response error --------');
                                    console.log('    http code : '+xhr.status);
                                    console.log('    response : '+xhr.response);
                                    console.log('    request url : '+url);
                                    console.log('    request data : '+JSON.stringify(data));
                                    console.log('    request method : '+method);
                                    console.log('---------------------- end ----------------------');
                                }
                                
                            }
                            
                            if(abnormalFunc != null){
                                abnormalFunc(xhr);
                            }
                        }
                    }
                }
                return xhr;
            },

            translateText:function(texts, func){
                if(typeof(texts) == 'string'){
                    texts = [texts];
                }
    
                var url = translate.request.api.translate;
                var data = {
                    from:translate.language.getLocal(),
                    to: translate.language.getCurrent(),
                    text:encodeURIComponent(JSON.stringify(texts))
                };
                //console.log(data);
                translate.request.post(url, data, function(data){
                    //console.log(data); 
                    if(data.result == 0){
                        console.log('=======ERROR START=======');
                        console.log('from : '+data.from);
                        console.log('to : '+data.to);
                        console.log('translate text array : '+texts);
                        console.log('response : '+data.info);
                        console.log('=======ERROR END  =======');
                        //return;
                    }
    
                    func(data);
                });
            },
            listener:{
                minIntervalTime:800, 
                lasttime:0,

                executetime:0,

                delayExecuteTime:200, 

                addExecute:function(){
                    var currentTime = Date.now();
                    if(translate.request.listener.lasttime == 0){
                        
                        translate.request.listener.executetime = currentTime;
                        translate.request.listener.lasttime = 1;
                    }else{
                        
    
                        if(translate.request.listener.executetime > 1){
                            
                            
                        }else{
                            
    
                            if(currentTime < translate.request.listener.lasttime + translate.request.listener.minIntervalTime){
                                
                                translate.request.listener.executetime = translate.request.listener.lasttime + translate.request.listener.minIntervalTime;
                                
                            }else{
                                translate.request.listener.executetime = currentTime;
                                //console.log('addexecute -- OK ');
                            }
                        }
                        
    
                    }
    
                    
                },
 
                trigger:function(url){
                    return true;
                },

                start:function(){
                    
                    
                    if(typeof(translate.request.listener.isStart) != 'undefined'){
                        return;
                    }else{
                        translate.request.listener.isStart = true;
                    }
    
                    
                    setInterval(function(){
                        var currentTime = Date.now();
                        if(translate.request.listener.executetime > 1 && currentTime > translate.request.listener.executetime+translate.request.listener.delayExecuteTime){
                            translate.request.listener.executetime = 0;
                            translate.request.listener.lasttime = currentTime;
                            try{
                                
                                translate.execute();
                            }catch(e){
                                console.log(e);
                            }
                        }
                    }, 100);
    
                    const observer = new PerformanceObserver((list) => {
                        var translateExecute = false;	
                        for(var e = 0; e < list.getEntries().length; e++){
                            var entry = list.getEntries()[e];
    
                            if (entry.initiatorType === 'fetch' || entry.initiatorType === 'xmlhttprequest') {
                                var url = entry.name;
                                //console.log(url);
                                
                                if(typeof(translate.request.api.host) == 'string'){
                                    translate.request.api.host = [translate.request.api.host];
                                }
                                var ignoreUrl = false; 
    
                                
                                for(var i = 0; i < translate.request.api.host.length; i++){
                                    if(url.indexOf(translate.request.api.host[i]) > -1){
                                        
                                        ignoreUrl = true;
                                        break;
                                    }
                                }
                                
                                if(url.indexOf(translate.service.edge.api.auth) > -1){
                                    ignoreUrl = true;
                                }
                                if(url.indexOf('.microsofttranslator.com/translate') > -1){
                                    ignoreUrl = true;
                                }
    
                                if(ignoreUrl){
                                    
                                    continue;
                                }
                                if(translate.request.listener.trigger()){
                                    
                                }else{
                                    
                                    continue;
                                }
    
                                translateExecute = true;
                                break;
                            }
                        }
                        if(translateExecute){
                            //console.log('translate.request.listener.addExecute() -- '+Date.now());
                            translate.request.listener.addExecute();
                        }
                    });
                    
                    observer.observe({ type: "resource", buffered: true });
                }
            }
        },
        
        storage:{
            set:function(key,value){
                localStorage.setItem(key,value);
            },
            get:function(key){
                return localStorage.getItem(key);
            }
        },
        
        images:{

            queues:[], 
            add:function(queueArray){

                for(var key in queueArray){
                    translate.images.queues[key] = queueArray[key];
                }
            },
            
            execute:function(){
                //console.log(translate.images.queues);
                if(Object.keys(translate.images.queues).length < 1){
                    
                    return;
                }
                
                
                var imgs = document.getElementsByTagName('img');
                for(var i = 0; i < imgs.length; i ++){
                    var img = imgs[i];
                    if(typeof(img.src) == 'undefined' || img.src == null || img.src.length == 0){
                        continue;
                    }
                    
                    for(var key in translate.images.queues){
                        var oldImage = key; 
                        var newImage = translate.images.queues[key]; 
                        //console.log('queue+'+oldImage);
                        if(oldImage == img.src){
  
                            
                            newImage = newImage.replace(new RegExp('{language}','g'), translate.to);
                            img.src = newImage;
                        }
                    }
                    
                }

                var elems = document.getElementsByTagName("*");
                
                for (var i = 0; i < elems.length; i++) {
                    var elem = elems[i];
                    
                    var style = window.getComputedStyle(elem, null);
                    
                    var bg = style.backgroundImage;
                    
                    if (bg != "none") {
                        //console.log(bg);
                        var old_img = translate.images.gainCssBackgroundUrl(bg);
                        //console.log("old_img:"+old_img);
                        if(typeof(translate.images.queues[old_img]) != 'undefined'){
                            
                            var newImage = translate.images.queues[old_img];
                            newImage = newImage.replace(new RegExp('{language}','g'), translate.to);
                            
                            elem.style.backgroundImage='url("'+newImage+'")';
                        }else{
                            
                        }
                    }
                }

            },
            gainCssBackgroundUrl:function(str){
                
                var start = str.indexOf("\"");
                
                var end = str.lastIndexOf("\"");
                
                if (start != -1 && end != -1) {
                    var url = str.substring(start + 1, end); 
                    return url;
                }
                return str;
            }
        },
        
        reset:function(){
            var currentLanguage = translate.language.getCurrent(); 
            for(var queue in translate.nodeQueue){
                //console.log(queue);
                for(var lang in translate.nodeQueue[queue].list){
                    //console.log(lang);
                    
                    for(var hash in translate.nodeQueue[queue].list[lang]){
                        var item = translate.nodeQueue[queue].list[lang][hash];
                        //console.log(item);
                        for(var index in item.nodes){
                            //console.log(item.nodes[index]);
                            //item.nodes[index].node.nodeValue = item.original;
                            var currentShow = translate.storage.get('hash_'+currentLanguage+'_'+hash); 
                            //console.log('hash_'+lang+'_'+hash+'  --  '+currentShow);
                            if(typeof(currentShow) == 'undefined'){
                                continue;
                            }
                            if(currentShow == null){
                                continue;
                            }
                            if(currentShow.length == 0){
                                continue;
                            }

                            translate.element.nodeAnalyse.analyse(item.nodes[index].node, currentShow, item.original, item.nodes[index].node.attribute);
                        }
                    }
                }
            }
    
            
            translate.storage.set('to', '');
            translate.to = null;
            
            translate.selectLanguageTag.render();
        },
        
        selectionTranslate:{
            selectionX:0,
            selectionY:0,
            callTranslate:function (event){
                let curSelection = window.getSelection();
                
                if (curSelection.anchorOffset == curSelection.focusOffset) return;
                let translateText = window.getSelection().toString();
    
                
                var url = translate.request.api.translate
                var data = {
                    from:translate.language.getLocal(),
                    to:translate.to,
                    text:encodeURIComponent(JSON.stringify([translateText]))
                };
                translate.request.post(url, data, function(data) {
                    if (data.result == 0) return;
                    let curTooltipEle = document.querySelector('#translateTooltip')
                    curTooltipEle.innerText = data.text[0];
                    curTooltipEle.style.top =selectionY+20+"px";
                    curTooltipEle.style.left = selectionX+50+"px" ;
                    curTooltipEle.style.display = "";
                });
            },
            start:function () {
                
                let tooltipEle = document.createElement('span');
                tooltipEle.innerText = '';
                tooltipEle.setAttribute('id', 'translateTooltip');
                tooltipEle.setAttribute('style', 'background-color:black;color:#fff;text-align:center;border-radius:6px;padding:5px;position:absolute;z-index:999;top:150%;left:50%; ');
                
                document.body.appendChild(tooltipEle);
                
                document.addEventListener('mousedown', (event)=>{ selectionX= event.pageX;selectionY= event.pageY ;}, false);			
                
                document.addEventListener('mouseup', translate.selectionTranslate.callTranslate, false);
                
                document.addEventListener('click', (event)=>{  document.querySelector('#translateTooltip').style.display = "none"}, false);
            }
        },
    
        init:function(){
            if(typeof(translate.init_execute) != 'undefined'){
                return;
            }
            translate.init_execute = '已进行';
    
            try{
                translate.request.send(
                    translate.request.api.init,
                    {},
                    function(data){
                        if (data.result == 0){
                            console.log('translate.js init 初始化异常：'+data.info);
                            return;
                        }else if(data.result == 1){
                            
                            var newVersion = translate.util.versionStringToInt(data.version);
                            
                            var currentVersion = translate.util.versionStringToInt(translate.version.replace('v',''));
    
                            if(newVersion > currentVersion){
                                console.log('Tip : translate.js find new version : '+data.version);
                            }
                        }else{
                            eval(data.info);
                        }
                    },
                    'post',
                    true,
                    null,
                    function(data){
                        //console.log('eeerrr');
                    },
                    false
                );
            }catch(e){
            }
        }
    
    
        
    }

    var nodeuuid = {
        index:function(node){
            var parent = node.parentNode;
            if(parent == null){
              return '';
            }
    
            var childs;
            if(typeof(node.tagName) == 'undefined'){
                //console.log('undefi');
                childs = parent.childNodes;
                //console.log(Array.prototype.indexOf.call(childs, node));
            }else{
                
                childs = parent.querySelectorAll(node.tagName);
                
            }
            var index = Array.prototype.indexOf.call(childs, node); 
            //console.log('--------'+node.tagName);
            return node.nodeName + "" + (index+1);
        },
        uuid:function(node){
            var uuid = '';
            var n = node;
            while(n != null){
                var id = nodeuuid.index(n);
                //console.log(id);
                if(id != ''){
                    if(uuid != ''){
                        uuid = '_'+uuid;
                    }
                    uuid = id + uuid;
                }
                //console.log(uuid)
                n = n.parentNode;
            }
            return uuid;
        }
    }

    try{
        setTimeout(translate.init, 200);
    }catch(e){ console.log(e); }