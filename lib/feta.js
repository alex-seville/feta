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
        report: function(newWindow){
            var output;
            output += "\n//starting test\n";
            for(var i=0;i<trackedEvents.length;i++){
                var e = trackedEvents[i];
                output += ("#"+(i+1)+ " "+ e.type+" event triggered from "+ identifySrc(e.srcElement) +" at "+e.timeStamp+"\n");
            }
            output += "//end test\n";
            if (newWindow){
                //added a link to download or view the data
                //document.body.appendChild("data:text/plain;charset=UTF-8,"+encodeURIComponent(output), 'test');
            }else{
                console.log(output);
            }
        }
    };
})(document);
//@ sourceURL=trackEvents.js
