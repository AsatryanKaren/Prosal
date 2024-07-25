import React, {useEffect, useState} from "react";

interface IFeaturesWallProps {
  history: any;
}

interface AnalyzedData {
  mismatch: string;
  matches: any;
  reason: string;
}

function History(props: IFeaturesWallProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  console.log(props.history, 'karr');
  return (
    <div className="historyContainer">
      {props.history.history && props.history.history.map((analyzedData: any, index: any) => (
        <div className="wrapper">
          <details open={isDetailsOpen} className="details">
            <summary className="summary">
              <div>{index + 1}. Analyzed Result History</div>
            </summary>
            <div style={{marginTop: '10px'}}>
              {analyzedData.reason &&
                <>
                  <div style={{ fontWeight: '600', fontSize: '13px' }}>Reason:</div>
                  <div>{analyzedData.reason}</div>
                </>
              }
              {analyzedData.mismatch &&
                <>
                  <div style={{ fontWeight: '600', fontSize: '13px', color: '#93930b' }}>Mismatches:</div>
                  <div style={{color: '#93930b'}}>{analyzedData.mismatch}</div>
                </>
              }
              {!!analyzedData.matches?.length &&
                <>
                  <div style={{ fontWeight: '600', fontSize: '13px' }}>Matches:</div>
                  {analyzedData.matches?.map((text:string, matchIndex:number) => (
                    <div key={matchIndex}>{text}</div>
                  ))}
                </>
              }
            </div>
          </details>
        </div>
      ))}

    </div>
  );
}

export default History;
