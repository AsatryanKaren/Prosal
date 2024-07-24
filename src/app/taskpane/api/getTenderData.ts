export function getTenderData(token: any, id: any) {
  const redirectUri = typeof chrome !== "undefined" && chrome.identity ?
    chrome.identity.getRedirectURL() :
    `${window.location.origin}/index.html`;

  console.log("Chrome extension redirect URI set to ", redirectUri);

  if (!token) return;

  const postUrl = `https://app.prosal.io/api/auth-single-contract/${id}`;

  return fetch(postUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      return response.json();
    })
    .then(result => {
      console.log({result})

      const tender = {
        title: result.data.title,
        link: result.data.link,
        description: result.data.details,
        timeline: result.data.project_timeline,
        postDate: result.data.post_date,
        category: result.data.category,
      };

      return tender;
    })
    .catch(error => {
      // Handle errors
      console.error('Fetch error:', error.message);
    });
}



