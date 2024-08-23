export function analyze(token:string, id: string | null, prompt:string, setError:any) {
  const redirectUri = typeof chrome !== "undefined" && chrome.identity ?
    chrome.identity.getRedirectURL() :
    `${window.location.origin}/index.html`;

  console.log("Chrome extension redirect URI set to ", redirectUri);
  if (!token) return;
  console.log(prompt, 'prompttttttttttttttttttttt');
  // const getURL = `https://tendersaiapi.volo.global/Tenders/${id}/analyze?token=${token}`;
  const getURL = `https://tendersaiapi.volo.global/Tenders/${id}/analyze-with-openai`;

  const payload = {
    prompt: prompt,
    token: token
  };

  return fetch(getURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      return response.json();
    })
    .then(result => {
      const analyzedResult = {
        mismatch: result.mismatches,
        reason: result.reason,
        matches: result.matches
      };
      console.log(analyzedResult);

      return analyzedResult;
    })
    .catch(error => {
      setError(true)
    });
}
