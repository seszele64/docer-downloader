// This could be triggered by some event on the page, e.g., button click
document.addEventListener('click', function(event) {
        if (event.target.matches('#dwn_btn')) {
            const item_id = event.target.getAttribute('data-id');
            const referer = window.location.href;
            
            // Send the item_id to the background script
            chrome.runtime.sendMessage({action: "download", itemId: item_id, referer: referer}, function(response) {
                if(response && response.error) {
                    console.error('Error in background script:', response.error);
                } else {
                    // Handle successful response or further actions here
                }
            });

        }
});
