
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

    window.updateTestList = function(url,fname,code){
        
        if (typeof testlist[url] === "undefined"){
            testlist[url]=[];
        }
        testlist[url].push({"name":fname,"test":code});
        
        refreshList();
    };



    function refreshList(){
        var ul = document.getElementById("testList");
        var urls = Object.keys(testlist);

        for(var j=0;j<urls.length;j++){
            var li = document.createElement("li");
            var currentUrl = urls[j];
            li.innerHTML = currentUrl;
            
            var childUL = document.createElement("ul");
            
            for(var i=0;i<testlist[currentUrl].length;i++){
                var childli = document.createElement("li");
                
                childli.innerHTML = testlist[currentUrl][i].name;
                
                childUL.appendChild(childli);
            }
             
            li.appendChild(childUL);
           
            ul.appendChild(li);
        }
    }

   
});



