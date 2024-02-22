chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "download" && message.itemId) {
    // Random number between 1 and 9
      const rc = Math.floor(Math.random() * 9) + 1;
      const bodyData = new URLSearchParams({
        item_id: message.itemId,
        rc: rc
      }).toString();
  
      fetch("https://docer.pl/start/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "Accept": "*/*",
          "Cache-Control": "no-cache",
          "Pragma": "no-cache",
          "X-Requested-With": "XMLHttpRequest",
          "Referer": message.referer,
          "Origin": "https://docer.pl",
        },
        body: bodyData,
        credentials: "include"
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data && data.success && data.response && data.response.url) {
          chrome.tabs.create({ url: data.response.url }); // Open in a new tab
        } else {
            throw new Error('Request succeeded but no URL was provided in the response.');
        }
      })
      .catch(error => {
        console.error('Error during fetch:', error);
        sendResponse({ error: error.message });
      });
    }
    return true; // Required to use sendResponse asynchronously
  });
  