function panelUI(options){
    this.testArea = options.testArea;
    this.headerArea = options.header;
    this.testPanel=options.testPanel;
    this.headerPanel = options.headerPanel;
    this.root = options.root;
    this.events={
        updatePanel: "panelUI.updatePanel",
        resetPanel: "panelUI.resetPanel"
    };

    this.testArea.click(this.selectTests);
    this.headerArea.click(this.selectHeader);
}
panelUI.prototype.selectTests=function(){
    this.testArea.find("li").removeClass("selected");
    this.headerArea.find("li").addClass("selected");
    this.root.trigger(this.events.updatePanel);
    this.headerPanel.hide();
    this.testPanel.show();
};
panelUI.prototype.selectHeader=function(){
    this.testArea.find("li").addClass("selected");
    this.headerArea.find("li").removeClass("selected");
    this.root.trigger(this.events.resetPanel);
    this.testPanel.hide();
    this.headerPanel.show();
};