// Code based on off Chrome Devtools API Samples, Copyright (c) 2012 The Chromium Authors. All rights reserved.

/* globals */

//Set up the communcation between devtools & background.js
var port = chrome.extension.connect({name:"devtools"});

var errorMessage = "Feta is in beta release.  Please report this error.\n";

/* create feta panel in devtools */

chrome.devtools.panels.create("Feta",
                              "images/feta.png",
                              "panel.html",
                              function(panel) {
    //add record button to bottom of panel
    var btn = panel.createStatusBarButton("images/record.png", "Start Recording", false);

    //when panel is shown...
    panel.onShown.addListener(function tmp(panelWindow) {
        //get a reference to the window object from panel.html
        _window = panelWindow;
        var firstload=true;
        var currUrl="";
        var newUrl="";

        var removeHash=function(url){
          if (url.indexOf("#") > -1){
            return url.slice(0,url.indexOf("#")-1);
          }
          return url;
        };

        //when a message is received by devtools
        //we delegate it and do the appropriate action
        //in this case, we reload feta
        port.onMessage.addListener(function(msg) {
            if (msg.code === "PageChanged"){
              
              //clearInterval(checkStatus);
              if (!firstload && currUrl !== newUrl){
                console.log(currUrl+"!=="+newUrl+" so reinjecting feta et al.");
                runInPage(window.fetaSource.loadStr(),function(){
                  //if we're already recording, we want to
                  //restart feta
                  
                  if (recording){
                    alert(currFetaArray);
                    runInPage(window.fetaSource.startStr(currFetaArray),
                        function(){
                          console.log("cs:",checkStatus);
                          checkStatus=setInterval(function(){
                            console.log("checking page");
                            runInPage(window.fetaSource.getCurrentStr(),
                            function(result){
                              console.log("updating array:",result.length);
                              currFetaArray = result;
                            },function(){
                              alert("Checking array error");
                            });
                          },1000);
                          console.log("cs:",checkStatus);
                        },function(){
                          alert(errorMessage+"Error re-starting feta on the page.");
                        });
                  }
                  
                },function(){
                  alert(errorMessage+"Error re-loading feta on the page.");
                });
              }else{
                firstload=false;
              }
              currUrl=newUrl;
            }else if (msg.code === "PageLoading"){
              console.log("loading "+msg.data);
              console.log("firstload? "+firstload);
                newUrl=removeHash(msg.data);
                if (recording && currUrl !== newUrl){
                  console.log("clearing interval");
                  console.log("cs:",checkStatus);
                  clearInterval(checkStatus);
                  console.log("cs:",checkStatus);
                }
               
            }
        });


        //Tell background.js to add onPageChange listener
        port.postMessage({code: "LOADFETA"});

        /* Panel.js Communication setup */

        //Messages are received from panel.js with window.msgToDevtools
        //and Message are sent to panel.js with window.msgFromDevtools
        _window.msgToDevtools = function(code,data){
          if (code === "injectScript"){
            //this is used by loadtest to inject a script onto the page
            runInPage(data.data,checkIfPlaying);
            return;
          }
          if (code === "clickRecord"){
            //run the appropriate feta command
            doFeta(data.data);
            return;
          }
          if (code === "getCurrentURL"){
            //get the current page url
            getCurrentURL(function(url) {
              data.url=url;
              _window.msgFromDevtools(data.callbackName,data);
            });
            return;
          }
          if (code === "makeDownload"){
            makeDownload(data.url,data.filename);
            return;
          }
        };

        //Initialize

        //we try loading feta as soon as the panel
        //is shown.
        //Unfortunately, we always get an exception back
        //this is a bug that needs to be investigated
        runInPage(window.fetaSource.loadStr(),doNothing,doNothing);

        //we only have the onshown to run once
        panel.onShown.removeListener(tmp);


        //Multipage support
        //we keep a local copy of the event array
        //and keep updating it.
        var currFetaArray=[];
        var recording=false;
        var checkStatus;

        //UI setup

        btn.onClicked.addListener(function(){
            _window.msgFromDevtools("clickRecord");
        });

        //we check if the test is still running
        //when it isn't running anymore we update
        //the run test button
        function checkIfPlaying(){
          runInPage(window.fetaSource.isPlayingStr(),
            function(result){
                if(!result){
                    setTimeout(checkIfPlaying,500);
                }else{
                    _window.msgFromDevtools("revertRun",{data: result});
                }
            },
            function(err){
              alert(errorMessage+"error playing script, line 96.");
            });
        }

        //we inject feta.start or feta.stop depending on the
        //mode.  we update the panel button as well
        function doFeta(msg) {
          firstload=false;
            if(msg){
              runInPage(window.fetaSource.startStr(),
                function(){
                  recording=true;
                  btn.update("images/recording.png", "Stop Recording");
                  console.log("cs:",checkStatus);
                  checkStatus=setInterval(function(){
                    console.log("checking page");
                    runInPage(window.fetaSource.getCurrentStr(),
                      function(result){
                        console.log("updating array");
                          currFetaArray = result;
                      },function(){
                        alert("set interval error");
                      });
                  },1000);
                  console.log("cs:",checkStatus);

                });
            }else{
              runInPage(window.fetaSource.stopStr(),
                function(result){
                  recording=false;
                  console.log("cs:",checkStatus);
                  clearInterval(checkStatus);
                  console.log("cs:",checkStatus);
                   btn.update("images/record.png", "Start Recording");
                   _window.msgFromDevtools("saveFile",{data:result});
                 });
            }
        }

         //we capture the url of the currently loaded page
         function getCurrentURL(callback){
            runInPage("document.location.href",callback);
         }

         //create a link element and click it to download the file
        function makeDownload(url,fname){
            fname = fname === ""  ? "feta_output.js" : fname;
            //this code is from SO, but I'm missing the link right now
            var s = "var a = document.createElement('a');";
                s+= "a.href = '"+url+"';";
                s+= "a.download = '"+ fname +"';"; // set the file name
                s+= "a.style.display = 'none';";
                s+= "document.body.appendChild(a);";
                s+= "a.click();"; //this is probably the key - simulatating a click on a download link
                s+= "delete a;";// we don't need this anymore
            runInPage(s,doNothing);
        }
    });
});

//when we don't care about the result
var doNothing = function(){};

//helper function to evaluate code in the inspected page context
//with access to the JS and the DOM
function runInPage(code,callback,errorCallback){
  errorCallback = errorCallback || function(err){ alert(errorMessage+err); };
  chrome.devtools.inspectedWindow["eval"](
    code,
    function(result, isException) {
     if (isException)
       errorCallback(isException);
     else{
       callback(result);
     }
  });
}



