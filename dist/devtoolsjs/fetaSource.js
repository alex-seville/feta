(function(root){
function fetaSrc(){
    this.source = fetaStr;
}
fetaSrc.prototype.startStr = function(arr){
    arr = arr || "";
    return "feta.start("+arr+");";
};
fetaSrc.prototype.stopStr = function(){
    return "feta.stop(null,true);";
};
fetaSrc.prototype.getCurrentStr = function(){
    return "feta.getCurrentStack();";
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
var fetaStr="if (!window.feta){window.feta=function(e,t){function n(e){for(var r=0;s.length>r;r++)if(t(e).on&&(!t(e).data(\"events\")||!t(e).data(\"events\")[s[r]]||t(e).data(\"events\")[s[r]].handler!==o))try{t(e).on(s[r],o)}catch(i){}var a=e.childNodes;if(a)for(var l=0;a.length>l;l++)n(a[l])}function r(e){return JSON.stringify({type:e.type,elem:e.selector,timeStamp:e.timeStamp,key:\"keypress\"==e.type?e.which:null})}function o(t){if(c){if(t.selector=i(t.target),l.length>0){var o=l[l.length-1];if(o.timeStamp==t.timeStamp&&o.type==t.type&&o.target==t.target)return}if(t.target==window&&(\"focus\"==t.type||\"blur\"==t.type))return;console.log(\"TRACKING EVENT\"),l.push(r(t)),setTimeout(function(){n(e.body)},50)}}function i(e){if(0===t(e).parents().length)return\"DOCUMENT\";var n=\"\";t(e).parents()[0]!==t(\"body\")[0]&&t.each(t(e).parents().get().reverse(),function(){n+=this.tagName+a(this);var e=t(n).index(t(this));0>e&&console.log(\"parent not in parent selector?\");var r=1===t(n).length?\"\":\":nth-child(\"+(e+1)+\")\";n+=r+\" \"}),n+=t(e)[0].nodeName,n+=a(e);var r=t(n),o=r.length;if(o>1)for(var i=0;o>i;)t(n)[i]===e&&(n+=\":nth-child(\"+(i+1)+\")\",i=o),i++;return n}function a(e){if(\"BODY\"==e.tagName.toUpperCase()||\"HTML\"==e.tagName.toUpperCase())return\"\";var n=\"\",r=t(e).attr(\"id\");r&&(n+=\"#\"+r);var o=t(e).attr(\"class\");return o&&(n+=\".\"+t.trim(o).replace(/\\s/gi,\".\")),n}var s=[\"click\",\"focus\",\"keypress\",\"blur\"],l=[],c=!1,u=e.body;console.log(\"binding event handlers\"),n(u),console.log(\"done binding\");var f;t(e).on(\"feta.hasRegression\",function(e,t){f=t.data?t.data:[]});var g=!1;return t(e).on(\"feta.startPlaying\",function(){g=!0}),t(e).on(\"feta.endPlaying\",function(){g=!1}),{isPlaying:function(){return g},lastRegression:function(){return f},getCurrentStack:function(){return l},start:function(e){l=e||[],c=!0},stop:function(e,t){c=!1;for(var n=\"\",o=0;l.length>o;o++)n+=r(l[o])+\",\";return this.saveAsJS('{ \"playlist\": ['+n.slice(0,n.length-1)+\"]}\",e?function(t){e({events:l,JS:t})}:null,t)},saveAsJS:function(e,t,n){var r=\"/* TestSetup, you shouldn't need to modify this */\\n\";r+=\"(function($,PhantomJS){\",r+=\"$(document).trigger('feta.startPlaying');\",r+=\"function regression(){\",r+=\"var regressions=[];\",r+=\"return {\",r+=\"add: function(item){\",r+=\"item = item || '';\",r+=\"regressions.push(item);\",r+=\"},\",r+=\"checkIfRegressed: function(cb){\",r+=\"var res = regressions.length > 0;\",r+=\"if (cb){\",r+=\"cb(res,regressions);\",r+=\"}else{\",r+=\"if (res ){\",r+=\"$(document).trigger('feta.hasRegression',{data: regressions});\",r+=\"console.log('FETA:Regression!');\",r+=\"}else{\",r+=\"$(document).trigger('feta.hasRegression',{});\",r+=\"console.log('FETA:No Regression.');\",r+=\"}\",r+=\"}\",r+=\"}\",r+=\"};\",r+=\"}\",r+=\"var r = new regression();\\n\",r+=\"function keyEvent(keyCode,el){\",r+='var e = $.Event(\"keypress\");',r+=\"e.keyCode=keyCode;\",r+=\"el.trigger(e);\",r+=\"var newVal=el.val();\",r+=\"if (keyCode === 46){\",r+=\"newVal = newVal.slice(0,newVal.length-1);\",r+=\"}\",r+=\"el.val(newVal+String.fromCharCode(keyCode));\",r+=\"}\\n\\n\",r+=\"/* Done TestSetup */\\n\\n\\n\",r+=\"var timeouts=[];\\n\";for(var o=JSON.parse(e).playlist,i=0,a=0,s=\"timeouts.push({fcn:function(){\",l=0;o.length>l;l++){var c=o[l];r+=\"\\n	/*Only modify the selector if you notice a recording error*/\",r+=\"\\n	var evtelem = $('\"+c.elem+\"');\\n\",\"keypress\"===c.type?r+=\"	keyEvent(\"+c.key+\",evtelem);\\n\":(\"click\"===c.type&&(r+=\"\\n	/* Don't modify */\",r+=\"\\n	if(evtelem.prop('tagName').toUpperCase() === 'INPUT' &&\",r+=\"(evtelem.prop('type').toUpperCase() === 'CHECKBOX' ||\",r+=\"evtelem.prop('type').toUpperCase() === 'RADIO' )){\",r+=\"evtelem.prop('checked',!evtelem.prop('checked'));\",r+=\"}\",r+=\"\\n	/* Done don't modify */\\n\"),r+=\"\\n	evtelem.trigger('\"+c.type+\"');\\n\"),r+=\"\\n	/* add any verification code here */\\n\",r+=\"	/* use `r.add()` or $(document).trigger('feta.regression',[data]) */\\n\\n\",l>0&&(r+=\" } ,time:\"+(i-a)+\"});\\n\\n\",a=i),o.length>l+1&&(i+=o[l+1].timeStamp-c.timeStamp),r+=s}return r+=\"\\n\\n	/* Add final verification code here */\\n\",r+=\"\\n	r.checkIfRegressed();\\n\",r+=\"\\n	/* leave the rest of the file as is*/\\n\\n\",r+=\"	$(document).trigger('feta.endPlaying');\\n\",r+='	if (PhantomJS){ console.log(\"FETA_PHANTOMJS:done\");}\\n',r+=\"},time:100});\",r+=\"function doTimeouts(current){\",r+=\"if (current){\",r+=\"setTimeout(function(){\",r+=\"current.fcn();\",r+=\"doTimeouts(timeouts.shift());\",r+=\"},current.time);\",r+=\"} }\",r+=\"doTimeouts(timeouts.shift());\",r+=\"\\n})(jQuery,typeof PhantomJS === 'undefined' ? null: PhantomJS);\\n\",n?r:((t||eval).call(this,r),void 0)}}}(document,jQuery);}";
//@ sourceURL=feta.js
})(window);