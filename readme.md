# Quick-copy
A extension to quickly copy text by clicking on a text/link while holding a key (you can enable/disable and change key in settings)

__build for chrome/chromium based browsers for now, not too hard to adapt__

## Install
1. Clone or download this repository (and unzip if necessary)
2. Open the file "content.js" if want to change any setting
3. Open your browser extensions page
4. Enable "Developer Mode"
5. Click on "Load unpacked" and select the folder you just unzip


## Usage
Hold shift and move the cursor to highligh a element and click to copy to clipboard


## Settings
_now, only settings on file are availble, a dedicated page may come later_

Open the file "content.js" edit what you need, all of them have a description.

These are the settings that you will find on the file:

```js
/**
 * @description change settings here
 * options page may come later...
 */
const config = {

    /**
     * @description notification after copying
     * 
     * @param {Boolean} enable      enable/disable (true/false)
     * @param {Number}  hideAfterMs hide notifiction after XXmilliseconds
     * set to -1 to not hide
     * 
     * may only work in secure pages/https, not in http/without SSL
     */
    notification:{
        enable: true,
        hideAfterMs: 2000,
        title: "Text copied to clipboard!"
    },

    /**
     * @description enable key to start/stop listening the mouse
     * false -> always listening
     * true  -> listen only when key is held down (recommended)
     * 
     * if disabled, may interfere with nafigation
     */
    enableActionKey: true,
    
    /**
     * @description the key that when you hold it will start listening
     * for  mouse  position  and  clicks,  this allows to not leave it
     * always tracking cursor and clicks
     * 
     * keys  like ctrl and shift are  not recomended if you cliking in
     * links,  it  may  prevent  for  copying  or  opening link in new
     * window/tab
     * 
     * change it by the key you want
     * @example //examples:
     * actionKey: "Shift"
     * actionKey: "Alt"
     * actionKey: "w"
     * actionKey: "W" (shift+w)
     */
    actionKey: "Shift",


    /**
     * @description the event that will make it interact
     * with what you want to select, you still need to click to copy
     * but changes if will select when mouse move or whe you click
     * 
     * recommended: click or mousemove
     */
    mouseEventType: "mousemove",


    /**
     * @description put the tag and the attribute if you want to  take
     * something  specifically, like "href" form <a> (links) or  "src"
     * from an image tag (<img>)
     * 
     * 
     */
    specialTags: {
        "A": "href"
    },

    /**
     * @description Sometimes you are not selecting/clicking a <a> tag
     * with this setted to "true", the parent element you are hovering 
     * will also be checked
     * 
     * Google search results do that, puts a <h3> inside a <a> tag
     */
    checkParentElement: true,


    /**
     * @description enables a  highlight when mouse hovers  a element,
     * adds a background-color to the element
     * 
     * @param {Boolean} enable  enable/disable (true/false) highlight
     * @param {String}  color   color of highlight, the recommended  is
     * a translucent color (with alpha channel, like rgba or 8char HEX)
     * @example
     * #00000080 -> half translucent black
     * rgba(255, 255, 255, 0.5) -> half translucent white
     * @param {Number}  timeout time to remove the highlight after stop
     * moving the mouse
     */
    highlight: {
        enable: true,
        color: "rgba(0,0,0,0.3)",
        timeout: 500,
    },


    // print things on devTools console
    debug: false,
}
```


## LICENSE: MIT