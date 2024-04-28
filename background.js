// Load the shared configuration from config.json
function loadConfig(callback) {
  const configUrl = chrome.runtime.getURL('config.json');
  fetch(configUrl)
    .then(response => response.json())
    .then(config => callback(config))
    .catch(error => console.error('Error loading config:', error));
}

// Function to create regex patterns for matching URLs
function createRegexPatterns(domains) {
  return domains.map(domain => new RegExp(`^https?://(.*\\.)?${domain.replace(/\./g, '\\.')}/pdf_dummy/.*$`));
}

// When the configuration is loaded, set up the listeners
loadConfig(function(config) {
  const { baseDomains } = config;
  const pdfUrlPatterns = createRegexPatterns(baseDomains);
  let openedUrls = {};

  chrome.webRequest.onCompleted.addListener(
    function(details) {
      console.log('Request completed. URL:', details.url); // Log the URL of the completed request

      // Check if the URL matches any of the regex patterns and if it has not been opened before
      const isPdfUrl = pdfUrlPatterns.some(pattern => pattern.test(details.url));
      if (isPdfUrl && !openedUrls[details.url]) {
        console.log('Match found. Opening new tab with URL:', details.url); // Log when a matching URL is found
        chrome.tabs.create({ url: details.url });

        // Mark the URL as opened
        openedUrls[details.url] = true;
      } else {
        console.log('URL already opened or does not match:', details.url); // Log when the URL has been opened or does not match
      }
    },
    // Monitor all XMLHTTPRequests
    {urls: ["<all_urls>"], types: ["xmlhttprequest"]});
  });


