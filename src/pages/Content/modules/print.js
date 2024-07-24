export const printLine = (line) => {

  setTimeout(() => {
    const data = {
      "token": localStorage.getItem('token'),
      "url": document.location.href,
    }

   chrome.runtime.sendMessage({ data })
    .then(() => {
      console.log('Message sent successfully From Content');
    })
    .catch(error => {
      console.error('Error sending message:', error);
    });
  }, 1000)
};
