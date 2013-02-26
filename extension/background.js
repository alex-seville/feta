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
        // Whatever you wish
        console.log(msg);
    });
});
// Function to send a message to all devtool.html views:
function notifyDevtools(msg) {
    Object.keys(ports).forEach(function(portId_) {
        ports[portId_].postMessage(msg);
    });
}