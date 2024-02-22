document.addEventListener('DOMContentLoaded', function() {
    var downloadButton = document.getElementById('download');
    downloadButton.addEventListener('click', function() {
        
        // You need to get the current tab's URL to extract the item_id
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            // Assuming the item_id is the last segment of the path in the URL
            var tab = tabs[0];
            var url = new URL(tab.url);
            var pathSegments = url.pathname.split('/');
            var itemId = pathSegments.pop() || pathSegments.pop();  // Handles potential trailing slash

            // Send a message to the background script with the extracted item_id
            chrome.runtime.sendMessage({action: "download", itemId: itemId}, function(response) {
                if(response.error) {
                    console.error('Error in background script:', response.error);
                } else {
                    // Handle successful response or further actions here
                }
            });
        });
        
    }, false);
}, false);
