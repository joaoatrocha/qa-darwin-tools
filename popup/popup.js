document.addEventListener('DOMContentLoaded', function() {
  // Retrieve the last selected language from local storage
  var lastLanguage = localStorage.getItem('lastLanguage');

  // If lastLanguage is not null or undefined, set it as the selected language
  if (lastLanguage) {
    document.getElementById('language').value = lastLanguage;
  }

  // Retrieve the last selected currency from local storage
  var lastCurrency = localStorage.getItem('lastCurrency');

  // If lastCurrency is not null or undefined, set it as the selected currency
  if (lastCurrency) {
    document.getElementById('currency').value = lastCurrency;
  }

  // Add event listener to language dropdown to update local storage when selection changes
  document.getElementById('language').addEventListener('change', function() {
    var selectedLanguage = this.value;
    localStorage.setItem('lastLanguage', selectedLanguage);
  });

  // Add event listener to currency dropdown to update local storage when selection changes
  document.getElementById('currency').addEventListener('change', function() {
    var selectedCurrency = this.value;
    localStorage.setItem('lastCurrency', selectedCurrency);
  });

  // Add functionality to modify URL
  const modifyButton = document.getElementById('modifyButton');
  modifyButton.addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      const tab = tabs[0];
      const language = document.getElementById('language').value;
      const currency = document.getElementById('currency').value;
      const newUrl = modifyUrl(tab.url, language, currency);
      chrome.tabs.update(tab.id, {url: newUrl});
    });
  });

  function modifyUrl(url, language, currency) {
    let modifiedUrl = new URL(url);
    modifiedUrl.searchParams.set('language', language);
    modifiedUrl.searchParams.set('currency', currency);
    return modifiedUrl.toString();
  }
});
