function testPanelControls(options){
    this.root = options.root;
    this.testPanel = options.testPanel;
    this.codeArea = options.codeArea;
    this.runBtnSelector = options.runBtnSelector;
    this.events = {
        downloadableCreated: "testPanelControls.downloadableCreated",
        runningTest: "testPanelControls.runningTest"
    };
}
testPanelControls.prototype.exportEvents = function(){
    return this.events;
};
//todo-need to make event to get current test,
//find the test code in memory
testPanelControls.prototype.download = function(filename){
    var data = this.codeArea.text();
    window.URL = window.webkitURL || window.URL;
    var file = new Blob([data],{"type":"text\/plain"});
    var url = window.URL.createObjectURL(file);
    root.trigger(this.events.downloadableCreated,{name:filename,url:url});
};
testPanelControls.prototype.runTest = function(){
    $(this.runBtnSelector).text("Running...");
    $(this.runBtnSelector).disabled = true;
    var fileData = this.codeArea.text();
    root.trigger(this.events.runningTest,fileData);
};
testPanelControls.prototype.revertRunBtn = function(){
    $(this.runBtnSelector).text("Run Test");
    $(this.runBtnSelector).disabled = false;
};
testPanelControls.prototype.updatePanel = function(filename,code){
    var codeDiv = $("<div/>")
        .attr("id","testCode")
        .text(code);
    //add the action buttons
    var btnDiv = $("<div/>")
        .addClass("btnBar");
    var dbtn = $("<button/>")
        .text("Download")
        .click(function(){ this.download(filename);});
    var lbtn = $("<button/>")
        .attr("id","runTestBtn")
        .text("Run Test")
        .click(this.runTest);
    btnDiv.append(lbtn);
    btnDiv.append(dbtn);
    this.testPanel.append(btnDiv);
    this.testPanel.append(codeDiv);
};

/*
    //find the script content, make a url from it, and pass that
    //to devtools to download.
    function downloadTest(){
        var test = document.getElementById("sideBar").getElementsByClassName("selected")[0];
        var spans = test.getElementsByTagName("span");
        var fname = spans[0].innerText;

        var fileData = document.getElementById("testCode").innerText;

       window.URL = window.webkitURL || window.URL;
       file = new Blob([fileData],{"type":"text\/plain"});
       var url = window.URL.createObjectURL(file);
        
        download(url,fname+".js");
    }

    //change the button text
    //and inject the test script into the page
     function runTest(){
        this.innerText = "Running...";
        this.disabled = true;
        var fileData = document.getElementById("testCode").innerText;
        inject(fileData);
    }

    //change button ui
    window.reenableRun = function(){
        document.getElementById("runTestBtn").innerText = "Run Test";
        document.getElementById("runTestBtn").disabled = false;
    };
*/

 