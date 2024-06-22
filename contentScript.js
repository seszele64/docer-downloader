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
      const fileUrlElements = pdfHolder.querySelectorAll('[data-pdf-url], iframe.google-doc');

      for (fileUrlElement of fileUrlElements) {
        console.log('A file URL element was found:', fileUrlElement);

        // Attempt to get the URL, checking for both PDF and MOBI files
        let fileUrl = fileUrlElement.getAttribute('data-pdf-url') || fileUrlElement.src;
        console.log('Initial file URL:', fileUrl);

        // If the file URL is not null or undefined, proceed
        if (fileUrl) {
          // Detect if the URL is from Google Viewer and extract the actual file URL if necessary
          const googleViewerMatch = fileUrl.match(/url=([^&]+)/);
          fileUrl = googleViewerMatch ? decodeURIComponent(googleViewerMatch[1]) : fileUrl;
          // Open the file URL in a new tab
          window.open(fileUrl, '_blank');
          observer.disconnect(); // Disconnect the observer if not needed further
          console.log('File URL opened in new tab:', fileUrl);
          break;
        } else {
          console.log('File URL was not found or is not valid.');
        }
      }

      if (fileUrlElements.length == 0) {
        console.log('No file URL element found within the PDF holder.');
      }
    }
  }
}

// Wait for the DOM to be fully loaded before attempting to set up the observer
if (document.readyState === "complete" || document.readyState === "interactive") {
  console.log('DOM is ready. Setting up observer and fetch interception.');
  setUpObserver();
} else {
  console.log('DOM is not fully loaded. Will set up observer and fetch interception when ready.');
  window.addEventListener('DOMContentLoaded', () => {
    setUpObserver();
  });
}