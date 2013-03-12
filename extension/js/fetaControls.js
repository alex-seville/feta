function fetaControls(options){
    //initialize recording mode to false
    this.isRecording=false;
    this.recordBtn = options.recordBtn;
    this.loadBtn = options.loadBtn;
    this.loadUpload = options.loadUpload;
    this.root = options.root;

    this.setupEvents();
    this.events={
        startRecording: "fetaControls.startRecording",
        stopRecording: "fetaControls.stopRecording",
        testLoaded: "fetaControls.testLoaded"
    };
}
fetaControls.prototype.exportEvents = function(){
    return this.events;
};
fetaControls.prototype.clickRecord = function(){
    if (!this.isRecording){
        this.isRecording=true;
        this.root.trigger(this.events.startRecording,true);
        this.recordBtn.text("Stop Recording");
        this.loadBtn.attr("disabled",true);
    }else{
        this.isRecording=false;
        this.root.trigger(this.events.stopRecording,false);
        this.recordBtn.text("Start Recording");
        this.loadBtn.attr("disabled",false);
    }
};

fetaControls.prototype.loadTest = function(){
    //we use the HTML5 upload api to bring up the filepicker
    //for loading scripts,
    //the devtools need to be docked or the upload dialog will
    //appear outside the usuable window
    this.loadUpload.click();
};

fetaControls.prototype.setupEvents = function(){
    var view = this;
    view.recordBtn.click(function(){
        view.clickRecord(view.isRecording);
    });
    view.loadUpload.change(function(){
        var fileList = this.files;
        //just one for now
        var file=fileList[0];

        var reader = new FileReader();
        reader.onload = function(e) {
            view.root.trigger(view.events.testLoaded,{
                name: file.name,
                code: e.target.result
            });
        };
        reader.readAsText(file);
    });
    view.loadBtn.click(function(){
        view.loadTest();
    });
};
