// Code based on off Chrome Devtools API Samples, Copyright (c) 2012 The Chromium Authors. All rights reserved.


chrome.devtools.panels.create("Feta",
                              "images/feta.png",
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

    var btn = panel.createStatusBarButton("images/record.png", "Start Recording", false);
   

    panel.onShown.addListener(function tmp(panelWindow) {

        var loadStr = "if (typeof jQuery === 'undefined'){"+
            "var _s=document.createElement('script');"+
            "_s.type='text/javascript';"+
            "_s.src='http://code.jquery.com/jquery-1.9.1.min.js';"+
            "_s.onload=function(){ "+fetaStr +"};"+
            "_s.onerror=function(){ alert('Error loading Feta');};"+
            "document.body.appendChild(_s);"+
            "}else{"+
            fetaStr +"}";

        chrome.devtools.inspectedWindow.eval(
           loadStr,
            function(result, isException) {
             
        });



        /*
        
        this fails, not sure why yet
        it should reload feta when the page changes

        chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
            if (changeInfo.status === 'complete') {
                chrome.devtools.inspectedWindow.eval(
                  loadStr,
                    function(result, isException) {
                     
                });
            }
        });
*/
        panel.onShown.removeListener(tmp); // Run once only
        _window = panelWindow;


        var record=true;
        btn.onClicked.addListener(function(){
            _window.respond(record);
            record=!record;

        });
       
       
        
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

        _window.respond = function(msg) {
            if(msg){
                
                chrome.devtools.inspectedWindow.eval(
                "feta.start();",
                 function(result, isException) {
                   if (isException)
                     alert("error");
                    else{
                        btn.update("images/recording.png", "Stop Recording");
                    }
                 });
            }else{
               
                chrome.devtools.inspectedWindow.eval(
                "feta.stop(null,true);",
                
                 function(result, isException) {
                   if (isException)
                     alert("error");
                   else{
                       btn.update("images/record.png", "Start Recording");
                     _window.saveFile(result);
                   }
                 });
            }
        };

     
         _window.saveNow = function(test,fname){
            //alert("save with:",test,fname);
            fname = fname === ""  ? "feta_output.js" : fname;
            chrome.devtools.inspectedWindow.eval(
                "document.location.href",
                 function(result, isException) {
                     if (isException){
                        alert("error");
                     }else{
                        
                       
                        _window.updateTestList(result,fname,test);
                        _window.updatePanel();
                    }
                 });
         };

        _window.download = function(url,fname){
            fname = fname === ""  ? "feta_output.js" : fname;
            //this code is from SO, but I'm missing the link right now
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




;
var fetaStr="window.feta=function(e,n){function t(e){for(var i=0;a.length>i;i++)if(n(e).on&&(!n(e).data(\"events\")||!n(e).data(\"events\").click||n(e).data(\"events\").click.handler!==r))try{n(e).on(a[i],r)}catch(s){}var o=e.childNodes;if(o)for(var c=0;o.length>c;c++)t(o[c])}function r(n){if(l){if(n.selector=s(n.target),c.length>0){var r=c[c.length-1];if(r.timeStamp==n.timeStamp&&r.type==n.type&&r.target==n.target)return}if(n.target==window&&(\"focus\"==n.type||\"blur\"==n.type))return;console.log(\"TRACKING EVENT\"),c.push(n),setTimeout(function(){t(e.body)},50)}}function i(e){return JSON.stringify({type:e.type,elem:e.selector,timeStamp:e.timeStamp})}function s(e){if(0===n(e).parents().length)return\"DOCUMENT\";var t=\"\";n(e).parents()[0]!==n(\"body\")[0]&&n.each(n(e).parents().get().reverse(),function(){t+=this.tagName+o(this);var e=n(t).index(n(this));0>e&&console.log(\"parent not in parent selector?\");var r=1===n(t).length?\"\":\":nth-child(\"+(e+1)+\")\";t+=r+\" \"}),t+=n(e)[0].nodeName,t+=o(e);var r=n(t),i=r.length;if(i>1)for(var s=0;i>s;)n(t)[s]===e&&(t+=\":nth-child(\"+(s+1)+\")\",s=i),s++;return t}function o(e){if(\"BODY\"==e.tagName.toUpperCase()||\"HTML\"==e.tagName.toUpperCase())return\"\";var t=\"\",r=n(e).attr(\"id\");r&&(t+=\"#\"+r);var i=n(e).attr(\"class\");return i&&(t+=\".\"+n.trim(i).replace(/\\s/gi,\".\")),t}var a=[\"click\",\"focus\",\"blur\"],c=[],l=!1,g=e.body;return console.log(\"binding event handlers\"),t(g),console.log(\"done binding\"),{start:function(){c=[],l=!0},stop:function(e,n){l=!1;for(var t=\"\",r=0;c.length>r;r++)t+=i(c[r])+\",\";return this.saveAsJS('{ \"playlist\": ['+t.slice(0,t.length-1)+\"]}\",e?function(n){e({events:c,JS:n})}:null,n)},saveAsJS:function(e,n,t){var r=\"//TestSetup\\n(function($){\";r+=\"function regression(){\",r+=\"var regressions=[];\",r+=\"return {\",r+=\"add: function(item){\",r+=\"item = item || '';\",r+=\"regressions.push(item);\",r+=\"},\",r+=\"checkIfRegressed: function(cb){\",r+=\"var res = regressions.length > 0;\",r+=\"if (cb){\",r+=\"cb(res,regressions);\",r+=\"}else{\",r+=\"if (res ){\",r+=\"$(document).trigger('feta.hasRegression',true);\",r+=\"console.log('FETA:Regression!');\",r+=\"}else{\",r+=\"$(document).trigger('feta.hasRegression',false);\",r+=\"console.log('FETA:No Regression.');\",r+=\"}\",r+=\"}\",r+=\"}\",r+=\"};\",r+=\"}\",r+=\"var r = new regression();\\n\\n\";for(var i=JSON.parse(e).playlist,s=0,o=\"setTimeout(function(){\",a=0;i.length>a;a++){var c=i[a];r+=\"	$('\"+c.elem+\"').trigger('\"+c.type+\"');\\n\",r+=\"	//add any verification code here\\n\",r+=\"	//use `r.add()` or $(document).trigger('feta.regression',[data])\\n\",a>0&&(r+=\" } ,\"+s+\");\\n\"),i.length>a+1&&(s+=i[a+1].timeStamp-c.timeStamp),r+=o}return r+=\"\\n//Add your verification code here\\n\",r+=\"r.checkIfRegressed();\\n\",r+=\"},\"+(s+100)+\");\",r+=\"\\n})(jQuery);\\n\",t?r:((n||eval).call(this,r),void 0)}}}(document,jQuery);";
//@ sourceURL=feta.js