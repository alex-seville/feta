window.feta = (function(document,$){

    //these are the events we track for now
    var events =
    [
        "click",
        "focus",
        //"keydown", //this needs to be worked on
        //"change", //this needs to be worked on
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
                 !$(base).data("events").click ||
                 $(base).data("events").click.handler !== globalHandler)){
                    
                    $(base).on(events[j],globalHandler);
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

    function globalHandler(e)
    {
        if (trackingEnabled ){
            e.selector = getSelector(e.target);
            if (trackedEvents.length > 0){
                
                var last = trackedEvents[trackedEvents.length-1];
                if (last.timeStamp == e.timeStamp &&
                    last.type == e.type &&
                    last.target == e.target){
                    return;
                }
            }
            
            if (e.target == window &&
                (e.type == "focus" || e.type == "blur")){
                return;
            }

            console.log("TRACKING EVENT");
            
            trackedEvents.push(e);
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
                timeStamp: e.timeStamp
            }
        );
    }

    function getSelector(elem){
        if ($(elem).parents().length === 0){
            return "DOCUMENT";
        }
        var selector =  $(elem).parents()[0] !== $("body")[0] ?
                        $(elem).parents()
                            .map(function() {
                                var par=this.tagName + getIdClass(this);
                                //determine which sibling
                                if ($(par).index($(this)) < 0){
                                    console.log("par:",par);
                                }
                                var extra=$(par).length === 1 ? "" : ":nth-child("+($(par).index($(this))+1)+")";
                                return par+extra;
                            })
                            .get().reverse().join(" ")
                        : null;

        if (selector) {
          selector += " ";
        }else{
            selector = "";
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

    return{
        start: function (){
            trackedEvents=[];
            trackingEnabled=true;
        },
        stop: function(cb){
            trackingEnabled=false;
            
            var output="";
            for(var i=0;i<trackedEvents.length;i++){
                output += outputEventRaw(trackedEvents[i])+",";
            }
            
            this.saveAsJS('{ "playlist": [' +output.slice(0,output.length-1) +']}',
                cb ? function(evalcode){
                cb({
                    events: trackedEvents,
                    JS: evalcode
                });
            } : null);
        },
        saveAsJS: function(report,cb){
            var reportAsJS="(function($){\n";
            reportAsJS+= "function regression(){\n";
            reportAsJS+= "var regressions=[];\n";
            reportAsJS+= "return {\n";
            reportAsJS+= "add: function(item){\n";
            reportAsJS+= "item = item || '';\n";
            reportAsJS+= "regressions.push(item);\n";
            reportAsJS+= "},\n";
            reportAsJS+= "checkIfRegressed: function(cb){\n";
            reportAsJS+= "var res = regressions.length > 0;\n";
            reportAsJS+= "if (cb){\n";
            reportAsJS+= "cb(res,regressions);\n";
            reportAsJS+= "}else{\n";
            reportAsJS+= "if (res ){\n";
            reportAsJS+= "console.log('FETA:Regression!');\n";
            reportAsJS+= "}else{\n";
            reportAsJS+= "console.log('FETA:No Regression.');\n";
            reportAsJS+= "}\n";
            reportAsJS+= "}\n";
            reportAsJS+= "}\n";
            reportAsJS+= "};\n";
            reportAsJS+= "}\n";
            reportAsJS+= "var r = new regression();\n";
            var playlist = JSON.parse(report).playlist;
            
            var delay = 0;
            var setTimeoutStr =  "setTimeout(function(){";
            for(var i=0;i<playlist.length;i++){
               
                var evt = playlist[i];
               
                reportAsJS += "$('"+evt.elem+"').trigger('"+evt.type+"');\n";
                reportAsJS += "//add any verification code here\n";
                reportAsJS += "//use `r.add()`\n";
                  if (i > 0){
                     reportAsJS += " } ,"+delay+");\n";
                }
                if (i+1 < playlist.length){
                    delay += playlist[i+1].timeStamp - evt.timeStamp;
                }

                reportAsJS += setTimeoutStr;
            }
            reportAsJS += "\n//Add your verification code here\n";
            reportAsJS += "r.checkIfRegressed();\n";
            reportAsJS += "},"+(delay+100)+");";
            reportAsJS += "\n})(jQuery);\n";
            reportAsJS += "\n//@ sourceURL=outputScript.js";
                      
            (cb || eval).call(this,reportAsJS);
        }
    };
})(document,jQuery);
//@ sourceURL=feta.js
