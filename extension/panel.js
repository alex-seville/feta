
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
    document.getElementById("loadTest").onclick = function(){
        document.getElementById("loadTestUpload").onchange = function(){
            var fileList = this.files;
            //just one for now
            var file=fileList[0];
            var reader = new FileReader();
            reader.onload = function(e) {  inject(e.target.result); };
            reader.readAsText(file);
        };
        document.getElementById("loadTestUpload").click();
    };

    window.saveFile = function(fileData){
       var fname = prompt("Enter a filename for your test script","");
       window.URL = window.webkitURL || window.URL;
       file = new Blob([fileData],{"type":"text\/plain"}); //populate the file with whatever text it is that you want
       var url = window.URL.createObjectURL(file);
       //saveNow(url,fname||"");
       saveNow(fileData.toString(),fname||"");
    };

    window.updateTestList = function(url,fname,code){
        alert("here with:",url,fname,code);
        if (typeof testlist[url] === "undefined"){
            testlist[url]=[];
        }
        testlist[url].push({"name":name,"test":code});
        alert("update with:",testlist);
        document.getElementById("testList").innerText = JSON.stringify(testlist,null,"\t");
    };
});



