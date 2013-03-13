function testPanelControls(options){
    this.root = options.root;
    this.testPanel = options.testPanel;
    this.codeArea = options.codeArea;
    this.runBtn = options.runBtn;
    this.downloadBtn = options.downloadBtn;
    this.testId = options.testIdField;
    this.deleteBtn = options.deleteBtn;

    var view=this;
    view.runBtn.click(function(){ view.runTest(); });
    view.downloadBtn.click(function(){ view.download($(this).data("filename"));});
    view.deleteBtn.click(function(){ view.deleteTest();});

    this.events = {
        downloadableCreated: "testPanelControls.downloadableCreated",
        runningTest: "testPanelControls.runningTest",
        updateLastResult: "testPanelControls.updateLastResult",
        deleteTest: "testPanelControls.deleteTest"
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
    this.resetRegressionReport();
    var fileData = this.codeArea.val();
    var fileId = this.testId.val();
    root.trigger(this.events.runningTest,{data:fileData,testId:fileId});
};
testPanelControls.prototype.resetRegressionReport=function(){
    this.testPanel.find(".lastRun")
        .text("")
        .removeClass("red")
        .removeClass("green");
    this.testPanel.find(".regressions").hide();
    this.testPanel.find(".regressions").find("ul").empty();
    this.codeArea.removeClass("splitSource");
};
testPanelControls.prototype.revertRunBtn = function(){
    this.runBtn.text("Run Test");
    this.runBtn.attr("disabled",false);
};
testPanelControls.prototype.updatePanel = function(item){
    this.resetRegressionReport();
    this.downloadBtn.data("filename",item.name);
    this.codeArea.val(item.code);
    this.testId.val(parseInt(item.id,10));
    if (item.lastResult && item.lastResult.length > 0){
        this.addResultDetail(item.lastResult,item.lastResultDate);
    }
};
testPanelControls.prototype.addResultDetail = function(regressionData,dateStamp){
    dateStamp = dateStamp || new Date().toISOString();
    this.root.trigger(this.events.updateLastResult,{id: this.testId.val() ,data:regressionData,date: dateStamp});
    if (regressionData.length > 0){
        this.testPanel
            .find(".lastRun")
            .text("Regression detected at "+ dateStamp)
            .addClass("red");
        var regs = this.testPanel.find(".regressions");
        var ul = regs.find("ul");
        for(var i=0;i<regressionData.length;i++){
            ul.append($("<li/>").text(regressionData[i]));
        }
        this.codeArea.addClass("splitSource");
        regs.show();
    }else{
        this.testPanel
            .find(".lastRun")
            .text("Passed at "+ dateStamp)
            .addClass("green");
    }
};
testPanelControls.prototype.deleteTest= function(data){
    if(confirm("Are you sure you want to delete this test?")){
        this.root.trigger(this.events.deleteTest,{id: this.testId.val()});
    }
};