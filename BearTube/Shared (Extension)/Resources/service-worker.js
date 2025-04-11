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

function btDebug(msg) {
    // return;
    console.debug(msg);
}

function btInfo(msg) {
    // return;
    console.info(msg);
}

function init() {
    btInfo("BearTube init");

    localStorage["BearTube.enabled"] = true;
    browser.browserAction.getBadgeBackgroundColor({}, (color) => {
        // Store the background color. The docs suggest that "null" will return
        // this to the default, but that doesn't seem to work in any browser.
        localStorage["BearTube.bg-color"] = color;
    });
}

function redirect(event) {
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
    btInfo("BearTube redirecting tab " + event.tabId + " " + event.url + " -> " + dstUrl);

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
            browser.tabs.update(tab.id, { url: dstUrl });
        })
    }
}

browser.webNavigation.onBeforeNavigate.addListener((event) => {
    btDebug("BearTube beforeNavigate");
    redirect(event);
}, filter);

browser.webNavigation.onCommitted.addListener((event) => {
    btDebug("BearTube onCommitted");
    // Safari Bug:
    // In the case of youtu.be links, there onBeforeNavigation is not fired.
    // This works as expected on Chrome.
    redirect(event);
}, filter);

browser.webNavigation.onCompleted.addListener((event) => {
    btDebug("BearTube onCompleted");
    // console.table(event);
}, filter);

browser.webNavigation.onDOMContentLoaded.addListener((event) => {
    btDebug("BearTube onDOMContentLoaded");
    // console.table(event);
}, filter);

browser.runtime.onInstalled.addListener(() => {
    btDebug("BearTube installed");
    init();
});

browser.runtime.onStartup.addListener(() => {
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

    browser.browserAction.setBadgeBackgroundColor(
        { color: color });
    browser.browserAction.setBadgeText(
        { text: text });
    btInfo("BearTube toggled: " + newState);
}

browser.browserAction.onClicked.addListener((tab) => {
    toggleEnabled(tab);
});
