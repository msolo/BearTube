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

    let params = new URL(event.url).searchParams;
    let id = params.get("v");
    if (id == null) {
        return;
    }
    let url = "https://msolo.github.io/BearTube/v1/watch.html?v=" + id;
    console.info("BearTube redirect " + event.url + " -> " + url);
    browser.tabs.update(event.tabId, { url: url });
}

browser.webNavigation.onBeforeNavigate.addListener((event) => {
    redirect(event);
}, filter);

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
