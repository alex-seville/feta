
var testlist={};



document.addEventListener('DOMContentLoaded', function() {
    var recording=false;
    document.getElementById("record").onclick = function(){
        if (!recording){
            recording=true;
            respond(recording);
            document.getElementById("record").innerText = "Stop Recording";
        }else{
            recording=false;
            respond(recording);
            document.getElementById("record").innerText = "Start Recording";
        }
    };

    document.getElementById("load").onclick = function(){
        document.getElementById("loadUpload").onchange = function(){
            var fileList = this.files;
            //just one for now
            var file=fileList[0];
            var reader = new FileReader();
            reader.onload = function(e) {  inject(e.target.result); };
            reader.readAsText(file);
        };
        
        document.getElementById("loadUpload").click();
    };
    

    window.saveFile = function(fileData){
       var fname = prompt("Enter a filename for your test script","");
       window.URL = window.webkitURL || window.URL;
       file = new Blob([fileData],{"type":"text\/plain"}); //populate the file with whatever text it is that you want
       var url = window.URL.createObjectURL(file);
       saveNow(fileData,fname||"");
       //download(url,fname||"");

       //alert("savefile:",fileData,fname);
       //saveNow(fileData,fname||"");
       //updateTestList(url,fname,fileData);
    };

    window.updatePanel = function(){

        document.getElementById("admin").style.display="none";
        document.getElementById("testPanel").style.display="block";
    };

    window.resetPanel = function(){

        document.getElementById("admin").style.display="block";
        document.getElementById("testPanel").style.display="none";
    };

    window.updateTestList = function(url,fname,code){
        
        
        var arr = Array.prototype.slice.call(document.getElementById("sideBar").getElementsByClassName("selected"));

        arr.forEach(function(el){
                        el.classList.remove("selected");
                    });
                    
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


        document.getElementById("testPanel").innerText = code;
        /*

        <li title="" class="sidebar-tree-item audit-result-sidebar-tree-item">
                  <img class="icon"><div class="status"></div>
                  <div class="titles no-subtitle">
                    <span class="title">https://plus.google.com/115133653231679625609/posts/UZF34wPJXsL (1)</span>
                    <span class="subtitle"></span>
                  </div>
                </li>
                */

    };



    

    document.getElementById("sidebarTests").onclick=function(evt){
        document.getElementById("sidebarHeader").children[0].classList.remove("selected");
        document.getElementById("sidebarTests").children[0].classList.add("selected");
    };

    document.getElementById("sidebarHeader").onclick=function(evt){
        document.getElementById("sidebarTests").children[0].classList.remove("selected");
        document.getElementById("sidebarHeader").children[0].classList.add("selected");
    };

   
});



