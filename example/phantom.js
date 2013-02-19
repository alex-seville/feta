var page = require('webpage').create(),
	system = require('system');
var url  = system.args[1];

page.onConsoleMessage = function (msg) {
    if (msg.slice(0,3) === "***"){
        console.log(msg);
        phantom.exit();
    }
};

page.open(url, function (status) {
    page.includeJs("http://localhost:3000/example/test.js", function() {
        //Page is loaded!
        //phantom.exit();
    });
});