window.feta = (function(document,$){

    //these are the events we track for now
    var events =
    [
        "click",
        "focus",
        "keydown",
        "blur",
        "change" //plus the rest
    ];

    function bindall(base){
        for(var j = 0; j < events.length; j++)
        {
            if ($(base).on){
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
        }
        
    
    }

    function identifySrc(el){
        if (!el || el == document){ return ""; }
        return (el.id || el.className || (el.tagName ? (identifySrc(el.parentNode) + " " + el.tagName): "DOCUMENT") );
    }

    function outputEvent(e){
        if (e.type == "click" ||
            e.type == "blur" ||
            e.type == "focus"){
            return e.type+
                " event triggered from "+
                identifySrc(e.target)+
                " at "+e.timeStamp;
        }
        if (e.type == "keydown"){
            return e.type+
                " event triggered with "+
                e.keyCode+
                " at "+e.timeStamp;
        }
        return e.type +
            " event triggered from "+
            identifySrc(e.target)+
                " at "+e.timeStamp;
    }

    function outputEventRaw(e){
        return JSON.stringify(
            {
                type: e.type,
                elem: getSelector(e.target),
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
                            .map(function() { return this.tagName + getIdClass(this); })
                            .get().reverse().join(" ")
                        : null;

        if (selector) {
          selector += " ";
        }else{
            selector = "";
        }
        selector += $(elem)[0].nodeName;

        selector += getIdClass(elem);
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

    function renderOutput(indx,raw){
        if(raw){
            return outputEventRaw(trackedEvents[indx])+",";
        }else{
            return ("#"+(indx+1)+ " "+ outputEvent(trackedEvents[indx])+"\n");
        }
    }

    function playEvent(playlist,before){
        if (playlist.length > 0){
            var evt = playlist.shift();
            
            var delay = 0;
            if (playlist.length > 0){
                delay = playlist[0].timeStamp - evt.timeStamp;
            }
            console.log("Playing event:",evt.type,",",evt.elem);
            
            $(evt.elem).trigger(evt.type);
            setTimeout(function(){ playEvent(playlist,before); } ,delay);
        }else{
            console.log("RAW:",trackedEvents);
            
            var after = feta.stop(false,true,function(out){
                if (before == out.length){
                    console.log("NO REGRESSION");
                }else{
                    console.log("POSSIBLE REGRESSION, EXPECTED "+before+" BUT SAW ",JSON.parse(out).playlist.length,"\nEVENTS:",out);
                }
                console.log("Done.");
            });
            

        }
    }

    return{
        start: function (){
            trackedEvents=[];
            trackingEnabled=true;
            var root = document.body;
            console.log("binding event handlers");
            bindall(root);
            console.log("done binding");
        },
        stop: function(noReport,raw,cb){
            trackingEnabled=false;
            if (!noReport){
                this.report(raw,cb);
            }
        },
        report: function(raw,cb){
            var output="";
            for(var i=0;i<trackedEvents.length;i++){
                output += renderOutput(i,raw);
            }
            if (cb){
                cb('{ "playlist": [' +output.slice(0,output.length-1) +']}');
            }else{
                console.log("//start\n"+output+"//end\n");
            }
        },
        play: function(script){
            console.log(script);
            var playlist = JSON.parse(script).playlist;
            //we want to match the playback
            var before = playlist.length;
            feta.start();
            console.log("Playing...");
            playEvent(playlist,before);
            
            
        }
    };
})(document,jQuery);
//@ sourceURL=trackEvents.js
