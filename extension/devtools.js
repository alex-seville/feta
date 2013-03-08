// Code based on off Chrome Devtools API Samples, Copyright (c) 2012 The Chromium Authors. All rights reserved.


chrome.devtools.panels.create("Feta",
                              "images/feta.png",
                              "panel.html",
                              function(panel) {
    //Set up the communcation between devtools & background.js
    var data = [];
    var port = chrome.extension.connect({name:"devtools"});

    //add record button to bottom of panel
    var btn = panel.createStatusBarButton("images/record.png", "Start Recording", false);

    //when panel is shown...
    panel.onShown.addListener(function tmp(panelWindow) {

        //when a message is received by devtools
        //we delegate it and do the appropriate action
        //in this case, we reload feta
        port.onMessage.addListener(function(msg) {
            if (msg === "PageChanged"){
                chrome.devtools.inspectedWindow["eval"](
                    loadStr,
                    function(result, isException) {  }
                );
            }
        });
        //Then we send the message to initialize the listener
        //which will call the above function on pageupdate
        port.postMessage({code: "LOADFETA"});

        //loading code for feta
        //we check is jquery already exists on the page
        //if not, we load in a copy
        var loadStr = "if (typeof jQuery === 'undefined'){"+
            "var _s=document.createElement('script');"+
            "_s.type='text/javascript';"+
            "_s.src='http://code.jquery.com/jquery-1.9.1.min.js';"+
            "_s.onload=function(){ "+fetaStr +"};"+
            "_s.onerror=function(){ alert('Error loading Feta');};"+
            "document.body.appendChild(_s);"+
            "}else{"+
            fetaStr +"}";

        //we try loading feta as soon as the panel
        //is shown.
        //Unfortunately, we always get an exception back
        //this is a bug that needs to be investigated
        chrome.devtools.inspectedWindow["eval"](
           loadStr,
            function(result, isException) {
        });

        //we only have the onshown to run once
        panel.onShown.removeListener(tmp);
        //get a reference to the window object from panel.html
        _window = panelWindow;

        //initialize recording to false
        var record=false;
        //when the button is clicked we
        //enter recording mode and
        //we run the clickRecord code to change
        //the buttons and run feta.start
        btn.onClicked.addListener(function(){
            _window.clickRecord(record);
            record=!record;
        });

        //this is used by loadtest to inject a script onto the page
        _window.inject = function(script){
            chrome.devtools.inspectedWindow["eval"](
              script,
              function(result, isException) {
                if (isException)
                  alert("Error loading test script.");
               checkIfPlaying();
             });
        };

        //we check if the test is still running
        //when it isn't running anymore we update
        //the run test button
        function checkIfPlaying(){
            chrome.devtools.inspectedWindow["eval"](
                "feta.isPlaying()",
                function(result,isException){
                    if(isException)
                        alert("error playing script");
                    if(!!result){
                        setTimeout(checkIfPlaying,500);
                    }else{
                        _window.reenableRun();
                    }
                }
            );
        }

        //we inject feta.start or feta.stop depending on the
        //mode.  we update the panel button as well
        _window.respond = function(msg) {
            if(msg){
                chrome.devtools.inspectedWindow["eval"](
                    "feta.start();",
                     function(result, isException) {
                       if (isException)
                         alert("error");
                        else{
                            btn.update("images/recording.png", "Stop Recording");
                        }
                     }
                );
            }else{
                chrome.devtools.inspectedWindow["eval"](
                    "feta.stop(null,true);",
                     function(result, isException) {
                       if (isException)
                         alert("error");
                       else{
                           btn.update("images/record.png", "Start Recording");
                         _window.saveFile(result);
                       }
                     }
                );
            }
        };

         //we capture the url of the currently loaded page
         _window.saveNow = function(test,fname){
            fname = fname === ""  ? "feta_output.js" : fname;
            chrome.devtools.inspectedWindow["eval"](
                "document.location.href",
                 function(result, isException) {
                     if (isException){
                        alert("error");
                     }else{
                        _window.updateTestList(result,fname,test);
                        _window.updatePanel();
                    }
                 }
            );
         };

         //create a link element and click it to download the file
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

            chrome.devtools.inspectedWindow["eval"](
             s,
             function(result, isException) {
               if (isException)
                 alert("error");
               else{

               }
            });
        };
    });
});



