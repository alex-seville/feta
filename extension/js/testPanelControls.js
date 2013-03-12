function testPanelControls(options){
    this.root = options.root;
    this.testPanel = options.testPanel;
    this.codeArea = options.codeArea;
    this.runBtn = options.runBtn;
    this.downloadBtn = options.downloadBtn;

    var view=this;
    view.runBtn.click(function(){ view.runTest(); });
    view.downloadBtn.click(function(){ view.download($(this).data("filename"));});

    this.events = {
        downloadableCreated: "testPanelControls.downloadableCreated",
        runningTest: "testPanelControls.runningTest"
    };
}
testPanelControls.prototype.exportEvents = function(){
    return this.events;
};
testPanelControls.prototype.download = function(filename){
    var data = this.codeArea.val();
    window.URL = window.webkitURL || window.URL;
    var file = new Blob([data],{"type":"text\/plain"});
    var url = window.URL.createObjectURL(file);
    root.trigger(this.events.downloadableCreated,{name:filename+".js",url:url});
};
testPanelControls.prototype.runTest = function(){
    this.runBtn.text("Running...");
    this.runBtn.attr("disabled",true);
    var fileData = this.codeArea.val();
    root.trigger(this.events.runningTest,{data:fileData});
};
testPanelControls.prototype.revertRunBtn = function(){
    this.runBtn.text("Run Test");
    this.runBtn.attr("disabled",false);
};
testPanelControls.prototype.updatePanel = function(filename,code){
    this.downloadBtn.data("filename",filename);
    this.codeArea.val(code);
};
testPanelControls.prototype.addResultDetail = function(regressionData){
    if (regressionData.length > 0){
        this.testPanel
            .find(".lastRun")
            .text("Regression detected at "+ new Date().toISOString())
            .on("click",this.showRegression(regressionData));
    }else{
        this.testPanel
            .find(".lastRun")
            .text("Passed at "+ new Date().toISOString())
            .off("click");
    }
};
testPanelControls.prototype.showRegression = function(data){
    return function(){
        alert(data);
    };
};