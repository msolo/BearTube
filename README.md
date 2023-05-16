![Banner](BearTube/icons/icon-64.svg)

# BearTube

BearTube is a small browser extension to make the drive-by YouTube experience more 2005 than 2020. It puts the video front and center, adhering to the design ethos best expressed by Terry Tate - "condense the nonsense". However, if you visit youtube.com directly and use the site the plugin won't modify any of the viewing pages.

# Installation

## macOS
Download the application from GitHub and run the application once.

[BearTube.zip](https://github.com/msolo/BearTube/releases/download/v1.0.1/BearTube-1.0.1.zip)

You may get a warning from Gatekeeper about having to trust an "unknown" developer.

The application will tell you to open Safari's preferences to explicitly enable the plugin, which must be done manually for security and inconvenience.

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
