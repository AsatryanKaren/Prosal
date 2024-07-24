import React, {useEffect, useState} from "react";

import okay from "./icons/OK.png"
import note from "./icons/note.png"
import empty from "./icons/empty.png"
import logo from "./icons/logo.png"

import { analyze } from "../../api/analyze";
import { extractIdFromUrl } from "../../helpers/commons";
import {getTenderData} from "../../api/getTenderData";

import "./FeaturesWall.css";

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

function FeaturesWall(props: IFeaturesWallProps) {
  const [tenders, setTenders] = useState<Tender | null>(null);
  const [analyzedData, setAnalyzedData] = useState<AnalyzedData | null>(null);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    const getAllUserData = async () => {
      const tenderInfo = await getTenderData(props.additionalData.token, extractIdFromUrl(props.additionalData.url));
      // @ts-ignore
      setTenders(tenderInfo)
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
            { !analyzedData &&
              <button
              className={`ftBtn ${isPending ? 'pending' : ''}`}
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
                {analyzedData.matches &&
                  <>
                    <div style={{ fontWeight: '600', fontSize: '14px' }}>Matches:</div>
                    {analyzedData.matches.map((text: any, index: number) => {
                      return <div key={index}>{text}</div>
                    })}
                  </>
                }
              </>
            }
          </div> :
          <div className="tenders">
            <div>Please wait while the extension loads your tender data.</div>
            <div><img src={note} alt="" />If this process takes too long, please refresh the page to reconnect to the Prosal page.</div>
            <div className="loader" />
          </div>
          }
      </div>
    </div>
  );
}

export default FeaturesWall;
