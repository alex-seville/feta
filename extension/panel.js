//memory object for storing currently loaded tests
var testlist={}; //not used yet, but should be

document.addEventListener('DOMContentLoaded', function() {
    /* Sidebar UI */

     //update sidebar ui to show test
    document.getElementById("sidebarTests").onclick=function(evt){
        document.getElementById("sidebarHeader").children[0].classList.remove("selected");
        document.getElementById("sidebarTests").children[0].classList.add("selected");
        window.updatePanel();
    };
    //update sidebar ui to hide tests
    document.getElementById("sidebarHeader").onclick=function(evt){
        document.getElementById("sidebarTests").children[0].classList.remove("selected");
        document.getElementById("sidebarHeader").children[0].classList.add("selected");
         window.resetPanel();
    };
    //find the script content, make a url from it, and pass that
    //to devtools to download.
    function downloadTest(){
        var test = document.getElementById("sideBar").getElementsByClassName("selected")[0];
        var spans = test.getElementsByTagName("span");
        var fname = spans[0].innerText;

        var fileData = document.getElementById("testCode").innerText;

       window.URL = window.webkitURL || window.URL;
       file = new Blob([fileData],{"type":"text\/plain"});
       var url = window.URL.createObjectURL(file);
        
        download(url,fname+".js");
    }
    //change the button text
    //and inject the test script into the page
     function runTest(){
        this.innerText = "Running...";
        this.disabled = true;
        var fileData = document.getElementById("testCode").innerText;
        inject(fileData);
    }
    //change button ui
    window.reenableRun = function(){
        document.getElementById("runTestBtn").innerText = "Run Test";
        document.getElementById("runTestBtn").disabled = false;
    };
    //show test ui
    window.updatePanel = function(){

        document.getElementById("admin").style.display="none";
        document.getElementById("testPanel").style.display="block";
    };
    //show feta ui
    window.resetPanel = function(){

        document.getElementById("admin").style.display="block";
        document.getElementById("testPanel").style.display="none";
    };

    /* feta controls UI */

    //initialize recording mode to false
    var recording=false;
    document.getElementById("record").onclick = function(){
        recording=clickRecord(recording);
    };
    //change button text and delegate to devtools.respond
    window.clickRecord = function(mode){
        if (!mode){
            mode=true;
            respond(mode);
            document.getElementById("record").innerText = "Stop Recording";
        }else{
            mode=false;
            respond(mode);
            document.getElementById("record").innerText = "Start Recording";
        }
        return mode;
    };
    //we use the HTML5 upload api to bring up the filepicker
    //for loading scripts
    document.getElementById("load").onclick = function(){
        document.getElementById("loadUpload").onchange = function(){
            var fileList = this.files;
            //just one for now
            var file=fileList[0];
            var reader = new FileReader();
            reader.onload = function(e) {
                updateTestList("local",file.name,e.target.result);
                updatePanel();
            };
            reader.readAsText(file);
        };
        document.getElementById("loadUpload").click();
    };
    
    //prompt for filename, then get the page url
    //from devtools
    window.saveFile = function(fileData){
       var fname = prompt("Enter a name for your test script (excluding extension)","");
       saveNow(fileData,fname||"");
    };
      
    //update the test panel
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
});



