# BearTube Safari Extension

## Excuses

For some reason, extensions in Swift are more reliable than in Objective-C. I explored the default templates in Xcode 16.2 for both languages and only the Swift versions seems to install the plugin inside Safari correctly.

I spent relatively little time trying to debug this as the documentation around extensions is sparse and the debugging process complex and unrewarding. It's possible that I'm the last person with a mixture of love and respect for Objective-C and thus no one has tested/cared about this in some time.

The inefficiency of Safari Extensions is particularly staggering. In order to deploy ~2k of Javascript I need to create an application - 330KB in Objective-C. Then I need 6MB of PNG files to appease the AppStore and its constantly shifting UI requirements. Porting this useless app shell to Swift so some magical internal wiring works pulls in another 12MB of additional garbage, masquerading as frameworks.

In the end, about 0.01% of this bundle is actually my code dedicated to solving the problem, the rest is arbitrary taxes. This should give us some indication of the overall efficiency in our craft.

I used to wring my hands about the size of statically linked Go binaries and the inefficiency of shipping those binaries around a few hundred thousand machines. Turns out there are bigger fish to fry.
