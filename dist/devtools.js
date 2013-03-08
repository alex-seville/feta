// Code based on off Chrome Devtools API Samples, Copyright (c) 2012 The Chromium Authors. All rights reserved.


chrome.devtools.panels.create("Feta",
                              "images/feta.png",
                              "panel.html",
                              function(panel) {
    var data = [];
    var port = chrome.extension.connect({name:"devtools"});


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
*/
       port.postMessage({code: "LOADFETA", data: loadStr});
        port.onMessage.addListener(function(msg) {
        // Write information to the panel, if exists.
        // If we don't have a panel reference (yet), queue the data.
        /*
        if (_window) {
            _window.do_something(msg);
        } else {
            data.push(msg);
        }
        */
        if (msg === "PageChanged"){
            chrome.devtools.inspectedWindow.eval(
                  loadStr,
                    function(result, isException) {
                    
                });
        }
    });


        panel.onShown.removeListener(tmp); // Run once only
        _window = panelWindow;


        var record=false;
        btn.onClicked.addListener(function(){
            _window.clickRecord(record);
           // _window.respond(record);
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
               checkIfPlaying();
             });
        };

        function checkIfPlaying(){
            chrome.devtools.inspectedWindow.eval(
                "feta.isPlaying()",
                function(result,isException){
                    if(isException)
                        alert("error playing script");
                    if(!!result){
                        setTimeout(checkIfPlaying,500);
                    }else{
                        _window.reenableRun();
                    }
                });
        }

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
var fetaStr="if (!window.feta){window.feta=function(e,t){function n(e){for(var i=0;a.length>i;i++)if(t(e).on&&(!t(e).data(\"events\")||!t(e).data(\"events\")[a[i]]||t(e).data(\"events\")[a[i]].handler!==r))try{t(e).on(a[i],r)}catch(o){}var s=e.childNodes;if(s)for(var g=0;s.length>g;g++)n(s[g])}function r(t){if(l){if(t.selector=o(t.target),g.length>0){var r=g[g.length-1];if(r.timeStamp==t.timeStamp&&r.type==t.type&&r.target==t.target)return}if(t.target==window&&(\"focus\"==t.type||\"blur\"==t.type))return;console.log(\"TRACKING EVENT\"),g.push(t),setTimeout(function(){n(e.body)},50)}}function i(e){return JSON.stringify({type:e.type,elem:e.selector,timeStamp:e.timeStamp,key:\"keypress\"==e.type?e.which:null})}function o(e){if(0===t(e).parents().length)return\"DOCUMENT\";var n=\"\";t(e).parents()[0]!==t(\"body\")[0]&&t.each(t(e).parents().get().reverse(),function(){n+=this.tagName+s(this);var e=t(n).index(t(this));0>e&&console.log(\"parent not in parent selector?\");var r=1===t(n).length?\"\":\":nth-child(\"+(e+1)+\")\";n+=r+\" \"}),n+=t(e)[0].nodeName,n+=s(e);var r=t(n),i=r.length;if(i>1)for(var o=0;i>o;)t(n)[o]===e&&(n+=\":nth-child(\"+(o+1)+\")\",o=i),o++;return n}function s(e){if(\"BODY\"==e.tagName.toUpperCase()||\"HTML\"==e.tagName.toUpperCase())return\"\";var n=\"\",r=t(e).attr(\"id\");r&&(n+=\"#\"+r);var i=t(e).attr(\"class\");return i&&(n+=\".\"+t.trim(i).replace(/\\s/gi,\".\")),n}var a=[\"click\",\"focus\",\"keypress\",\"blur\"],g=[],l=!1,c=e.body;console.log(\"binding event handlers\"),n(c),console.log(\"done binding\"),t(e).on(\"feta.hasRegression\",function(e){e.data?alert(\"Regression detected: \"+e):alert(\"No regressions\")});var u=!1;return t(e).on(\"feta.startPlaying\",function(){u=!0}),t(e).on(\"feta.endPlaying\",function(){u=!1}),{isPlaying:function(){return u},start:function(){g=[],l=!0},stop:function(e,t){l=!1;for(var n=\"\",r=0;g.length>r;r++)n+=i(g[r])+\",\";return this.saveAsJS('{ \"playlist\": ['+n.slice(0,n.length-1)+\"]}\",e?function(t){e({events:g,JS:t})}:null,t)},saveAsJS:function(e,t,n){var r=\"//TestSetup\\n(function($){\";r+=\"$(document).trigger('feta.startPlaying');\",r+=\"function regression(){\",r+=\"var regressions=[];\",r+=\"return {\",r+=\"add: function(item){\",r+=\"item = item || '';\",r+=\"regressions.push(item);\",r+=\"},\",r+=\"checkIfRegressed: function(cb){\",r+=\"var res = regressions.length > 0;\",r+=\"if (cb){\",r+=\"cb(res,regressions);\",r+=\"}else{\",r+=\"if (res ){\",r+=\"$(document).trigger('feta.hasRegression',{data: regressions});\",r+=\"console.log('FETA:Regression!');\",r+=\"}else{\",r+=\"$(document).trigger('feta.hasRegression',{});\",r+=\"console.log('FETA:No Regression.');\",r+=\"}\",r+=\"}\",r+=\"}\",r+=\"};\",r+=\"}\",r+=\"var r = new regression();\\n\\n\",r+=\"function keyEvent(keyCode,el){\",r+='var e = $.Event(\"keypress\");',r+=\"e.keyCode=keyCode;\",r+=\"el.trigger(e);\",r+=\"el.val(el.val()+String.fromCharCode(keyCode));\",r+=\"}\\n\\n\";for(var i=JSON.parse(e).playlist,o=0,s=\"setTimeout(function(){\",a=0;i.length>a;a++){var g=i[a];r+=\"keypress\"===g.type?\"	keyEvent(\"+g.key+\",$('\"+g.elem+\"'));\\n\":\"	$('\"+g.elem+\"').trigger('\"+g.type+\"');\\n\",r+=\"	//add any verification code here\\n\",r+=\"	//use `r.add()` or $(document).trigger('feta.regression',[data])\\n\",a>0&&(r+=\" } ,\"+o+\");\\n\"),i.length>a+1&&(o+=i[a+1].timeStamp-g.timeStamp),r+=s}return r+=\"\\n//Add your verification code here\\n\",r+=\"r.checkIfRegressed();\\n\",r+=\"$(document).trigger('feta.endPlaying');\",r+=\"},\"+(o+100)+\");\",r+=\"\\n})(jQuery);\\n\",n?r:((t||eval).call(this,r),void 0)}}}(document,jQuery);}";
//@ sourceURL=feta.js