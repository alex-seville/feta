(function(root){
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
var fetaStr="if (!window.feta){window.feta=function(e,n){function t(e){for(var o=0;a.length>o;o++)if(n(e).on&&(!n(e).data(\"events\")||!n(e).data(\"events\")[a[o]]||n(e).data(\"events\")[a[o]].handler!==r))try{n(e).on(a[o],r)}catch(i){}var s=e.childNodes;if(s)for(var l=0;s.length>l;l++)t(s[l])}function r(n){if(c){if(n.selector=i(n.target),l.length>0){var r=JSON.parse(l[l.length-1]);if(r.timeStamp==n.timeStamp&&r.type==n.type&&r.elem==n.selector)return}if(n.target==window&&(\"focus\"==n.type||\"blur\"==n.type))return;console.log(\"TRACKING EVENT\"),l.push(o(n)),setTimeout(function(){t(e.body)},50)}}function o(e){return JSON.stringify({type:e.type,elem:e.selector,timeStamp:e.timeStamp,key:\"keypress\"==e.type?e.which:null})}function i(e){if(0===n(e).parents().length)return\"DOCUMENT\";var t=\"\";n(e).parents()[0]!==n(\"body\")[0]&&n.each(n(e).parents().get().reverse(),function(){t+=this.tagName+s(this);var e=n(t).index(n(this));0>e&&console.log(\"parent not in parent selector?\");var r=1===n(t).length?\"\":\":nth-child(\"+(e+1)+\")\";t+=r+\" \"}),t+=n(e)[0].nodeName,t+=s(e);var r=n(t),o=r.length;if(o>1)for(var i=0;o>i;)n(t)[i]===e&&(t+=\":nth-child(\"+(i+1)+\")\",i=o),i++;return t}function s(e){if(\"BODY\"==e.tagName.toUpperCase()||\"HTML\"==e.tagName.toUpperCase())return\"\";var t=\"\",r=n(e).attr(\"id\");r&&(t+=\"#\"+r);var o=n(e).attr(\"class\");return o&&(t+=\".\"+n.trim(o).replace(/\\s/gi,\".\")),t}var a=[\"click\",\"dblclick\",\"focus\",\"keypress\",\"change\",\"blur\"],l=[],c=!1,f=e.body;console.log(\"binding event handlers\"),t(f),console.log(\"done binding\");var u;n(e).on(\"feta.hasRegression\",function(e,n){u=n.data?n.data:[]});var d=!1;return n(e).on(\"feta.startPlaying\",function(){d=!0}),n(e).on(\"feta.endPlaying\",function(){d=!1}),{isPlaying:function(){return d},lastRegression:function(){return u},getStack:function(){return l},start:function(e){l=e||[],c=!0},stop:function(e,n){c=!1;for(var t=\"\",r=0;l.length>r;r++)t+=l[r]+\",\";return this.saveAsJS('{ \"playlist\": ['+t.slice(0,t.length-1)+\"]}\",e?function(n){e({events:l,JS:n})}:null,n)},saveAsJS:function(n,t,r){var o=\"/* Recorded from \"+e.location.href+\" on \"+(new Date).toISOString()+\" */\\n\";o+=\"/* TestSetup, you shouldn't need to modify this */\\n\",o+=\"(function($,PhantomJS){\",o+=\"$(document).trigger('feta.startPlaying');\",o+=\"function regression(){\",o+=\"var regressions=[];\",o+=\"return {\",o+=\"add: function(item){\",o+=\"item = item || '';\",o+=\"regressions.push(item);\",o+=\"},\",o+=\"checkIfRegressed: function(cb){\",o+=\"var res = regressions.length > 0;\",o+=\"if (cb){\",o+=\"cb(res,regressions);\",o+=\"}else{\",o+=\"if (res ){\",o+=\"$(document).trigger('feta.hasRegression',{data: regressions});\",o+=\"console.log('FETA:Regression!');\",o+=\"}else{\",o+=\"$(document).trigger('feta.hasRegression',{});\",o+=\"console.log('FETA:No Regression.');\",o+=\"}\",o+=\"}\",o+=\"}\",o+=\"};\",o+=\"}\",o+=\"var r = new regression();\",o+=\"function keyEvent(keyCode,el){\",o+='var e = $.Event(\"keypress\");',o+=\"e.keyCode=keyCode;\",o+=\"el.trigger(e);\",o+=\"var newVal=el.val();\",o+=\"if (keyCode === 46){\",o+=\"newVal = newVal.slice(0,newVal.length-1);\",o+=\"}\",o+=\"el.val(newVal+String.fromCharCode(keyCode));\",o+=\"}\\n\\n\",o+=\"var timeouts=[];\\n\",o+=\"/* Done TestSetup */\\n\\n\\n\";for(var i=JSON.parse(n).playlist,s=0,a=0,l=\"timeouts.push({fcn:function(){\",c=0;i.length>c;c++){var f=i[c];o+=\"\\n	/*Only modify the selector if you notice a recording error*/\",o+=\"\\n	var evtelem = $('\"+f.elem+\"');\\n\",o+=\"\\n	if (evtelem.length === 0){ r.add('Element not found: \"+f.elem+\"');\\n }else{\\n\",\"keypress\"===f.type?o+=\"	keyEvent(\"+f.key+\",evtelem);\\n\":(\"click\"===f.type&&(o+=\"\\n	/* Don't modify */\",o+=\"\\n	if(evtelem.prop('tagName').toUpperCase() === 'INPUT' &&\",o+=\"(evtelem.prop('type').toUpperCase() === 'CHECKBOX' ||\",o+=\"evtelem.prop('type').toUpperCase() === 'RADIO' )){\",o+=\"evtelem.prop('checked',!evtelem.prop('checked'));\",o+=\"}\",o+=\"\\n	/* Done don't modify */\\n\"),o+=\"\\n	evtelem.trigger('\"+f.type+\"');\\n\"),o+=\"\\n	}\",o+=\"\\n	/* add any verification code here */\\n\",o+=\"	/* use `r.add()` or $(document).trigger('feta.regression',[data]) */\\n\\n\",c>0&&(o+=\" } ,time:\"+(s-a)+\"});\\n\\n\",a=s),i.length>c+1&&(s+=i[c+1].timeStamp-f.timeStamp),o+=l}return o+=\"\\n\\n	/* Add final verification code here */\\n\",o+=\"\\n	r.checkIfRegressed();\\n\",o+=\"\\n	/* leave the rest of the file as is*/\\n\\n\",o+=\"	$(document).trigger('feta.endPlaying');\\n\",o+='	if (PhantomJS){ console.log(\"FETA_PHANTOMJS:done\");}\\n',o+=\"},time:100});\",o+=\"function doTimeouts(current){\",o+=\"if (current){\",o+=\"setTimeout(function(){\",o+=\"current.fcn();\",o+=\"doTimeouts(timeouts.shift());\",o+=\"},current.time);\",o+=\"} }\",o+=\"doTimeouts(timeouts.shift());\",o+=\"\\n})(jQuery,typeof PhantomJS === 'undefined' ? null: PhantomJS);\\n\",r?o:((t||eval).call(this,o),void 0)}}}(document,jQuery);}";
//@ sourceURL=feta.js
})(window);