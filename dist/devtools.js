// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.


chrome.devtools.panels.create("Feta",
                              "feta.png",
                              "panel.html",
                              function(panel) {

    var data = [];
    var port = chrome.extension.connect({name:"devtools"});
    port.onMessage.addListener(function(msg) {
        // Write information to the panel, if exists.
        // If we don't have a panel reference (yet), queue the data.
        if (_window) {
            _window.do_something(msg);
        } else {
            data.push(msg);
        }
    });

    panel.onShown.addListener(function tmp(panelWindow) {



        chrome.devtools.inspectedWindow.eval(
           fetaStr,
     function(result, isException) {
       if (isException)
         alert("Error loading feta.");
       
     });
       
        panel.onShown.removeListener(tmp); // Run once only
        _window = panelWindow;

        // Release queued data
        var msg;
        while (msg = data.shift()){
            _window.do_something(msg);
        }
        _window.inject = function(script){
            chrome.devtools.inspectedWindow.eval(
                   script,
             function(result, isException) {
               if (isException)
                 alert("Error loading test script.");
               
             });
        };

        // Just to show that it's easy to talk to pass a message back:
        _window.respond = function(msg) {
            //port.postMessage(msg);
            if(msg){
                    
                chrome.devtools.inspectedWindow.eval(
                "feta.start();",
                 function(result, isException) {
                   if (isException)
                     alert("error");
                   
                 });
    
            }else{
                chrome.devtools.inspectedWindow.eval(
                //"feta.stop();",
                "feta.stop(null,true);",
                 function(result, isException) {
                   if (isException)
                     alert("error");
                   else{
                     _window.saveFile(result);
                     //saveAs()
                   }
                 });
            }
        };

        _window.saveNow = function(url,fname){
            fname = fname === ""  ? "feta_output.js" : fname;
            var s = "var a = document.createElement('a');";
                s+= "a.href = '"+url+"';";
                s+= "a.download = '"+ fname +"';"; // set the file name
                s+= "a.style.display = 'none';";
                s+= "document.body.appendChild(a);";
                s+= "a.click();"; //this is probably the key - simulatating a click on a download link
                s+= "delete a;";// we don't need this anymore
              
                chrome.devtools.inspectedWindow.eval(
                s,
                 function(result, isException) {
                   if (isException)
                     alert("error");
                   else{
                     //_window.saveFile(result);

                   }
                 });
        };
    });

});

function loadFeta(){

}




;
var fetaStr="window.feta=function(e,n){function t(e){for(var i=0;a.length>i;i++)if(n(e).on&&(!n(e).data(\"events\")||!n(e).data(\"events\").click||n(e).data(\"events\").click.handler!==r))try{n(e).on(a[i],r)}catch(o){}var s=e.childNodes;if(s)for(var c=0;s.length>c;c++)t(s[c])}function r(n){if(l){if(n.selector=o(n.target),c.length>0){var r=c[c.length-1];if(r.timeStamp==n.timeStamp&&r.type==n.type&&r.target==n.target)return}if(n.target==window&&(\"focus\"==n.type||\"blur\"==n.type))return;console.log(\"TRACKING EVENT\"),c.push(n),setTimeout(function(){t(e.body)},50)}}function i(e){return JSON.stringify({type:e.type,elem:e.selector,timeStamp:e.timeStamp})}function o(e){if(0===n(e).parents().length)return\"DOCUMENT\";var t=\"\";n(e).parents()[0]!==n(\"body\")[0]&&n.each(n(e).parents().get().reverse(),function(){t+=this.tagName+s(this);var e=n(t).index(n(this));0>e&&console.log(\"parent not in parent selector?\");var r=1===n(t).length?\"\":\":nth-child(\"+(e+1)+\")\";t+=r+\" \"}),t+=n(e)[0].nodeName,t+=s(e);var r=n(t),i=r.length;if(i>1)for(var o=0;i>o;)n(t)[o]===e&&(t+=\":nth-child(\"+(o+1)+\")\",o=i),o++;return t}function s(e){if(\"BODY\"==e.tagName.toUpperCase()||\"HTML\"==e.tagName.toUpperCase())return\"\";var t=\"\",r=n(e).attr(\"id\");r&&(t+=\"#\"+r);var i=n(e).attr(\"class\");return i&&(t+=\".\"+n.trim(i).replace(/\\s/gi,\".\")),t}var a=[\"click\",\"focus\",\"blur\"],c=[],l=!1,u=e.body;return console.log(\"binding event handlers\"),t(u),console.log(\"done binding\"),{start:function(){c=[],l=!0},stop:function(e,n){l=!1;for(var t=\"\",r=0;c.length>r;r++)t+=i(c[r])+\",\";return this.saveAsJS('{ \"playlist\": ['+t.slice(0,t.length-1)+\"]}\",e?function(n){e({events:c,JS:n})}:null,n)},saveAsJS:function(e,n,t){var r=\"(function($){\\n\";r+=\"function regression(){\\n\",r+=\"var regressions=[];\\n\",r+=\"return {\\n\",r+=\"add: function(item){\\n\",r+=\"item = item || '';\\n\",r+=\"regressions.push(item);\\n\",r+=\"},\\n\",r+=\"checkIfRegressed: function(cb){\\n\",r+=\"var res = regressions.length > 0;\\n\",r+=\"if (cb){\\n\",r+=\"cb(res,regressions);\\n\",r+=\"}else{\\n\",r+=\"if (res ){\\n\",r+=\"console.log('FETA:Regression!');\\n\",r+=\"}else{\\n\",r+=\"console.log('FETA:No Regression.');\\n\",r+=\"}\\n\",r+=\"}\\n\",r+=\"}\\n\",r+=\"};\\n\",r+=\"}\\n\",r+=\"var r = new regression();\\n\";for(var i=JSON.parse(e).playlist,o=0,s=\"setTimeout(function(){\",a=0;i.length>a;a++){var c=i[a];r+=\"$('\"+c.elem+\"').trigger('\"+c.type+\"');\\n\",r+=\"//add any verification code here\\n\",r+=\"//use `r.add()`\\n\",a>0&&(r+=\" } ,\"+o+\");\\n\"),i.length>a+1&&(o+=i[a+1].timeStamp-c.timeStamp),r+=s}return r+=\"\\n//Add your verification code here\\n\",r+=\"r.checkIfRegressed();\\n\",r+=\"},\"+(o+100)+\");\",r+=\"\\n})(jQuery);\\n\",r+=\"\\n//@ sourceURL=outputScript.js\",t?r:((n||eval).call(this,r),void 0)}}}(document,jQuery);";
//@ sourceURL=feta.js