import React, {useEffect, useState} from "react";
import okay from "./icons/OK.png"
import note from "./icons/note.png"
import empty from "./icons/empty.png"
import { sendToken } from "../../api/sendToken";
import { extractIdFromUrl } from "../../helpers/commons";
import "./FeaturesWall.css";
import {getTenderData} from "../../api/getTenderData";

interface IFeaturesWallProps {
  setHideFeaturesWall: (hideFeaturesWall: boolean) => void;
  additionalData: any;
}

interface Tender {
  title: string;
  link: string;
  description: string;
  timeline: string;
  postDate: string;
  category: string;
}

function FeaturesWall(props: IFeaturesWallProps) {
  const [tenders, setTenders] = useState<Tender | null>(null);

  useEffect(() => {
    const getAllUserData = async () => {
      console.log(85)
      const tenderInfo = await getTenderData(props.additionalData.token, extractIdFromUrl(props.additionalData.url));
      // @ts-ignore
      setTenders(tenderInfo)
    }

    getAllUserData()
  }, [props.additionalData.token, props.additionalData.url])
  console.log({tenders})
  function showedWall() {
    console.log(props.additionalData.token, "props.additionalData.token");
    console.log(props.additionalData.url, "props.additionalData.token");
    console.log(props.additionalData.headline, "props.additionalData.token");
    const extractedId:string | null = extractIdFromUrl(props.additionalData.url);

    sendToken(props.additionalData.token, extractedId);
    props.setHideFeaturesWall(true);
    localStorage.setItem('isShowed', 'isShowed');
  }

  return (
    <div className="ftContainer">
      <div className="ftLogo" />
      <h1 className="ftTitle">Analyze Prosal Tenders</h1>
      <div className="features">
        {tenders ?
          <div className="tenders">
            <div>Category - {tenders.category}</div>
            <div>Title - {tenders.title}</div>
            <div>Timeline - {tenders.timeline}</div>
            <div>Post Date - {tenders.postDate}</div>
            { props.additionalData.token ?
              <div>
                <h3 className="ftDescription">{props.additionalData?.headline}</h3>
                <div><img src={okay} alt="" />Token retrieved successfully from Prosal.</div>
              </div> :
              <div><img src={empty} alt="" />Can't get Token, Please Log In</div>
            }
            <button className="ftBtn" onClick={showedWall}>Send To Analyze</button>
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
