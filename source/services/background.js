/**
 * Listener to display pageAction and start extension.
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    switch(request.query){
        case "SHOW_PAGE_ACTION":
            chrome.tabs.executeScript(sender.tab.id, {file: request.path});
            chrome.tabs.executeScript(sender.tab.id, {file: "./services/dependencies/jquery.min.js"});
            chrome.tabs.executeScript(sender.tab.id, {file: "./services/utils.js"});
            chrome.tabs.executeScript(sender.tab.id, {file: "./services/dom_listener.js"});
            chrome.tabs.executeScript(sender.tab.id, {file: "./services/lyrics_provider_chooser.js"});
            chrome.tabs.executeScript(sender.tab.id, {file: "./services/api_keys.js"});
            chrome.tabs.executeScript(sender.tab.id, {file: "./services/main.js"});
            chrome.pageAction.show(sender.tab.id);
            break;
        case "LOAD_LYRIC_PROVIDER":
            chrome.tabs.executeScript(sender.tab.id, {file: "./lyrics_providers/"+request.file}, function(){
                sendResponse(request.file);
            });
            return true;
        case "ADD_REQUEST_LISTENER":
            chrome.webRequest.onBeforeRequest.addListener(
                function(details)
                {
                    if(details.requestBody != undefined){
                        var postedString = decodeURIComponent(String.fromCharCode.apply(null,
                                                      new Uint8Array(details.requestBody.raw[0].bytes)));
                        chrome.tabs.sendMessage(sender.tab.id, {query: request.response, body: JSON.parse(postedString)});
                    }

                },
                {urls: [request.url]},
                ['requestBody']
            );
            break;

    }
});

