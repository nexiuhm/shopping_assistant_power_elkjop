



let injected_tabs = [];
/*
chrome.tabs.onActivated.addListener(tab => {
    chrome.tabs.get(tab.tabId, current_tab_info => {

        active_tabs.push(tab.tabId);

        console.log(current_tab_info.url);
       

        if (/^https:\/\/www\.elkjop\.no/.test(current_tab_info.url)) {
            chrome.tabs.insertCSS(null, { file: './stil.css' });
            chrome.tabs.executeScript(null, { file: './foreground.js' }, () => console.log('-- Debug: Kjøpe boten er lastet inn på siden ? --'))
      
        }

        else if (/^https:\/\/www\.power\.no/.test(current_tab_info.url)) {
            chrome.tabs.insertCSS(null, { file: './stil.css' });
            chrome.tabs.executeScript(null, { file: './foreground.js' }, () => console.log('-- Debug: Kjøpe boten er lastet inn på siden ? --'))
   
        }
    });
});

*/
chrome.webNavigation.onCompleted.addListener(details => {

  

    if (/^https:\/\/www\.elkjop\.no/.test(details.url)) {
        chrome.tabs.insertCSS(null, { file: './stil.css' });
        chrome.tabs.executeScript(null, { file: './foreground.js' }, () => console.log('-- Debug: Kjøpe boten er lastet inn på siden ? --'))
        injected_tabs.push(details.tabId);
  
    }

    else if (/^https:\/\/www\.power\.no/.test(details.url)) {
        chrome.tabs.insertCSS(null, { file: './stil.css' });
        chrome.tabs.executeScript(null, { file: './foreground.js' }, () => console.log('-- Debug: Kjøpe boten er lastet inn på siden ? --'))

    }

    else if (/^https:\/\/api\.vipps\.no/.test(details.url)) {
        chrome.tabs.executeScript(null, { file: './instavipps.js' }, () => console.log('-- Debug: Kjøpe boten er lastet inn på siden ? --'))
        console.log("VIPPS");
    }
    
});



