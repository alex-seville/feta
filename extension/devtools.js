// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.


chrome.devtools.panels.create("Feta",
                              "feta.png",
                              "Panel.html",
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
                "feta.stop();",
                 function(result, isException) {
                   if (isException)
                     alert("error");
                   
                 });
            }
        };
    });

});



