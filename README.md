# Feta.js
========

**Automated regression testing**

Use Feta to record functional tests of sites, and detect regressions caused by refactoring or maintenance.

Feta runs as a Chrome extension, and as a standalone library.  Use Feta with PhantomJS to detect regression automatically in your continuous integration pipeline.


## Download

You can find a distributable copy of the Chrome extension [here](https://github.com/alex-seville/feta/blob/distributables/v0.0.1.zip?raw=true).

The full source can be downloaded from the master branch on GitHub (as a zip or gz) or installed via bower (`bower install feta`).


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
**A.** It has been tested on both windows and mac (presumably works on linux)

**Q.** I got an error alert, what does it mean?  
**A.** Please report all errors to the issue tracker.  Since Feta is in beta release I appreciate any feedback.

## Roadmap
 
v0.0.2  
-Cleanup of generated test  
-Minor UI fixes  
-Example app  

v0.0.3  
-multipage support  