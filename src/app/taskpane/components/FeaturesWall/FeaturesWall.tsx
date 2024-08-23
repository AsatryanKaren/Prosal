import React, { useEffect, useState } from "react";

import okay from "./icons/OK.png";
import note from "./icons/note.png";
import empty from "./icons/empty.png";
import postDate from "./icons/postDate.png";
import title from "./icons/title.png";
import timeline from "./icons/timeline.png";
import deadline from "./icons/deadline.png";
import tag from "./icons/tag.png";
import analyzeLogo from "./icons/AnalyzeTenders.png";
import logo from "./icons/logo.png";

import { analyze } from "../../api/analyze";
import { extractIdFromUrl, isDateMoreThan15DaysAway } from '../../helpers/commons';
import { getAnalyzedHistory, getTenderData } from '../../api/getTenderData';

import "./FeaturesWall.css";
import History from './History/History';

interface IFeaturesWallProps {
  additionalData: any;
}

interface AnalyzedData {
  mismatch: any;
  matches: any;
  reason: string;
}

interface Tender {
  title: string;
  link: string;
  description: string;
  timeline: string;
  postDate: string;
  premium: number;
  category: string;
  deadline: string;
}

interface AnalyzedHistory {
  result: any;
}

function FeaturesWall(props: IFeaturesWallProps) {
  const [tenders, setTenders] = useState<Tender | null>(null);
  const [analyzedHistory, setAnalyzedHistory] = useState<AnalyzedHistory | null>(null);
  const [analyzedData, setAnalyzedData] = useState<AnalyzedData | null>(null);
  const [isPending, setIsPending] = useState(false);
  const isDeadlineAcceptable = isDateMoreThan15DaysAway(tenders?.deadline);
  const isPremium = tenders?.premium === 1;
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [promptMessage, setPromptMessage] = useState(
    'As an IT company, I am interested in selecting a tender that aligns closely with our capabilities and business model. Here are the primary criteria that are most important to us:\n' +
    'Category: The tender should fall under the category of Software Development.\n' +
    'Remote Work: The project should accommodate remote collaboration, enabling our team to work with employees from other countries.\n' +
    'After that check the technical matching\n' +
    'Technical alignment - Matching with tech stack - .NET, Angular, React, C#, Python, Android, iOS, Azure, AWS\n' +
    'Scalability - Long-term development, growing future potential features, future phases\n' +
    'Third-party integrations - especially integrations with Microsoft services, Payment systems, e-Signing, Google services, \n' +
    'Project types- existing business digitalization, legacy projects modernization,\n' +
    ' \n' +
    'Please let me know if the company fit to tender\n'
  );
  const [error, setError] = useState(false)
  console.log({ isDeadlineAcceptable });
  useEffect(() => {
    const getAllUserData = async () => {
      const tenderInfo = await getTenderData(props.additionalData.token, extractIdFromUrl(props.additionalData.url));
      const aHistory = await getAnalyzedHistory(extractIdFromUrl(props.additionalData.url));

      // @ts-ignore
      setTenders(tenderInfo);
      // @ts-ignore
      setAnalyzedHistory(aHistory);
    };

    getAllUserData();
  }, [props.additionalData.token, props.additionalData.url]);

  const sendToAnalyze = async () => {
    setIsPending(true);
    const extractedId: string | null = extractIdFromUrl(props.additionalData.url);
    const analyzedResult = await analyze(props.additionalData.token, extractedId, promptMessage, setError);

    // @ts-ignore
    setAnalyzedData(analyzedResult);
    setIsPending(false);
  };

  const handlePromptChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPromptMessage(event.target.value);
  };

  return (
    <div className="ftContainer">
      <h1 className="ftTitle">
        <img className="ftLogo" src="https://volosa.blob.core.windows.net/websitecontainer/images/default-source/svg/volo_logo.svg" />Analyze Tenders
      </h1>
      <div className="features">
        {tenders ? (
          <div className="tenders">
            <div><img src={title} alt="" className="icon" />Title - {tenders.title}</div>
            <div><img src={tag} alt="" className="icon" />Category - {tenders.category}</div>
            <div><img src={timeline} alt="" className="icon" />Timeline - {tenders.timeline}</div>
            <div><img src={postDate} alt="" className="icon" />Post Date - {tenders.postDate}</div>
            <div><img src={deadline} alt="" className="icon" />Deadline - {tenders.deadline}</div>
            {props.additionalData.token ? (
              <div>
                <h3 className="ftDescription">{props.additionalData?.headline}</h3>
                <div><img src={okay} alt="" />Token retrieved successfully from Prosal.</div>
              </div>
            ) : (
              <div><img src={empty} alt="" />Can't get Token, Please Log In</div>
            )}
            {!isDeadlineAcceptable && (
              <div style={{ color: '#858505' }}>
                <img src={note} alt="" />The submission deadline is less than 15 days.
              </div>
            )}
            {isPremium && (
              <div style={{ color: '#858505' }}>
                <img src={note} alt="" />The tender is premium. Please upgrade to analyze!
              </div>
            )}
            <details open={isDetailsOpen} className="promptDetails">
              <summary className="summary">
                <div>Prompt Message ...</div>
              </summary>
              <div style={{ marginTop: '10px' }}>
                <textarea value={promptMessage} onChange={handlePromptChange} />
              </div>
            </details>
            {!analyzedData && (
              <button
                className={`ftBtn ${(isPending || !isDeadlineAcceptable || isPremium) ? 'disable' : ''}`}
                onClick={sendToAnalyze}
              >
                Send To Analyze
              </button>
            )}
            {isPending && <div className="loader" style={{ height: '50px', marginTop: '13px' }} />}
            {analyzedData && (
              <>
                <div style={{ fontWeight: '600', fontSize: '16px', marginTop: '20px' }}>
                  <span style={{ borderBottom: '1px solid #00377B', paddingBottom: '5px' }}>
                    Analyzed Result:
                  </span>
                </div>
                {analyzedData.reason && (
                  <>
                    <div style={{ fontWeight: '600', fontSize: '14px' }}>Reason:</div>
                    <div>{analyzedData.reason}</div>
                  </>
                )}
                {/*{analyzedData.mismatch && (*/}
                {/*  <>*/}
                {/*    <div style={{ fontWeight: '600', fontSize: '14px', color: '#93930b' }}>Mismatches:</div>*/}
                {/*    <div style={{ color: '#93930b' }}>{analyzedData.mismatch}</div>*/}
                {/*  </>*/}
                {/*)}*/}
                {!!analyzedData.mismatch?.length && (
                  <>
                    <div style={{ fontWeight: '600', fontSize: '14px', color: '#93930b' }}>Mismatches:</div>
                    {analyzedData.mismatch.map((text: string, index: number) => {
                      return <div key={index}>{text}</div>;
                    })}
                  </>
                )}
                {!!analyzedData.matches?.length && (
                  <>
                    <div style={{ fontWeight: '600', fontSize: '14px' }}>Matches:</div>
                    {analyzedData.matches.map((text: string, index: number) => {
                      return <div key={index}>{text}</div>;
                    })}
                  </>
                )}
              </>
            )}
            {error &&
              <div style={{ color: '#bd0000' }}>
                <img src={empty} alt="" />Sorry, we are unable to analyze this tender.
              </div>
            }
            <History history={analyzedHistory} />
          </div>
        ) : (
          <div className="tenders">
            <div>Please wait while the extension loads your tender data.</div>
            <div><img src={note} alt="" />If this process takes too long, please refresh the page to reconnect to Prosal. If you are not currently on <a href="https://app.prosal.io/">Prosal</a>, please visit the site.</div>
            <div className="loader" />
          </div>
        )}
      </div>
    </div>
  );
}

export default FeaturesWall;
