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

    this.testArea.click(this.selectTests);
    this.headerArea.click(this.selectHeader);
}
sidebarUI.prototype.selectTests=function(){
    this.testArea.find("li").removeClass("selected");
    this.headerArea.find("li").addClass("selected");
    this.root.trigger(this.events.updatePanel);
    this.headerPanel.hide();
    this.testPanel.show();
};
sidebarUI.prototype.selectHeader=function(){
    this.testArea.find("li").addClass("selected");
    this.headerArea.find("li").removeClass("selected");
    this.root.trigger(this.events.resetPanel);
    this.testPanel.hide();
    this.headerPanel.show();
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
/*
window.updateTestList = function(url,fname,code){
        //TODO replace with proper view/templating
        var arr = Array.prototype.slice.call(document.getElementById("sideBar").getElementsByClassName("selected"));
        arr.forEach(function(el){
            el.classList.remove("selected");
        });
        //switch the sidebar
        var sb = document.getElementById("sidebarTests");
        var newLi = document.createElement("li");
        newLi.classList.add("sidebar-tree-item");
        newLi.classList.add("audit-result-sidebar-tree-item");
        newLi.classList.add("selected");
        
        var img = document.createElement("img");
        img.classList.add("icon");
        var statusDiv = document.createElement("div");
        statusDiv.classList.add("status");
        img.appendChild(statusDiv);
        //set the titles
        var titleDiv = document.createElement("div");
        titleDiv.classList.add("titles");
        titleDiv.classList.add("subtitle");
        var titleSpan = document.createElement("span");
        titleSpan.classList.add("title");
        titleSpan.innerText = fname;
        var subtitleSpan = document.createElement("span");
        subtitleSpan.classList.add("subtitle");
        subtitleSpan.innerText = url;
        titleDiv.appendChild(titleSpan);
        titleDiv.appendChild(subtitleSpan);
        newLi.appendChild(img);
        newLi.appendChild(titleDiv);
        sb.appendChild(newLi);
        //add the test code
        var codeDiv = document.createElement("div");
        codeDiv.id="testCode";
        codeDiv.innerText = code;
        //add the action buttons
        var btnDiv = document.createElement("div");
        btnDiv.classList.add("btnBar");
        var dbtn = document.createElement("button");
        dbtn.innerText = "Download";
        dbtn.onclick = downloadTest;
        var lbtn = document.createElement("button");
        lbtn.id="runTestBtn";
        lbtn.innerText = "Run Test";
        lbtn.onclick =runTest;
        btnDiv.appendChild(lbtn);
        btnDiv.appendChild(dbtn);
        document.getElementById("testPanel").appendChild(btnDiv);
        document.getElementById("testPanel").appendChild(codeDiv);
    };
    */