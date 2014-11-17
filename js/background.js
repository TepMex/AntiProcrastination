chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if(request.cmd == "getDisabledTemplate") {
        $.ajax({
            url: chrome.extension.getURL("disabled.html"),
            dataType: "html",
            success: sendResponse
        });
    }
});