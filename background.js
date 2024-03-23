// background.js

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === "openTab" && message.url) {
      // Open the PDF URL in a new tab
      chrome.tabs.create({ url: message.url }, function(tab) {
          console.log('New tab opened with PDF:', message.url);
      });
  }
});