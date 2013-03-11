(function(root){
function fetaSrc(){
    this.source = fetaStr;
}
fetaSrc.prototype.startStr = function(){
    return "feta.start();";
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
    return "if (typeof jQuery === 'undefined'){"+
            "var _s=document.createElement('script');"+
            "_s.type='text/javascript';"+
            "_s.src='http://code.jquery.com/jquery-1.9.1.min.js';"+
            "_s.onload=function(){ "+fetaStr +"};"+
            "_s.onerror=function(){ alert('Error loading Feta');};"+
            "document.body.appendChild(_s);"+
            "}else{"+
            fetaStr +"}";
};

(root||window).fetaSource = new fetaSrc();
var fetaStr="if (!window.feta){window.feta=function(e,n){function t(e){for(var o=0;i.length>o;o++)if(n(e).on&&(!n(e).data(\"events\")||!n(e).data(\"events\")[i[o]]||n(e).data(\"events\")[i[o]].handler!==r))try{n(e).on(i[o],r)}catch(s){}var a=e.childNodes;if(a)for(var l=0;a.length>l;l++)t(a[l])}function r(n){if(g){if(n.selector=s(n.target),l.length>0){var r=l[l.length-1];if(r.timeStamp==n.timeStamp&&r.type==n.type&&r.target==n.target)return}if(n.target==window&&(\"focus\"==n.type||\"blur\"==n.type))return;console.log(\"TRACKING EVENT\"),l.push(n),setTimeout(function(){t(e.body)},50)}}function o(e){return JSON.stringify({type:e.type,elem:e.selector,timeStamp:e.timeStamp,key:\"keypress\"==e.type?e.which:null})}function s(e){if(0===n(e).parents().length)return\"DOCUMENT\";var t=\"\";n(e).parents()[0]!==n(\"body\")[0]&&n.each(n(e).parents().get().reverse(),function(){t+=this.tagName+a(this);var e=n(t).index(n(this));0>e&&console.log(\"parent not in parent selector?\");var r=1===n(t).length?\"\":\":nth-child(\"+(e+1)+\")\";t+=r+\" \"}),t+=n(e)[0].nodeName,t+=a(e);var r=n(t),o=r.length;if(o>1)for(var s=0;o>s;)n(t)[s]===e&&(t+=\":nth-child(\"+(s+1)+\")\",s=o),s++;return t}function a(e){if(\"BODY\"==e.tagName.toUpperCase()||\"HTML\"==e.tagName.toUpperCase())return\"\";var t=\"\",r=n(e).attr(\"id\");r&&(t+=\"#\"+r);var o=n(e).attr(\"class\");return o&&(t+=\".\"+n.trim(o).replace(/\\s/gi,\".\")),t}var i=[\"click\",\"focus\",\"keypress\",\"blur\"],l=[],g=!1,c=e.body;console.log(\"binding event handlers\"),t(c),console.log(\"done binding\");var u;n(e).on(\"feta.hasRegression\",function(e){console.log(\"caught has regression event\"),u=e.has?e.data:[]});var f=!1;return n(e).on(\"feta.startPlaying\",function(){f=!0}),n(e).on(\"feta.endPlaying\",function(){f=!1}),{isPlaying:function(){return f},lastRegression:function(){return u},start:function(){l=[],g=!0},stop:function(e,n){g=!1;for(var t=\"\",r=0;l.length>r;r++)t+=o(l[r])+\",\";return this.saveAsJS('{ \"playlist\": ['+t.slice(0,t.length-1)+\"]}\",e?function(n){e({events:l,JS:n})}:null,n)},saveAsJS:function(e,n,t){var r=\"/* TestSetup, you shouldn't need to modify this */\\n\";r+=\"(function($,PhantomJS){\",r+=\"$(document).trigger('feta.startPlaying');\",r+=\"function regression(){\",r+=\"var regressions=[];\",r+=\"return {\",r+=\"add: function(item){\",r+=\"item = item || '';\",r+=\"regressions.push(item);\",r+=\"},\",r+=\"checkIfRegressed: function(cb){\",r+=\"var res = regressions.length > 0;\",r+=\"if (cb){\",r+=\"cb(res,regressions);\",r+=\"}else{\",r+=\"if (res ){\",r+=\"$(document).trigger('feta.hasRegression',{has: true,data: regressions});\",r+=\"console.log('FETA:Regression!');\",r+=\"}else{\",r+=\"$(document).trigger('feta.hasRegression',{has:false});\",r+=\"console.log('FETA:No Regression.');\",r+=\"}\",r+=\"}\",r+=\"}\",r+=\"};\",r+=\"}\",r+=\"var r = new regression();\\n\",r+=\"function keyEvent(keyCode,el){\",r+='var e = $.Event(\"keypress\");',r+=\"e.keyCode=keyCode;\",r+=\"el.trigger(e);\",r+=\"el.val(el.val()+String.fromCharCode(keyCode));\",r+=\"}\\n\\n\",r+=\"/* Done TestSetup */\\n\\n\\n\";for(var o=JSON.parse(e).playlist,s=0,a=\"setTimeout(function(){\",i=0;o.length>i;i++){var l=o[i];r+=\"keypress\"===l.type?\"	keyEvent(\"+l.key+\",$('\"+l.elem+\"'));\\n\":\"	$('\"+l.elem+\"').trigger('\"+l.type+\"');\\n\",r+=\"\\n	/* add any verification code here */\\n\",r+=\"	/* use `r.add()` or $(document).trigger('feta.regression',[data]) */\\n\\n\",i>0&&(r+=\" } ,\"+s+\");\\n\"),o.length>i+1&&(s+=o[i+1].timeStamp-l.timeStamp),r+=a}return r+=\"\\n\\n	/* Add final verification code here */\\n\",r+=\"	r.checkIfRegressed();\\n\",r+=\"	$(document).trigger('feta.endPlaying');\\n\",r+='	if (PhantomJS){ console.log(\"FETA_PHANTOMJS:done\");}\\n',r+=\"},\"+(s+100)+\");\",r+=\"\\n})(jQuery,typeof PhantomJS === 'undefined' ? null: PhantomJS);\\n\",t?r:((n||eval).call(this,r),void 0)}}}(document,jQuery);}";
//@ sourceURL=feta.js
})(window);