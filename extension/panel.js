
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

function do_something(msg) {
    document.body.textContent += '\n' + msg; // Stupid example, PoC
}

