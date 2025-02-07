document.addEventListener('DOMContentLoaded', function () {
  var lastLanguage = localStorage.getItem('lastLanguage');

  if (lastLanguage) {
    document.getElementById('language').value = lastLanguage;
  }

  var lastCurrency = localStorage.getItem('lastCurrency');

  if (lastCurrency) {
    document.getElementById('currency').value = lastCurrency;
  }

  document.getElementById('language').addEventListener('change', function () {
    var selectedLanguage = this.value;
    localStorage.setItem('lastLanguage', selectedLanguage);
  });

  document.getElementById('currency').addEventListener('change', function () {
    var selectedCurrency = this.value;
    localStorage.setItem('lastCurrency', selectedCurrency);
  });

  const modifyButton = document.getElementById('modifyButton');
  modifyButton.addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tab = tabs[0];
      const language = document.getElementById('language').value;
      const currency = document.getElementById('currency').value;
      const newUrl = modifyUrl(tab.url, language, currency);
      chrome.tabs.update(tab.id, { url: newUrl });
    });
  });

  function modifyUrl(url, language, currency) {
    let modifiedUrl = new URL(url);

    const pathParts = modifiedUrl.pathname.split('/');
    if (pathParts.length > 1 && pathParts[pathParts.length - 2].match(/^[a-z]{2}-[a-z]{2}$/)) {
      pathParts[pathParts.length - 2] = language;
      modifiedUrl.pathname = pathParts.join('/');
    }

    if (!modifiedUrl.pathname.includes(`/${language}/`)) {
      modifiedUrl.searchParams.set('language', language);
    }

    modifiedUrl.searchParams.set('currency', currency);

    return modifiedUrl.toString();
  }

  document.getElementById('copyScriptButton').addEventListener('click', function () {
    const codeToCopy = `
    const jsonData = document.getElementById("configs_data")?.textContent;
    if (!jsonData) {
      console.error("configs_data element not found or is empty");
    } else {
      console.log("Configs Data:", jsonData);
      let config;
      try {
        config = JSON.parse(jsonData);
        console.log("Parsed Config:", config);
      } catch (e) {
        console.error("Error parsing JSON:", e);
      }
      if (config) {
        function validateAllMinBets(config) {
          const errors = [];
          for (const [currency, data] of Object.entries(config.currency_configs)) {
            const minBet = data.min_bet;
            const firstBetValue = data.bet_values[0];
            if (minBet !== firstBetValue) {
              errors.push(\`\${currency}: min_bet (\${minBet}) does not match the first bet value (\${firstBetValue}).\`);
            }
          }
          return errors.length > 0 ? errors : "All currencies are valid.";
        }
        const validationResult = validateAllMinBets(config);
        if (Array.isArray(validationResult)) {
          validationResult.forEach(error => console.log(error));
        } else {
          console.log(validationResult);
        }
      }
    }
  `;
    navigator.clipboard.writeText(codeToCopy)
      .then(() => {
        const message = document.createElement('p');
        message.textContent = "Script copied! Paste it into the console.";
        message.style.color = 'green'; // Example styling
        this.parentNode.insertBefore(message, this.nextSibling);

        setTimeout(() => {
          message.remove();
        }, 2000);
      })
      .catch(err => {
        const message = document.createElement('p');
        message.textContent = "Failed to copy script!";
        message.style.color = 'red';
        this.parentNode.insertBefore(message, this.nextSibling);
        setTimeout(() => {
          message.remove();
        }, 3000);
        console.error("Failed to copy script: ", err);
      });
  });
});
