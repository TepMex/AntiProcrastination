chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.create({
        url: chrome.extension.getURL("options.html")
    })
});

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if(request.cmd == "getDisabledTemplate") {
        $.ajax({
            url: chrome.extension.getURL("disabled.html"),
            dataType: "html",
            success: sendResponse
        });
    }
});