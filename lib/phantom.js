var page = require('webpage').create(),
	system = require('system');
var url  = system.args[2];
var testfile = system.args[1];
var delimiter = "FETA:";

page.onConsoleMessage = function (msg) {
    if (msg.indexOf(delimiter) === 0){
        console.log(msg.slice(delimiter.length));
        phantom.exit();
    }
};

page.open(url, function (status) {
    page.includeJs(testfile, function() {
        //Page is loaded!
    });
});