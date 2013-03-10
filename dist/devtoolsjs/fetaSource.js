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
    return "feta.isPlaying();";
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
var fetaStr="if (!window.feta){window.feta=function(e,t){function n(e){for(var o=0;a.length>o;o++)if(t(e).on&&(!t(e).data(\"events\")||!t(e).data(\"events\")[a[o]]||t(e).data(\"events\")[a[o]].handler!==r))try{t(e).on(a[o],r)}catch(i){}var s=e.childNodes;if(s)for(var l=0;s.length>l;l++)n(s[l])}function r(t){if(g){if(t.selector=i(t.target),l.length>0){var r=l[l.length-1];if(r.timeStamp==t.timeStamp&&r.type==t.type&&r.target==t.target)return}if(t.target==window&&(\"focus\"==t.type||\"blur\"==t.type))return;console.log(\"TRACKING EVENT\"),l.push(t),setTimeout(function(){n(e.body)},50)}}function o(e){return JSON.stringify({type:e.type,elem:e.selector,timeStamp:e.timeStamp,key:\"keypress\"==e.type?e.which:null})}function i(e){if(0===t(e).parents().length)return\"DOCUMENT\";var n=\"\";t(e).parents()[0]!==t(\"body\")[0]&&t.each(t(e).parents().get().reverse(),function(){n+=this.tagName+s(this);var e=t(n).index(t(this));0>e&&console.log(\"parent not in parent selector?\");var r=1===t(n).length?\"\":\":nth-child(\"+(e+1)+\")\";n+=r+\" \"}),n+=t(e)[0].nodeName,n+=s(e);var r=t(n),o=r.length;if(o>1)for(var i=0;o>i;)t(n)[i]===e&&(n+=\":nth-child(\"+(i+1)+\")\",i=o),i++;return n}function s(e){if(\"BODY\"==e.tagName.toUpperCase()||\"HTML\"==e.tagName.toUpperCase())return\"\";var n=\"\",r=t(e).attr(\"id\");r&&(n+=\"#\"+r);var o=t(e).attr(\"class\");return o&&(n+=\".\"+t.trim(o).replace(/\\s/gi,\".\")),n}var a=[\"click\",\"focus\",\"keypress\",\"blur\"],l=[],g=!1,c=e.body;console.log(\"binding event handlers\"),n(c),console.log(\"done binding\"),t(e).on(\"feta.hasRegression\",function(e){e.data?alert(\"Regression detected: \"+e):alert(\"No regressions\")});var f=!1;return t(e).on(\"feta.startPlaying\",function(){f=!0}),t(e).on(\"feta.endPlaying\",function(){f=!1}),{isPlaying:function(){return f},start:function(){l=[],g=!0},stop:function(e,t){g=!1;for(var n=\"\",r=0;l.length>r;r++)n+=o(l[r])+\",\";return this.saveAsJS('{ \"playlist\": ['+n.slice(0,n.length-1)+\"]}\",e?function(t){e({events:l,JS:t})}:null,t)},saveAsJS:function(e,t,n){var r=\"//TestSetup\\n(function($,PhantomJS){\";r+=\"$(document).trigger('feta.startPlaying');\",r+=\"function regression(){\",r+=\"var regressions=[];\",r+=\"return {\",r+=\"add: function(item){\",r+=\"item = item || '';\",r+=\"regressions.push(item);\",r+=\"},\",r+=\"checkIfRegressed: function(cb){\",r+=\"var res = regressions.length > 0;\",r+=\"if (cb){\",r+=\"cb(res,regressions);\",r+=\"}else{\",r+=\"if (res ){\",r+=\"$(document).trigger('feta.hasRegression',{data: regressions});\",r+=\"console.log('FETA:Regression!');\",r+=\"}else{\",r+=\"$(document).trigger('feta.hasRegression',{});\",r+=\"console.log('FETA:No Regression.');\",r+=\"}\",r+=\"}\",r+=\"}\",r+=\"};\",r+=\"}\",r+=\"var r = new regression();\\n\\n\",r+=\"function keyEvent(keyCode,el){\",r+='var e = $.Event(\"keypress\");',r+=\"e.keyCode=keyCode;\",r+=\"el.trigger(e);\",r+=\"el.val(el.val()+String.fromCharCode(keyCode));\",r+=\"}\\n\\n\";for(var o=JSON.parse(e).playlist,i=0,s=\"setTimeout(function(){\",a=0;o.length>a;a++){var l=o[a];r+=\"keypress\"===l.type?\"	keyEvent(\"+l.key+\",$('\"+l.elem+\"'));\\n\":\"	$('\"+l.elem+\"').trigger('\"+l.type+\"');\\n\",r+=\"	//add any verification code here\\n\",r+=\"	//use `r.add()` or $(document).trigger('feta.regression',[data])\\n\",a>0&&(r+=\" } ,\"+i+\");\\n\"),o.length>a+1&&(i+=o[a+1].timeStamp-l.timeStamp),r+=s}return r+=\"\\n//Add your verification code here\\n\",r+=\"r.checkIfRegressed();\\n\",r+=\"$(document).trigger('feta.endPlaying');\",r+='if (PhantomJS){ console.log(\"FETA_PHANTOMJS:done\");}',r+=\"},\"+(i+100)+\");\",r+=\"\\n})(jQuery,typeof PhantomJS === 'undefined' ? null: PhantomJS);\\n\",n?r:((t||eval).call(this,r),void 0)}}}(document,jQuery);}";
//@ sourceURL=feta.js
})(window);