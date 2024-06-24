const b = typeof chrome !== 'undefined' ? chrome : (typeof browser !== 'undefined' ? browser : null);

b.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  
    if (changeInfo.status === 'complete' && tab.url.includes('stackoverflow.com/questions/')) {
        // console.log("heiin ?")

        b.tabs.executeScript(tabId, { file: 'content_script.js' });
      }
});

b.tabs.onActivated.addListener(function(activeInfo) {
    // console.log("background scrip activated");
    b.tabs.get(activeInfo.tabId, function(tab) {
        // console.log(tab);

      if (tab.url.includes('stackoverflow.com/questions/')) {
        console.log("background scrip activated true");
        // b.tabs.executeScript(tab.id, { file: 'content_script.js' });
        // pageLoad();
        b.tabs.sendMessage(parseInt(tab.id), {action: "executeAutoScroll"})
      }
    });
  });

// Listen for when a tab is focused
b.windows.onFocusChanged.addListener(function(windowId) {
    // console.log("background script focusChanged");
    // console.log(windowId);
    // console.log(tabId);
    // console.log(changeInfo);
    // console.log(tab);
    if (windowId !== b.windows.WINDOW_ID_NONE) {
      b.tabs.query({ active: true, windowId: windowId }, function(tabs) {
        if (tabs.length > 0 && tabs[0].url.includes('stackoverflow.com/questions/')) {
            b.tabs.sendMessage(parseInt(tabs[0].id), {action: "executeAutoScroll"})

        //   b.tabs.executeScript(tabs[0].id, { file: 'content_script.js' });
        //   pageLoad();
        }
      });
    }
  });