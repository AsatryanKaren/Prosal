import React, {useEffect, useState} from "react";

import okay from "./icons/OK.png"
import note from "./icons/note.png"
import empty from "./icons/empty.png"
import logo from "./icons/logo.png"

import { analyze } from "../../api/analyze";
import { extractIdFromUrl, isDateMoreThan15DaysAway } from '../../helpers/commons';
import { getAnalyzedHistory, getTenderData } from '../../api/getTenderData';

import "./FeaturesWall.css";
import History from './History/History';

interface IFeaturesWallProps {
  additionalData: any;
}

interface AnalyzedData {
  mismatch: string;
  matches: any;
  reason: string;
}

interface Tender {
  title: string;
  link: string;
  description: string;
  timeline: string;
  postDate: string;
  category: string;
  deadline: string;
}

interface AnalyzedHistory {
  result: any
}

function FeaturesWall(props: IFeaturesWallProps) {
  const [tenders, setTenders] = useState<Tender | null>(null);
  const [analyzedHistory, setAnalyzedHistory] = useState<AnalyzedHistory | null>(null);
  const [analyzedData, setAnalyzedData] = useState<AnalyzedData | null>(null);
  const [isPending, setIsPending] = useState(false);
  const isDeadlineAcceptable = isDateMoreThan15DaysAway(tenders?.deadline);
  console.log({isDeadlineAcceptable});
  useEffect(() => {
    const getAllUserData = async () => {
      const tenderInfo = await getTenderData(props.additionalData.token, extractIdFromUrl(props.additionalData.url));
      const aHistory = await getAnalyzedHistory(extractIdFromUrl(props.additionalData.url));

      // @ts-ignore
      setTenders(tenderInfo);
      // @ts-ignore
      setAnalyzedHistory(aHistory);
    }

    getAllUserData()
  }, [props.additionalData.token, props.additionalData.url])

  const sendToAnalyze = async () => {
    setIsPending(true);
    const extractedId:string | null = extractIdFromUrl(props.additionalData.url);
    const analyzedResult = await analyze(props.additionalData.token, extractedId);

    // @ts-ignore
    setAnalyzedData(analyzedResult);
    setIsPending(false);
  }

  return (
    <div className="ftContainer">
      <h1 className="ftTitle"><img className="ftLogo" src={logo} />Analyze Prosal Tenders</h1>
      <div className="features">
        {tenders ?
          <div className="tenders">
            <div>Category - {tenders.category}</div>
            <div>Title - {tenders.title}</div>
            <div>Timeline - {tenders.timeline}</div>
            <div>Post Date - {tenders.postDate}</div>
            <div>Deadline - {tenders.deadline}</div>
            { props.additionalData.token ?
              <div>
                <h3 className="ftDescription">{props.additionalData?.headline}</h3>
                <div><img src={okay} alt="" />Token retrieved successfully from Prosal.</div>
              </div> :
              <div><img src={empty} alt="" />Can't get Token, Please Log In</div>
            }
            { !isDeadlineAcceptable && <div style={{color: '#858505'}}><img src={note}/>The submission deadline is less than 15 days.</div> }
            { !analyzedData &&
              <button
              className={`ftBtn ${(isPending || !isDeadlineAcceptable) ? 'disable' : ''}`}
              onClick={sendToAnalyze}
            >
              Send To Analyze
            </button>
            }
            { isPending && <div className="loader" style={{height: '50px', marginTop: '13px'}} /> }
            { analyzedData &&
              <>
                <div style={{fontWeight: '600', fontSize: '16px', marginTop: '20px'}}>
                  <span style={{borderBottom: '1px solid #00377B', paddingBottom: '5px'}}>
                    Analyzed Result:
                  </span>
                </div>
                {analyzedData.reason &&
                  <>
                    <div style={{ fontWeight: '600', fontSize: '14px' }}>Reason:</div>
                    <div>{analyzedData.reason}</div>
                  </>
                }
                {analyzedData.mismatch &&
                  <>
                    <div style={{ fontWeight: '600', fontSize: '14px', color: '#93930b' }}>Mismatches:</div>
                    <div style={{color: '#93930b'}}>{analyzedData.mismatch}</div>
                  </>
                }
                {!!analyzedData.matches?.length &&
                  <>
                    <div style={{ fontWeight: '600', fontSize: '14px' }}>Matches:</div>
                    {analyzedData.matches.map((text: string, index: number) => {
                      return <div key={index}>{text}</div>
                    })}
                  </>
                }
              </>
            }
            <History history={analyzedHistory} />
          </div> :
          <div className="tenders">
            <div>Please wait while the extension loads your tender data.</div>
            <div><img src={note} alt="" />If this process takes too long, please refresh the page to reconnect to Prosal. If you are not currently on <a href="https://app.prosal.io/">Prosal</a>, please visit the site.</div>
            <div className="loader" />
          </div>
          }
      </div>
    </div>
  );
}

export default FeaturesWall;
