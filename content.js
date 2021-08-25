/**
 * @description this file is where listeners are attached
 * and executed 
*/


let highlightRemove;               // timer for remove higlight is stored here
let lastEl = undefined;            // last element clicked/hovered
let debug = false || config.debug; // enable/disable debug, change here or in the settings

/**
 * @description check if debug is enabled then print the arguments
 * if you set the fisrt parameter as log, error or warn, it use
 * the console.<type>
 * 
 * @param  {...any} args things to print on console
 * 
 * @example log("test: ", 1)
 * @example log("error", new Error("Error"))
 * @example log("warn", "warning")
 */
function log(...args){
    const typs = ["log", "warn", "error"];
    let type = typs.includes(args[0]) ? args[0] : "log";
    if(debug) console[type](...args);
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
    if(config.preventDefaultActions){
        e.preventDefault();
        e.stopPropagation();
    }

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