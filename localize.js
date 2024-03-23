document.addEventListener('DOMContentLoaded', function() {
    var elements = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        var message = chrome.i18n.getMessage(element.getAttribute('data-i18n'));
        if (message) {
            element.innerHTML = message;
        }
    }
});