function sidebarUI(options){
    this.testArea = options.testArea;
    this.headerArea = options.headerArea;
    this.testPanel=options.testPanel;
    this.headerPanel = options.headerPanel;
    this.root = options.root;
    this.events={
        updatePanel: "sidebarUI.updatePanel",
        resetPanel: "sidebarUI.resetPanel"
    };

    var view=this;
    this.testArea.click(function(e){
        var current = e.target.tagName === "LI" ? $(e.target) : $(e.target).closest("li");
        var indx = view.testArea.find("li").index(current);
        view.selectTests(indx);
    });
    this.headerArea.click(function(){view.selectHeader();});
}
sidebarUI.prototype.exportEvents = function(){
    return this.events;
};
sidebarUI.prototype.selectHeader=function(){
    this.testArea.find("li").removeClass("selected");
    this.headerArea.find("li").addClass("selected");
    this.root.trigger(this.events.resetPanel);
    this.headerPanel.show();
    this.testPanel.hide();
};
sidebarUI.prototype.selectTests=function(indx){
    this.testArea.find("li").removeClass("selected");
    this.headerArea.find("li").removeClass("selected");
    this.testArea.find("li").eq(indx).addClass("selected");
    this.root.trigger(this.events.updatePanel,{data:indx});
    this.testPanel.show();
    this.headerPanel.hide();
};
sidebarUI.prototype.getNewTestEntry = function(testName,testUrl){
    //create a new sidebar entry
    var newLi = $("<li/>")
        .addClass("sidebar-tree-item")
        .addClass("audit-result-sidebar-tree-item")
        .addClass("selected");
    var img = $("<img/>").addClass("icon");
    var status = $("<div/>").addClass("status");
    img.append(status);
    var titleDiv = $("<div/>")
        .addClass("titles")
        .addClass("subtitle");
    var titleSpan = $("<span/>")
        .addClass("title")
        .text(testName);
    var subtitleSpan = $("<span/>")
        .addClass("subtitle")
        .text(testUrl);
    titleDiv.append(titleSpan);
    titleDiv.append(subtitleSpan);
    newLi.append(img);
    newLi.append(titleDiv);
    return newLi;
};
sidebarUI.prototype.addTestToList = function(testName,testUrl){  
    var newLi=this.getNewTestEntry(testName,testUrl);
    //clear the current selections
    this.testArea.find("li").removeClass("selected");
    this.headerArea.find("li").removeClass("selected");
    //add the new item
    this.testArea.append(newLi);
};