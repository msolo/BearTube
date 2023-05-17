// We don't need real persistence - a hack will do nicely.
const localStorage = {
    "BearTube.enabled": true,
    "BearTube.bg-color": "#ff0000",
};

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


function redirect(event) {
    let enabled = localStorage["BearTube.enabled"];
    if (!enabled) {
        console.info("BearTube skipping redirect " + event.url);
        return;
    }

    let url = new URL(event.url);
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

    let dstUrl = "https://msolo.github.io/BearTube/v1/watch.html?v=" + id;
    console.info("BearTube redirect tab " + event.tabId + " "    + event.url + " -> " + dstUrl);
    chrome.tabs.update(event.tabId, { url: dstUrl });
}

chrome.webNavigation.onBeforeNavigate.addListener((event) => {
    redirect(event);
}, filter);

chrome.webNavigation.onHistoryStateUpdated.addListener((event) => {
    // Links on youtube.com send this message instead.
    // console.info("onHistoryStateUpdated: " + event.url);
    redirect(event);
}, filter);

function init() {
    localStorage["BearTube.enabled"] = true;
    chrome.browserAction.getBadgeBackgroundColor({}, (color) => {
        // Store the background color. The docs suggest that "null" will return
        // this to the default, but that doesn't seem to work in any browser.
        localStorage["BearTube.bg-color"] = color;
    });
}

chrome.runtime.onInstalled.addListener(() => {
    console.info("BearTube installed");
    init();
});

chrome.runtime.onStartup.addListener(() => {
    console.info("BearTube started");
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

chrome.browserAction.onClicked.addListener((tab) => {
    toggleEnabled(tab);
});
