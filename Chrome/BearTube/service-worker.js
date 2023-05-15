// We don't need real persistence - a hack will do nicely.
const BearTubeEnabled = "com.hiredgoons.BearTube.enabled";

const localStorage = {
    BearTubeEnabled: true,
    "backgroundColor": "#ff0000",
};

const filter = {
    url: [
        {
            urlMatches: 'youtube.com/watch',
        },
    ],
};


function redirect(event) {
    let enabled = localStorage[BearTubeEnabled];
    if (!enabled) {
        console.info("skipping redirect " + event.url);
        return;
    }

    let params = new URL(event.url).searchParams;
    let id = params.get("v");
    let url = "https://hiredgoons.com/ytbt?v=" + id;
    console.info("redirect " + event.url + " -> " + url);
    chrome.tabs.update(event.tabId, { url: url });
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
    localStorage[BearTubeEnabled] = true;
    chrome.browserAction.getBadgeBackgroundColor({}, (color) => {
        // Store the background color. The docs suggest that "null" will return
        // this to the default, but that doesn't seem to work in any browser.
        localStorage["backgroundColor"] = color;
        console.info("got background color");
    });
}

chrome.runtime.onInstalled.addListener(() => {
    console.info("com.hiredgoons.BearTube installed");
    init();
});

chrome.runtime.onStartup.addListener(() => {
    console.info("com.hiredgoons.BearTube started");
    init();
});




function toggleEnabled(tab) {
    let newState = !localStorage[BearTubeEnabled];
    localStorage[BearTubeEnabled] = newState;
    let color = "#000000";
    let text = "off";
    if (newState) {
        color = localStorage["backgroundColor"];
        text = "";
    }

    chrome.browserAction.setBadgeBackgroundColor(
        { color: color });
    chrome.browserAction.setBadgeText(
        { text: text });

    console.info("com.hiredgoons.BearTube toggled: " + newState);
}

chrome.browserAction.onClicked.addListener((tab) => {
    toggleEnabled(tab);
});
