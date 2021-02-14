




chrome.webNavigation.onCompleted.addListener(details => {

  

    if (/^https:\/\/www\.elkjop\.no/.test(details.url)) {
        chrome.tabs.insertCSS(null, { file: './stil.css' });
        chrome.tabs.executeScript(null, { file: './foreground.js' }, () => console.log('-- Debug: Kjøpe boten er lastet inn på siden ? --'))
        
  
    }

    else if (/^https:\/\/www\.power\.no/.test(details.url)) {
        chrome.tabs.insertCSS(null, { file: './stil.css' });
        chrome.tabs.executeScript(null, { file: './foreground.js' }, () => console.log('-- Debug: Kjøpe boten er lastet inn på siden ? --'))

    }

    else if (/^https:\/\/www\.netonnet\.no/.test(details.url)) {
        chrome.tabs.insertCSS(null, { file: './stil.css' });
        chrome.tabs.executeScript(null, { file: './foreground.js' }, () => console.log('-- Debug: Kjøpe boten er lastet inn på siden ? --'))

    }

    else if (/^https:\/\/api\.vipps\.no/.test(details.url)) {
        chrome.tabs.executeScript(null, { file: './instavipps.js' }, () => console.log('-- Debug: Kjøpe boten er lastet inn på siden ? --'))
        console.log("VIPPS");
    }
    
});



