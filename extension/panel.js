
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
                /*
              var blob = new Blob(fileData, { "type" : "text\/javascript" });
              
             
              document.getElementById("iframe").src = window.webkitURL.createObjectURL(blob);
              */
              window.URL = window.webkitURL || window.URL;
                file = new Blob(fileData,{"type":"text\/plain"}); //populate the file with whatever text it is that you want
                var url = window.URL.createObjectURL(file);
                console.log("url:",url);
                saveNow(url);
                
          };
});



