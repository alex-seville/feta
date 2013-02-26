// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.


chrome.devtools.panels.create("Feta",
                              "feta.png",
                              "Panel.html",
                              function(panel) {

chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.recording){
        chrome.devtools.inspectedWindow.eval(
        "typeof jQuery !== 'undefined'",
         function(result, isException) {
           if (isException)
             alert("the page is not using jQuery");
           else
             alert("The page is using jQuery v" + result);
         }
         );
     }
      //sendResponse({farewell: "goodbye"});
  });

/*chrome.devtools.inspectedWindow.eval(
    "typeof jQuery !== 'undefined'",
     function(result, isException) {
       if (isException)
         alert("the page is not using jQuery");
       else
         alert("The page is using jQuery v" + result);
     }
);*/

       

                               });
