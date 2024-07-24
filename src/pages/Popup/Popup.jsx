import React, { useCallback, useEffect, useState } from 'react';
import { ErrorContextProvider } from '../../app/taskpane/contexts/ErrorContext';
import './Popup.css';
import FeaturesWall from '../../app/taskpane/components/FeaturesWall/FeaturesWall';

const Popup = () => {
  const [additionalData, setAdditionalData] = useState({
    headline: '',
    address: '',
    id: "ajax:3326659609759597861",
    name: '',
    url: '',
    img: '',
    accessToken: '',
    refreshToken: '',
    isLoggedInLinkedin: '',
    connectionToken: '',
    replacerToken: ''
  });
  const [hideFeaturesWall, setHideFeaturesWall] = React.useState(false);

  useEffect(() => {
    function getContentData() {
      chrome.storage.local.get(['data'])
        .then((x) => {
          const data = x['data'];
          console.log({data});
          setAdditionalData(prev => ({
            ...prev,
            headline: data?.headline,
            address: data?.address,
            id: data?.id,
            name: data?.fullName,
            img: data?.img,
            url: data?.url,
            isLoggedInLinkedin: data?.isLoggedInLinkedin,
            connectionToken: data?.connectionToken,
            accessToken: data?.accessToken,
            refreshToken: data?.refreshToken,
            replacerToken: data?.replacerToken,
            token: data?.token
          }));
        });
    }

    getContentData();
  }, [])

  const fn = useCallback(function (request, sender, sendResponse) {
    if (request.message === 'Url_Updated' || request.message === 'Tab_Changed') {
      window.close()
    }
  }, [])

  useEffect(() => {
    chrome.runtime.onMessage.addListener(fn);
    return () => chrome.runtime.onMessage.removeListener(fn);
  }, [fn])

  return (
    <div className="App">
      <div className='container'>
        <ErrorContextProvider>
          <FeaturesWall additionalData={additionalData} setHideFeaturesWall={setHideFeaturesWall} />
        </ErrorContextProvider>
      </div>
    </div>
  );
};

export default Popup;
