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

     //events
    $(document).on('feta.hasRegression',function(hasRegressed){
       
        if (hasRegressed.data){
            alert("Regression detected: "+hasRegressed);
        }else{
            alert("No regressions");
        }
    });

    return{
        start: function (){
            trackedEvents=[];
            trackingEnabled=true;
        },
        stop: function(cb,ret){
            trackingEnabled=false;
            
            var output="";
            for(var i=0;i<trackedEvents.length;i++){
                output += outputEventRaw(trackedEvents[i])+",";
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
            var reportAsJS="//TestSetup\n(function($){";
            reportAsJS+= "function regression(){";
            reportAsJS+= "var regressions=[];";
            reportAsJS+= "return {";
            reportAsJS+= "add: function(item){";
            reportAsJS+= "item = item || '';";
            reportAsJS+= "regressions.push(item);";
            reportAsJS+= "},";
            reportAsJS+= "checkIfRegressed: function(cb){";
            reportAsJS+= "var res = regressions.length > 0;";
            reportAsJS+= "if (cb){";
            reportAsJS+= "cb(res,regressions);";
            reportAsJS+= "}else{";
            reportAsJS+= "if (res ){";
            reportAsJS+= "$(document).trigger('feta.hasRegression',{data: regressions});";
            reportAsJS+= "console.log('FETA:Regression!');";
            reportAsJS+= "}else{";
            reportAsJS+= "$(document).trigger('feta.hasRegression',{});";
            reportAsJS+= "console.log('FETA:No Regression.');";
            reportAsJS+= "}";
            reportAsJS+= "}";
            reportAsJS+= "}";
            reportAsJS+= "};";
            reportAsJS+= "}";
            reportAsJS+= "var r = new regression();\n\n";
            var playlist = JSON.parse(report).playlist;
            
            var delay = 0;
            var setTimeoutStr =  "setTimeout(function(){";
            for(var i=0;i<playlist.length;i++){
               
                var evt = playlist[i];
               
                reportAsJS += "\t$('"+evt.elem+"').trigger('"+evt.type+"');\n";
                reportAsJS += "\t//add any verification code here\n";
                reportAsJS += "\t//use `r.add()` or $(document).trigger('feta.regression',[data])\n";
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

                  
            if (ret){
                return reportAsJS;
            }else{
                (cb || eval).call(this,reportAsJS);
            }
        }
    };



})(document,jQuery);
//@ sourceURL=feta.js
