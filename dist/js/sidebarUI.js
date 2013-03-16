function sidebarUI(options){
    this.testArea = options.testArea;
    this.headerArea = options.headerArea;
    this.testPanel=options.testPanel;
    this.headerPanel = options.headerPanel;
    this.root = options.root;
    this.splitDivider = options.splitDivider;

    this.events={
        updatePanel: "sidebarUI.updatePanel",
        resetPanel: "sidebarUI.resetPanel"
    };

    var view=this;
    this.testArea.click(function(e){
        var current = e.target.tagName === "LI" ? $(e.target) : $(e.target).closest("li");
        var indx = view.testArea.find("li").index(current);
        view.selectTests(current.data("id"),indx);
    });
    this.headerArea.click(function(){view.selectHeader();});
    this.splitDivider.mousedown(function(e){
        view.root.find(".panel").on("mousemove",m_move);
        view.root.find(".panel").on("mouseup",m_up);
        //e.preventDefault();
    });
    //could be improved
    var minMove = 75;
    var maxMove = $(".panel").width()-308;

    var m_move = function(e){
        var newOffset = e.pageX;
        if (e.pageX > minMove && e.pageX < maxMove){
            console.log("newOffset:"+newOffset);
            view.splitDivider.css("left",newOffset);
            view.root.find("#sideBar").width(newOffset+3);
            view.root.find("#sidePanel").css("left",newOffset+3);
        }
    };
    var m_up = function(){
        view.root.find(".panel").off("mousemove",m_move);
        view.root.find(".panel").off("mouseup",m_up);
    };
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
sidebarUI.prototype.selectTests=function(id,indx){
    indx = indx === -1 ? this.testArea.find("li").length-1 : indx;
    this.testArea.find("li").removeClass("selected");
    this.headerArea.find("li").removeClass("selected");
    this.testArea.find("li").eq(indx).addClass("selected");
    this.root.trigger(this.events.updatePanel,{data:id});
    this.testPanel.show();
    this.headerPanel.hide();
};
sidebarUI.prototype.getNewTestEntry = function(testName,testUrl,id){
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
    newLi.data("id",id);
    return newLi;
};
sidebarUI.prototype.addTestToList = function(testName,testUrl,id){
    var newLi=this.getNewTestEntry(testName,testUrl,id);
    //clear the current selections
    this.testArea.find("li").removeClass("selected");
    this.headerArea.find("li").removeClass("selected");
    //add the new item
    this.testArea.append(newLi);
};
sidebarUI.prototype.removeCurrent=function(){
    this.testArea.find("li.selected").remove();
    this.selectHeader();
};