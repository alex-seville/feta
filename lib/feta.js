window.feta = (function(document){

    //these are the events we track for now
    var events =
    [
        "onclick",
        "onfocus",
        "onblur",
        "onchange" //plus the rest
    ];

    function bindall(base){
        var elms = base.childNodes;
        if (elms){
            for(var i = 0; i < elms.length; i++)
            {
                bindall(elms[i]);
                for(var j = 0; j < events.length; j++)
                {
                    elms[i][events[j]] =globalHandler;
                }
                
            }
        }
    }

    var trackedEvents=[];
    var trackingEnabled=false;

    function globalHandler(e)
    {
        if (trackingEnabled){
            console.log("TRACKING EVENT");
            trackedEvents.push(e);
        }
    }

    function identifySrc(el){
        if (!el || el == document){ return ""; }
        return (el.id || el.className || (identifySrc(el.parentNode) + " " + el.tagName) );
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
        report: function(){
            console.log("//starting test");
            for(var i=0;i<trackedEvents.length;i++){
                var e = trackedEvents[i];
                console.log("#"+(i+1)+ " "+ e.type+" event triggered from "+ identifySrc(e.srcElement) +" at "+e.timeStamp);
            }
            console.log("//end test");
        }
    };
})(document);
//@ sourceURL=trackEvents.js
