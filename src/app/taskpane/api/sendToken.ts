export function sendToken(token: string, id: string | null) {
  const redirectUri = typeof chrome !== "undefined" && chrome.identity ?
    chrome.identity.getRedirectURL() :
    `${window.location.origin}/index.html`;

  console.log("Chrome extension redirect URI set to ", redirectUri);
  if (!token) return;

  const getURL = `https://tendersaiapi.volo.global/Tenders/${id}/analyze?token=${token}`;

  return fetch(getURL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      return response.json();
    })
    .then(result => {
      const analyzedResult = {
        mismatch: result.mismatches[0],
        reason: result.reason
      }
      console.log({analyzedResult})

      return analyzedResult;
    })
    .catch(error => {
      console.error('Fetch error:', error.message);
    });
}
