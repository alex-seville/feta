

//from http://stackoverflow.com/questions/11661613/chrome-devpanel-extension-communicating-with-background-page

var ports = {};
chrome.extension.onConnect.addListener(function(port) {
    if (port.name !== "devtools") return;
    ports[port.portId_] = port;
    // Remove port when destroyed (eg when devtools instance is closed)
    port.onDisconnect.addListener(function(port) {
        delete ports[port.portId_];
    });
    port.onMessage.addListener(function(msg) {
        // When the extension is loaded
        //we start listening for page updated
        //events
        if (msg.code === "LOADFETA"){
             chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
                if (changeInfo.status === 'complete') {
                    console.log("laoding complete");
                    port.postMessage({code: "PageChanged"});
                }else if(changeInfo.status === 'loading'){
                    console.log("loading "+changeInfo.url);
                    port.postMessage({code: "PageLoading",data:changeInfo.url});
                }
            });
        }
    });
});
// Function to send a message to all devtool.html views:
function notifyDevtools(msg) {
    Object.keys(ports).forEach(function(portId_) {
        ports[portId_].postMessage(msg);
    });
}