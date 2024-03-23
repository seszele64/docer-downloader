// contentScript.js

// Function to set up the observer
function setUpObserver() {
  const pdfHolder = document.getElementById('pdf-holder');
  if (pdfHolder) {
    const observer = new MutationObserver(checkForFileUrl);
    observer.observe(pdfHolder, { childList: true, subtree: true });
    console.log('Observer has been set up.');
  } else {
    console.log('The PDF holder element does not exist on this page.');
  }
}


function checkForFileUrl(mutationList, observer) {
  console.log('Mutation observed:', mutationList); // Log the mutation list for debugging

  for (const mutation of mutationList) {
    if (mutation.type === 'childList') {
      console.log('A childList mutation was observed.');
      const pdfHolder = document.getElementById('pdf-holder');
      // Check for both PDF and MOBI URLs
      const fileUrlElement = pdfHolder.querySelector('[data-pdf-url], iframe.google-doc');

      if (fileUrlElement) {
        console.log('A file URL element was found:', fileUrlElement);

        // Attempt to get the URL, checking for both PDF and MOBI files
        let fileUrl = fileUrlElement.getAttribute('data-pdf-url') || fileUrlElement.src;
        console.log('Initial file URL:', fileUrl);

        // If the file URL is not null or undefined, proceed
        if (fileUrl) {
          // Detect if the URL is from Google Viewer and extract the actual file URL if necessary
          const googleViewerMatch = fileUrl.match(/url=([^&]+)/);
          fileUrl = googleViewerMatch ? decodeURIComponent(googleViewerMatch[1]) : fileUrl;
          // Send the file URL to the background script
          chrome.runtime.sendMessage({action: "openTab", url: fileUrl});
          observer.disconnect(); // Disconnect the observer if not needed further
          console.log('File URL found and sent to background script:', fileUrl);
        } else {
          console.log('File URL was not found or is not valid.');
        }
      } else {
        console.log('No file URL element found within the PDF holder.');
      }
    }
  }
}

// Intercept network requests to catch EPUB files
function interceptEPUBFiles() {
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    if (typeof args[0] === 'string') {
      console.log('Fetch request detected, URL:', args[0]);
      if (args[0].startsWith('https://stream2.docer.pl/pdf_dummy/')) {
        console.log('Fetch request for EPUB file intercepted:', args[0]);
        chrome.runtime.sendMessage({ action: "openTab", url: args[0] });
      }
    }
    return originalFetch.apply(this, args);
  };
  console.log('Fetch requests are now being intercepted for EPUB files.');
}

// Wait for the DOM to be fully loaded before attempting to set up the observer
if (document.readyState === "complete" || document.readyState === "interactive") {
  console.log('DOM is ready. Setting up observer and fetch interception.');
  setUpObserver();
  interceptEPUBFiles();
} else {
  console.log('DOM is not fully loaded. Will set up observer and fetch interception when ready.');
  window.addEventListener('DOMContentLoaded', () => {
    setUpObserver();
    interceptEPUBFiles();
  });
}