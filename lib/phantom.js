var page = require('webpage').create(),
	system = require('system');
var url  = system.args[2];
var testfile = system.args[1];
var delimiter = "FETA_PHANTOMJS:";

page.onConsoleMessage = function (msg) {
    if (msg.indexOf(delimiter) === 0){
        console.log(msg.slice(delimiter.length));
        phantom.exit();
    }
};

page.open(url, function (status) {
    console.log("page loaded, injecting jquery");
    page.includeJs('http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js', function() {
        console.log("jquery loaded, injecting script");
        page.evaluate(function(){
            window.PhantomJS = true;
        });
        page.injectJs(testfile, function() {
            //Page is loaded!
            console.log("test running...");
        });
    });
});