# feta.js
========

Automated regression testing

## Requirements

Feta uses any existing jQuery instance it finds, or loads it's own.  This shouldn't conflict with your code, but it may.


## Install

Enable 'developer mode' in Chrome extensions and click 'load unpacked extension'.  Select the `dist` directory to load the extension.


## Usage

### Automated Test Creation

1. Open devtools and click on the Feta tab
2. Click `Start Recording`
3. Work through typical behaviours on the site
4. Click `Stop Recording` to stop capturing events and create the output script (it will prompt you for a filename)
5. A new tab will be created for the test.  From there you can run or download the test.
6. Validations can be added to this file, or it can be incorporated into an automated test suite


### Regression Testing

-Click `Load Script` to load a script into the sidebar, and then `Run Test` to run it.

OR

-Run `phantomjs feta/lib/phantom.js <url>`


### Todo
 
-improve reporting of regression, make regression report available
-cleanup classes in CSS/HTML
-sidebar needs to be expandable
-screenshot to check for css regressions (just in phantom script probably)
-capture double click, scroll, change events (capturing change events will help to make keypress events more reliable)
-maybe have test manifest to load multiple tests  
-reactor panel, devtools, and timeouts in test
-make tests editable in the panel?
-save tests to memory (maybe optionally local/session storage)

