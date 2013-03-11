var root = $(document);
var tests = new db('feta_devtool_testlist');

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
        codeArea: $(".testCode"),
        runBtn: $(".runBtn"),
        downloadBtn: $(".downloadBtn")
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

    //take all the tests we have saved and
    //load them into the sidebar
    for(var showTests=0;showTests<tests.length();showTests++){
        var selectedItem = tests.get(showTests);
        sidebarView.addTestToList(selectedItem.name,selectedItem.url);
    }
    sidebarView.selectHeader();

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
      .on(fetaView.exportEvents().testLoaded,function(e,testInfo){
        //file has been loaded, update the sidebar ui and panel
        var indx = tests.add({
            url: "local",
            name:testInfo.name,
            code:testInfo.code
        });
        sidebarView.addTestToList(testInfo.name,"local");
        sidebarView.selectTests(indx);
      })
      .on(sidebarView.exportEvents().updatePanel,function(e,data){
        //update the panel with the correct data
        var selectedItem = tests.get(data.data);
        testPanelView.updatePanel(selectedItem.name,selectedItem.code);
      })
      .on(testPanelView.exportEvents().runningTest,function(e,fileData){
        //send test to devtools to run in page context
        window.msgToDevtools("injectScript",{data:fileData.data});
      })
      .on(testPanelView.exportEvents().downloadableCreated,function(e,data){
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
            testPanelView.addResultDetail(data.data);
            //should save the most recent result with the db, I think.
        }
        if (code === "saveWithURL"){
            //new test has been created, update the sidebar & panel ui
            var indx=tests.add({
                url: data.url,
                name:data.filename,
                code:data.data
            });
            sidebarView.addTestToList(data.filename,data.url);
            sidebarView.selectTests(indx);
        }
    };
});



