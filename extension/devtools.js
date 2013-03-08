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



