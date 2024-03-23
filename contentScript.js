// contentScript.js

// Function to set up the observer
function setUpObserver() {
  const pdfHolder = document.getElementById('pdf-holder');
  if (pdfHolder) {
      // Create an observer instance linked to the checkForPDFUrl callback function
      const observer = new MutationObserver(checkForPDFUrl);

      // Start observing the target node for configured mutations
      observer.observe(pdfHolder, { childList: true, subtree: true });

      console.log('Observer has been set up.');
  } else {
      console.log('The PDF holder element does not exist on this page.');
  }
}

function checkForPDFUrl(mutationList, observer) {
  for (const mutation of mutationList) {
      if (mutation.type === 'childList') {
          const pdfHolder = document.getElementById('pdf-holder');
          const pdfUrlElement = pdfHolder.querySelector('[data-pdf-url]');
          if (pdfUrlElement) {
              const pdfUrl = pdfUrlElement.getAttribute('data-pdf-url');
              if (pdfUrl) {
                  // Send the PDF URL to the background script
                  chrome.runtime.sendMessage({action: "openTab", url: pdfUrl});
                  observer.disconnect(); // Disconnect the observer if not needed further
                  console.log('PDF URL found and sent to background script:', pdfUrl);
              }
          }
      }
  }
}

// Wait for the DOM to be fully loaded before attempting to set up the observer
if (document.readyState === "complete" || document.readyState === "interactive") {
  // DOM is already ready to be manipulated
  setUpObserver();
} else {
  // Set up observer once DOM is fully loaded
  window.addEventListener('DOMContentLoaded', setUpObserver);
}
