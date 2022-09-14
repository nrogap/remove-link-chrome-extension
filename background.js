const TARGET_URLS = ['en.wikipedia.org']
const ERROR_CANNOT_EDITED = 'Error: Tabs cannot be edited right now (user may be dragging a tab).'

chrome.tabs.onUpdated.addListener(tabOnUpdated);
chrome.tabs.onRemoved.removeListener(tabOnUpdated);

async function blockLink(tab, sourceUrls) {
  length = sourceUrls.length

  for(let i = 0; i < length; i++){
    if (tab.url?.includes(sourceUrls[i])) {
      try {

        await chrome.scripting.executeScript({
          target: {
            tabId: tab.id,
          },
          func: () => {
            const element = document.querySelector('[title="Articles related to current events"]')
            element.removeAttribute('href')
            element.children[0].textContent = 'Xxxxxxx xxxxxx'
          },
        });

      } catch (err) {
        console.error(`failed to execute script: ${err}`);
      }
    }
  }
}

async function tabOnUpdated(tabId, changeInfo, tab) {
  try {

    await blockLink(tab, TARGET_URLS)

  } catch (error) {
    if (error == ERROR_CANNOT_EDITED) {
      setTimeout(() => tabOnUpdated(tabId, changeInfo, tab), 50);
    } else {
      console.error(error);
    }
  }
}
