
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
});



