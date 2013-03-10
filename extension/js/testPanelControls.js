function testPanelControls(options){
    this.root = options.root;
    this.testPanel = options.testPanel;
    this.codeAreaSelector = options.codeAreaSelector;
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
    var data = $(this.codeAreaSelector).val();
    window.URL = window.webkitURL || window.URL;
    var file = new Blob([data],{"type":"text\/plain"});
    var url = window.URL.createObjectURL(file);
    root.trigger(this.events.downloadableCreated,{name:filename+".js",url:url});
};
testPanelControls.prototype.runTest = function(){
    $(this.runBtnSelector).text("Running...");
    $(this.runBtnSelector).attr("disabled",true);
    var fileData = $(this.codeAreaSelector).val();
    root.trigger(this.events.runningTest,{data:fileData});
};
testPanelControls.prototype.revertRunBtn = function(){
    $(this.runBtnSelector).text("Run Test");
    $(this.runBtnSelector).attr("disabled",false);
};
testPanelControls.prototype.updatePanel = function(filename,code){
    var view=this;
    var codeDiv = $("<textarea/>")
        .attr("id","testCode")
        .val(code);
    //add the action buttons
    var btnDiv = $("<div/>")
        .addClass("btnBar");
    var dbtn = $("<button/>")
        .text("Download")
        .click(function(){ view.download(filename);});
    var lbtn = $("<button/>")
        .attr("id","runTestBtn")
        .text("Run Test")
        .click(function(){ view.runTest(); });
    btnDiv.append(lbtn);
    btnDiv.append(dbtn);
    view.testPanel.append(btnDiv);
    view.testPanel.append(codeDiv);
};