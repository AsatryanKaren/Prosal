
// chrome.action.disable();
const hostPermissions = ['https://www.app.prosal.io']
chrome.runtime.onInstalled.addListener(() => {
  chrome.declarativeContent.onPageChanged.removeRules(() => {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: hostPermissions.map(h => {
        const [, sub, host] = h?.match(/:\/\/(\*\.)?([^/]+)/);
        return new chrome.declarativeContent.PageStateMatcher({
          pageUrl: sub ? {hostSuffix: '.' + host} : {hostEquals: host},
        });
      }),
      actions: [new chrome.declarativeContent.ShowAction()],
    }]);
  });
});


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  chrome.storage.local.set({
    "data": request.data
  })
    .then(() => {
      console.log('Data saved successfully From Background');
    })
    .catch(error => {
      console.log('Error saving data:', error);
    });
});

chrome.tabs.onUpdated.addListener(
  function(tabId, changeInfo, tab) {
    if (changeInfo.url) {
      chrome.tabs.sendMessage(tabId, {
        message: 'Url_Updated',
        url: changeInfo.url
      }).then(() => {
        console.log('Message sent successfully');
      })
      .catch(error => {
        console.log('Error sending message:', error);
      })
    }
  }
);

chrome.tabs.onActivated.addListener(function(activeInfo) {
  // activeInfo contains information about the newly activated tab
  const tabId = activeInfo.tabId;
  const windowId = activeInfo.windowId;

  // For example, you can send a message to your content script
  chrome.tabs.sendMessage(tabId, {
    message: 'Tab_Changed',
    action: 'tabActivated'
  }).then(() => {
      console.log('Message sent successfully');
    })
    .catch(error => {
      console.log('Error sending message:', error);
    })
});
