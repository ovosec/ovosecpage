
var translate = {
    /*
     * current version
     */
    version: '3.1.5.20240318',
    useVersion: 'v2',	//The currently used version uses v2 by default. You can use setUseVersion2(); // to set the use of v2, which has been abandoned. It is mainly used to distinguish whether it is the v1 version. The v2 and v3 versions are used in the same way.
    setUseVersion2: function () {
        translate.useVersion = 'v2';
        console.log('Tip: Since version v2.10, the default version used is V2 (current version: ' + translate.version + '), and translate.setUseVersion2() no longer needs to be added. Of course, adding it does not matter, just adding it is exactly the same as not adding it.');

    },

    translate: null,
    includedLanguages: 'zh-CN,zh-TW,en',

    resourcesUrl: '//res.zvo.cn/translate',


    selectLanguageTag: {

        documentId: 'translate',
        /* Whether to display the select language selection box, true will display; false will not display. Default is true */
        show: true,
        languages: '',
        alreadyRender: false, //Whether it has been rendered currently, true is added in v2.2
        selectOnChange: function (event) {
            var language = event.target.value;
            translate.changeLanguage(language);
        },
        //Redraw the select language drop-down selection. For example, after secondary development of translate.js, you manually set translate.to, but after manual changes, the changes will not be automatically made in the select language selection box. This requires manual redrawing of the select language selection drop-down selection box.
        refreshRender: function () {
            // Get element
            let element = document.getElementById(translate.selectLanguageTag.documentId + "SelectLanguage");

            // Delete element
            if (element) {
                element.parentNode.removeChild(element);
            }

            //Set to non-rendered state to allow rendering
            translate.selectLanguageTag.alreadyRender = false;

            translate.selectLanguageTag.render();
        },
        render: function () { //v2 increase
            if (translate.selectLanguageTag.alreadyRender) {
                return;
            }
            translate.selectLanguageTag.alreadyRender = true;

            //Determine if the select language is not displayed, just hide it directly.
            if (!translate.selectLanguageTag.show) {
                return;
            }

            //Determine whether the id of translate exists. If it does not exist, create one.
            if (document.getElementById(translate.selectLanguageTag.documentId) == null) {
                var body_trans = document.getElementsByTagName('body')[0];
                var div = document.createElement("div");  //Create a script tag
                div.id = translate.selectLanguageTag.documentId;
                body_trans.appendChild(div);
            } else {
                //Exists, then check whether the select exists. If it exists, do not create it again.
                if (document.getElementById(translate.selectLanguageTag.documentId + 'SelectLanguage') != null) {
                    //If select exists, it will not be created again.
                    return;
                }
            }

            //Load supported language libraries from the server
            translate.request.post(translate.request.api.language, {}, function (data) {
                if (data.result == 0) {
                    console.log('load language list error : ' + data.info);
                    return;
                }

                //select onchange event
                var onchange = function (event) { translate.selectLanguageTag.selectOnChange(event); }

                //Create select tag
                var selectLanguage = document.createElement("select");
                selectLanguage.id = translate.selectLanguageTag.documentId + 'SelectLanguage';
                selectLanguage.className = translate.selectLanguageTag.documentId + 'SelectLanguage';
                for (var i = 0; i < data.list.length; i++) {
                    var option = document.createElement("option");
                    option.setAttribute("value", data.list[i].id);

                    //Determine which ones are allowed in selectLanguageTag.languages

                    if (translate.selectLanguageTag.languages.length > 0) {
                        //Set custom display language

                        //Convert all to lower case
                        var langs_indexof = (',' + translate.selectLanguageTag.languages + ',').toLowerCase();
                        //console.log(langs_indexof)
                        if (langs_indexof.indexOf(',' + data.list[i].id.toLowerCase() + ',') < 0) {
                            //Not found, then this language will not be displayed, call up
                            continue
                        }
                    }

                    /*Determine which language to select by default*/
                    if (translate.to != null && typeof (translate.to) != 'undefined' && translate.to.length > 0) {
                        //If the target language is set, then judge and display the target language.

                        if (translate.to == data.list[i].id) {
                            option.setAttribute("selected", 'selected');
                        }
                    } else {
                        //If the target language is not set, the current local language will be selected by default.
                        if (data.list[i].id == translate.language.getLocal()) {
                            option.setAttribute("selected", 'selected');
                        }
                    }

                    option.appendChild(document.createTextNode(data.list[i].name));
                    selectLanguage.appendChild(option);
                }
                //Add onchange event
                if (window.addEventListener) { // Mozilla, Netscape, Firefox 
                    selectLanguage.addEventListener('change', onchange, false);
                } else { // IE 
                    selectLanguage.attachEvent('onchange', onchange);
                }
                //Add select to web page display
                document.getElementById(translate.selectLanguageTag.documentId).appendChild(selectLanguage);

            });


        }
    },


    localLanguage: 'zh-CN',


    googleTranslateElementInit: function () {
        var selectId = '';
        if (document.getElementById('translate') != null) {	// && document.getElementById('translate').innerHTML.indexOf('translateSelectLanguage') > 0
            //Already created, exists
            selectId = 'translate';
        }

        translate.translate = new google.translate.TranslateElement(
            {
                //This parameter is useless, please ignore it
                pageLanguage: 'zh-CN',
                //There are 80 language options in total. This is the language you need to translate. For example, if you only need to translate into Vietnamese and English, just write en, vi here.
                includedLanguages: translate.selectLanguageTag.languages,
                //Select the language style. This is the panel and the drop-down box style. I can’t remember the specific ones. I can’t find the API~~  
                layout: 0,
            },
            selectId //The id of the trigger button
        );
    },

    /**
     * Perform translation operations
     * Deprecated, used by v1
     */
    execute_v1: function () {
        console.log('=====ERROR======');
        console.log('The v1 version has been discontinued since 2022. Please use the latest V3 version and refer to: http://translate.zvo.cn/41162.html');
    },

    /**
     * Set a cookie with an expiration date of one year.
     * @param name
     * @param value
     * * Deprecated, used by v1
     */
    setCookie: function (name, value) {
        var cookieString = name + "=" + escape(value);
        document.cookie = cookieString;
    },

    //Get cookies. If it is not saved, an empty string is returned.
    //* Deprecated, used by v1
    getCookie: function (name) {
        var strCookie = document.cookie;
        var arrCookie = strCookie.split("; ");
        for (var i = 0; i < arrCookie.length; i++) {
            var arr = arrCookie[i].split("=");
            if (arr[0] == name) {
                return unescape(arr[1]);
            }
        }
        return "";
    },

    currentLanguage: function () {
        //translate.check();
        var cookieValue = translate.getCookie('googtrans');
        if (cookieValue.length > 0) {
            return cookieValue.substr(cookieValue.lastIndexOf('/') + 1, cookieValue.length - 1);
        } else {
            return translate.localLanguage;
        }
    },


    changeLanguage: function (languageName) {
        //Determine whether v1.x is used
        var v1 = ',en,de,hi,lt,hr,lv,ht,hu,zh-CN,hy,uk,mg,id,ur,mk,ml,mn,af,mr,uz,ms,el,mt,is,it,my,es,et,eu,ar,pt-PT,ja,ne,az,fa,ro,nl,en-GB,no,be,fi,ru,bg,fr,bs,sd,se,si,sk,sl,ga,sn,so,gd,ca,sq,sr,kk,st,km,kn,sv,ko,sw,gl,zh-TW,pt-BR,co,ta,gu,ky,cs,pa,te,tg,th,la,cy,pl,da,tr,';
        if (v1.indexOf(',' + languageName + ',') > -1) {
            //Using v1.x
            console.log('You are using the v1 version of the language switching method. v1 will be abandoned in 2021, please change to v2, refer to the document: http://translate.zvo.cn/41549.html');
            translate.check();

            var googtrans = '/' + translate.localLanguage + '/' + languageName;

            //First clear the settings of the pan-analytic domain name
            var s = document.location.host.split('.');
            if (s.length > 2) {
                var fanDomain = s[s.length - 2] + '.' + s[s.length - 1];
                document.cookie = 'googtrans=;expires=' + (new Date(1)) + ';domain=' + fanDomain + ';path=/';
                document.cookie = 'googtrans=' + googtrans + ';domain=' + fanDomain + ';path=/';
            }

            translate.setCookie('googtrans', '' + googtrans);
            location.reload();
            return;
        }

        //Using v2.x or higher
        //translate.setUseVersion2();
        translate.useVersion = 'v2';
        //Determine whether this is the first translation. If so, there is no need to refresh the page. true means it needs to be refreshed, not the first translation.
        if (translate.to != null && translate.to.length > 0) {
            //The current target value has a value, and the target language is inconsistent with the current language, then the current one has been translated
            if (translate.to != translate.language.getLocal()) {
                var isReload = true; //Mark to refresh the page
            }
        }


        translate.to = languageName;
        translate.storage.set('to', languageName); //Set the target translation language

        if (isReload) {
            location.reload(); //Refresh the page
        } else {
            //No need to refresh, translate directly
            translate.execute(); //Translation
        }
    },


    check: function () {
        if (window.location.protocol == 'file:') {
            console.log('\r\n---WARNING----\r\ntranslate.js active translation component self-check exception, the current protocol is the file protocol, the translation component must be under the normal online http, https protocol to use the translation function normally\r\n----------------');
        }
    },


    /**************************** v2.0 */
    to: '', //The target language to translate to, such as english, chinese_simplified
    autoDiscriminateLocalLanguage: false,
    documents: [], //Specify a collection of elements to be translated. Multiple settings can be set, such as: document.getElementsByTagName('DIV')

    inProgressNodes: [],
    //Some things ignored during translation, such as ignoring a certain tag, a certain class, etc.
    ignore: {
        tag: ['style', 'script', 'link', 'pre', 'code'],
        class: ['ignore', 'translateSelectLanguage'],
        id: [],
        /*
            Pass in an element and determine whether this element is an ignored element. This will look for the parent class to see if the parent class is included in the ignored ones.
            return true is ignored, false is no longer ignored
        */
        isIgnore: function (ele) {
            if (ele == null || typeof (ele) == 'undefined') {
                return false;
            }

            var parentNode = ele;
            var maxnumber = 100;	//Maximum number of loops to avoid infinite loops
            while (maxnumber-- > 0) {
                if (parentNode == null || typeof (parentNode) == 'undefined') {
                    //There is no parent element anymore
                    return false;
                }

                //Judge Tag
                //var tagName = parentNode.nodeName.toLowerCase(); //tag name, lowercase
                var nodename = translate.element.getNodeName(parentNode).toLowerCase(); //tag name, lowercase
                if (nodename.length > 0) {
                    //There is nodename
                    if (nodename == 'body' || nodename == 'html' || nodename == '#document') {
                        //The upper-level element is already a top-level element, so it definitely isn’t.
                        return false;
                    }
                    if (translate.ignore.tag.indexOf(nodename) > -1) {
                        //Found that ignore.tag is currently an ignored tag
                        return true;
                    }
                }


                //Determine class name
                if (parentNode.className != null) {
                    var classNames = parentNode.className;
                    if (classNames == null || typeof (classNames) != 'string') {
                        continue;
                    }
                    //console.log('className:'+typeof(classNames));
                    //console.log(classNames);
                    classNames = classNames.trim().split(' ');
                    for (var c_index = 0; c_index < classNames.length; c_index++) {
                        if (classNames[c_index] != null && classNames[c_index].trim().length > 0) {
                            //Valid class name for judgment
                            if (translate.ignore.class.indexOf(classNames[c_index]) > -1) {
                                //Found that ignore.class is currently an ignored class
                                return true;
                            }
                        }
                    }
                }

                //Determine id
                if (parentNode.id != null && typeof (parentNode.id) != 'undefined') {
                    //Valid class name for judgment
                    if (translate.ignore.id.indexOf(parentNode.id) > -1) {
                        //Found that ignore.id is currently an ignored id
                        return true;
                    }
                }

                //The element assigned to the judgment is moved up one level
                parentNode = parentNode.parentNode;
            }

            return false;
        }
    },
    //Custom translation terms
    nomenclature: {
        data: new Array(),

        old_Data: [],

        set: function (data) {
            alert('请将 translate.nomenclature.set 更换为 append，具体使用可参考： https://github.com/xnx3/translate ');
        },
        append: function (from, to, properties) {
            if (typeof (translate.nomenclature.data[from]) == 'undefined') {
                translate.nomenclature.data[from] = new Array();
            }
            if (typeof (translate.nomenclature.data[from][to]) == 'undefined') {
                translate.nomenclature.data[from][to] = new Array();
            }

            //Analyze properties
            //Split by row
            var line = properties.split('\n');
            //console.log(line)
            for (var line_index = 0; line_index < line.length; line_index++) {
                var item = line[line_index].trim();
                if (item.length < 1) {
                    //Blank lines, ignored
                    continue;
                }
                var kvs = item.split('=');
                //console.log(kvs)
                if (kvs.length != 2) {
                    //If it is not composed of key and value, ignore it.
                    continue;
                }
                var key = kvs[0].trim();
                var value = kvs[1].trim();
                //console.log(key)
                if (key.length == 0 || value.length == 0) {
                    //If one of them is empty, ignore it
                    continue;
                }
                //Join, if it has been added before, it will be overwritten
                translate.nomenclature.data[from][to][key] = value;
                //console.log(local+', '+target+', key:'+key+', value:'+value);
            }

            //After appending, sort the entire object array, with the larger keys in front.
            translate.nomenclature.data[from][to] = translate.util.objSort(translate.nomenclature.data[from][to]);

        },
        //Get the currently defined glossary
        get: function () {
            return translate.nomenclature.data;
        },
        //Replace the incoming str characters, replace the custom terms in it in advance, and then return the replaced result
        dispose: function (str) {
            if (str == null || str.length == 0) {
                return str;
            }

            if (typeof (translate.nomenclature.data[translate.language.getLocal()]) == 'undefined' || typeof (translate.nomenclature.data[translate.language.getLocal()][translate.to]) == 'undefined') {
                return str;
            }
            //console.log(str)
            for (var originalText in translate.nomenclature.data[translate.language.getLocal()][translate.to]) {
                var translateText = translate.nomenclature.data[translate.language.getLocal()][translate.to][originalText];
                if (typeof (translateText) == 'function') {
                    //Perform exception preprocessing callout
                    continue;
                }

                var index = str.indexOf(originalText);
                if (index > -1) {
                    //console.log('find -- '+originalText+', \t'+translateText);
                    if (translate.language.getLocal() == 'english') {
                        //If the local language is English, then you also need to judge its front and back to avoid for example replacing is in display and forcibly splitting the word.

                        //Determine whether the word precedes it
                        var beforeChar = '';	//preceding character
                        if (index == 0) {
                            //There are no other characters in front, so the front is appropriate.
                        } else {
                            //If there are other characters in front of it, determine what character it is. If it is English, then this cannot be split and should be ignored.
                            beforeChar = str.substr(index - 1, 1);
                            //console.log('beforeChar:'+beforeChar+', str:'+str)
                            var lang = translate.language.getCharLanguage(beforeChar);
                            //console.log(lang);
                            if (lang == 'english') {
                                //Transfer out, cannot demolish by force
                                continue;
                            }
                        }

                        //Determine whether the word is followed by
                        var afterChar = ''; //the following characters
                        if (index + originalText.length == str.length) {
                            //There are no other characters at the back, so the front is suitable.
                            //console.log(originalText+'， meile '+str)
                        } else {
                            //If there are other characters behind it, determine what character it is. If it is English, then this cannot be split and should be ignored.
                            afterChar = str.substr(index + originalText.length, 1);
                            var lang = translate.language.getCharLanguage(afterChar);
                            if (lang == 'english') {
                                //Jump out, cannot be forced to demolish
                                continue;
                            }
                        }

                        str = str.replace(new RegExp(beforeChar + originalText + afterChar, 'g'), beforeChar + translateText + afterChar);
                    } else {
                        //Other situations, such as Chinese, Chinese and other languages
                        str = str.replace(new RegExp(originalText, 'g'), translateText);
                    }

                }
            }

            return str;
        },

    },
    office: {

        export: function () {
            if (translate.language.getLocal() == translate.language.getCurrent()) {
                alert('The local language matches the target language; no export is required.');
                return;
            }

            var text = '';
            for (var uuid in translate.nodeQueue) {
                var queueValue = translate.nodeQueue[uuid];
                for (var lang in translate.nodeQueue[uuid].list) {
                    //console.log('------'+lang)
                    if (typeof (lang) != 'string' || lang.length < 1) {
                        continue;
                    }
                    //if(translate.language.getLocal() == lang){
                    //console.log(translate.nodeQueue[uuid].list[lang]);
                    for (var hash in translate.nodeQueue[uuid].list[lang]) {
                        text = text + '\n' + translate.nodeQueue[uuid].list[lang][hash].original + '=' + translate.storage.get('hash_' + translate.language.getCurrent() + '_' + hash);
                    }
                    //}
                }

            }

            if (text.length > 0) {
                //There is content
                text = 'translate.office.append(\'' + translate.language.getCurrent() + '\',`' + text + '\n`);';
                //console.log(text);
                translate.util.loadMsgJs();
                msg.popups({
                    text: '<textarea id="msgPopupsTextarea" style="width:100%; height:100%; color: black; padding: 8px;">loaing...</textarea>',
                    width: '750px',
                    height: '600px',
                    padding: '1px',
                });
                document.getElementById('msgPopupsTextarea').value = text;
            } else {
                msg.alert('No valid content!');
            }


        },
        //Show export panel
        showPanel: function () {
            let panel = document.createElement('div');
            panel.setAttribute('id', 'translate_export');
            panel.setAttribute('class', 'ignore');

            //export button
            let button = document.createElement('button');
            button.onclick = function () {
                translate.office.export();
            };
            button.innerHTML = 'Export configuration information';
            button.setAttribute('style', 'margin-left: 72px; margin-top: 30px; margin-bottom: 20px; font-size: 25px; background-color: blue; padding: 15px; padding-top: 3px; padding-bottom: 3px; border-radius: 3px;');
            panel.appendChild(button);

            //Description text
            let textdiv = document.createElement('div');
            textdiv.innerHTML = '1. First switch the current language to the language you want to translate<br/>2. Click the export button to export the translation configuration information<br/>3. Paste the exported configuration information into the code to complete<br/><a href="asd" target="_black" style="color: aliceblue;">Click here to view detailed usage instructions</a>';
            textdiv.setAttribute('style', 'font-size: 14px; padding: 12px;');

            panel.appendChild(textdiv);

            panel.setAttribute('style', 'background-color: black; color: #fff; width: 320px; height: 206px; position: fixed; bottom: 50px; right: 50px;');
            //Add the element node to the body element node to become its child node, and place it at the end of the existing child node of body
            document.body.appendChild(panel);

            translate.util.loadMsgJs();
        },
        append: function (to, properties) {
            //console.log(properties)
            //Analyze properties
            //Split by row
            var line = properties.split('\n');
            //console.log(line)
            for (var line_index = 0; line_index < line.length; line_index++) {
                var item = line[line_index].trim();
                if (item.length < 1) {
                    //Blank lines, ignored
                    continue;
                }
                var kvs = item.split('=');
                //console.log(kvs)
                if (kvs.length != 2) {
                    //If it is not composed of key and value, ignore it.
                    continue;
                }
                var key = kvs[0];
                var value = kvs[1];
                //console.log(key)
                if (key.length == 0 || value.length == 0) {
                    //If one of them is empty, ignore it
                    continue;
                }
                //console.log('set---'+key);
                //Join store
                translate.storage.set('hash_' + to + '_' + translate.util.hash(key), value);
            }
        },
    },
    setAutoDiscriminateLocalLanguage: function () {
        translate.autoDiscriminateLocalLanguage = true;
    },
    nodeQueue: {},

    setDocuments: function (documents) {
        if (documents == null || typeof (documents) == 'undefined') {
            return;
        }

        if (typeof (documents.length) == 'undefined') {
            //Not an array, but a single element
            translate.documents[0] = documents;
        } else {
            //is an array, assigned directly
            translate.documents = documents;
        }
        //Clear the translation queue and retrieve it again during the next translation
        translate.nodeQueue = {};
        //console.log('set documents , clear translate.nodeQueue');
    },
    //Get the elements of the currently specified translation (array form [document,document,...])
    //If the user does not use setDocuments specified, then return the entire web page
    getDocuments: function () {
        if (translate.documents != null && typeof (translate.documents) != 'undefined' && translate.documents.length > 0) {
            // setDocuments specified
            return translate.documents;
        } else {
            //If it is not specified using setDocuments, then it is the entire web page.
            return document.all; //Translate all
        }
    },
    listener: {

        isStart: false,

        start: function () {

            translate.temp_linstenerStartInterval = setInterval(function () {
                if (document.readyState == 'complete') {
                    //DOM is loaded and started.
                    clearInterval(translate.temp_linstenerStartInterval);//stop
                    translate.listener.addListener();
                }
            }, 300);


        },
        //Add monitoring and start monitoring. Do not call this directly, you need to use start() above to start it.
        addListener: function () {
            translate.listener.isStart = true; //Record that the startup method has been executed

            // Observer configuration (what changes need to be observed)
            translate.listener.config = { attributes: true, childList: true, subtree: true, characterData: true, attributeOldValue: true, characterDataOldValue: true };
            // callback function executed when a change is observed
            translate.listener.callback = function (mutationsList, observer) {
                var documents = []; //elements that change
                //console.log('--------- lisetner changes');
                // Use traditional 'for loops' for IE 11
                for (let mutation of mutationsList) {
                    let addNodes = [];
                    if (mutation.type === 'childList') {
                        if (mutation.addedNodes.length > 0) {
                            //More components
                            addNodes = mutation.addedNodes;
                            //documents.push.apply(documents, mutation.addedNodes);
                        } else if (mutation.removedNodes.length > 0) {
                        } else {
                        }
                    } else if (mutation.type === 'attributes') {
                        //console.log('The ' + mutation.attributeName + ' attribute was modified.');
                    } else if (mutation.type === 'characterData') {
                        //Content changes
                        addNodes = [mutation.target];
                        //documents.push.apply(documents, [mutation.target]);
                    }

                    //Remove duplicates and add documents
                    for (let item of addNodes) {
                        //console.log(item);

                        //Determine whether it has already been added. If it has already been added, it will not be added again.
                        var isFind = false;
                        for (var di = 0; di < documents.length; di++) {
                            if (documents[di].isSameNode(item)) {
                                isFind = true;
                                break;
                            }
                        }
                        if (isFind) {
                            break;
                        }
                        documents.push.apply(documents, [item]);
                    }
                }

                //console.log(documents.length);
                if (documents.length > 0) {
                    //If there is a change, you need to check whether translation is needed. Delay execution by 10 milliseconds.

                    //Determine whether it belongs to the node being translated, and reassemble a new set of nodes to be translated.
                    var translateNodes = [];
                    //console.log(translate.inProgressNodes.length);
                    for (let ipnode of documents) {
                        //console.log('---type:'+ipnode.nodeType);

                        var find = false;
                        for (var ini = 0; ini < translate.inProgressNodes.length; ini++) {
                            if (translate.inProgressNodes[ini].node.isSameNode(ipnode)) {
                                //If there is a record, then ignore this node. This node is changed due to translation.
                                //console.log('Same found');
                                find = true;
                                break;
                            }
                        }
                        if (find) {
                            continue;
                        }

                        //If they are not the same, add them to new translateNodes.
                        translateNodes.push(ipnode);
                    }
                    if (translateNodes.length < 1) {
                        return;
                    }
                    //console.log('translateNodeslength: '+translateNodes.length);


                    setTimeout(function () {
                        //console.log(translateNodes);
                        translate.execute(translateNodes); //Specify a collection of elements to be translated, one or more elements can be passed in. If not set, the entire web page will be translated by default.
                    }, 10); //This is shorter than the settimeout in task.execute() that delays the execution of deletion of translate.inpr....nodes. The purpose is that after the previous change, the inpr...nodes is recorded. Then after the translation is completed, the node changes and triggers the listener. At this time, inpr....nodes is still there, then this change will not be processed, and then inp....nodes will delete the mark.
                }
            };
            // Create an observer instance and pass in the callback function
            translate.listener.observer = new MutationObserver(translate.listener.callback);
            // Start observing the target node with the above configuration
            var docs = translate.getDocuments();
            for (var docs_index = 0; docs_index < docs.length; docs_index++) {
                var doc = docs[docs_index];
                if (doc != null) {
                    translate.listener.observer.observe(doc, translate.listener.config);
                }
            }
        },
        renderTaskFinish: function (renderTask) {
            //console.log(renderTask);
        }
    },
    //The task of replacing and rendering the translation results, the process of replacing the content to be translated with the translated content
    renderTask: class {
        constructor() {

            this.taskQueue = [];

            this.nodes = [];
        }

        add(node, originalText, resultText, attribute) {
            var nodeAnaly = translate.element.nodeAnalyse.get(node, attribute); //node analysis
            //var hash = translate.util.hash(translate.element.getTextByNode(node)); //Hash of the content in node
            var hash = translate.util.hash(nodeAnaly['text']);

            if (typeof (this.nodes[hash]) == 'undefined') {
                this.nodes[hash] = new Array();
            }
            this.nodes[hash].push(node);
            //console.log(node)

            /****** Join the translation task queue  */
            var tasks = this.taskQueue[hash];
            if (tasks == null || typeof (tasks) == 'undefined') {
                //console.log(node.nodeValue);
                tasks = new Array(); //Task list stores multiple tasks, each task is a replacement. The array here is a replacement of multiple tasks for the same nodeValue.
            }
            var task = new Array();

            if (originalText.substr(0, 1) == ' ') {
                //console.log('The first character is a space');
                if (resultText.substr(0, 1) != ' ') {
                    //If the first character of the translation result is not a space, then add it
                    resultText = ' ' + resultText;
                }
            }
            if (originalText.substr(originalText.length - 1, 1) === ' ') {
                //console.log('The last character is a space');
                if (resultText.substr(0, 1) != ' ') {
                    //If the last character of the translation result is not a space, then add it
                    resultText = resultText + ' ';
                }
            }
            //v2.3.3 added -- ended

            task['originalText'] = originalText;
            task['resultText'] = resultText;
            task['attribute'] = attribute;

            //console.log(task);
            tasks.push(task);
            this.taskQueue[hash] = tasks;
            /****** Add translation task queue end  */
        }
        //Carry out replacement rendering tasks and render and replace translations on the page
        execute() {
            //First sort the replacement words of the tasks task queue, and arrange the replacement words of the same node from large to small to avoid replacing the small ones first and not finding the large ones when replacing them.
            for (var hash in this.taskQueue) {
                var tasks = this.taskQueue[hash];
                if (typeof (tasks) == 'function') {
                    //Perform exception preprocessing callout
                    continue;
                }

                //Sort, and put the longer original string in front to avoid the situation where some parts are not translated (the bug is that the short string is translated first, causing the long string to be interrupted and unable to adapt)
                tasks.sort((a, b) => b.originalText.length - a.originalText.length);

                this.taskQueue[hash] = tasks;
            }


            //Translate nodeQueue
            for (var hash in this.nodes) {
                var tasks = this.taskQueue[hash]; //Get the replacement task corresponding to the current node element
                //var tagName = this.nodes[hash][0].nodeName; //tag name of the following nodes
                //console.log(tasks);
                for (var node_index = 0; node_index < this.nodes[hash].length; node_index++) {
                    //Replace translation characters for this node element
                    for (var task_index = 0; task_index < tasks.length; task_index++) {
                        var task = tasks[task_index];
                        if (typeof (tasks) == 'function') {
                            //Perform exception preprocessing callout
                            continue;
                        }

                        //After the translation is completed, remove the target node from inPro....Nodes
                        var ipnode = this.nodes[hash][task_index];
                        //console.log('int-----++'+ipnode.nodeValue);
                        setTimeout(function (ipnode) {
                            //console.log('int-----'+ipnode.nodeValue);
                            for (var ini = 0; ini < translate.inProgressNodes.length; ini++) {
                                if (translate.inProgressNodes[ini].node.isSameNode(ipnode)) {

                                    translate.inProgressNodes[ini].number = translate.inProgressNodes[ini].number - 1;
                                    //console.log("inProgressNodes -- number: "+translate.inProgressNodes[ini].number+', text:'+ipnode.nodeValue);
                                    if (translate.inProgressNodes[ini].number < 1) {


                                        //console.log('ini-'+ini)
                                        translate.inProgressNodes.splice(ini, 1);
                                        //console.log("inProgressNodes -- minus node length: "+translate.inProgressNodes.length+', text:'+ipnode.nodeValue);
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

            //Monitoring - add to translation history nodeHistory
            if (typeof (this.taskQueue) != 'undefined' && Object.keys(this.taskQueue).length > 0) {
                //Executed after 50 milliseconds so that the page can be rendered.
                var renderTask = this;
                setTimeout(function () {

                    /** After execution is completed, save the translation history node **/
                    //The currently translated node is cached and recorded, using the unique identifier of the node as the key, node, and the currently translated content of the node as the value for caching. This is convenient for the next time you execute translate.execute(), if the value has not changed, it will not be translated.
                    for (var hash in renderTask.nodes) {
                        //console.log(translate.nodeQueue[uuid].list[lang][hash])
                        for (var nodeindex in renderTask.nodes[hash]) {

                            var analyse = translate.element.nodeAnalyse.get(renderTask.nodes[hash][0]);
                            //analyse.text  analyse.node
                            var nodeid = nodeuuid.uuid(analyse.node);

                            if (nodeid.length == 0) {
                                //For example, the input placeholder has not been taken into consideration for the time being, so I will simply ignore it.
                                continue;
                            }

                            translate.nodeHistory[nodeid] = {};
                            translate.nodeHistory[nodeid].node = analyse.node;
                            translate.nodeHistory[nodeid].translateText = analyse.text;
                        }

                    }
                    //console.log(translate.nodeHistory);

                    /** After the execution is completed, the user-defined translation completion execution function is triggered **/
                    translate.listener.renderTaskFinish(renderTask);

                }, 50);

            } else {
                //console.log(this.taskQueue);
                //console.log('---this.taskQueue is null');
            }
        }
    },


    execute: function (docs) {
        if (typeof (docs) != 'undefined') {
            //Execute passes in parameters, which are only supported by the v2 version.
            translate.useVersion = 'v2';
        }

        if (translate.useVersion == 'v1') {
            //if(this.to == null || this.to == ''){
            //Using version 1.x of translation, use Google Translate
            //translate.execute_v1();
            //return;
            //v2.5.1 added
            //console.log('Tip: https://github.com/xnx3/translate Since version v2.5, due to Google Translate adjustments, the free translation channel is no longer supported, so the v1 version translation interface is no longer supported, and v1 is completely removed. Considering that v1 is no longer available, it has been automatically switched to v2. If you find any abnormalities during use, please adapt to v2.');
            translate.useVersion = 'v2';
        }

        //Version detection
        try {
            translate.init();
        } catch (e) { }

        /****** Using version 2.x translation, using its own translation algorithm */


        //Each time execute is executed, a unique uuid will be generated, which can also be called the unique identifier of the queue. Each time execute is executed, an independent translation execution queue will be created.
        var uuid = translate.util.uuid();

        //If the page is opened and used for the first time, first determine whether the last used language is in the cache and retrieve it from the cache.
        if (translate.to == null || translate.to == '') {
            var to_storage = translate.storage.get('to');
            if (to_storage != null && typeof (to_storage) != 'undefined' && to_storage.length > 0) {
                translate.to = to_storage;
            }
        }

        //Render select select language
        try {
            translate.selectLanguageTag.render();
        } catch (e) {
            console.log(e);
        }

        //Determine whether the target language for translation has not been specified
        if (translate.to == null || typeof (translate.to) == 'undefined' || translate.to.length == 0) {
            //Not specified, it is judged that if it is specified to automatically obtain the user's native language, then obtain it.
            if (translate.autoDiscriminateLocalLanguage) {
                translate.executeByLocalLanguage();
            }

            //If the translation target language is not specified and the user's native language is not automatically obtained, the translation will not be performed.
            return;
        }

        //Determine whether the local language is the same as the target language to be translated. If they are the same, no translation is required.
        if (translate.to == translate.language.getLocal()) {
            return;
        }

        /********** Translation in progress */

        //First, translate and replace the image. After all, the image still needs to be loaded.
        translate.images.execute();


        var all;
        if (typeof (docs) != 'undefined') {
            //1. This method has specified translation nodes

            if (docs == null) {
                //The target area to be translated does not exist
                console.log('translate.execute(...) The target area to be translated does not exist');
                return;
            }

            if (typeof (docs.length) == 'undefined') {
                //Not an array, but a single element
                all = new Array();
                all[0] = docs;
            } else {
                //is an array, assigned directly
                all = docs;
            }

        } else {
            //2、3
            all = translate.getDocuments();
        }
        //console.log('----Target element to be translated-----');
        //console.log(all)

        //Retrieve the node element within the target
        for (var i = 0; i < all.length & i < 20; i++) {
            var node = all[i];
            translate.element.whileNodes(uuid, node);
        }

        /***** translate.language.translateLanguagesRange Start *****/
        if (translate.language.translateLanguagesRange.length > 0) {
            //If it is greater than 0, it means there is a setting, then only the languages ​​that have settings will be translated, and languages ​​that are not in the settings will not participate in the translation.
            for (var lang in translate.nodeQueue[uuid].list) {
                if (translate.language.translateLanguagesRange.indexOf(lang) < 0) {
                    //Delete this language
                    delete translate.nodeQueue[uuid].list[lang];
                }
            }
        }

        /***** translate.language.translateLanguagesRange end *****/

        for (var lang in translate.nodeQueue[uuid].list) {
            //console.log('lang:'+lang)
            for (var hash in translate.nodeQueue[uuid].list[lang]) {
                //console.log(hash)
                if (typeof (translate.nodeQueue[uuid].list[lang][hash]) == 'function') {
                    //Added in v2.10 to prevent Contains from popping up in the hash, causing .length errors in for
                    continue;
                }
                for (var nodeindex = translate.nodeQueue[uuid].list[lang][hash].nodes.length - 1; nodeindex > -1; nodeindex--) {
                    //console.log(translate.nodeQueue[uuid].list[lang][hash].nodes);
                    var analyse = translate.element.nodeAnalyse.get(translate.nodeQueue[uuid].list[lang][hash].nodes[nodeindex].node);
                    //analyse.text  analyse.node
                    var nodeid = nodeuuid.uuid(analyse.node);
                    //translate.nodeQueue[uuid].list[lang][hash].nodes.splice(nodeindex, 1);
                    //console.log(nodeid+'\t'+analyse.text);
                    if (typeof (translate.nodeHistory[nodeid]) != 'undefined') {
                        //exists, determine whether its content has changed

                        if (translate.nodeHistory[nodeid].translateText == analyse.text) {
                            //The content has not changed, so no more translation is needed. Delete this node from translate.nodeQueue.
                            translate.nodeQueue[uuid].list[lang][hash].nodes.splice(nodeindex, 1);
                            //console.log('Equal node found, delete '+analyse.text+'\t'+hash);
                        } else {

                        }
                    } else {
                        //console.log('Not found in nodeHistory, new node nodeid:'+nodeid);
                        //console.log(analyse.node)
                    }
                }
                if (translate.nodeQueue[uuid].list[lang][hash].nodes.length == 0) {
                    //If there is no more node array, then directly remove the hash
                    delete translate.nodeQueue[uuid].list[lang][hash];
                }
            }
            if (Object.keys(translate.nodeQueue[uuid].list[lang]).length == 0) {
                //If there is no node to be translated in this language, then delete this language
                delete translate.nodeQueue[uuid].list[lang];
            }
        }

        //translateTextArray[lang][0]
        var translateTextArray = {};	//Array of text to be translated, in the format ["Hello", "Welcome"]
        var translateHashArray = {};	//The hash of the text to be translated is the same as the index above, except that the text to be translated is stored above, and this stores the hash value.

        var twoScanNodes = {};
        var cacheScanNodes = []; //Same as twoScanNodes above, except that twoScanNodes is stored according to lang, and this one is no longer distinguished by lang.
        for (var lang in translate.nodeQueue[uuid]['list']) { //In a two-dimensional array, take the language
            //console.log('lang:'+lang); //lang is the language identifier of english
            if (lang == null || typeof (lang) == 'undefined' || lang.length == 0 || lang == 'undefined') {
                //console.log('lang is null : '+lang);
                continue;
            }

            translateTextArray[lang] = [];
            translateHashArray[lang] = [];

            let task = new translate.renderTask();
            //console.log(translate.nodeQueue);

            twoScanNodes[lang] = [];
            //Two-dimensional array, take hash, value
            for (var hash in translate.nodeQueue[uuid]['list'][lang]) {
                if (typeof (translate.nodeQueue[uuid]['list'][lang][hash]) == 'function') {
                    //Jump out and increase fault tolerance.  Normally this should not be the case
                    continue;
                }

                //Take the original words, the words that have not been translated, and the words that need to be translated.
                //var originalWord = translate.nodeQueue[uuid]['list'][lang][hash]['original'];	

                //Words in the original node
                var originalWord = translate.nodeQueue[uuid]['list'][lang][hash]['original'];
                //word to translate
                var translateText = translate.nodeQueue[uuid]['list'][lang][hash]['translateText'];
                //console.log(originalWord);
                //console.log(originalWord == translateText ? '1':'xin：'+translateText);
                //Based on the hash, determine whether there is a local cache
                var cacheHash = originalWord == translateText ? hash : translate.util.hash(translateText); //If a custom term database is matched, the hash before translation has been changed.
                translate.nodeQueue[uuid]['list'][lang][hash]['cacheHash'] = cacheHash; //Cached hash. When caching, its hash completely corresponds to the translated language. The cached hash is converted from the translated language.
                var cache = translate.storage.get('hash_' + translate.to + '_' + cacheHash);
                //console.log(cacheHash+', '+cache);

                //var twoScanNodes[] = []; //The node to be scanned for the second time
                if (cache != null && cache.length > 0) {

                    for (var node_index = 0; node_index < translate.nodeQueue[uuid]['list'][lang][hash]['nodes'].length; node_index++) {
                        //console.log(translate.nodeQueue[uuid]['list'][lang][hash]['nodes'][node_index]);


                        //Add translate.inProgressNodes
                        //Get the node of this translation
                        var ipnode = translate.nodeQueue[uuid]['list'][lang][hash]['nodes'][node_index]['node'];

                        //Determine whether this node has been recorded in inProgressNodes
                        var isFind = false;
                        for (var ini = 0; ini < translate.inProgressNodes.length; ini++) {
                            if (translate.inProgressNodes[ini].node.isSameNode(ipnode)) {
                                //If there is a record, then the number of occurrences +1
                                translate.inProgressNodes[ini].number++;
                                isFind = true;
                                //console.log('cache - find - ++ ');
                                //console.log(ipnode);
                            }
                        }
                        //If it is not found, then you need to add this node to it.
                        if (!isFind) {
                            //console.log('cache - find - add -- lang:'+lang+', hash:'+hash+' node_index:'+node_index);
                            //console.log(ipnode.nodeValue);
                            translate.inProgressNodes.push({ node: ipnode, number: 1 });
                        }

                        //console.log(translate.inProgressNodes);
                        //Add translate.inProgressNodes -- end

                        //The text of the translation result includes before and after
                        var translateResultText = translate.nodeQueue[uuid]['list'][lang][hash]['nodes'][node_index]['beforeText'] + cache + translate.nodeQueue[uuid]['list'][lang][hash]['nodes'][node_index]['afterText'];
                        task.add(translate.nodeQueue[uuid]['list'][lang][hash]['nodes'][node_index]['node'], originalWord, translateResultText, translate.nodeQueue[uuid]['list'][lang][hash]['nodes'][node_index]['attribute']);
                        //this.nodeQueue[lang][hash]['nodes'][node_index].nodeValue = this.nodeQueue[lang][hash]['nodes'][node_index].nodeValue.replace(new RegExp(originalWord,'g'), cache);
                        //console.log(translateResultText);

                        var twoScanIndex = -1; //Whether the current element has been added to twoScan, if it has been added, then the current subscript is assigned here.
                        for (var i = 0; i < twoScanNodes[lang].length; i++) {
                            if (translate.nodeQueue[uuid]['list'][lang][hash]['nodes'][node_index]['node'].isSameNode(twoScanNodes[lang][i]['node'])) {
                                //if(translate.nodeQueue[uuid]['list'][lang][hash]['nodes'][node_index]['node'].isSameNode(cacheScanNodes[i]['node'])){
                                //If you have already joined, skip it
                                twoScanIndex = i;
                                break;
                            }
                        }
                        var twoScanIndex_cache = -1; //Whether the current element has been added to twoScan, if it has been added, then the current subscript is assigned here.
                        for (var i = 0; i < cacheScanNodes.length; i++) {
                            //if(translate.nodeQueue[uuid]['list'][lang][hash]['nodes'][node_index]['node'].isSameNode(twoScanNodes[lang][i]['node'])){
                            if (translate.nodeQueue[uuid]['list'][lang][hash]['nodes'][node_index]['node'].isSameNode(cacheScanNodes[i]['node'])) {
                                //If you have already joined, skip it
                                twoScanIndex_cache = i;
                                break;
                            }
                        }

                        if (twoScanIndex == -1) {
                            //console.log(translate.nodeQueue[uuid]['list'][lang][hash]['nodes'][node_index]['node']);
                            twoScanIndex = twoScanNodes[lang].length;
                            twoScanNodes[lang][twoScanIndex] = {};
                            twoScanNodes[lang][twoScanIndex]['node'] = translate.nodeQueue[uuid]['list'][lang][hash]['nodes'][node_index]['node'];
                            twoScanNodes[lang][twoScanIndex]['array'] = [];
                        }

                        if (twoScanIndex_cache == -1) {
                            twoScanIndex_cache = cacheScanNodes.length;
                            cacheScanNodes[twoScanIndex_cache] = {};
                            cacheScanNodes[twoScanIndex_cache]['node'] = translate.nodeQueue[uuid]['list'][lang][hash]['nodes'][node_index]['node'];
                            cacheScanNodes[twoScanIndex_cache]['array'] = [];
                        }

                        //If you have not joined before, then join
                        var arrayIndex = twoScanNodes[lang][twoScanIndex]['array'].length;
                        twoScanNodes[lang][twoScanIndex]['array'][arrayIndex] = translateResultText;

                        var arrayIndex_cache = cacheScanNodes[twoScanIndex_cache]['array'].length;
                        cacheScanNodes[twoScanIndex_cache]['array'][arrayIndex_cache] = translateResultText;

                        //twoScanNodes[lang][twoScanIndex]['array'][arrayIndex] = translate.nodeQueue[uuid]['list'][lang][hash]['beforeText']+cache+translate.nodeQueue[uuid]['list'][lang][hash]['afterText'];
                    }
                    //}



                    continue;	//Jump out, no need to pass in the translation interface below
                }


                //Add to array to be translated
                translateTextArray[lang].push(translateText);
                translateHashArray[lang].push(hash); //The original hash is still used here, and the hash before the custom term base is not used. The purpose is not to destroy the key of nodeQueue.
            }

            task.execute(); //Perform rendering tasks
        }

        /******* Carry out the second scan and add it to the translation queue. The purpose is to prevent caching from fragmenting the scanned text to be translated ********/
        for (var lang in twoScanNodes) {
            //Record the data from the first scan for comparison with the data after the second scan
            var firstScan = Object.keys(translate.nodeQueue[uuid]['list'][lang]);
            var firstScan_lang_langth = firstScan.length; //Array length after first scan

            //console.log(twoScanNodes[lang]);
            for (var i = 0; i < twoScanNodes[lang].length; i++) {

                //Find the translation record after this node element hits the cache
                for (var ci = 0; ci < cacheScanNodes.length; ci++) {
                    if (twoScanNodes[lang][i].node.isSameNode(cacheScanNodes[ci]['node'])) {
                        //If found, then assign
                        twoScanNodes[lang][i].array = cacheScanNodes[ci].array;
                        break;
                    }
                }

                twoScanNodes[lang][i].array.sort(function (a, b) { return b.length - a.length; });
                //console.log(twoScanNodes[lang][i].array);

                var nodeAnaly = translate.element.nodeAnalyse.get(twoScanNodes[lang][i].node);
                //console.log(nodeAnaly);
                var text = nodeAnaly.text;
                //console.log(text.indexOf(twoScanNodes[lang][i].array[0]));

                for (var ai = 0; ai < twoScanNodes[lang][i].array.length; ai++) {
                    if (twoScanNodes[lang][i].array[ai] < 1) {
                        continue;
                    }
                    text = text.replace(new RegExp(translate.util.regExp.pattern(twoScanNodes[lang][i].array[ai]), 'g'), translate.util.regExp.resultText('\n'));
                }

                //console.log(text);
                var textArray = text.split('\n');
                //console.log(textArray);
                for (var tai = 0; tai < textArray.length; tai++) {
                    if (textArray[tai] < 1) {
                        continue;
                    }
                    //console.log(textArray[tai]);
                    //Append the new ones to translate.nodeQueue
                    translate.addNodeToQueue(uuid, nodeAnaly['node'], textArray[tai]);
                }
            }


            //Get the appended data from the second scan
            var twoScan = Object.keys(translate.nodeQueue[uuid]['list'][lang]);
            var twoScan_lang_langth = twoScan.length; //Array length after second scan
            //console.log(firstScan_lang_langth+ '=='+twoScan_lang_langth);
            if (firstScan_lang_langth - twoScan_lang_langth == 0) {
                //Consistent, no new additions, then jump out directly and ignore
                continue;
            }

            //console.log(translate.nodeQueue[uuid]['list'][lang]);
            //console.log(firstScan);
            for (var ti = 0; ti < twoScan.length; ti++) {
                twoHash = twoScan[ti];
                //console.log(twoHash + '-- '+firstScan.indexOf(twoHash));
                if (firstScan.indexOf(twoHash) == -1) {
                    //Need to add
                    var item = translate.nodeQueue[uuid]['list'][lang][twoHash];

                    var cacheHash = item.original == item.translateText ? twoHash : translate.util.hash(item.translateText); //If a custom term database is matched, the hash before translation has been changed.
                    translate.nodeQueue[uuid]['list'][lang][twoHash]['cacheHash'] = cacheHash; //Cached hash. When caching, its hash completely corresponds to the translated language. The cached hash is converted from the translated language.

                    translateTextArray[lang].push(item.translateText);
                    translateHashArray[lang].push(twoHash);
                }
            }

        }
        /******* Perform the second scan and add to the translation queue -- End ********/


        //window.translateHashArray = translateHashArray;

        //Count out which languages ​​need to be translated, and the languages ​​will call the interface for translation. The format inside is like english
        var fanyiLangs = [];
        //console.log(translateTextArray)
        for (var lang in translate.nodeQueue[uuid]['list']) { //Two-dimensional array language
            if (typeof (translateTextArray[lang]) == 'undefined') {
                continue;
            }
            if (translateTextArray[lang].length < 1) {
                continue;
            }
            fanyiLangs.push(lang);
        }


        //console.log(translate.nodeQueue[uuid]['list'])
        if (fanyiLangs.length == 0) {
            //If there is nothing to translate, just exit.
            return;
        }

        //Add translate.inProgressNodes -- start
        for (var lang in translateHashArray) {
            if (typeof (translateHashArray[lang]) == 'undefined') {
                continue;
            }
            if (translateHashArray[lang].length < 1) {
                continue;
            }
            for (var hai = 0; hai < translateHashArray[lang].length; hai++) {
                var thhash = translateHashArray[lang][hai];
                //Get the node of this translation
                //var ipnode = translate.nodeQueue[uuid]['list'][lang][thhash].nodes[ipni].node;
                for (var ipni = 0; ipni < translate.nodeQueue[uuid]['list'][lang][thhash].nodes.length; ipni++) {
                    //Get the node of this translation
                    var ipnode = translate.nodeQueue[uuid]['list'][lang][thhash].nodes[ipni].node;

                    //Determine whether this node has been recorded in inProgressNodes
                    var isFind = false;
                    for (var ini = 0; ini < translate.inProgressNodes.length; ini++) {
                        if (translate.inProgressNodes[ini].node.isSameNode(ipnode)) {
                            //If there is a record, then the number of occurrences +1
                            //console.log('net request ++');
                            //console.log(ipnode);
                            translate.inProgressNodes[ini].number++;
                            isFind = true;
                        }
                    }
                    //If it is not found, then you need to add this node to it.
                    if (!isFind) {
                        //console.log('net request add');
                        //console.log(ipnode);
                        translate.inProgressNodes.push({ node: ipnode, number: 1 });
                    }

                }

            }
        }
        //Add translate.inProgressNodes -- end



        //Perform interface translation
        for (var lang_index in fanyiLangs) { //One-dimensional array, take language
            var lang = fanyiLangs[lang_index];
            //console.log(typeof(translateTextArray[lang]))

            if (typeof (translateTextArray[lang]) == 'undefined' || translateTextArray[lang].length < 1) {
                return;
            }


            /*** Translation starts ***/
            var url = translate.request.api.translate;
            var data = {
                from: lang,
                to: translate.to,
                //text:JSON.stringify(translateTextArray[lang])
                text: encodeURIComponent(JSON.stringify(translateTextArray[lang]))
            };
            //console.log(data);
            translate.request.post(url, data, function (data) {
                //console.log(data); 
                //console.log(translateTextArray[data.from]);
                if (data.result == 0) {
                    console.log('=======ERROR START=======');
                    console.log(translateTextArray[data.from]);
                    //console.log(encodeURIComponent(JSON.stringify(translateTextArray[data.from])));

                    console.log('response : ' + data.info);
                    console.log('=======ERROR END  =======');
                    //translate.temp_executeFinishNumber++; //Record the number of times the execution is completed
                    return;
                }


                //console.log('response:'+uuid);
                let task = new translate.renderTask();
                //Traverse translateHashArray
                for (var i = 0; i < translateHashArray[data.from].length; i++) {
                    //The language before translation, such as english
                    var lang = data.from;
                    //Translated content
                    var text = data.text[i];
                    //If text is null, then this may be because there are too many words in one translation. In order to maintain the length of the array, null is spelled out.
                    if (text == null) {
                        continue;
                    }

                    // v3.0.3 added to avoid the problem of text duplication after translation when JavaScript is incorrectly translated as "JavaScript" and then Javascript appears in multiple sentences.
                    // Here is to verify whether the translated text will completely contain the previous text. If it does, then the translated text will be forced to be assigned to the original text before translation (that is, it will not be translated)
                    if (text.toLowerCase().indexOf(translateTextArray[data.from][i].toLowerCase()) > -1) {
                        //Found it, then force it to turn over the previous content
                        text = translateTextArray[data.from][i];
                    }


                    //The hash before translation corresponds to the subscript
                    var hash = translateHashArray[data.from][i];
                    var cacheHash = translate.nodeQueue[uuid]['list'][lang][hash]['cacheHash'];



                    //Take the original words, the words that have not been translated, and the words that need to be translated.
                    var originalWord = '';
                    try {
                        originalWord = translate.nodeQueue[uuid]['list'][lang][hash]['original'];
                        //console.log('bef:'+translate.nodeQueue[uuid]['list'][lang][hash]['beforeText']);
                    } catch (e) {
                        console.log('uuid:' + uuid + ', originalWord:' + originalWord + ', lang:' + lang + ', hash:' + hash + ', text:' + text + ', queue:' + translate.nodeQueue[uuid]);
                        console.log(e);
                        continue;
                    }

                    //for(var index = 0; index < translate.nodeQueue[lang][hash].length; index++){
                    for (var node_index = 0; node_index < translate.nodeQueue[uuid]['list'][lang][hash]['nodes'].length; node_index++) {
                        //translate.nodeQueue[lang][hash]['nodes'][node_index].nodeValue = translate.nodeQueue[lang][hash]['nodes'][node_index].nodeValue.replace(new RegExp(originalWord,'g'), text);
                        //Join the task
                        task.add(translate.nodeQueue[uuid]['list'][lang][hash]['nodes'][node_index]['node'], originalWord, translate.nodeQueue[uuid]['list'][lang][hash]['nodes'][node_index]['beforeText'] + text + translate.nodeQueue[uuid]['list'][lang][hash]['nodes'][node_index]['afterText'], translate.nodeQueue[uuid]['list'][lang][hash]['nodes'][node_index]['attribute']);
                    }

                    //Cache the translation results in the form of key: hash value translation results
                    translate.storage.set('hash_' + data.to + '_' + cacheHash, text);
                }
                task.execute(); //Perform rendering tasks
                //translate.temp_executeFinishNumber++; //Record the number of times the execution is completed

            });
            /*** translation end ***/


        }
    },

    nodeHistory: {},
    element: {
        //Analysis of node elements before and after translation (before translation) and rendering (after translation)
        nodeAnalyse: {

            get: function (node, attribute) {
                return translate.element.nodeAnalyse.analyse(node, '', '', attribute);
            },

            set: function (node, originalText, resultText, attribute) {
                translate.element.nodeAnalyse.analyse(node, originalText, resultText, attribute);
            },

            analyse: function (node, originalText, resultText, attribute) {
                var result = new Array(); //Returned results
                result['node'] = node;
                result['text'] = '';

                var nodename = translate.element.getNodeName(node);

                if (attribute != null && typeof (attribute) == 'string' && attribute.length > 0) {
                    //This node has attributes. What is replaced is the attribute of node, not nodeValue.
                    result['text'] = node[attribute];

                    //Replacement rendering
                    if (typeof (originalText) != 'undefined' && originalText.length > 0) {
                        if (typeof (node[attribute]) != 'undefined') {
                            node[attribute] = node[attribute].replace(new RegExp(translate.util.regExp.pattern(originalText), 'g'), translate.util.regExp.resultText(resultText));
                        } else {
                            console.log(node);
                        }

                    }
                    return result;
                }

                //Normal node and typeof are both object

                //console.log(typeof(node)+node);
                if (nodename == '#text') {
                    //If it is ordinary text, determine whether the upper layer is included in the textarea tag.
                    if (typeof (node.parentNode) != 'undefined') {
                        var parentNodename = translate.element.getNodeName(node.parentNode);
                        //console.log(parentNodename)
                        if (parentNodename == 'TEXTAREA') {
                            //is a textarea tag, then incorporate nodename into the judgment of textarea, and hand over the judgment object to the superior, which is the textarea tag.
                            nodename = 'TEXTAREA';
                            node = node.parentNode;
                        }
                    }
                }

                if (nodename == 'INPUT' || nodename == 'TEXTAREA') {
                    //console.log(node.attributes)
                    /*
                        1. For input and textarea input boxes, placeholder needs to be translated.
                        2. input needs to translate the case of type=button
                    */
                    if (node.attributes == null || typeof (node.attributes) == 'undefined') {
                        result['text'] = '';
                        return result;
                    }

                    //input, to translate the situation of type=button and submit
                    if (nodename == 'INPUT') {
                        if (typeof (node.attributes.type) != 'undefined' && typeof (node.attributes.type.nodeValue) != null && (node.attributes.type.nodeValue.toLowerCase() == 'button' || node.attributes.type.nodeValue.toLowerCase() == 'submit')) {
                            //console.log('----is <input type="button"');
                            //take its value
                            var input_value_node = node.attributes.value;
                            if (input_value_node != null && typeof (input_value_node) != 'undefined' && typeof (input_value_node.nodeValue) != 'undefined' && input_value_node.nodeValue.length > 0) {
                                //Replacement rendering
                                if (typeof (originalText) != 'undefined' && originalText.length > 0) {
                                    //this.nodes[hash][task_index].nodeValue = this.nodes[hash][task_index].nodeValue.replace(new RegExp(translate.util.regExp.pattern(task.originalText),'g'), translate.util.regExp.resultText(task.resultText));
                                    input_value_node.nodeValue = input_value_node.nodeValue.replace(new RegExp(translate.util.regExp.pattern(originalText), 'g'), translate.util.regExp.resultText(resultText));
                                }

                                result['text'] = input_value_node.nodeValue;
                                result['node'] = input_value_node;
                                return result;
                            }
                        }
                    }
                    //console.log(node)

                    //placeholder case of input textarea
                    if (typeof (node.attributes['placeholder']) != 'undefined') {
                        //console.log(node);
                        //Replacement rendering
                        if (typeof (originalText) != 'undefined' && originalText.length > 0) {
                            //this.nodes[hash][task_index].nodeValue = this.nodes[hash][task_index].nodeValue.replace(new RegExp(translate.util.regExp.pattern(task.originalText),'g'), translate.util.regExp.resultText(task.resultText));
                            node.attributes['placeholder'].nodeValue = node.attributes['placeholder'].nodeValue.replace(new RegExp(translate.util.regExp.pattern(originalText), 'g'), translate.util.regExp.resultText(resultText));
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
                if (nodename == 'META') {
                    //Meta tags, such as keywords, descriptions, etc.
                    if (typeof (node.name) != 'undefined' && node.name != null) {
                        var nodeAttributeName = node.name.toLowerCase();  //Get the name attribute of the meta tag
                        if (nodeAttributeName == 'keywords' || nodeAttributeName == 'description') {
                            //Replacement rendering
                            if (typeof (originalText) != 'undefined' && originalText != null && originalText.length > 0) {
                                //this.nodes[hash][task_index].nodeValue = this.nodes[hash][task_index].nodeValue.replace(new RegExp(translate.util.regExp.pattern(task.originalText),'g'), translate.util.regExp.resultText(task.resultText));
                                node.content = node.content.replace(new RegExp(translate.util.regExp.pattern(originalText), 'g'), translate.util.regExp.resultText(resultText));
                            }

                            result['text'] = node.content;
                            return result;
                        }
                    }

                    result['text'] = '';
                    return result;
                }
                if (nodename == 'IMG') {
                    if (typeof (node.alt) == 'undefined' || node.alt == null) {
                        result['text'] = '';
                        return result;
                    }

                    //Replacement rendering
                    if (typeof (originalText) != 'undefined' && originalText.length > 0) {
                        //this.nodes[hash][task_index].nodeValue = this.nodes[hash][task_index].nodeValue.replace(new RegExp(translate.util.regExp.pattern(task.originalText),'g'), translate.util.regExp.resultText(task.resultText));
                        node.alt = node.alt.replace(new RegExp(translate.util.regExp.pattern(originalText), 'g'), translate.util.regExp.resultText(resultText));
                    }
                    result['text'] = node.alt;
                    return result;
                }


                //Others
                if (node.nodeValue == null || typeof (node.nodeValue) == 'undefined') {
                    result['text'] = '';
                } else if (node.nodeValue.trim().length == 0) {
                    //Avoid simple spaces or line breaks
                    result['text'] = '';
                } else {
                    //Replacement rendering
                    if (typeof (originalText) != 'undefined' && originalText != null && originalText.length > 0) {
                        //this.nodes[hash][task_index].nodeValue = this.nodes[hash][task_index].nodeValue.replace(new RegExp(translate.util.regExp.pattern(task.originalText),'g'), translate.util.regExp.resultText(task.resultText));
                        node.nodeValue = node.nodeValue.replace(new RegExp(translate.util.regExp.pattern(originalText), 'g'), translate.util.regExp.resultText(resultText));
                    }
                    result['text'] = node.nodeValue;
                }
                return result;
            }
        },
        //Get the node name of this node element. If not found, return an empty string.
        getNodeName: function (node) {
            if (node == null || typeof (node) == 'undefined') {
                return '';
            }

            if (node.nodeName == null || typeof (node.nodeName) == 'undefined') {
                return '';
            }

            var nodename = node.nodeName;
            //console.log('nodename:'+nodename+', node:'+node);
            return nodename;
        },
        //Traverse node downwards
        whileNodes: function (uuid, node) {
            if (node == null || typeof (node) == 'undefined') {
                return;
            }

            //If this uuid does not exist, create it
            if (typeof (translate.nodeQueue[uuid]) == 'undefined' || translate.nodeQueue[uuid] == null) {
                translate.nodeQueue[uuid] = new Array(); //create
                translate.nodeQueue[uuid]['expireTime'] = Date.now() + 120 * 1000; //Deletion time, delete after 10 minutes
                translate.nodeQueue[uuid]['list'] = new Array();
                //console.log('Create --- ');
                //console.log(uuid)
            }

            //console.log('---'+typeof(node)+', ');
            //Determine whether there is a title attribute. The title attribute also needs to be translated.
            if (typeof (node) == 'object' && typeof (node['title']) == 'string' && node['title'].length > 0) {
                //Add title to translation queue

                //Determine whether the current element is in the tag, id, class name ignored by ignore
                if (!translate.ignore.isIgnore(node)) {
                    //Translation will be added only if it is not ignored.
                    translate.addNodeToQueue(uuid, node, node['title'], 'title');
                }
            }

            var childNodes = node.childNodes;
            if (childNodes.length > 0) {
                for (var i = 0; i < childNodes.length; i++) {
                    translate.element.whileNodes(uuid, childNodes[i]);
                }
            } else {
                //Single
                translate.element.findNode(uuid, node);
            }
        },
        findNode: function (uuid, node) {
            if (node == null || typeof (node) == 'undefined') {
                return;
            }
            //console.log(node)
            if (node.parentNode == null) {
                return;
            }

            //console.log('-----parent')
            var parentNodeName = translate.element.getNodeName(node.parentNode);
            //node.parentNode.nodeName;
            if (parentNodeName == '') {
                return;
            }
            if (translate.ignore.tag.indexOf(parentNodeName.toLowerCase()) > -1) {
                //ignore tag
                //console.log('Ignore tag: '+parentNodeName);
                return;
            }

            /**** Avoid partial translation in the middle and make your own judgment ****/
            //Determine whether the current element is in the tag, id, class name ignored by ignore
            if (translate.ignore.isIgnore(node)) {
                //console.log('node is contained in an element to be ignored: ');
                //console.log(node);
                return;
            }

            //node analysis
            var nodeAnaly = translate.element.nodeAnalyse.get(node);
            if (nodeAnaly['text'].length > 0) {
                //If you have target content to be translated, add it to the translation queue
                //console.log('addNodeToQueue -- '+nodeAnaly['node']+', text:' + nodeAnaly['text']);
                translate.addNodeToQueue(uuid, nodeAnaly['node'], nodeAnaly['text']);
            }

        },
    },


    addNodeToQueue: function (uuid, node, text, attribute) {
        if (node == null || text == null || text.length == 0) {
            return;
        }

        var nodename = translate.element.getNodeName(node);

        //Determine if it is an area commented by <!-- --> and do not translate it.
        if (nodename.toLowerCase() == '#comment') {
            return;
        }
        //console.log('\t\t'+text);
        //Get the hash of the character to be translated
        var key = translate.util.hash(text);

        //Determine whether the content is script, style, etc. programmed text. If so, it will not be translated, otherwise the normal use of the page will be affected after translation.
        if (translate.util.findTag(text)) {

            //Get the tag that the current text belongs to. If it is in a tag such as script or style, it will be ignored and will not be translated.
            if (node.parentNode == null) {
                //There is no superior, or the superior has not been obtained, ignore
                return;
            }
            //Go to the superior tag name
            var parentNodeName = translate.element.getNodeName(node.parentNode);
            //node.parentNode.nodeName;
            if (parentNodeName == 'SCRIPT' || parentNodeName == 'STYLE') {
                //If it is found in script or style, it will also be ignored.
                return;
            }
        }
        //console.log(node.nodeValue);

        //Get the current language
        //var langs = translate.language.get(text);
        var textRecognition = translate.language.recognition(text);
        langs = textRecognition.languageArray;
        //console.log('langs');
        //console.log(langs);


        //Filter out the target language you want to convert to. For example, if you want to convert to English, then filter out the part that is originally in English. There is no need to translate it again.
        if (typeof (langs[translate.to]) != 'undefined') {
            delete langs[translate.to];
        }

        var isWhole = translate.whole.isWhole(node);
        //console.log('isWhole:'+isWhole+', '+text);

        if (!isWhole) {
            //Conventional method, language classification


            for (var lang in langs) {
                //Create a two-dimensional array, the key is the language, such as english
                /*
                Put it in translate.addNodeQueueItem for judgment
                if(translate.nodeQueue[uuid]['list'][lang] == null || typeof(translate.nodeQueue[uuid]['list'][lang]) == 'undefined'){
                    translate.nodeQueue[uuid]['list'][lang] = new Array();
                }
                */
                //console.log('|'+langs[lang].length);
                //Traverse to find out which words in the language need to be translated
                for (var word_index = 0; word_index < langs[lang].list.length; word_index++) {
                    //console.log('start:'+word_index)
                    //console.log(langs[lang].list[word_index]);
                    if (typeof (langs[lang].list[word_index]) == 'undefined' || typeof (langs[lang].list[word_index]['text']) == 'undefined') {
                        //Theoretically, it shouldn't happen, but I need to make a judgment call.
                        continue;
                    }
                    var word = langs[lang].list[word_index]['text']; //word to translate
                    var beforeText = langs[lang].list[word_index]['beforeText'];
                    var afterText = langs[lang].list[word_index]['afterText'];

                    translate.addNodeQueueItem(uuid, node, word, attribute, lang, beforeText, afterText);

                }

            }




        } else {
            //Directly translate the content within the entire element without classifying the language. First delete English, and then use the language with the most occurrences as the original language.
            var lang = textRecognition.languageName;
            translate.addNodeQueueItem(uuid, node, text, attribute, lang, '', '');
        }



        //this.nodeQueue[lang][key][this.nodeQueue[lang][key].length]=node; //Append to the array
    },

    addNodeQueueItem: function (uuid, node, word, attribute, lang, beforeText, afterText) {
        //Create a two-dimensional array, the key is the language, such as english
        if (translate.nodeQueue[uuid]['list'][lang] == null || typeof (translate.nodeQueue[uuid]['list'][lang]) == 'undefined') {
            translate.nodeQueue[uuid]['list'][lang] = new Array();
        }

        //var word = text; //Text to be translated
        var hash = translate.util.hash(word); 	//The hash of the text to be translated

        //Create a three-dimensional array, the key is the hash of the text word or sentence to be translated through the interface. The text translated here is the content of the entire node element, and there is no need to split it.
        if (translate.nodeQueue[uuid]['list'][lang][hash] == null || typeof (translate.nodeQueue[uuid]['list'][lang][hash]) == 'undefined') {
            translate.nodeQueue[uuid]['list'][lang][hash] = new Array();

            translate.nodeQueue[uuid]['list'][lang][hash]['nodes'] = new Array();
            translate.nodeQueue[uuid]['list'][lang][hash]['original'] = word;
            translate.nodeQueue[uuid]['list'][lang][hash]['translateText'] = translate.nomenclature.dispose(word); //Custom term processing

            //The key: nodes is a fourth-dimensional array, which stores specific node element objects.
        }


        var isEquals = false; //Whether this node has been added to the queue (of course the same hash and the same node)
        if (typeof (node.isSameNode) != 'undefined') {	//Support isSameNode method to determine whether objects are equal
            for (var node_index = 0; node_index < translate.nodeQueue[uuid]['list'][lang][hash]['nodes'].length; node_index++) {
                if (node.isSameNode(translate.nodeQueue[uuid]['list'][lang][hash]['nodes'][node_index]['node'])) {
                    //If they are the same, then there is no need to deposit again.
                    //console.log('The same, then there is no need to save it again')
                    isEquals = true;
                    //console.log(node)
                    continue;
                }
            }
        }
        if (isEquals) {
            //If they are the same, then there is no need to deposit again.
            return;
        }

        //Append node elements to the five-dimensional array nodes
        var nodesIndex = translate.nodeQueue[uuid]['list'][lang][hash]['nodes'].length;
        translate.nodeQueue[uuid]['list'][lang][hash]['nodes'][nodesIndex] = new Array();
        translate.nodeQueue[uuid]['list'][lang][hash]['nodes'][nodesIndex]['node'] = node;
        translate.nodeQueue[uuid]['list'][lang][hash]['nodes'][nodesIndex]['attribute'] = attribute;
        translate.nodeQueue[uuid]['list'][lang][hash]['nodes'][nodesIndex]['beforeText'] = beforeText;
        translate.nodeQueue[uuid]['list'][lang][hash]['nodes'][nodesIndex]['afterText'] = afterText;


    },

    //All translation, all node contents are translated, instead of language extraction, all the contents of the node itself are directly taken out and directly translated.
    whole: {
        class: [],
        tag: [],
        id: [],

        //A self-check appears when running and informative text appears in the browser console. 
        //This method is called when executing a translation, i.e. execute().
        executeTip: function () {
            if (translate.whole.class.length == 0 && translate.whole.tag.length == 0 && translate.whole.id.length == 0) {

            } else {
                console.log('You have enabled translate.whole, which bypasses the browser automatic text language recognition and directly translates the entire text of a certain element. This may result in a very large amount of translation. Please be cautious!For information regarding the daily character translation limit, please refer to： http://translate.zvo.cn/42557.html ');
            }

            if (translate.whole.tag.indexOf('html') > -1) {
                console.log('Self-check found that you set translate.whole.tag containing html, which is not valid. The maximum allowed is body ');
            }
        },

        //The current element is an element that belongs to all translation definitions
        /*
            Pass in an element and determine whether the element is included. This will look for the parent class to see if it is included in the parent class.
            return true is among them, false is no longer among them
        */
        isWhole: function (ele) {
            if (translate.whole.class.length == 0 && translate.whole.tag.length == 0 && translate.whole.id.length == 0) {
                //If not set, then return false directly.
                return false;
            }
            if (ele == null || typeof (ele) == 'undefined') {
                return false;
            }

            var parentNode = ele;
            var maxnumber = 100;	//Maximum number of loops to avoid infinite loops
            while (maxnumber-- > 0) {
                if (parentNode == null || typeof (parentNode) == 'undefined') {
                    //There is no parent element anymore
                    return false;
                }

                //Judge Tag
                //var tagName = parentNode.nodeName.toLowerCase(); //tag name, lowercase
                var nodename = translate.element.getNodeName(parentNode).toLowerCase(); //tag name, lowercase
                if (nodename.length > 0) {
                    //There is nodename
                    if (nodename == 'html' || nodename == '#document') {
                        //The upper-level element is already a top-level element, so it definitely isn’t.
                        return false;
                    }
                    if (translate.whole.tag.indexOf(nodename) > -1) {
                        //Found that ignore.tag is currently an ignored tag
                        return true;
                    }
                }


                //Determine class name
                if (parentNode.className != null) {
                    var classNames = parentNode.className;
                    if (classNames == null || typeof (classNames) != 'string') {
                        continue;
                    }
                    //console.log('className:'+typeof(classNames));
                    //console.log(classNames);
                    classNames = classNames.trim().split(' ');
                    for (var c_index = 0; c_index < classNames.length; c_index++) {
                        if (classNames[c_index] != null && classNames[c_index].trim().length > 0) {
                            //Valid class name for judgment
                            if (translate.whole.class.indexOf(classNames[c_index]) > -1) {
                                //Found that ignore.class is currently an ignored class
                                return true;
                            }
                        }
                    }
                }

                //Determine id
                if (parentNode.id != null && typeof (parentNode.id) != 'undefined') {
                    //Valid class name for judgment
                    if (translate.whole.id.indexOf(parentNode.id) > -1) {
                        //Found that ignore.id is currently an ignored id
                        return true;
                    }
                }

                //The element assigned to the judgment is moved up one level
                parentNode = parentNode.parentNode;
            }

            return false;
        }
    },

    language: {
        //Current local language, local language, the default is Simplified Chinese. Please use translate.language.setLocal(...) to set it. It cannot be used directly. You need to use getLocal() to use it.
        local: '',
        /*
            Translation language range
            For example, passing in ['chinese_simplified','chinese_traditional','english'] means that only Simplified Chinese, Traditional Chinese, and English in the webpage will be translated, while other languages ​​such as French and Korean that appear in the webpage will not be translated.
            If it is empty [], when translating, all languages ​​in the web page will be translated.			
            The setting method is: translate.language.translateLanguagesRange = ['chinese_simplified','chinese_traditional']
        */
        translateLanguagesRange: [],
        //Incoming language. Specific references that can be passed in: http://api.translate.zvo.cn/doc/language.json.html
        setLocal: function (languageName) {
            //translate.setUseVersion2(); //Set to use v2.x version
            translate.useVersion = 'v2';
            translate.language.local = languageName;
        },
        //Get the current local language, local language, the default is Simplified Chinese. Please use translate.language.setLocal(...) for setting
        getLocal: function () {
            //Determine whether the local language is set. If not, set it automatically.
            if (translate.language.local == null || translate.language.local.length < 1) {
                translate.language.autoRecognitionLocalLanguage();
            }
            return translate.language.local;
        },
        /*
            Get the current language.
            For example, if the currently set local language is Simplified Chinese and the user has not switched to other languages, then this method will return the current local language, which is equivalent to translate.language.getLocal()
            If the user switches to English for browsing, then this method will return the target language of the translation, which is english
        */
        getCurrent: function () {
            var to_storage = translate.storage.get('to');
            if (to_storage != null && typeof (to_storage) != 'undefined' && to_storage.length > 0) {
                //Have used it before and actively set the target language
                return to_storage;
            }
            return translate.language.getLocal();
        },
        //If it is used for the first time, what language will be displayed by default.
        //For example, if the current local language is simplified Chinese, and it is set to english here, then when the user uses it for the first time, it will be automatically translated into english for display. If the user manually switches to another language such as Korean, then the user's manual switch will be followed and Korean will be displayed.
        setDefaultTo: function (languageName) {
            var to_storage = translate.storage.get('to');
            if (to_storage != null && typeof (to_storage) != 'undefined' && to_storage.length > 0) {
                //It has been used before and the target language has been actively set, so it will not be processed.
            } else {
                //Not set, process it
                translate.storage.set('to', languageName);
                translate.to = languageName;
            }
        },
        /*
            Clear the cache of historical translation languages
        */
        clearCacheLanguage: function () {
            translate.to = '';
            translate.storage.set('to', '');
        },
        //Control which language to display based on URL parameters
        //Settings can control which language to use based on a get parameter of the current access URL.
        //For example, the current language is Simplified Chinese and the web page URL is http://translate.zvo.cn/index.html. Then you can specify the translation language by adding the language parameter after the URL to display the web page content in English http://translate.zvo.cn/index.html?language=english
        setUrlParamControl: function (paramName) {
            if (typeof (paramName) == 'undefined' || paramName.length < 1) {
                paramName = 'language';
            }
            var paramValue = translate.util.getUrlParam(paramName);
            if (typeof (paramValue) == 'undefined') {
                return;
            }
            if (paramValue == '' || paramValue == 'null' || paramValue == 'undefined') {
                return;
            }

            translate.storage.set('to', paramValue);
            translate.to = paramValue;
        },
        //Automatically identify the language of the current page
        autoRecognitionLocalLanguage: function () {
            if (translate.language.local != null && translate.language.local.length > 2) {
                //Already set, no need to set again
                return;
            }

            var bodyText = document.body.outerText;
            if (bodyText == null || typeof (bodyText) == 'undefined' || bodyText.length < 1) {
                //Not retrieved, default assigned to Simplified Chinese
                translate.language.local = 'chinese_simplified';
                return;
            }

            bodyText = bodyText.replace(/\n|\t|\r/g, ''); //Remove carriage return, line feed, etc.

            //Simplified Chinese is assigned by default
            translate.language.local = 'chinese_simplified';
            var recognition = translate.language.recognition(bodyText);
            translate.language.local = recognition.languageName;
            return translate.language.local;

        },


        get: function (str) {
            //Split str into a single char for judgment

            var langs = new Array(); //An array of languages ​​that the current string contains, such as english
            var langStrs = new Array();	//Store text in different languages, in the format ['english'][0] = 'hello'
            var upLangs = []; //What is the language of the previous character, the first character from the current character upwards. The format is like ['language']='english', ['chatstr']='a', ['storage_language']='english' There are three parameters, which represent which language the character belongs to, what the character is, and which language queue it is stored in. Because characters such as commas and periods are usually stored in the native language rather than special symbols. 
            var upLangsTwo = []; //What is the language of the previous two characters? The current character is the second character from the top. The format is like ['language']='english', ['chatstr']='a', ['storage_language']='english' There are three parameters, which represent which language the character belongs to, what the character is, and which language queue it is stored in. Because characters such as commas and periods are usually stored in the native language rather than special symbols.

            //var upLangs = ''; //What is the language of the previous character, the format is english
            for (var i = 0; i < str.length; i++) {
                var charstr = str.charAt(i);
                //console.log('charstr:'+charstr)
                var lang = translate.language.getCharLanguage(charstr);
                if (lang == '') {
                    //Not retrieved, not found what language it is
                    //continue;
                    lang = 'unidentification';
                }
                var result = translate.language.analyse(lang, langStrs, upLangs, upLangsTwo, charstr);
                //console.log(result)
                langStrs = result['langStrs'];
                //Record a few characters
                if (typeof (upLangs['language']) != 'undefined') {
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
            if (typeof (langStrs['unidentification']) != 'undefined') {
                delete langStrs['unidentification'];
            }
            if (typeof (langStrs['specialCharacter']) != 'undefined') {
                delete langStrs['specialCharacter'];
            }
            if (typeof (langStrs['number']) != 'undefined') {
                delete langStrs['number'];
            }


            //console.log('get end');
            return langStrs;
        },


        recognition: function (str) {
            var langs = translate.language.get(str);
            //var langkeys = Object.keys(langs);
            //console.log(langkeys);
            var langsNumber = []; //key language name, value number of language characters
            var langsNumberOriginal = []; //Same as above, except this will not clear the number of characters.
            var allNumber = 0;//total word count
            for (var key in langs) {
                var langStrLength = 0;
                for (var ls = 0; ls < langs[key].length; ls++) {
                    langStrLength = langStrLength + langs[key][ls].text.length;
                }
                allNumber = allNumber + langStrLength;
                langsNumber[key] = langStrLength;
                langsNumberOriginal[key] = langStrLength;
            }

            //Filter If the number of characters in a language is less than 5% of the total number of characters, if it is lower than this number, it will be ignored.
            var langkeys = [];
            for (var lang in langsNumber) {
                if (langsNumber[lang] / allNumber > 0.05) {
                    langkeys[langkeys.length] = lang + '';
                }
            }


            if (langkeys.length > 1 && langkeys.indexOf('english') > -1) {
                //console.log('english appears, and english appears together with other languages, then delete english, because English is included in French and German. And Chinese and English are together, if it is considered to be English, sometimes Chinese will not be translated');
                //langkeys.splice(langkeys.indexOf('english'), 1); 
                langsNumber['english'] = 0;
            }

            if (langkeys.indexOf('chinese_simplified') > -1 && langkeys.indexOf('chinese_traditional') > -1) {
                //If Simplified Chinese and Traditional Chinese appear together, the current sentence will be judged to be Traditional Chinese.
                //langkeys.splice(langkeys.indexOf('chinese_simplified'), 1); 
                langsNumber['chinese_simplified'] = 0;
            }


            //Find the one with the most words from langsNumber
            var maxLang = ''; //Language with the most words
            var maxNumber = 0;
            for (var lang in langsNumber) {
                if (langsNumber[lang] > maxNumber) {
                    maxLang = lang;
                    maxNumber = langsNumber[lang];
                }
            }

            //Reassemble the languageArray of return values
            var languageArray = {};
            for (var lang in langs) {
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
        // Input a char and return the language of this char, such as chinese_simplified, english. If an empty string is returned, it means that the language has not been obtained.
        getCharLanguage: function (charstr) {
            if (charstr == null || typeof (charstr) == 'undefined') {
                return '';
            }

            if (this.italian(charstr)) {
                return 'italian';
            }
            if (this.english(charstr)) {
                return 'english';
            }
            if (this.specialCharacter(charstr)) {
                return 'specialCharacter';
            }
            if (this.number(charstr)) {
                return 'number';
            }

            //There are two types of Chinese judgments, simplified and traditional
            var chinesetype = this.chinese(charstr);
            if (chinesetype == 'simplified') {
                return 'chinese_simplified';
            } else if (chinesetype == 'traditional') {
                return 'chinese_traditional';
            }

            if (this.japanese(charstr)) {
                return 'japanese';
            }
            if (this.korean(charstr)) {
                return 'korean';
            }

            //Unrecognized language
            //console.log('not find is language , char : '+charstr+', unicode: '+charstr.charCodeAt(0).toString(16));
            return '';

        },

        analyse: function (language, langStrs, upLangs, upLangsTwo, charstr) {
            if (typeof (langStrs[language]) == 'undefined') {
                langStrs[language] = new Array();
            }
            var index = 0; //The index of the array currently to be stored
            if (typeof (upLangs['storage_language']) == 'undefined') {
                //For the first time, the value has not been stored yet, and the index must be 0.
                //console.log('The first time, then the value has not been stored yet, the index must be 0')
                //console.log(upLangs['language'])
            } else {


                //If the current character is a connector
                if (translate.language.connector(charstr)) {
                    language = upLangs['storage_language'];

                }


                //The current language to be translated is the same as the language to be translated for the previous character, so directly splice
                if (upLangs['storage_language'] == language) {
                    index = langStrs[language].length - 1;
                } else {
                    //console.log('newly opened');
                    //The current character is different from the last language, then open a new array
                    index = langStrs[language].length;
                }
            }
            if (typeof (langStrs[language][index]) == 'undefined') {
                langStrs[language][index] = new Array();
                langStrs[language][index]['beforeText'] = '';
                langStrs[language][index]['afterText'] = '';
                langStrs[language][index]['text'] = '';
            }
            langStrs[language][index]['text'] = langStrs[language][index]['text'] + charstr;

            if (translate.language.wordBlankConnector(translate.language.getLocal()) == false && translate.language.wordBlankConnector(translate.to)) {
                if ((upLangs['storage_language'] != null && typeof (upLangs['storage_language']) != 'undefined' && upLangs['storage_language'].length > 0)) {
                    //Previous character exists
                    //console.log(upLangs['storage_language']);
                    if (upLangs['storage_language'] != 'specialCharacter') {
                        //The last character is not a special character (it is a normal language. It will not be a connector. The connectors are all merged into the normal language)

                        //if( upLangs['storage_language'] != 'english' && language == 'english'){
                        //The language of the previous character is consecutive, but the language of the current character is not consecutive (space interval)
                        if (translate.language.wordBlankConnector(upLangs['storage_language']) == false && translate.language.wordBlankConnector(language)) {
                            //The previous character is not English and the current character is English. In this case, a space must be appended after the previous character. Because the current character is English, the translation operation will not be performed.
                            //console.log(upLangs['language']);
                            langStrs[upLangs['storage_language']][langStrs[upLangs['storage_language']].length - 1]['afterText'] = ' ';
                        } else if (upLangs['storage_language'] == 'english' && language != 'english') {
                            //The previous character is English and the current character is not English. Append a space directly in front of the current character.
                            langStrs[language][index]['beforeText'] = ' ';
                        }
                    }


                }
            }

            var result = new Array();
            result['langStrs'] = langStrs;
            result['storage_language'] = language;	//Which language queue is actually stored?
            //console.log(result);
            //console.log(langStrs)
            //console.log(charstr);
            return result;
        },

        /*
         * Unlike language, this is just a connector. For example, there are commas, periods, and spaces between English words, and there are commas, periods, and book titles between Chinese characters. Avoid a complete line of sentences being split, resulting in inaccurate translations
         * The purpose of taking it out separately is to make better judgments and calculations and improve the accuracy of translation.
         */
        connector: function (str) {


            if (/.*[\u0020\u00A0\u202F\u205F\u3000]+.*$/.test(str)) {
                return true;
            }

            if (/.*[\u0030-\u0039]+.*$/.test(str)) {
                return true
            }


            if (/.*[\u0021\u0022\u0023\u0024\u0025\u0026\u0027\u002C\u002D\u002E\u003A\u003B\u003F\u0040]+.*$/.test(str)) {
                return true;
            }

            if (/.*[\u3002\uFF1F\uFF01\uFF0C\u3001\uFF1B\uFF1A\u300C\u300D\u300E\u300F\u2018\u2019\u201C\u201D\uFF08\uFF09\u3014\u3015\u3010\u3011\u2014\u2026\u2013\uFF0E\u300A\u300B\u3008\u3009\u00b7]+.*$/.test(str)) {
                return true;
            }




            //No, return false
            return false;
        },
        //Whether the word connector of the language requires spaces. For example, Chinese simplified, traditional, Korean, and Japanese do not require spaces, then false is returned. However, if words in English need spaces to separate them, true is returned.
        //If no match is found, it returns true by default.
        //language: language, passed in such as english
        wordBlankConnector: function (language) {
            if (language == null || typeof (language) == 'undefined') {
                return true;
            }
            switch (language.trim().toLowerCase()) {
                case 'chinese_simplified':
                    return false;
                case 'chinese_traditional':
                    return false;
                case 'korean':
                    return false;
                case 'japanese':
                    return false;
            }
            //Otherwise, it returns true
            return true;
        },
        //Traditional Chinese dictionary, judging Traditional Chinese is based on this judgment
        chinese_traditional_dict: '皚藹礙愛翺襖奧壩罷擺敗頒辦絆幫綁鎊謗剝飽寶報鮑輩貝鋇狽備憊繃筆畢斃閉邊編貶變辯辮鼈癟瀕濱賓擯餅撥缽鉑駁蔔補參蠶殘慚慘燦蒼艙倉滄廁側冊測層詫攙摻蟬饞讒纏鏟産闡顫場嘗長償腸廠暢鈔車徹塵陳襯撐稱懲誠騁癡遲馳恥齒熾沖蟲寵疇躊籌綢醜櫥廚鋤雛礎儲觸處傳瘡闖創錘純綽辭詞賜聰蔥囪從叢湊竄錯達帶貸擔單鄲撣膽憚誕彈當擋黨蕩檔搗島禱導盜燈鄧敵滌遞締點墊電澱釣調叠諜疊釘頂錠訂東動棟凍鬥犢獨讀賭鍍鍛斷緞兌隊對噸頓鈍奪鵝額訛惡餓兒爾餌貳發罰閥琺礬釩煩範販飯訪紡飛廢費紛墳奮憤糞豐楓鋒風瘋馮縫諷鳳膚輻撫輔賦複負訃婦縛該鈣蓋幹趕稈贛岡剛鋼綱崗臯鎬擱鴿閣鉻個給龔宮鞏貢鈎溝構購夠蠱顧剮關觀館慣貫廣規矽歸龜閨軌詭櫃貴劊輥滾鍋國過駭韓漢閡鶴賀橫轟鴻紅後壺護滬戶嘩華畫劃話懷壞歡環還緩換喚瘓煥渙黃謊揮輝毀賄穢會燴彙諱誨繪葷渾夥獲貨禍擊機積饑譏雞績緝極輯級擠幾薊劑濟計記際繼紀夾莢頰賈鉀價駕殲監堅箋間艱緘繭檢堿鹼揀撿簡儉減薦檻鑒踐賤見鍵艦劍餞漸濺澗漿蔣槳獎講醬膠澆驕嬌攪鉸矯僥腳餃繳絞轎較稭階節莖驚經頸靜鏡徑痙競淨糾廄舊駒舉據鋸懼劇鵑絹傑潔結誡屆緊錦僅謹進晉燼盡勁荊覺決訣絕鈞軍駿開凱顆殼課墾懇摳庫褲誇塊儈寬礦曠況虧巋窺饋潰擴闊蠟臘萊來賴藍欄攔籃闌蘭瀾讕攬覽懶纜爛濫撈勞澇樂鐳壘類淚籬離裏鯉禮麗厲勵礫曆瀝隸倆聯蓮連鐮憐漣簾斂臉鏈戀煉練糧涼兩輛諒療遼鐐獵臨鄰鱗凜賃齡鈴淩靈嶺領餾劉龍聾嚨籠壟攏隴樓婁摟簍蘆盧顱廬爐擄鹵虜魯賂祿錄陸驢呂鋁侶屢縷慮濾綠巒攣孿灤亂掄輪倫侖淪綸論蘿羅邏鑼籮騾駱絡媽瑪碼螞馬罵嗎買麥賣邁脈瞞饅蠻滿謾貓錨鉚貿麽黴沒鎂門悶們錳夢謎彌覓綿緬廟滅憫閩鳴銘謬謀畝鈉納難撓腦惱鬧餒膩攆撚釀鳥聶齧鑷鎳檸獰甯擰濘鈕紐膿濃農瘧諾歐鷗毆嘔漚盤龐國愛賠噴鵬騙飄頻貧蘋憑評潑頗撲鋪樸譜臍齊騎豈啓氣棄訖牽扡釺鉛遷簽謙錢鉗潛淺譴塹槍嗆牆薔強搶鍬橋喬僑翹竅竊欽親輕氫傾頃請慶瓊窮趨區軀驅齲顴權勸卻鵲讓饒擾繞熱韌認紉榮絨軟銳閏潤灑薩鰓賽傘喪騷掃澀殺紗篩曬閃陝贍繕傷賞燒紹賒攝懾設紳審嬸腎滲聲繩勝聖師獅濕詩屍時蝕實識駛勢釋飾視試壽獸樞輸書贖屬術樹豎數帥雙誰稅順說碩爍絲飼聳慫頌訟誦擻蘇訴肅雖綏歲孫損筍縮瑣鎖獺撻擡攤貪癱灘壇譚談歎湯燙濤縧騰謄銻題體屜條貼鐵廳聽烴銅統頭圖塗團頹蛻脫鴕馱駝橢窪襪彎灣頑萬網韋違圍爲濰維葦偉僞緯謂衛溫聞紋穩問甕撾蝸渦窩嗚鎢烏誣無蕪吳塢霧務誤錫犧襲習銑戲細蝦轄峽俠狹廈鍁鮮纖鹹賢銜閑顯險現獻縣餡羨憲線廂鑲鄉詳響項蕭銷曉嘯蠍協挾攜脅諧寫瀉謝鋅釁興洶鏽繡虛噓須許緒續軒懸選癬絢學勳詢尋馴訓訊遜壓鴉鴨啞亞訝閹煙鹽嚴顔閻豔厭硯彥諺驗鴦楊揚瘍陽癢養樣瑤搖堯遙窯謠藥爺頁業葉醫銥頤遺儀彜蟻藝億憶義詣議誼譯異繹蔭陰銀飲櫻嬰鷹應纓瑩螢營熒蠅穎喲擁傭癰踴詠湧優憂郵鈾猶遊誘輿魚漁娛與嶼語籲禦獄譽預馭鴛淵轅園員圓緣遠願約躍鑰嶽粵悅閱雲鄖勻隕運蘊醞暈韻雜災載攢暫贊贓髒鑿棗竈責擇則澤賊贈紮劄軋鍘閘詐齋債氈盞斬輾嶄棧戰綻張漲帳賬脹趙蟄轍鍺這貞針偵診鎮陣掙睜猙幀鄭證織職執紙摯擲幟質鍾終種腫衆謅軸皺晝驟豬諸誅燭矚囑貯鑄築駐專磚轉賺樁莊裝妝壯狀錐贅墜綴諄濁茲資漬蹤綜總縱鄒詛組鑽緻鐘麼為隻兇準啟闆裡靂餘鍊洩',

        chinese: function (str) {
            if (/.*[\u4e00-\u9fa5]+.*$/.test(str)) {
                if (this.chinese_traditional_dict.indexOf(str) > -1) {
                    return 'traditional';
                } else {
                    return 'simplified';
                }
            } else {
                return '';
            }
        },
        //Whether to include English, true: include
        english: function (str) {
            if (/.*[\u0041-\u005a]+.*$/.test(str)) {
                return true;
            } else if (/.*[\u0061-\u007a]+.*$/.test(str)) {
                return true;
            } else {
                return false;
            }
        },
        //Whether to include Japanese, true: include
        japanese: function (str) {
            if (/.*[\u3040-\u309F\u30A0-\u30FF]+.*$/.test(str)) {
                return true
            } else {
                return false;
            }
        },
        //Whether to include Korean, true: include
        korean: function (str) {
            if (/.*[\uAC00-\uD7AF]+.*$/.test(str)) {
                return true
            } else {
                return false;
            }
        },
        //0-9 Arabic numerals
        number: function (str) {
            if (/.*[\u0030-\u0039]+.*$/.test(str)) {
                return true;
            }
            return false;
        },
        //Italian
        italian: function (str) {
            if (/.*[\u00E0-\u00F6]+.*$/.test(str)) {
                return true;
            }
            return false;
        },

        //Does it contain special characters?
        specialCharacter: function (str) {
            //Such as: ① ⑴ ⒈ 
            if (/.*[\u2460-\u24E9]+.*$/.test(str)) {
                return true
            }

            //Such as: ┊┌┍ ▃ ▄ ▅
            if (/.*[\u2500-\u25FF]+.*$/.test(str)) {
                return true
            }

            //Such as:㎠ ㎎ ㎏ ㎡
            if (/.*[\u3200-\u33FF]+.*$/.test(str)) {
                return true
            }

            //Such as: full-width characters corresponding to ANSI
            if (/.*[\uFF00-\uFF5E]+.*$/.test(str)) {
                return true
            }

            //Other special symbols
            if (/.*[\u2000-\u22FF]+.*$/.test(str)) {
                return true
            }

            // , >< and other symbols
            if (/.*[\u3001-\u3036]+.*$/.test(str)) {
                return true;
            }

            /*
            //Arabic numerals 0-9
            if(/.*[\u0030-\u0039]+.*$/.test(str)){
                return true;
            }
            */


            if (/.*[\u0020-\u002F]+.*$/.test(str)) {
                return true;
            }


            if (/.*[\u003A-\u007E]+.*$/.test(str)) {
                return true;
            }

            //White space characters, \u0009\u000a + https://cloud.tencent.com/developer/article/2128593
            if (/.*[\u0009\u000a\u0020\u00A0\u1680\u180E\u202F\u205F\u3000\uFEFF]+.*$/.test(str)) {
                return true;
            }
            if (/.*[\u2000-\u200B]+.*$/.test(str)) {
                return true;
            }


            if (/.*[\u00A1-\u0105]+.*$/.test(str)) {
                return true;
            }
            if (/.*[\u2C60-\u2C77]+.*$/.test(str)) {
                return true;
            }


            return false;
        }
    },
    //When a user opens a web page for the first time, it automatically determines which language is used in the country where the user is currently located, and automatically switches to the language of the user's country.
    //If you use it for the second time after use, the one chosen by the user will be given priority.
    executeByLocalLanguage: function () {
        translate.request.post(translate.request.api.ip, {}, function (data) {
            //console.log(data); 
            if (data.result == 0) {
                console.log('==== ERROR  Failed to get the current user region ====');
                console.log(data.info);
                console.log('==== ERROR END ====');
            } else {
                translate.storage.set('to', data.language);	//Set target translation language
                translate.to = data.language; //Set target language
                translate.selectLanguageTag
                translate.execute(); //Perform translation
            }
        });
    },

    util: {
        /* Generate a random UUID, copied from https://gitee.com/mail_osc/kefu.js */
        uuid: function () {
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

        //Determine whether the tag tag exists in the string. true exists
        findTag: function (str) {
            var reg = /<[^>]+>/g;
            return reg.test(str);
        },
        //Pass in an array, find the one with the most frequency from the array and return it. If multiple frequencies appear the same number of times, multiple
        arrayFindMaxNumber: function (arr) {

            // Store the number of occurrences of each element
            var numbers = {}

            // Store the element that appears the most times
            var maxStr = []

            // Store the maximum number of occurrences of an element
            var maxNum = 0

            for (var i = 0, len = arr.length; i < len; i++) {
                if (!numbers[arr[i]]) {
                    numbers[arr[i]] = 1
                } else {
                    numbers[arr[i]]++
                }

                if (numbers[arr[i]] > maxNum) {
                    maxNum = numbers[arr[i]]
                }
            }

            for (var item in numbers) {
                if (numbers[item] === maxNum) {
                    maxStr.push(item)
                }
            }

            return maxStr;
        },
        //Hash the string to obtain a unique value for identification
        hash: function (str) {
            if (str == null || typeof (str) == 'undefined') {
                return str;
            }
            var hash = 0, i, chr;
            if (str.length === 0) {
                return hash;
            }

            for (i = 0; i < str.length; i++) {
                chr = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + chr;
                hash |= 0; // Convert to 32bit integer
            }
            return hash + '';
        },
        //Remove some specified characters, such as newlines. If null is passed in, an empty string is returned
        charReplace: function (str) {

            if (str == null) {
                return '';
            }
            str = str.trim();
            str = str.replace(/\t|\n|\v|\r|\f/g, '');	//Remove line breaks, etc.
            //str = str.replace(/&/g, "%26"); //Because the URL has been encoded when submitting
            return str;
        },
        //RegExp related
        regExp: {
            // Preprocessing of pattern string in new RegExp(pattern, resultText);
            pattern: function (str) {
                str = str.replace(/\\/g, '\\\\'); //This must be placed first, otherwise it will be affected by the following
                //str = str.replace(/'/g,'\\\'');
                str = str.replace(/\"/g, '\\\"');
                //str = str.replace(/./g,'\\\.');
                str = str.replace(/\?/g, '\\\?');
                str = str.replace(/\$/g, '\\\$');
                str = str.replace(/\(/g, '\\\(');
                str = str.replace(/\)/g, '\\\)');
                str = str.replace(/\|/g, '\\\|');
                str = str.replace(/\+/g, '\\\+');
                str = str.replace(/\*/g, '\\\*');
                str = str.replace(/\[/g, '\\\[');
                str = str.replace(/\]/g, '\\\]');
                str = str.replace(/\^/g, '\\\^');
                str = str.replace(/\{/g, '\\\{');
                str = str.replace(/\}/g, '\\\}');
                return str;
            },
            // Preprocessing of resultText string in new RegExp(pattern, resultText);
            resultText: function (str) {
                //str = str.replace(/&quot;/g,"\"");
                //str = str.replace(/'/g,"\\\'");
                //str = str.replace(/"/g,"\\\"");
                return str;
            }
        },
        //Get the GET parameters of the URL. If not, return ""
        getUrlParam: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]); return "";
        },
        /**
         * Load JS synchronously, it will be blocked during the loading process, and continue to execute the following after loading is completed.
         * url: the url of the js to be loaded
         */
        synchronizesLoadJs: function (url) {
            var xmlHttp = null;
            if (window.ActiveXObject) {//IE  
                try {
                    //Can be used in IE6 and later versions  
                    xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
                } catch (e) {
                    //IE5.5 and later versions can be used  
                    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
                }
            } else if (window.XMLHttpRequest) {
                //Firefox，Opera 8.0+，Safari，Chrome  
                xmlHttp = new XMLHttpRequest();
            }
            //Use synchronous loading  
            xmlHttp.open("GET", url, false);
            //Send a synchronization request. If the browser is Chrome or Opera, it must be published before running, otherwise an error will be reported.  
            xmlHttp.send(null);
            //4 means the data has been sent.  
            if (xmlHttp.readyState == 4) {
                //0 indicates the local accessed, 200 to 300 indicates successful access to the server, and 304 indicates that no modifications have been made and the cache accessed is  
                if ((xmlHttp.status >= 200 && xmlHttp.status < 300) || xmlHttp.status == 0 || xmlHttp.status == 304) {
                    var myBody = document.getElementsByTagName("HTML")[0];
                    var myScript = document.createElement("script");
                    myScript.language = "javascript";
                    myScript.type = "text/javascript";
                    try {
                        //IE8 and below do not support this method and need to be set through the text attribute.  
                        myScript.appendChild(document.createTextNode(xmlHttp.responseText));
                    } catch (ex) {
                        myScript.text = xmlHttp.responseText;
                    }
                    myBody.appendChild(myScript);
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        },
        //Load msg.js
        loadMsgJs: function () {
            if (typeof (msg) != 'undefined') {
                return;
            }
            translate.util.synchronizesLoadJs('https://res.zvo.cn/msg/msg.js');
        },
        /*
            For an object, sort according to the length of the object's key. The longer the object, the longer it is in front.
        */
        objSort: function (obj) {
            // Get all keys of the object array and convert them to ordinary arrays
            var keys = Array.from(Object.keys(obj));

            // Sort key array
            keys.sort(function (a, b) {
                return b.length - a.length;
            });

            // Define a new object array to store the sorted results
            var sortedObj = new Array();

            // Traverse the sorted key array, copy the corresponding values ​​to the new object array, and delete the key-value pairs in the original object array
            for (var key of keys) {
                sortedObj[key] = obj[key];
            }
            return sortedObj;
        },
        /*
            Convert 2.11.3.20231232 to 2011003
            The characters of the last date will be removed during conversion.
        */
        versionStringToInt: function (versionString) {
            var vs = versionString.split('\.');
            var result = 0;
            result = parseInt(vs[0]) * 1000 * 1000 + result;
            result = parseInt(vs[1]) * 1000 + result;
            result = parseInt(vs[2]) + result;

            return result;
        },

        split: function (array, size) {
            let list = [];
            // If the array length is less than size, return it directly.
            if (JSON.stringify(array).length <= size) {
                list.push(array);
            } else {
                // Convert to String
                let arrayStr = JSON.stringify(array).trim().substring(1, JSON.stringify(array).length - 1);

                // Determine the difference between size and string length. If it is 1 or 2, just split it into two pieces.
                if (JSON.stringify(array).length - size <= 2) {
                    size = size - 4;
                    // Split into two sections
                    let str1 = arrayStr.substring(0, arrayStr.lastIndexOf("\",\"") + 1);
                    let str2 = arrayStr.substring(arrayStr.lastIndexOf("\",\"") + 2);
                    list.push(JSON.parse("[" + str1 + "]"));
                    list.push(JSON.parse("[" + str2 + "]"));
                } else {
                    size = size - 2;
                    // Split multiple sections
                    let index = 0;
                    while (index - arrayStr.length < 0) {
                        // Divide a section according to the specified size
                        let s = "";
                        if ((index + size) - arrayStr.length >= 0) {
                            s = arrayStr.substring(index);
                        } else {
                            s = arrayStr.substring(index, (index + size));
                        }
                        // The ending length defaults to the string length
                        let endIndex = s.length;
                        // Because the first character next time may be a comma, you need +1 next time.
                        let startNeedAdd = 1;
                        // Determine whether the last character is a double quote
                        if (s.endsWith("\"")) {
                            // Determine whether the penultimate character is a comma
                            if (s.endsWith("\",\"")) {
                                // delete two characters
                                endIndex -= 2;
                            } else if (!s.startsWith("\"")) {
                                // If there is not a quotation mark at the beginning, you need to add a quotation mark, which will cause it to be too long, so you need to find the specified character at the end.
                                // Find the position of the last specified character
                                let la = s.lastIndexOf("\",\"");
                                endIndex = la + 1;
                            }
                        } else if (s.endsWith("\",")) {
                            // Determine whether it is a comma, if so, delete a character
                            endIndex -= 1;
                        } else {
                            // None, that’s the end of the content
                            // Find the position of the last specified character
                            let la = s.lastIndexOf("\",\"");
                            endIndex = la + 1;
                            // If the content is too long, endIndex will become 0. In this case, manual assignment is required.
                            if (endIndex <= 0) {
                                // Check to see if it starts with a quotation mark. If not, you need to spell it with two quotation marks.
                                if (s.startsWith("\"")) {
                                    // Spell a quotation mark, -1
                                    endIndex = s.length() - 1;
                                } else {
                                    // Put two quotation marks, -2
                                    endIndex = s.length() - 2;
                                }
                                if (!s.endsWith("\"")) {
                                    // It's not a comma at the beginning, it can't be -1
                                    startNeedAdd = 0;
                                }
                            }
                        }
                        // Second split based on processed end length
                        let s2 = "";
                        if (endIndex - s.length > 0 || endIndex - 0 == 0) {
                            s2 = s;
                            endIndex = endIndex + s2.length;
                        } else {
                            s2 = s.substring(0, endIndex);
                        }
                        if (!s2.startsWith("\"") && !s2.startsWith(",\"")) {
                            // spell a quotation mark
                            s2 = "\"" + s2;
                        }
                        if (!s2.endsWith("\"")) {
                            // spell a quotation mark
                            s2 = s2 + "\"";
                        }
                        // Calculate the length of the next loop start
                        index += (endIndex + startNeedAdd);
                        // add to list
                        s2 = "[" + s2 + "]";
                        try {
                            list.push(JSON.parse(s2));
                        } catch (e) {
                            // Encountered an error, skipping a character
                            index = index - (endIndex + startNeedAdd) + 1;
                        }
                    }
                }
            }
            return list;
        }

    },
    //Which translation service is used for machine translation?
    service: {

        name: 'translate.service',
        /*
            In fact, it is to set translate.service.name
 
        */
        use: function (serviceName) {
            if (typeof (serviceName) == 'string' && serviceName == 'client.edge') {
                translate.service.name = serviceName;

                //Increase the overall translation capabilities of elements
                translate.whole.tag.push('body');
                translate.whole.tag.push('head');
                translate.whole.tag.push('html');
            }
        },
        //The client-side edge provides machine translation services
        edge: {
            api: { //edge browser translation function
                auth: 'https://edge.microsoft.com/translate/auth', //auth Authorized Pull
                translate: 'https://api-edge.cognitive.microsofttranslator.com/translate?from={from}&to={to}&api-version=3.0&includeSentenceLength=true' //Translation interface
            },

            language: {
                json: [{ "id": "ukrainian", "name": "УкраїнськаName", "serviceId": "uk" }, { "id": "norwegian", "name": "Norge", "serviceId": "no" }, { "id": "welsh", "name": "color name", "serviceId": "cy" }, { "id": "dutch", "name": "nederlands", "serviceId": "nl" }, { "id": "japanese", "name": "しろうと", "serviceId": "ja" }, { "id": "filipino", "name": "Pilipino", "serviceId": "fil" }, { "id": "english", "name": "English", "serviceId": "en" }, { "id": "lao", "name": "ກະຣຸນາ", "serviceId": "lo" }, { "id": "telugu", "name": "తెలుగుQFontDatabase", "serviceId": "te" }, { "id": "romanian", "name": "Română", "serviceId": "ro" }, { "id": "nepali", "name": "नेपालीName", "serviceId": "ne" }, { "id": "french", "name": "Français", "serviceId": "fr" }, { "id": "haitian_creole", "name": "Kreyòl ayisyen", "serviceId": "ht" }, { "id": "czech", "name": "český", "serviceId": "cs" }, { "id": "swedish", "name": "Svenska", "serviceId": "sv" }, { "id": "russian", "name": "Русский язык", "serviceId": "ru" }, { "id": "malagasy", "name": "Malagasy", "serviceId": "mg" }, { "id": "burmese", "name": "ဗာရမ်", "serviceId": "my" }, { "id": "pashto", "name": "پښتوName", "serviceId": "ps" }, { "id": "thai", "name": "คนไทย", "serviceId": "th" }, { "id": "armenian", "name": "Արմենյան", "serviceId": "hy" }, { "id": "chinese_simplified", "name": "简体中文", "serviceId": "zh-CHS" }, { "id": "persian", "name": "Persian", "serviceId": "fa" }, { "id": "chinese_traditional", "name": "繁體中文", "serviceId": "zh-CHT" }, { "id": "kurdish", "name": "Kurdî", "serviceId": "ku" }, { "id": "turkish", "name": "Türkçe", "serviceId": "tr" }, { "id": "hindi", "name": "हिन्दी", "serviceId": "hi" }, { "id": "bulgarian", "name": "български", "serviceId": "bg" }, { "id": "malay", "name": "Malay", "serviceId": "ms" }, { "id": "swahili", "name": "Kiswahili", "serviceId": "sw" }, { "id": "oriya", "name": "ଓଡିଆ", "serviceId": "or" }, { "id": "icelandic", "name": "ÍslandName", "serviceId": "is" }, { "id": "irish", "name": "Íris", "serviceId": "ga" }, { "id": "khmer", "name": "ខ្មែរKCharselect unicode block name", "serviceId": "km" }, { "id": "gujarati", "name": "ગુજરાતી", "serviceId": "gu" }, { "id": "slovak", "name": "Slovenská", "serviceId": "sk" }, { "id": "kannada", "name": "ಕನ್ನಡ್Name", "serviceId": "kn" }, { "id": "hebrew", "name": "היברית", "serviceId": "he" }, { "id": "hungarian", "name": "magyar", "serviceId": "hu" }, { "id": "marathi", "name": "मराठीName", "serviceId": "mr" }, { "id": "tamil", "name": "தாமில்", "serviceId": "ta" }, { "id": "estonian", "name": "eesti keel", "serviceId": "et" }, { "id": "malayalam", "name": "മലമാലം", "serviceId": "ml" }, { "id": "inuktitut", "name": "ᐃᓄᒃᑎᑐᑦ", "serviceId": "iu" }, { "id": "arabic", "name": "بالعربية", "serviceId": "ar" }, { "id": "deutsch", "name": "Deutsch", "serviceId": "de" }, { "id": "slovene", "name": "slovenščina", "serviceId": "sl" }, { "id": "bengali", "name": "বেঙ্গালী", "serviceId": "bn" }, { "id": "urdu", "name": "اوردو", "serviceId": "ur" }, { "id": "azerbaijani", "name": "azerbaijani", "serviceId": "az" }, { "id": "portuguese", "name": "português", "serviceId": "pt" }, { "id": "samoan", "name": "lifiava", "serviceId": "sm" }, { "id": "afrikaans", "name": "afrikaans", "serviceId": "af" }, { "id": "tongan", "name": "汤加语", "serviceId": "to" }, { "id": "greek", "name": "ελληνικά", "serviceId": "el" }, { "id": "indonesian", "name": "IndonesiaName", "serviceId": "id" }, { "id": "spanish", "name": "Español", "serviceId": "es" }, { "id": "danish", "name": "dansk", "serviceId": "da" }, { "id": "amharic", "name": "amharic", "serviceId": "am" }, { "id": "punjabi", "name": "ਪੰਜਾਬੀName", "serviceId": "pa" }, { "id": "albanian", "name": "albanian", "serviceId": "sq" }, { "id": "lithuanian", "name": "Lietuva", "serviceId": "lt" }, { "id": "italian", "name": "italiano", "serviceId": "it" }, { "id": "vietnamese", "name": "Tiếng Việt", "serviceId": "vi" }, { "id": "korean", "name": "한국어", "serviceId": "ko" }, { "id": "maltese", "name": "Malti", "serviceId": "mt" }, { "id": "finnish", "name": "suomi", "serviceId": "fi" }, { "id": "catalan", "name": "català", "serviceId": "ca" }, { "id": "croatian", "name": "hrvatski", "serviceId": "hr" }, { "id": "bosnian", "name": "bosnian", "serviceId": "bs-Latn" }, { "id": "polish", "name": "Polski", "serviceId": "pl" }, { "id": "latvian", "name": "latviešu", "serviceId": "lv" }, { "id": "maori", "name": "Maori", "serviceId": "mi" }],
                /*
                    Get the language list in map form 
                    The key is the name of translate.service  
                    value is serviceId
 
                */
                getMap: function () {
                    if (typeof (translate.service.edge.language.map) == 'undefined') {
                        translate.service.edge.language.map = new Array();
                        for (var i = 0; i < translate.service.edge.language.json.length; i++) {
                            var item = translate.service.edge.language.json[i];
                            translate.service.edge.language.map[item.id] = item.serviceId;
                        }
                    }
                    return translate.service.edge.language.map;
                }
            },

            translate: function (path, data, func) {
                var textArray = JSON.parse(decodeURIComponent(data.text));
                let translateTextArray = translate.util.split(textArray, 48000);
                //console.log(translateTextArray);


                translate.request.send(translate.service.edge.api.auth, {}, function (auth) {
                    var from = translate.service.edge.language.getMap()[data.from];
                    var to = translate.service.edge.language.getMap()[data.to];
                    var transUrl = translate.service.edge.api.translate.replace('{from}', from).replace('{to}', to);

                    //If the translation volume is large, it must be split into multiple translation requests
                    for (var tai = 0; tai < translateTextArray.length; tai++) {
                        var json = [];
                        for (var i = 0; i < translateTextArray[tai].length; i++) {
                            json.push({ "Text": translateTextArray[tai][i] });
                        }

                        translate.request.send(transUrl, JSON.stringify(json), function (result) {
                            var d = {};
                            d.info = 'SUCCESS';
                            d.result = 1;
                            d.from = data.from;
                            d.to = data.to;
                            d.text = [];
                            for (var t = 0; t < result.length; t++) {
                                d.text.push(result[t].translations[0].text);
                            }


                            //Determine whether the current translation has been split again. For example, if it exceeds 50,000 characters at a time, it will be split into multiple requests.
                            if (translateTextArray.length > 1) {
                                //This time the translation has split multiple requests, so the array needs to be completed so that the number of arrays can be consistent.


                                var currentIndex = -1;	//The array index of the split number that the current translation request belongs to, starting from 0
                                for (var cri = 0; cri < translateTextArray.length; cri++) {
                                    if (translateTextArray[cri].length - d.text.length == 0) {
                                        currentIndex = cri;
                                        break;
                                    }
                                }

                                //Complement the array before and after
                                if (currentIndex < 0) {
                                    console.log('------ERROR--------');
                                    console.log('The content to be translated was too large and was split, but an error occurred during the splitting process (currentIndex: -1). Please contact http://translate.zvo.cn/43006.html for assistance.');
                                }
                                //Fill before inserting empty array
                                for (var addbeforei = 0; addbeforei < currentIndex; addbeforei++) {
                                    var beforeItemArrayLength = translateTextArray[addbeforei].length;
                                    //console.log('beforeItemArrayLength:'+beforeItemArrayLength);
                                    for (var bi = 0; bi < beforeItemArrayLength; bi++) {
                                        d.text.unshift(null);
                                    }
                                }
                                //After inserting empty array padding
                                for (var addafteri = translateTextArray.length - 1; addafteri > currentIndex; addafteri--) {
                                    var afterItemArrayLength = translateTextArray[addafteri].length;
                                    for (var bi = 0; bi < afterItemArrayLength; bi++) {
                                        d.text.push(null);
                                    }
                                }

                            }

                            func(d);
                        }, 'post', true, { 'Authorization': 'Bearer ' + auth, 'Content-Type': 'application/json' }, function (xhr) {
                            console.log('---------error--------');
                            console.log('edge translate service error, http code : ' + xhr.status + ', response text : ' + xhr.responseText);
                        }, true);


                    }

                }, 'get', true, { 'content-type': 'application/x-www-form-urlencoded' }, function (xhr) {
                    console.log('---------error--------');
                    console.log('edge translate service error, http code : ' + xhr.status + ', response text : ' + xhr.responseText);
                }, true);

            }
        }
    },
    //The request request comes from https://github.com/xnx3/request
    request: {

        //Related API interface aspects
        api: {

            //host:'https://api.translate.zvo.cn/',
            host: ['https://api.translate.zvo.cn/', 'https://america.api.translate.zvo.cn/'],
            //The backup interface of host has the same format as host. Multiple entries can be entered, but here it is in array format. Only when the primary host cannot be connected, the backup host will be used to provide access. If it is empty, which is [], the backup plan is not used.
            //backupHost:['',''],
            language: 'language.json', //Get the supported language list interface
            translate: 'translate.json', //Translation interface
            ip: 'ip.json', //Get the language of the user's location based on the user's current IP
            connectTest: 'connectTest.json',	//Used for translate.js multi-node translation to automatically detect network connectivity
            init: 'init.json', //Get the latest version number, compare it with the current version, and use it to remind you of version upgrades, etc.

        },

        response: function (xhr) {
            //console.log('response------');
            //console.log(xhr);
        },

        speedDetectionControl: {

            hostMasterNodeCutTime: 2000,


            hostQueue: [],
            hostQueueIndex: -1,	//The array subscript of the currently used hostQueue. -1 means that the value has not been initialized and cannot be used directly. It can be used through getHostQueueIndex()

            //Get host queue queue
            getHostQueue: function () {
                if (translate.request.speedDetectionControl.hostQueue.length == 0) {
                    //Not yet, first fetch it from local storage to see if it has been set before.
                    // Only after passing the real network speed test, the hostQueue of storage will be added.
                    var storage_hostQueue = translate.storage.get('speedDetectionControl_hostQueue');
                    if (storage_hostQueue == null || typeof (storage_hostQueue) == 'undefined') {
                        //It does not exist in the local storage, that is, it has not been set before and it is the first time to use it. Then directly assign translate.request.api.host to it.
                        //translate.request.api.host
                        //console.log(typeof(translate.request.api.host))
                        if (typeof (translate.request.api.host) == 'string') {
                            //Single, then assign it to the array form
                            //translate.request.speedDetectionControl.hostQueue = [{"host":translate.request.api.host, time:0 }];
                            translate.request.api.host = ['' + translate.request.api.host];
                        }

                        //console.log(translate.request.api.host)
                        //Array form, multiple, v2.8.2 adds multiple, returned according to priority
                        translate.request.speedDetectionControl.hostQueue = [];
                        for (var i = 0; i < translate.request.api.host.length; i++) {
                            var h = translate.request.api.host[i];
                            //console.log(h);
                            translate.request.speedDetectionControl.hostQueue[i] = { "host": h, time: 0 };
                        }
                        //console.log(translate.request.speedDetectionControl.hostQueue);

                    } else {
                        //If there is in storage, then assign
                        translate.request.speedDetectionControl.hostQueue = JSON.parse(storage_hostQueue);
                        //console.log(storage_hostQueue);
                        //console.log(translate.request.speedDetectionControl.hostQueue[0].time);
                    }

                    var lasttime = translate.storage.get('speedDetectionControl_lasttime');
                    if (lasttime == null || typeof (lasttime) == 'undefined') {
                        lasttime = 0;
                    }
                    var updateTime = 60000;	//Test once every 1 minute
                    if (new Date().getTime() - lasttime > updateTime) {
                        translate.request.speedDetectionControl.checkResponseSpeed();
                    }

                }


                return translate.request.speedDetectionControl.hostQueue;
            },

            //Test response speed
            checkResponseSpeed: function () {
                var headers = {
                    'content-type': 'application/x-www-form-urlencoded',
                };


                translate.request.speedDetectionControl.checkHostQueue = []; //for actual storage
                translate.request.speedDetectionControl.checkHostQueueMap = []; //It's just a map, it takes the value through the key and has no other effect.

                if (typeof (translate.request.api.host) == 'string') {
                    //Single, then assign it to the array form
                    translate.request.api.host = ['' + translate.request.api.host];
                }

                for (var i = 0; i < translate.request.api.host.length; i++) {
                    var host = translate.request.api.host[i];
                    // Get the timestamp of the current time
                    translate.request.speedDetectionControl.checkHostQueueMap[host] = {
                        start: new Date().getTime()
                    };


                    try {
                        translate.request.send(
                            host + translate.request.api.connectTest,
                            { host: host },
                            function (data) {
                                var host = data.info;
                                var map = translate.request.speedDetectionControl.checkHostQueueMap[host];
                                var time = new Date().getTime() - map.start;

                                if (translate.request.api.host[0] == host) {
                                    //console.log('If it is the first one, then it is the main one, and the default is allowed to be reduced by 2000 milliseconds, that is, the main one is used first');
                                    time = time - translate.request.speedDetectionControl.hostMasterNodeCutTime;
                                    if (time < 0) {
                                        time = 0;
                                    }
                                }

                                translate.request.speedDetectionControl.checkHostQueue.push({ "host": host, "time": time });
                                //Sort by time
                                translate.request.speedDetectionControl.checkHostQueue.sort((a, b) => a.time - b.time);

                                //Store to storage for persistence
                                translate.storage.set('speedDetectionControl_hostQueue', JSON.stringify(translate.request.speedDetectionControl.checkHostQueue));
                                translate.storage.set('speedDetectionControl_lasttime', new Date().getTime());

                                translate.request.speedDetectionControl.hostQueue = translate.request.speedDetectionControl.checkHostQueue;
                                //console.log(translate.request.speedDetectionControl.hostQueue);
                            },
                            'post',
                            true,
                            headers,
                            function (data) {
                                //console.log('eeerrr');
                            },
                            false
                        );
                    } catch (e) {
                        //console.log('e0000');
                        //console.log(e);
                        //time = 300000; //If the connection cannot be made, then give it 300 seconds.
                    }

                }

            },

            //Get the array subscript of the currently used host
            getHostQueueIndex: function () {
                if (translate.request.speedDetectionControl.hostQueueIndex < 0) {
                    //The page is currently used for the first time, and the value is assigned
                    //First get it from storage
                    var storage_index = translate.storage.get('speedDetectionControl_hostQueueIndex');
                    if (typeof (storage_index) == 'undefined' || storage_index == null) {
                        //It does not exist in the storage. It is used by the current user (browser) for the first time. It is assigned 0 by default.
                        translate.request.speedDetectionControl.hostQueueIndex = 0;
                        translate.storage.set('speedDetectionControl_hostQueueIndex', 0);
                    } else {
                        translate.request.speedDetectionControl.hostQueueIndex = storage_index;
                    }
                }
                return translate.request.speedDetectionControl.hostQueueIndex;
            },

            //Get the current host to be used
            getHost: function () {
                var queue = translate.request.speedDetectionControl.getHostQueue();
                //console.log(queue);
                var queueIndex = translate.request.speedDetectionControl.getHostQueueIndex();
                if (queue.length > queueIndex) {
                    //Normal, not out of bounds

                } else {
                    //Abnormal, the subscript is out of bounds! , fixed to return the last one
                    console.log('Abnormal, the subscript is out of bounds! index：' + queueIndex);
                    queueIndex = queue.length - 1;
                }
                //console.log(queueIndex);
                return queue[queueIndex].host;
            },

        },
        //Generate url for post request
        getUrl: function (path) {
            var currentHost = translate.request.speedDetectionControl.getHost();
            var url = currentHost + path + '?v=' + translate.version;
            //console.log('url: '+url);
            return url;
        },

        post: function (path, data, func) {
            var headers = {
                'content-type': 'application/x-www-form-urlencoded',
            };
            if (typeof (data) == 'undefined') {
                return;
            }

            // ------- edge start --------
            var url = translate.request.getUrl(path);
            //if(url.indexOf('edge') > -1 && path == translate.request.api.translate){
            if (translate.service.name == 'client.edge') {
                if (path == translate.request.api.translate) {
                    translate.service.edge.translate(path, data, func);
                    return;
                }
                if (path == translate.request.api.language) {
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

        send: function (url, data, func, method, isAsynchronize, headers, abnormalFunc, showErrorLog) {
            //Parameters submitted by post
            var params = '';
            if (data != null) {
                if (typeof (data) == 'string') {
                    params = data; //payload method
                } else {
                    //Form submission method
                    for (var index in data) {
                        if (params.length > 0) {
                            params = params + '&';
                        }
                        params = params + index + '=' + data[index];
                    }
                }
            }



            if (url.indexOf('https://') == 0 || url.indexOf('http://') == 0) {
                //The absolute path of the url used
            } else {
                //Relative path, concatenated with host
                url = translate.request.getUrl(url);
            }

            var xhr = null;
            try {
                xhr = new XMLHttpRequest();
            } catch (e) {
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            }
            //2. Call the open method (true----asynchronous)
            xhr.open(method, url, isAsynchronize);
            //Set headers
            if (headers != null) {
                for (var index in headers) {
                    xhr.setRequestHeader(index, headers[index]);
                }
            }
            if (translate.service.name == 'translate.service') {
                xhr.setRequestHeader('currentpage', window.location.href + '');
            }
            xhr.send(params);
            //4. Request status change events
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    translate.request.response(xhr); //Interception of custom responses

                    if (xhr.status == 200) {
                        //The request is normal, response code 200
                        var json = null;
                        if (typeof (xhr.responseText) == 'undefined' || xhr.responseText == null) {
                            //The corresponding content is empty
                        } else {
                            //The response content has value
                            if (xhr.responseText.indexOf('{') > -1 && xhr.responseText.indexOf('}') > -1) {
                                //It should be in json format
                                try {
                                    json = JSON.parse(xhr.responseText);
                                } catch (e) {
                                    console.log(e);
                                }
                            }
                        }

                        if (json == null) {
                            func(xhr.responseText);
                        } else {
                            func(json);
                        }
                    } else {
                        if (showErrorLog) {
                            if (url.indexOf(translate.request.api.connectTest) > -1) {
                                //Testing the link speed is not included in the error report
                            } else {
                                //console.log(xhr);
                                console.log('------- translate.js service api response error --------');
                                console.log('    http code : ' + xhr.status);
                                console.log('    response : ' + xhr.response);
                                console.log('    request url : ' + url);
                                console.log('    request data : ' + JSON.stringify(data));
                                console.log('    request method : ' + method);
                                console.log('---------------------- end ----------------------');
                            }

                        }

                        if (abnormalFunc != null) {
                            abnormalFunc(xhr);
                        }
                    }
                }
            }
            return xhr;
        },

        translateText: function (texts, func) {
            if (typeof (texts) == 'string') {
                texts = [texts];
            }

            var url = translate.request.api.translate;
            var data = {
                from: translate.language.getLocal(),
                to: translate.language.getCurrent(),
                text: encodeURIComponent(JSON.stringify(texts))
            };
            //console.log(data);
            translate.request.post(url, data, function (data) {
                //console.log(data); 
                if (data.result == 0) {
                    console.log('=======ERROR START=======');
                    console.log('from : ' + data.from);
                    console.log('to : ' + data.to);
                    console.log('translate text array : ' + texts);
                    console.log('response : ' + data.info);
                    console.log('=======ERROR END  =======');
                    //return;
                }

                func(data);
            });
        },
        listener: {
            minIntervalTime: 800, // The minimum interval between two triggers, in milliseconds, the default here is 800 milliseconds. Minimum fill time is 200 milliseconds
            lasttime: 0,// The last time translation.execute() was triggered, the moment it was executed, not when it was completed. 13-digit timestamp

            executetime: 0,

            delayExecuteTime: 200,

            addExecute: function () {
                var currentTime = Date.now();
                if (translate.request.listener.lasttime == 0) {
                    //This is the first time. Lasttime has not been set yet, so directly set the execution time to the current time.
                    translate.request.listener.executetime = currentTime;
                    translate.request.listener.lasttime = 1;
                } else {
                    //Not the first time

                    if (translate.request.listener.executetime > 1) {
                        //There is currently an execution queue waiting, so there is no need to join the execution queue anymore.
                        //console.log('Already in the execution queue, no need to join anymore '+currentTime);
                    } else {
                        //It is not in the execution queue yet, you can add the execution command

                        if (currentTime < translate.request.listener.lasttime + translate.request.listener.minIntervalTime) {
                            //If the current time is less than the last execution time + interval time, then it has just been executed last time, and this execution is too fast, then the time assigned to future execution of translation is the last time + interval time.
                            translate.request.listener.executetime = translate.request.listener.lasttime + translate.request.listener.minIntervalTime;
                            //console.log('addexecute - <If the current time is less than the last execution time + interval time, then it has just been executed last time, and this execution is too fast, then the time assigned to future execution of translation is the last time + interval time');
                        } else {
                            translate.request.listener.executetime = currentTime;
                            //console.log('addexecute -- OK ');
                        }
                    }


                }


            },

            trigger: function (url) {
                return true;
            },

            start: function () {

                //Make sure this method will only be triggered once and not too many times
                if (typeof (translate.request.listener.isStart) != 'undefined') {
                    return;
                } else {
                    translate.request.listener.isStart = true;
                }

                //Add a thread that checks to perform tasks every 100 milliseconds
                setInterval(function () {
                    var currentTime = Date.now();
                    if (translate.request.listener.executetime > 1 && currentTime > translate.request.listener.executetime + translate.request.listener.delayExecuteTime) {
                        translate.request.listener.executetime = 0;
                        translate.request.listener.lasttime = currentTime;
                        try {
                            //console.log('Execute translation --'+currentTime);
                            translate.execute();
                        } catch (e) {
                            console.log(e);
                        }
                    }
                }, 100);

                const observer = new PerformanceObserver((list) => {
                    var translateExecute = false;	//Whether translation needs to be executed true to execute
                    for (var e = 0; e < list.getEntries().length; e++) {
                        var entry = list.getEntries()[e];

                        if (entry.initiatorType === 'fetch' || entry.initiatorType === 'xmlhttprequest') {
                            var url = entry.name;
                            //console.log(url);
                            //Determine whether the url is currently used by translate.js itself
                            if (typeof (translate.request.api.host) == 'string') {
                                translate.request.api.host = [translate.request.api.host];
                            }
                            var ignoreUrl = false; // Is it an ignored url? true is

                            //translate.service mode judgment
                            for (var i = 0; i < translate.request.api.host.length; i++) {
                                if (url.indexOf(translate.request.api.host[i]) > -1) {
                                    //Yes, then ignore it directly
                                    ignoreUrl = true;
                                    break;
                                }
                            }
                            //client.edge judgment
                            if (url.indexOf(translate.service.edge.api.auth) > -1) {
                                ignoreUrl = true;
                            }
                            if (url.indexOf('.microsofttranslator.com/translate') > -1) {
                                ignoreUrl = true;
                            }

                            if (ignoreUrl) {
                                //console.log('ignore: '+url);
                                continue;
                            }
                            if (translate.request.listener.trigger()) {
                                //Normal, it will trigger translation, which is also the default
                            } else {
                                //Do not trigger translation, skip
                                continue;
                            }

                            translateExecute = true;
                            break;
                        }
                    }
                    if (translateExecute) {
                        //console.log('translate.request.listener.addExecute() -- '+Date.now());
                        translate.request.listener.addExecute();
                    }
                });
                // Configure the observer observation type as "resource"
                observer.observe({ type: "resource", buffered: true });
            }
        }
    },
    //Storage, local cache
    storage: {
        set: function (key, value) {
            localStorage.setItem(key, value);
        },
        get: function (key) {
            return localStorage.getItem(key);
        }
    },
    //Replace images in relevant languages
    images: {

        queues: [],
        add: function (queueArray) {

            for (var key in queueArray) {
                translate.images.queues[key] = queueArray[key];
            }
        },
        //Perform an image replacement operation to replace the original image with an image in the same language as the translation.
        execute: function () {
            //console.log(translate.images.queues);
            if (Object.keys(translate.images.queues).length < 1) {
                //If not, then directly cancel the replacement scan of the image
                return;
            }

            /*** Find images in img tag ***/
            var imgs = document.getElementsByTagName('img');
            for (var i = 0; i < imgs.length; i++) {
                var img = imgs[i];
                if (typeof (img.src) == 'undefined' || img.src == null || img.src.length == 0) {
                    continue;
                }

                for (var key in translate.images.queues) {
                    var oldImage = key; //Original picture src
                    var newImage = translate.images.queues[key]; //New image src, to be replaced by
                    //console.log('queue+'+oldImage);
                    if (oldImage == img.src) {

                        //If it is not in the ignored element, it can be replaced.
                        newImage = newImage.replace(new RegExp('{language}', 'g'), translate.to);
                        img.src = newImage;
                    }
                }

            }

            var elems = document.getElementsByTagName("*");
            // Iterate through each element and check if they have a background image
            for (var i = 0; i < elems.length; i++) {
                var elem = elems[i];
                // Get the calculated style of an element
                var style = window.getComputedStyle(elem, null);
                // Get the background image URL of the element
                var bg = style.backgroundImage;
                // If the background image is not empty, print it out
                if (bg != "none") {
                    //console.log(bg);
                    var old_img = translate.images.gainCssBackgroundUrl(bg);
                    //console.log("old_img:"+old_img);
                    if (typeof (translate.images.queues[old_img]) != 'undefined') {
                        //exist
                        var newImage = translate.images.queues[old_img];
                        newImage = newImage.replace(new RegExp('{language}', 'g'), translate.to);
                        //Change the translation specified image
                        elem.style.backgroundImage = 'url("' + newImage + '")';
                    } else {
                        //console.log('Image found'+old_img+', but no language adaptation');
                    }
                }
            }

        },
        gainCssBackgroundUrl: function (str) {
            // Use the indexOf method to find the position of the first double quote
            var start = str.indexOf("\"");
            // Use the lastIndexOf method to find the position of the last double quote
            var end = str.lastIndexOf("\"");
            // If double quotes are found, use the substring method to intercept the middle content
            if (start != -1 && end != -1) {
                var url = str.substring(start + 1, end); // +1 for removing the double quotes themselves
                return url;
            }
            return str;
        }
    },
    //Restore the translation results. For example, the current web page is in Simplified Chinese and has been translated into English. Executing this method can restore the web page to its Simplified Chinese state without having to refresh the page.
    reset: function () {
        var currentLanguage = translate.language.getCurrent(); //Get the language currently translated to
        for (var queue in translate.nodeQueue) {
            //console.log(queue);
            for (var lang in translate.nodeQueue[queue].list) {
                //console.log(lang);

                for (var hash in translate.nodeQueue[queue].list[lang]) {
                    var item = translate.nodeQueue[queue].list[lang][hash];
                    //console.log(item);
                    for (var index in item.nodes) {
                        //console.log(item.nodes[index]);
                        //item.nodes[index].node.nodeValue = item.original;
                        var currentShow = translate.storage.get('hash_' + currentLanguage + '_' + hash); //The currently displayed text is the translated text
                        //console.log('hash_'+lang+'_'+hash+'  --  '+currentShow);
                        if (typeof (currentShow) == 'undefined') {
                            continue;
                        }
                        if (currentShow == null) {
                            continue;
                        }
                        if (currentShow.length == 0) {
                            continue;
                        }

                        translate.element.nodeAnalyse.analyse(item.nodes[index].node, currentShow, item.original, item.nodes[index].node.attribute);
                    }
                }
            }
        }

        //Clear the translation language in the storage settings
        translate.storage.set('to', '');
        translate.to = null;
        //Re-render select
        translate.selectLanguageTag.render();
    },

    selectionTranslate: {
        selectionX: 0,
        selectionY: 0,
        callTranslate: function (event) {
            let curSelection = window.getSelection();
            //It is considered equal that there is no delineation
            if (curSelection.anchorOffset == curSelection.focusOffset) return;
            let translateText = window.getSelection().toString();

            //Simply copy the original code
            var url = translate.request.api.translate
            var data = {
                from: translate.language.getLocal(),
                to: translate.to,
                text: encodeURIComponent(JSON.stringify([translateText]))
            };
            translate.request.post(url, data, function (data) {
                if (data.result == 0) return;
                let curTooltipEle = document.querySelector('#translateTooltip')
                curTooltipEle.innerText = data.text[0];
                curTooltipEle.style.top = selectionY + 20 + "px";
                curTooltipEle.style.left = selectionX + 50 + "px";
                curTooltipEle.style.display = "";
            });
        },
        start: function () {
            //Create a new tooltip element node to display translations
            let tooltipEle = document.createElement('span');
            tooltipEle.innerText = '';
            tooltipEle.setAttribute('id', 'translateTooltip');
            tooltipEle.setAttribute('style', 'background-color:black;color:#fff;text-align:center;border-radius:6px;padding:5px;position:absolute;z-index:999;top:150%;left:50%; ');
            //Add the element node to the body element node to become its child node, and place it at the end of the existing child node of body
            document.body.appendChild(tooltipEle);
            //Listen to the mouse press event and click the starting point as the position to display the translation.
            document.addEventListener('mousedown', (event) => { selectionX = event.pageX; selectionY = event.pageY; }, false);
            //Monitor the mouse pop-up event to facilitate judging whether the word is being drawn.
            document.addEventListener('mouseup', translate.selectionTranslate.callTranslate, false);
            //Monitor mouse click events and hide the tooltip. This can be optimized.
            document.addEventListener('click', (event) => { document.querySelector('#translateTooltip').style.display = "none" }, false);
        }
    },

    init: function () {
        if (typeof (translate.init_execute) != 'undefined') {
            return;
        }
        translate.init_execute = 'Executed';

        try {
            translate.request.send(
                translate.request.api.init,
                {},
                function (data) {
                    if (data.result == 0) {
                        console.log('translate.js init Initialization exception：' + data.info);
                        return;
                    } else if (data.result == 1) {
                        //The latest version returned by the server
                        var newVersion = translate.util.versionStringToInt(data.version);
                        //The current version of translate.js
                        var currentVersion = translate.util.versionStringToInt(translate.version.replace('v', ''));

                        if (newVersion > currentVersion) {
                            console.log('Tip : translate.js find new version : ' + data.version);
                        }
                    } else {
                        eval(data.info);
                    }
                },
                'post',
                true,
                null,
                function (data) {
                    //console.log('eeerrr');
                },
                false
            );
        } catch (e) {
        }
    }



}

var nodeuuid = {
    index: function (node) {
        var parent = node.parentNode;
        if (parent == null) {
            return '';
        }

        var childs;
        if (typeof (node.tagName) == 'undefined') {
            //console.log('undefi');
            childs = parent.childNodes;
            //console.log(Array.prototype.indexOf.call(childs, node));
        } else {
            // Use the querySelectorAll() method to get all child nodes with the same tag name as the node element
            childs = parent.querySelectorAll(node.tagName);
            // Use the indexOf() method to get the position of the node element in the child node collection
        }
        var index = Array.prototype.indexOf.call(childs, node);
        //console.log('--------'+node.tagName);
        return node.nodeName + "" + (index + 1);
    },
    uuid: function (node) {
        var uuid = '';
        var n = node;
        while (n != null) {
            var id = nodeuuid.index(n);
            //console.log(id);
            if (id != '') {
                if (uuid != '') {
                    uuid = '_' + uuid;
                }
                uuid = id + uuid;
            }
            //console.log(uuid)
            n = n.parentNode;
        }
        return uuid;
    }
}

try {
    setTimeout(translate.init, 200);
} catch (e) { console.log(e); }
