

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


let hovered;
let highlightRemove;
let lastTag = "";
let lastEl = undefined;

function log(...args){
    if(config.debug) console.log(...args);
}

/**
 * @description Check/Request notification permission and send a notification
 * @param {String} str notification body
 * @returns {Error}
 */
function notify(body, title = config.notification.title){
    if(!config.notification.enable) return;
    if(typeof body !== "string") return new Error("Notification text must be a string");
    if(body == "") return;
    if(!("Notification" in window)) return new Error("Notification API unavailable");

    if(Notification.permission === "denied"){
        Notification.requestPermission(permission => {
            if(permission === "granted") notify(body);
        })
    }
    else if(Notification.permission === "granted"){
        if(body.length > 150) str = `${body.slice(0, 120)}...${body.slice(-10)}`;
        let n = new Notification(title, {
            body
        });
        if(config.notification.hideAfterMs != -1){
            setTimeout(() => {
                n.close();
            }, config.notification.hideAfterMs);
        }
    }
}


/**
 * @description Check if clipboard API is available and
 * write text on clipboard 
 * @param {String}  str text to write
 */
function clipboardWrite(str){
    // I know, try/catch + then/catch is bad  but for
    // this application should not be a big of a deal
    // thats just to have a fallback if API isn't availbale
    try {
        const nav = navigator || chrome;
        if("clipboard" in nav){
            nav.clipboard.writeText(str).then(success => {
                try {
                    notify(str)
                } catch (e) {log("notify err");}
            }).catch(err => {
                log("Error while trying to write to clipdoard\n", err);
            })
        }
    } catch (e) {
        let txtarea = document.createElement("textarea");
        txtarea.value = str;
        txtarea.focus();
        txtarea.select();
        document.execCommand("copy");
        txtarea.blur();
        try {
            notify(str)
        } catch (e) {log("notify err");}
    }
}

function copy(e){
    e.preventDefault();
    e.stopPropagation();

    if(e.target){
        let text = e.target.innerText;
        let tag = e.target.tagName;
        let ptag = e.target.parentElement.tagName;
        
        if(tag in config.specialTags){
            let sp = config.specialTags[tag];

            if(sp in e.target && e.target[sp] != ""){
                let t = e.target[sp];
                
            }
        }
        else if(config.checkParentElement && ptag in config.specialTags){
            let sp = config.specialTags[ptag];
    
            if(sp in e.target.parentElement && e.target.parentElement[sp] != ""){
                text = e.target.parentElement[sp];
            }
        }
    
        clipboardWrite(text);
    }
    
    log(e.target, typeof e.target);
}


function selectFragment(e){

    if(config.mouseEventType == "click"){
        copy(e);
    }
    else{
        hovered = e;
        if(config.highlight.enable){
            e.target.style.backgroundColor = config.highlight.color;

            if(lastEl && lastEl != e.target){
                lastEl.style.backgroundColor = "";
            }
            else{
                if(highlightRemove) clearTimeout(highlightRemove);
                highlightRemove = setTimeout(() => {
                    lastEl.style.backgroundColor = "";
                }, config.highlight.timeout);
            }

        }
        lastEl = e.target;
        log(e.target.innerText);
        document.addEventListener("click", copy);
    }
}


document.addEventListener("readystatechange", ready_evt => {
    
    if(document.readyState == "complete"){

        console.log("Quick-copy loaded!");

        if(config.enableActionKey){
            
            // start listen when key is held down
            document.addEventListener("keydown", e => {
                if(e.key == config.actionKey){
                    document.addEventListener(config.mouseEventType, selectFragment);
                }
            })

            // stop when release the key
            document.addEventListener("keyup", e => {
                if(e.key == config.actionKey){
                    document.removeEventListener(config.mouseEventType, selectFragment);
                    document.removeEventListener("click", copy);
                }
            })

        }
        else{
            document.addEventListener(config.mouseEventType, selectFragment)
        }
    }
})