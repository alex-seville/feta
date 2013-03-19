# Feta.js
========

**Automated regression testing**

Feta runs as a Chrome extension, and as a standalone library.  
Use Feta to record functional tests of sites, and detect regressions caused by refactoring or maintenance.

Use Feta with PhantomJS to detect regression automatically in your continuous integration pipeline.


## Install

Enable 'developer mode' in Chrome extensions and click 'load unpacked extension'.  Select the `dist` directory to load the extension.


## Usage

**Check out [this walkthrough video](http://www.youtube.com/watch?v=vAzU243xUh0) (no sound yet) to see Feta in action**  

## Automated Test Creation

1. Open devtools and click on the Feta tab
2. Click `Start Recording`
3. Work through typical behaviours on the site
4. Click `Stop Recording` to stop capturing events and create the output script (it will prompt you for a filename)
5. A new tab will be created for the test.  From there you can run or download the test.
6. Validations can be added to this file, or it can be incorporated into an automated test suite


## Regression Testing

-Click `Load Script` to load a script into the sidebar, and then `Run Test` to run it.

OR

-Run `phantomjs feta/lib/phantom.js <url>`


## FAQ

**Q.** Can I use the extension to run multi page tests (i.e. refreshing of pages)
**A.** Not at this time.  Feta can only be used for single page apps for the moment.

**Q.** Does it work on windows? mac?
**A.** It has been tested on both windows and mac (but not linux)

**Q.** I got an error alert, what does it mean?
**A.** Please report all errors to the issue tracker.  Since Feta is in beta release I appreciate any feedback.

## Todo
 
-cleanup classes in CSS/HTML  
-screenshot to check for css regressions (just in phantom script probably)  
-capture double click, scroll, change events (capturing change events will help to make keypress events more reliable)  
-maybe have test manifest to load multiple tests     
-mock host objects in test (alert, confirm) and add pass throughs to feta for them, but also add option to not do that  
-more qunit tests for lib/feta.js

-multi page:
-timeout to capture event array as it's processing
-if page change, when page load reinject feta, re-start feta with existing event array
-need to distinguish between real page load events, check hashing function, interval not clearing?



