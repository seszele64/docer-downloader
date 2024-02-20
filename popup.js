document.addEventListener('DOMContentLoaded', function () {
    var checkPdfButton = document.getElementById('checkPdfButton');
    checkPdfButton.addEventListener('click', function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            var currentTab = tabs[0];
            if (currentTab.url.startsWith('https://docer.pl/doc/')) {
                chrome.tabs.sendMessage(currentTab.id, { action: "checkForPdf" }, function(response) {
                    if (response && response.success) {
                        console.log("PDF URL found: " + response.url);
                    } else {
                        console.log(response.message);
                    }
                });
            } else {
                console.log("This button works only on 'https://docer.pl/doc/'.");
            }
        });
    }, false);
});
