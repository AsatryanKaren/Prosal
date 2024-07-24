import React, { useCallback, useEffect, useState } from 'react';
import { ErrorContextProvider } from '../../app/taskpane/contexts/ErrorContext';
import './Popup.css';
import FeaturesWall from '../../app/taskpane/components/FeaturesWall/FeaturesWall';

const Popup = () => {
  const [additionalData, setAdditionalData] = useState({
    url: '',
    token: '',
  });

  useEffect(() => {
    function getContentData() {
      chrome.storage.local.get(['data'])
        .then((x) => {
          const data = x['data'];
          console.log({data});
          setAdditionalData(prev => ({
            ...prev,
            url: data?.url,
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
          <FeaturesWall additionalData={additionalData} />
        </ErrorContextProvider>
      </div>
    </div>
  );
};

export default Popup;
