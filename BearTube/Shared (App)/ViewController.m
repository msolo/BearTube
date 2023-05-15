#import "ViewController.h"

#import <WebKit/WebKit.h>

#if TARGET_OS_OSX
#import <SafariServices/SafariServices.h>
#endif

static NSString * const extensionBundleIdentifier = @"com.hiredgoons.BearTube.Extension";

@interface ViewController () <WKNavigationDelegate, WKScriptMessageHandler>

@property (nonatomic) IBOutlet WKWebView *webView;

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];

    _webView.navigationDelegate = self;

#if TARGET_OS_IOS
    _webView.scrollView.scrollEnabled = NO;
#endif

    [_webView.configuration.userContentController addScriptMessageHandler:self name:@"controller"];

    [_webView loadFileURL:[NSBundle.mainBundle URLForResource:@"Main" withExtension:@"html"] allowingReadAccessToURL:NSBundle.mainBundle.resourceURL];
}

- (void)webView:(WKWebView *)webView didFinishNavigation:(WKNavigation *)navigation {
#if TARGET_OS_IOS
    [webView evaluateJavaScript:@"show('ios')" completionHandler:nil];
#elif TARGET_OS_OSX
    [webView evaluateJavaScript:@"show('mac')" completionHandler:nil];

    [SFSafariExtensionManager getStateOfSafariExtensionWithIdentifier:extensionBundleIdentifier completionHandler:^(SFSafariExtensionState *state, NSError *error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (!state) {
                // Insert code to inform the user something went wrong.
                return;
            }

            [webView evaluateJavaScript:[NSString stringWithFormat:@"show('mac', %@)", state.isEnabled ? @"true" : @"false"] completionHandler:nil];
        });
    }];
#endif
}

- (void)userContentController:(WKUserContentController *)userContentController didReceiveScriptMessage:(WKScriptMessage *)message {
#if TARGET_OS_OSX
    if (![message.body isEqualToString:@"open-preferences"])
        return;

    [SFSafariApplication showPreferencesForExtensionWithIdentifier:extensionBundleIdentifier completionHandler:^(NSError *error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            [NSApplication.sharedApplication terminate:nil];
        });
    }];
#endif
}

@end
