(function(document,window){
var events =
[   
    "onclick",
    "onfocus",
    "onblur",
    "onchange" //plus the rest
];



window.startTrackEvents = function (){
    var root = document.body;
    console.log("binding event handlers");
    bindall(root);
    console.log("done binding");
};
function bindall(base){
    var elms = base.childNodes;
    if (elms){
        for(var i = 0; i < elms.length; i++)
        {
            for(var j = 0; j < events.length; j++)
            {
                elms[i][events[j]] =globalHandler;           
            }
            bindall(elms[i]);
        }
    }
}
function globalHandler(e)
{
    if (!window.trackEvents){
        window.trackEvents = [];
    }
    console.log("TRACKING EVENT");
    window.trackEvents.push(e);
}

window.trackEventsPlayBack = function(){
    globalHandler = function(){};
    playback();
};

function playback(){
    console.log("//starting test");
    for(var i=0;i<window.trackEvents.length;i++){
        var e = window.trackEvents[i];
        console.log("#"+(i+1)+ " "+ e.type+" event triggered from "+e.srcElement.id+" at "+e.timeStamp);
    }
    console.log("//end test");
}
if (window.tracking){
window.trackEventsPlayBack();
window.tracking=false;
}else{
window.tracking=true;
window.startTrackEvents();
}

})(document,window);
//@ sourceURL=trackEvents.js
