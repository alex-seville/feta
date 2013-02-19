# feta.js
========

feta.js, automated regression testing


## Usage

This project is still in the preliminary stages, but this the intended workflow, as it exists right now:

1. Inject or include feta.js on an existing, functional page.
2. Run `feta.start()` to begin recording events.
3. Run through a series of behaviours on the page.
4. Run `feta.stop()` and then `feta.report(true,feta.saveAsJS)`
5. Copy the output.js file that now appears in the sources tab of your devtools
6. Paste this file into a text editor
7. Add verifications between steps (i.e. checking DOM properties)
8. Output a single result message prefixed with '***''
9. Save the file as 'regression_test.js'.
10. Run `phantomjs phantom.js regression_test.js <url>`
11. Output should have no regressions
11. Update <url> source code
12. Re-run phantom command and look for regressions

1-6 may be put into a browser extension.
7,8 will be formalized more (success/fail api)


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

## Phantomjs Example

1. Install phantomjs
2. `cd example`
3. Run `phantomjs phantom.js http://www.audemarspiguet.com/fr/savoir-faire/notre-expertise`
4. You should see a "***No regression" message.
