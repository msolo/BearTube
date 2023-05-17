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

function init() {
    browser.browserAction.getBadgeBackgroundColor({}, (color) => {
        // Store the background color. The docs suggest that "null" will return
        // this to the default, but that doesn't seem to work in any browser.
        localStorage["BearTube.bg-color"] = color;
    });
}

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

    // Safari Bug:
    // When a link is pasted into the Safari omnibox, tabId and frameId are unset.
    // This is a bug, but we can "guess" that it's the current tab. We might be
    // wrong if people are switching things around very quickly, but given the
    // upstream bug, there isn't much that can be done in the extension.
    // Chrome gets this right.
    if (event.tabId != 0) {
        browser.tabs.update(event.tabId, { url: dstUrl });
    } else {
        browser.tabs.getCurrent((tab) => {
            browser.tabs.update(tab.id, {url: dstUrl});
        })
    }
}

browser.webNavigation.onBeforeNavigate.addListener((event) => {
    redirect(event);
}, filter);

browser.webNavigation.onCommitted.addListener((event) => {
    // Safari Bug:
    // In the case of youtu.be links, there onBeforeNavigation is not fired.
    // This works as expected on Chrome.
    redirect(event);
}, filter);

//browser.webNavigation.onCompleted.addListener((event) => {
//    console.info("onCompleted");
//    console.table(event);
//}, filter);

//browser.webNavigation.onDOMContentLoaded.addListener((event) => {
//    console.info("onDOMContentLoaded");
//    console.table(event);
//}, filter);

browser.runtime.onInstalled.addListener(() => {
    console.info("BearTube installed");
    init();
});

browser.runtime.onStartup.addListener(() => {
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

    browser.browserAction.setBadgeBackgroundColor(
        { color: color });
    browser.browserAction.setBadgeText(
        { text: text });
    console.info("BearTube toggled: " + newState);
}

browser.browserAction.onClicked.addListener((tab) => {
    toggleEnabled(tab);
});
