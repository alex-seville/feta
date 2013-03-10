//memory object for storing currently loaded tests
var testlist=[]; //not used yet, but should be
var root = $(document);

document.addEventListener('DOMContentLoaded', function() {
    /* Sidebar UI */
    var sidebarView = new sidebarUI({
        testArea: $("#sidebarTests"),
        headerArea: $("#sidebarHeader"),
        testPanel: $("#testPanel"),
        headerPanel: $("#admin"),
        root: root
    });
    /* test controls */
    var testPanelView = new testPanelControls({
        root:root,
        testPanel: $("#testPanel"),
        codeArea: $("#testCode"),
        runBtnSelector: $("#runTestBtn")
    });

    /* feta controls UI */
    var fetaView = new fetaControls({
        recordBtn: $("#record"),
        loadBtn: $("#load"),
        loadUpload: $("#loadUpload"),
        root: root
    });

    function promptForTestname(){
        var defaultStr = "test";
        var msgStr = "Enter a name for your test script "+
                "(excluding extension)";
        return prompt(msgStr,"") || defaultStr;
    }

    //subscribe view events
    root
      .on(fetaView.exportEvents().startRecording,function(){
        //tell devtools we are recording
        window.msgToDevtools("clickRecord",{data:true});
      })
      .on(fetaView.exportEvents().stopRecording,function(){
        //tell devtools we're done recording
        window.msgToDevtools("clickRecord",{data:false});
      })
      .on(fetaView.exportEvents().loadTest,function(testInfo){
        //file has been loaded, update the sidebar ui and panel
        sidebarView.addTestToList(testInfo.name,"local");
        testPanelView.updatePanel(testInfo.name,testInfo.code);
      })
      .on(testPanelView.exportEvents().runningTest,function(fileData){
        //send test to devtools to run in page context
        window.msgToDevtools("injectScript",{data:fileData});
      })
      .on(testPanelView.exportEvents().downloadableCreated,function(data){
        //when download url is created, pass it to devtools to make downloadable
        window.msgToDevtools("makeDownload",{
            url:data.url,
            filename:data.name
        });
      });


    /* Communication with devtools */
    window.msgFromDevtools = function(code,data){
        if (code === "clickRecord"){
           //When footer bar record button is clicked
           fetaView.clickRecord();
           return;
        }
        if (code === "saveFile"){
            //we prompt for a filename
            //and then pass it right back
            //to devtools.
            window.msgToDevtools("getCurrentURL",{
                data:data.data,
                filename: promptForTestname(),
                callbackName: "saveWithURL"
            });
            return;
        }
        if (code === "revertRun"){
            //test is done running
            testPanelView.revertRunBtn();
        }
        if (code === "saveWithURL"){
            //new test has been created, update the sidebar & panel ui
            sidebarView.addTestToList(data.filename,data.url);
            testPanelView.updatePanel(data.filename,data.code);
            sidebarView.selectTests();
        }
    };
});



