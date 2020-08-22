'use strict';

chrome.runtime.onInstalled.addListener(details => {
  console.log('previousVersion', details.previousVersion);
});

chrome.browserAction.setBadgeText({text: 'MFP'});

var onBeforeRequestListener = function(details) {
  if(details.requestBody) {
    // let strData = String.fromCharCode.apply(String,details.requestBody.raw[0].bytes);
    // let json = JSON.parse(strData);
    var enc = new TextDecoder("utf-8");
    let data = enc.decode(details.requestBody.raw[0].bytes)
    if (JSON.parse(data).item) {
      chrome.storage.local.set({"macro_data": data}, function() {
        // console.log('Value is set to ' + header.value);
      });
    }
    
  }
  if(details.requestHeaders) {
    console.log(details);
    details.requestHeaders.forEach(header => {
      let headerName = header.name.toLowerCase();
      if(headerName == "authorization"){
        chrome.storage.local.set({"authorization": header.value}, function() {
          // console.log('Value is set to ' + header.value);
        });
      }else if(headerName == "mfp-user-id") {
        chrome.storage.local.set({"mfp-user-id": header.value}, function() {
          // console.log("Value is set to " + header.value);
        });
      }
    })
  }
}


chrome.webRequest.onBeforeRequest.addListener(onBeforeRequestListener, {
  urls: ["https://api.myfitnesspal.com/*"]
}, ["extraHeaders", "blocking", "requestBody"]);

chrome.webRequest.onBeforeSendHeaders.addListener(onBeforeRequestListener, {
  urls: ["https://api.myfitnesspal.com/*"]
}, ["requestHeaders", "blocking"]);
