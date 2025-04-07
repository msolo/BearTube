console.log("BearTube content injection: ", window.location.href);

// Something YouTube does interferes with events on Safari.
var btObserveUrlChange = () => {
  let oldHref = document.location.href;
  const body = document.querySelector('body');
  const observer = new MutationObserver(mutations => {
    if (oldHref !== document.location.href) {
      oldHref = document.location.href;
      //      console.log(
      //                  `observer change location: ${document.location}`,
      //                  );
      if (document.location.pathname == "/watch") {
        let url = new URL(document.location.href);
        if (url.searchParams.get("yt") == "1") {
          console.log("BearTube skip reset location: ", l);
          // This is our signal we *really* want all of yt.
          return;
        }
        let l = document.location + "&ts=" + Date.now();
        console.log("BearTube reset location: ", l);
        window.location = l;
      }
    }
  });
  observer.observe(body, { childList: true, subtree: true });
};

window.addEventListener("load", btObserveUrlChange, false);

// On MobileSafari, the events don't seem to match the desktop, nor are
// they reliably delivered. Navigate is not even supposed to work based
// on the documentation, but it works in iOS Safari 18.
window.addEventListener("navigate", (event) => {
  btObserveUrlChange()
}, false);
