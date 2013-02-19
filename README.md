# feta.js
========

feta.js, automated regression testing


## Install

Run `bower install` to install jquery (a dev dependence).  
If you use it in the browser on a page that is already using jquery,you don't need to worry about this.

## Instructions

1. Start a local server in the feta directory
2. Open a website
3. Open devtools
4. Paste the following in the console `s = document.createElement('script');  s.src = 'http://localhost:3000/lib/feta.js'; document.body.appendChild(s);`
5. Run `feta.start()`
6. Run througha  typical behaviour
7. Run `feta.stop()` and a readable list of events will be displayed
8. Run `feta.report(true,feta.play)` to have the events re-played in the browser
9. Instead of 8, run `feta.report(true,feta.saveAsJS)` to replay the events and have them saved as a JS to the sources tab of devtools.


*NOTE: Steps 1-4 can be avoided if you're able to include a script reference to feta.js on the page itself*

## Example

1. Open `http://www.audemarspiguet.com/en/savoir-faire/our-craft`
2. Open devtools
3. In the console, run `s = document.createElement('script');  s.src = 'http://localhost:3000/example/test.js'; document.body.appendChild(s);`
4. You should see actions occur on the screen and then a "No Regression" message in the console (unless there have been regressions!)
