// A set to keep track of processed URLs
const processedUrls = new Set();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "openTab" && message.url) {
    chrome.tabs.create({ url: message.url });
  }
});

// Listener for the completed web requests to the specified URL pattern
chrome.webRequest.onCompleted.addListener(
  function(details) {
    console.log('Request completed to URL:', details.url);

    // Check if the URL matches the expected pattern and hasn't been processed
    if ((details.url.includes('pdf_dummy') || details.url.includes('/getepub/')) && !processedUrls.has(details.url)) {
      console.log('Detected the EPUB file download request. Opening in new tab:', details.url);

      // Add the URL to the set of processed URLs
      processedUrls.add(details.url);

      // Open the URL in a new tab
      chrome.tabs.create({ url: details.url });
    }
  },
  // URL filter for the listener
  { urls: ["https://stream2.docer.pl/pdf_dummy/*", "https://stream.docer.pl/getepub/*"] },
  // Optional extra parameters (none needed here since we're not blocking requests)
  []
);