chrome.runtime.onInstalled.addListener(function() {
  console.log("URL Modifier extension installed.");
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === "validateParams") {
    const language = message.language;
    const currency = message.currency;
    
    // Perform validation here
    if (language === "en-us" && currency === "EUR") {
      console.log("Valid parameters: language=en-us & currency=EUR");
      // You can perform further actions here if needed
    } else {
      console.log("Invalid parameters.");
      // You can handle invalid parameters here
    }
  }
});
