window.feta = (function(document,$){

    //these are the events we track for now
    var events =
    [
        "click",
        "dblclick",
        "focus",
        "keypress",
        "change",
        "blur"
    ];

    //Unused for now, but might be handy
    function loadScript(url) {
        s = document.createElement('script');
        s.src =url;
        document.body.appendChild(s);
    }

    function bindall(base){
        for(var j = 0; j < events.length; j++)
        {
            //bind if we can,
            //and if not already binded by feta
            if ($(base).on &&
                (!$(base).data("events") ||
                 !$(base).data("events")[events[j]] ||
                 $(base).data("events")[events[j]].handler !== globalHandler)){
                    //we need to wrap this in a try statement
                    //otherwise it doesn't load in chrome.api
                    try{
                        $(base).on(events[j],globalHandler);
                    }catch(e){}
            }
        }

        var elms = base.childNodes;
        if (elms){
            for(var i = 0; i < elms.length; i++)
            {
                bindall(elms[i]);
            }
        }
    }

    var trackedEvents=[];
    var trackingEnabled=false;
    var localStorageEnabled=false;

    function globalHandler(e)
    {
        if (trackingEnabled ){
            e.selector = getSelector(e.target);
            if (trackedEvents.length > 0){

                var last = JSON.parse(trackedEvents[trackedEvents.length-1]);
                if (last.timeStamp == e.timeStamp &&
                    last.type == e.type &&
                    last.elem == e.selector){
                    return;
                }
            }

            if (e.target == window &&
                (e.type == "focus" || e.type == "blur")){
                return;
            }

            console.log("TRACKING EVENT");

            trackedEvents.push(outputEventRaw(e));
            if (localStorageEnabled){
                sessionStorage.setItem("fetaEvents",JSON.stringify(trackedEvents));
            }
            setTimeout(function(){
                bindall(document.body);
            },50);
        }
    }

    function outputEventRaw(e){
        return JSON.stringify(
            {
                type: e.type,
                elem: e.selector,
                timeStamp: e.timeStamp,
                key: e.type == "keypress" ? e.which : null
            }
        );
    }

    function getSelector(elem){
        if ($(elem).parents().length === 0){
            return "DOCUMENT";
        }
        var selector="";
        if( $(elem).parents()[0] !== $("body")[0]){
            $.each($(elem).parents().get().reverse(),function() {
                selector+=this.tagName + getIdClass(this);
                //determine which sibling
                var indx=$(selector).index($(this));
                if (indx < 0){
                    console.log("parent not in parent selector?");
                }
                var extra=$(selector).length === 1 ? "" : ":nth-child("+(indx+1)+")";
                selector+=extra+" ";
            });
        }

        selector += $(elem)[0].nodeName;

        selector += getIdClass(elem);
        //check sibling
        var $selector = $(selector);
        var selLen = $selector.length;
        if (selLen > 1){
            var indx=0;
            while(indx < selLen){
                if ($(selector)[indx]===elem){
                    selector += ":nth-child("+(indx+1)+")";
                    indx=selLen;
                }
                indx++;
            }
        }
        return selector;
    }

    function getIdClass(elem){
        if (elem.tagName.toUpperCase() == "BODY" || elem.tagName.toUpperCase() == "HTML"){
            return "";
        }
        var selector="";
        var id = $(elem).attr("id");
        if (id) {
          selector += "#"+ id;
        }

        var classNames = $(elem).attr("class");
        if (classNames) {
          selector += "." + $.trim(classNames).replace(/\s/gi, ".");
        }
        return selector;
    }

    var root = document.body;
    console.log("binding event handlers");
    bindall(root);
    console.log("done binding");
    var lastRegressionData;
     //events
    $(document).on('feta.hasRegression',function(e,hasRegressed){
        
        if (hasRegressed.data){

            lastRegressionData = hasRegressed.data;
        }else{
             lastRegressionData=[];
        }
    });
    var playing=false;
    $(document).on('feta.startPlaying',function(){
        playing=true;
    });
    $(document).on('feta.endPlaying',function(){
        playing=false;
    });

    return{
        isPlaying: function(){
            return playing;
        },
        lastRegression: function(){
            return  lastRegressionData;
        },
        start: function (useLocalStorage){
            //initial stack is used to prepopulate the event array when doing multi-page
            useLocalStorage = typeof sessionStorage !== 'undefined' && useLocalStorage;
            var existing = useLocalStorage ? sessionStorage.getItem("fetaEvents") : [];
            try{
                existing = JSON.parse(existing);
            }catch(e){
                existing = [];
            }
            trackedEvents= existing || [];
            alert("Starting with:",trackedEvents);
            trackingEnabled=true;
            localStorageEnabled=useLocalStorage;
        },
        stop: function(cb,ret){
            trackingEnabled=false;
            if (localStorageEnabled){
                sessionStorage.removeItem("fetaEvents",null);
            }

            var output="";
            for(var i=0;i<trackedEvents.length;i++){
                output += trackedEvents[i]+",";
            }

            return this.saveAsJS('{ "playlist": [' +output.slice(0,output.length-1) +']}',
                cb ?
                function(evalcode){
                cb({
                    events: trackedEvents,
                    JS: evalcode
                });
            } : null,ret);
        },
        saveAsJS: function(report,cb,ret){
            var reportAsJS="/* Recorded from "+document.location.href+" on "+new Date().toISOString()+" */\n";
            reportAsJS+= "/* TestSetup, you shouldn't need to modify this */\n";
            reportAsJS+= "(function($,PhantomJS){";
            reportAsJS+=    "$(document).trigger('feta.startPlaying');";
            reportAsJS+=    "function regression(){";
            reportAsJS+=        "var regressions=[];";
            reportAsJS+=        "return {";
            reportAsJS+=            "add: function(item){";
            reportAsJS+=                "item = item || '';";
            reportAsJS+=                "regressions.push(item);";
            reportAsJS+=            "},";
            reportAsJS+=            "checkIfRegressed: function(cb){";
            reportAsJS+=                "var res = regressions.length > 0;";
            reportAsJS+=                "if (cb){";
            reportAsJS+=                    "cb(res,regressions);";
            reportAsJS+=                "}else{";
            reportAsJS+=                    "if (res ){";
            reportAsJS+=                        "$(document).trigger('feta.hasRegression',{data: regressions});";
            reportAsJS+=                        "console.log('FETA:Regression!');";
            reportAsJS+=                    "}else{";
            reportAsJS+=                        "$(document).trigger('feta.hasRegression',{});";
            reportAsJS+=                        "console.log('FETA:No Regression.');";
            reportAsJS+=                    "}";
            reportAsJS+=                "}";
            reportAsJS+=            "}";
            reportAsJS+=        "};";
            reportAsJS+= "}";
            reportAsJS+= "var r = new regression();";
            reportAsJS+= "function keyEvent(keyCode,el){";
            reportAsJS+=    "var e = $.Event(\"keypress\");";
            reportAsJS+=     "e.keyCode=keyCode;";
            reportAsJS+=     "el.trigger(e);";
            reportAsJS+=     "var newVal=el.val();";
            reportAsJS+=     "if (keyCode === 46){";
            reportAsJS+=     "newVal = newVal.slice(0,newVal.length-1);";
            reportAsJS+=     "}";
            reportAsJS+=    "el.val(newVal+String.fromCharCode(keyCode));";
            reportAsJS+= "}\n\n";
            reportAsJS+= "var timeouts=[];\n";
            reportAsJS+= "/* Done TestSetup */\n\n\n";
            
            var playlist = JSON.parse(report).playlist;
            var delay = 0;
            var lastTime=0;
            var setTimeoutStr =  "timeouts.push({fcn:function(){";
            for(var i=0;i<playlist.length;i++){
                var evt = playlist[i];
                reportAsJS += "\n\t/*Only modify the selector if you notice a recording error*/";
                reportAsJS += "\n\tvar evtelem = $('"+evt.elem+"');\n";
                reportAsJS += "\n\tif (evtelem.length === 0){ r.add('Element not found: "+evt.elem+"');\n }else{\n";
                if (evt.type === "keypress"){
                    reportAsJS += "\tkeyEvent("+evt.key+",evtelem);\n";
                }else{
                    if (evt.type === "click"){
                        reportAsJS += "\n\t/* Don't modify */";
                        reportAsJS += "\n\tif(evtelem.prop('tagName').toUpperCase() === 'INPUT' &&";
                        reportAsJS+=     "(evtelem.prop('type').toUpperCase() === 'CHECKBOX' ||";
                        reportAsJS+=      "evtelem.prop('type').toUpperCase() === 'RADIO' )){";
                        reportAsJS+=     "evtelem.prop('checked',!evtelem.prop('checked'));";
                        reportAsJS+=     "}";
                        reportAsJS+=  "\n\t/* Done don't modify */\n";
                    }
                    reportAsJS += "\n\tevtelem.trigger('"+evt.type+"');\n";
                }
                reportAsJS += "\n\t}";
                reportAsJS += "\n\t/* add any verification code here */\n";
                reportAsJS += "\t/* use `r.add()` or $(document).trigger('feta.regression',[data]) */\n\n";
                  if (i > 0){
                     reportAsJS += " } ,time:"+(delay-lastTime)+"});\n\n";
                     lastTime = delay;
                }
                if (i+1 < playlist.length){
                    delay += playlist[i+1].timeStamp - evt.timeStamp;
                }

                reportAsJS += setTimeoutStr;
            }
            reportAsJS += "\n\n\t/* Add final verification code here */\n";
            reportAsJS += "\n\tr.checkIfRegressed();\n";
            reportAsJS += "\n\t/* leave the rest of the file as is*/\n\n";
            reportAsJS+= "\t$(document).trigger('feta.endPlaying');\n";
            reportAsJS+= "\tif (PhantomJS){ console.log(\"FETA_PHANTOMJS:done\");}\n";
            reportAsJS += "},time:"+(100)+"});";
            reportAsJS += "function doTimeouts(current){";
            reportAsJS += "if (current){";
            reportAsJS += "setTimeout(function(){";
            reportAsJS += "current.fcn();";
            reportAsJS += "doTimeouts(timeouts.shift());";
            reportAsJS += "},current.time);";
            reportAsJS += "} }";
            reportAsJS += "doTimeouts(timeouts.shift());";
            reportAsJS += "\n})(jQuery,typeof PhantomJS === 'undefined' ? null: PhantomJS);\n";

            if (ret){
                return reportAsJS;
            }else{
                (cb || eval).call(this,reportAsJS);
            }
        }
    };

})(document,jQuery);
//@ sourceURL=feta.js