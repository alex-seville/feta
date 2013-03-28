function fetaSrc(){
    this.source = fetaStr;
}
fetaSrc.prototype.startStr = function(initial){
    var initialStr = JSON.string
    return "feta.start();";
};
fetaSrc.prototype.hasFeta = function(){
    return "typeof feta !== 'undefined';";
};
fetaSrc.prototype.stopStr = function(){
    return "feta.stop(null,true);";
};
fetaSrc.prototype.isPlayingStr = function(){
    return "feta.isPlaying() ? null : feta.lastRegression();";
};
fetaSrc.prototype.loadStr = function(){
    //loading code for feta, we check is jquery already exists on the page
    //if not, we load in a copy
    return "(function(){ if (typeof jQuery === 'undefined'){"+
            "var _s=document.createElement('script');"+
            "_s.type='text/javascript';"+
            "_s.src='http://code.jquery.com/jquery-1.9.1.min.js';"+
            "_s.onload=function(){ "+fetaStr +"};"+
            "_s.onerror=function(){ console.error('Error loading Feta');};"+
            "document.body.appendChild(_s);"+
            "}else{"+
            fetaStr +"} return true; })();";
};

(root||window).fetaSource = new fetaSrc();