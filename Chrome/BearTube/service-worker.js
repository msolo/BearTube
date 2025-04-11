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
    // return;
    console.debug(msg);
}

function btInfo(msg) {
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
    loadFull = false;
    let enabled = localStorage["BearTube.enabled"];
    if (!enabled) {
        btInfo("BearTube skipping redirect");
        return;
    } else {
        btInfo("BearTube redirect " + event.url);
    }

    let url = new URL(event.url);
    if (url.searchParams.get("yt") == "1") {
        // This is our signal we *really* want all of yt.
        loadFull = true;
        return;
    }

    let search = url.search;
    if (url.hostname == "youtu.be") {
        let id = url.pathname.substring(1);
        url.searchParams.append("v", id);
        search = "?" + url.searchParams.toString()
    }

    let dstUrl = "https://beartube.hiredgoons.com/v1/watch.html" + search
    btInfo("BearTube redirecting tab " + event.tabId + " " + event.url + " -> " + dstUrl);
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
    btInfo("BearTube toggled: " + newState);
}
