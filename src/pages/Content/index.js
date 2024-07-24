import { printLine } from './modules/print';

const generateClick = () => {
  const elements = document.querySelectorAll('span.display-flex.t-normal.flex-1[aria-hidden="true"]');
  elements.forEach(element => {
    if (element.textContent.includes('PDF')) {
      element.click();
    }
  });
}

console.log("here!!!!!!!!!!!!");

printLine("Using the 'printLine' function from the Print Module");

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    // listen for messages sent from background.js
    if (request.action === 'GET_PDF') {
      generateClick();
    }

    if (request.message === 'Url_Updated' || request.message === 'Tab_Changed') {
      printLine("Using the 'printLine' function from the Print Module");
    }
});

