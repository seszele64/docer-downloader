// content.js

// Function to check for the PDF URL in the data attribute and open it in a new tab
function openPdfInNewTab() {
  const pdfContainer = document.querySelector('.pdf-pro-plugin[data-pdf-url]');
  if (pdfContainer) {
    const pdfUrl = pdfContainer.getAttribute('data-pdf-url');
    if (pdfUrl.startsWith('https://stream.docer.pl')) {
      window.open(pdfUrl, '_blank').focus();
    }
  } else {
    console.error('No PDF URL found.');
  }
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "checkForPdf") {
    openPdfInNewTab();
    sendResponse({status: "PDF opened"});
  }
  return true; // keep the messaging channel open for sendResponse
});
