function loadFeta(){
    
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