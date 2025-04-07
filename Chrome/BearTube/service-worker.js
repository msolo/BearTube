// We don't need real persistence - a hack will do nicely.
const localStorage = {
    "BearTube.enabled": true,
    "BearTube.bg-color": "#ff0000",
};

var loadFull = false;

const filter = {
    url: [
        {
            urlMatches: 'youtube.com/watch',
        },
        {
            // https://youtu.be/wBd1tS5Ptmk
            hostEquals: 'youtu.be',
        },
    ],
};

function btDebug(msg) {
    return;
    console.info(msg);
}

function init() {
    btDebug("BearTube init");

    localStorage["BearTube.enabled"] = true;

    chrome.action.getBadgeBackgroundColor({}, (color) => {
        // Store the background color. The docs suggest that "null" will return
        // this to the default, but that doesn't seem to work in any browser.
        localStorage["BearTube.bg-color"] = color;
    });

    chrome.action.onClicked.addListener(async (tab) => {
        toggleEnabled(tab);
    });
}

function redirect(event) {
    btDebug("BearTube redirect");
    loadFull = false;
    let enabled = localStorage["BearTube.enabled"];
    if (!enabled) {
        console.info("BearTube skipping redirect " + event.url);
        return;
    }

    let url = new URL(event.url);
    if (url.searchParams.get("yt") == "1") {
        // This is our signal we *really* want all of yt.
        btDebug("BearTube loading full YouTube: " + event.url);
        loadFull = true;
        return;
    }
    let id = null;
    if (url.hostname == "youtu.be") {
        id = url.pathname.substring(1);
    }
    if (id == null) {
        id = url.searchParams.get("v");
    }
    if (id == null) {
        return;
    }

    let dstUrl = "https://beartube.hiredgoons.com/v1/watch.html?v=" + id;
    btDebug("BearTube redirect tab " + event.tabId + " " + event.url + " -> " + dstUrl);
    chrome.tabs.update(event.tabId, { url: dstUrl });
}

chrome.webNavigation.onBeforeNavigate.addListener((event) => {
    btDebug("BearTube beforeNavigate: " + event.url);
    redirect(event);
}, filter);

chrome.webNavigation.onHistoryStateUpdated.addListener((event) => {
    btDebug("BearTube onHistoryStateUpdated: " + event.url + " loadfull:" + loadFull);
    // Links on youtube.com send this message instead.
    // We have to ignore if we are trying to actually load the onsite version.
    if (loadFull) {
        return;
    }
    redirect(event);
}, filter);

chrome.runtime.onInstalled.addListener(() => {
    btDebug("BearTube installed");
    init();
});

chrome.runtime.onStartup.addListener(() => {
    btDebug("BearTube started");
    init();
});


function toggleEnabled(tab) {
    let newState = !localStorage["BearTube.enabled"];
    localStorage["BearTube.enabled"] = newState;
    let color = "#000000";
    let text = "off";
    if (newState) {
        color = localStorage["BearTube.bg-color"];
        text = "";
    }

    chrome.browserAction.setBadgeBackgroundColor(
        { color: color });
    chrome.browserAction.setBadgeText(
        { text: text });

    console.info("BearTube toggled: " + newState);
}
