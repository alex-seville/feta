window.feta = (function(document){

    //these are the events we track for now
    var events =
    [
        "onclick",
        "onfocus",
        "onkeydown",
        "onblur",
        "onchange" //plus the rest
    ];

    function bindall(base){
        for(var j = 0; j < events.length; j++)
        {
            base[events[j]]=globalHandler(base[events[j]]);
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

    function globalHandler(handler)
    {
        return function(e){
            if (trackingEnabled){
                console.log("TRACKING EVENT");
                trackedEvents.push(e);
            }
            if (handler){
                handler(e);
            }
        };
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
                identifySrc(e.srcElement)+
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
            identifySrc(e.srcElement)+
                " at "+e.timeStamp;
    }

    function outputEventRaw(e){
        return JSON.stringify(
            {
                type: e.type,
                elem: getSelector(e.srcElement),
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
                            .map(function() { return elem.tagName; })
                            .get().reverse().join(" ")
                        : null;

        if (selector) {
          selector += " ";
        }else{
            selector = "";
        }
        selector += $(elem)[0].nodeName;

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

    function playEvent(evt){
        $(evt.elem).trigger(evt.type);
    }

    return{
        start: function (){
            trackingEnabled=true;
            var root = document.body;
            console.log("binding event handlers");
            bindall(root);
            console.log("done binding");
        },
        stop: function(noReport){
            trackingEnabled=false;
            if (!noReport){
                this.report();
            }
        },
        report: function(raw,cb){
            var output="";
            for(var i=0;i<trackedEvents.length;i++){
                output += renderOutput(i,raw);
            }
            if (cb){
                cb(output.slice(-1));
            }else{
                console.log("//start\n"+output+"//end\n");
            }
        },
        play: function(script){
            var playlist = JSON.parse(script);
            console.log("Playing...");
            while(playlist.length > 0){
                playEvent(playlist.shift());
            }
            console.log("Done.");
        }
    };
})(document);
//@ sourceURL=trackEvents.js
