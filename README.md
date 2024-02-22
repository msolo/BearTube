![Banner](BearTube/icons/icon-64.svg)

# BearTube

BearTube is a small browser extension to make the drive-by YouTube experience more 2005 than 2020. It puts the video front and center, adhering to the design ethos best expressed by Terry Tate - "condense the nonsense". However, if you visit youtube.com directly and use the site the plugin won't modify any of the viewing pages.

# Installation

## macOS

Thie is more difficult than many applications due to Apple's security theatre. Follow carefully, you may have to improvise because Apple makes changes to the permission process that are out of my control.

1. Download the application from this link [BearTube.zip](https://github.com/msolo/BearTube/releases/download/v1.0.3/BearTube-1.0.3.zip).
2. Go to the `Downloads` folder and right click on the BearTube application. Select `Open`. You must launch the application this way. You will get a dialog box asking if you want to allow running the unsigned, untrusted code - yes. You want to do that.
3. If you see the application load, it will give you a button to quit it and launch Safari's Extension panel instead. It doesn't always work so you may need to go to the Safari Preferences, find the section called `Extentsions` and enable the checkbox next to BearTube.
4. This might still be not enough. Visit youtube.com. You should see a tv icon next to the location bar, if it is not glowing blue, you need to click on the tv icon and select `Always allow on youtube.com`.
5. Paste in a link to a youtube video - it should take you to a giant version of the video with nothing else.

NOTE: Due to a bug in how Safari extensions work, clicking on links on Youtube itself often causes fail to activate the plugin. You often have to reload the page with `Command-R`. Sometimes this can even happen with other links. Unfortunately, it seems completely out of my control since the plugin code never gets triggered.

## iOS

For now, the easiest thing (for various definitions of "easy") is to compile the project yourself and self-sign so you can install it via USB on your iOS devices.

## Chrome

The unpacked plugin can also be manually installed from the source in [`Chrome/BearTube`](Chrome/BearTube). You may have to visit chrome://extensions and enter Developer Mode to do this.


# Using BearTube

When BearTube encounters a link to a youtube watch page, it will redirect the browser to a super-sized embedded version. To view the original page, disable BearTube by clicking its icon in the Safari tool bar. Hint: it looks like a bear on the tube.

# TODO

 * Update mechanism?
 * The application is ~330K to deploy 2K of Javascript, but also seems to require 6MB of PNG files to conform to "best practices." Condense nonsense. The Chrome extension is 60K and manages to look decent doing it.
 * Eliminate server side component? The fastest RPC is one that doesn't happen.
 * Need some sort of special ADC account for iOS, which strongly suggests you need to have some sort of LLC
   * There is some prior art publishing as an individual: https://github.com/arnoappenzeller/PiPifier
   * There is a fee of $100+, which seems pointless if you aren't going to charge for something.
