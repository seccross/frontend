import styled from "styled-components";
import Editer from "../../../components/Editer";
// import moment from 'moment'
import { useEffect, useState } from "react";
import Markdown from "../../../components/Markdown";
type markerProps = {
  startRow: number;
  startCol: number;
  endRow: number;
  endCol: number;
  className: string;
  type: string;
};
//  startRow: 0;
// startCol: 0;
// endRow: 1;
// endCol: 100;
// className: "error-marker";
// type: "fullline";
export default function Content({
  loading,
  result,
  index,
  data,
  status,
  contractInfo,
}: {
  data: string;
  loading: boolean;
  result: any;
  index: number;
  status: number;
  contractInfo?: any;
}) {
  const [markers, setMarkers] = useState<markerProps[]>([]);
  const [data1, setData1] = useState<{
    check: string;
    impact: string;
    comfidence_used: string;
    description: string;
    report: string;
    send_funcs: string;
    receive_funcs: string;
    events: string;
    send_stores: string;
  }>({
    check: "",
    impact: "",
    comfidence_used: "",
    description: "",
    report: "",
    send_funcs: "",
    receive_funcs: "",
    events: "",
    send_stores: "",
  }); //successful
  const [data2, setData2] = useState<any>(""); // error
  const [data3, setData3] = useState<any>({}); //no bug

  useEffect(() => {
    console.log("index,result", index, result, status);
    if (!result) return;
    if (status === 0) {
      // error
      setData2(result.error);
    }
    if (status === 1) {
      // successful
      const detector = result.result.results.detectors[index];
      if (!detector) return;
      setData1({
        check: detector.check,
        impact: detector.impact,
        comfidence_used: detector.confidence,
        description: detector.description,
        report: result.report,
        send_funcs: contractInfo.send_funcs,
        receive_funcs: contractInfo.receive_funcs,
        events: contractInfo.events,
        send_stores: contractInfo.send_stores,
      });
      const mks: any[] = [];
      (detector.elements || []).forEach((e: any) => {
        const lines = e.source_mapping.lines || [];
        lines.forEach((l: number) => {
          mks.push({
            startRow: l - 1,
            endRow: l - 1,
            startCol: 0,
            endCol: 10,
            className: "error-marker",
            type: "fullLine",
          });
        });
      });
      console.log("mks", mks);
      setMarkers(mks);
    }
    if (status === 2) {
      // no bug
    }
  }, [index, result, status]);
  useEffect(() => {
      console.log('contractInfo',contractInfo)
  },[contractInfo])
  const renderError = () => {
    return (
      <>
        <ResultWrapper>
          <h1 style={{ marginBottom: "20px" }}>Error</h1>
          {renderContractInfo()}
          <InfoWrapper className="error">
            <div className="content">{data2}</div>
          </InfoWrapper>
        </ResultWrapper>
      </>
    );
  };
  const renderSuccessful = () => {
    return (
      <>
        <ResultWrapper>
          <Error>{index + 1}</Error>
          <h1 style={{ marginBottom: "20px" }}>{data1.check}</h1>

          
          <div className="detail1">
            <div><span>Impact: </span>{data1.impact}</div>
            <div><span>Confidence used: </span>{data1.comfidence_used}</div>
          </div>
          <div className="detail2">Details</div>
          {renderContractInfo()}
          <InfoWrapper className="error">
            <div className="content">{data1.description}</div>
          </InfoWrapper>
        </ResultWrapper>
      </>
    );
  };
  const renderContractInfo = () => {
    return (
      <div className="contract-info">
        <div>
          <div className="t">Send Functions:</div>
          <div className="v">{contractInfo.send_funcs}</div>
        </div>
        <div>
          <div className="t">Receive Functions:</div>
          <div className="v">{contractInfo.receive_funcs}</div>
        </div>
        <div>
          <div className="t">Events:</div>
          <div className="v">{contractInfo.events}</div>
        </div>
        <div>
          <div className="t">Send Stroage:</div>
          <div className="v">{contractInfo.send_stores}</div>
        </div>
      </div>
    );
  };
  const renderNobug = () => {
    return (
      <>
        <h2 style={{ margin: "30px 0" }}>All checks passed</h2>
        {renderContractInfo()}
      </>
    );
  };
  return (
    <Wrapper>
      {/* <div>status: {status}</div> */}

      {status === 0
        ? renderError()
        : status === 1
        ? renderSuccessful()
        : status === 2
        ? renderNobug()
        : null}
      {loading ? null : (
        <Editer
          data={data}
          style={{ height: "80vh" }}
          readOnly={true}
          onChange={(value) => {
            console.log(value);
          }}
          markers={markers}
        />
      )}

      {loading ? (
        <img className="loading" src="/images/loading.gif" alt="loading" />
      ) : null}
      {status === 1 ? (
        <ResultWrapper>
          <div className="detail3" style={{ margin: "30px 0 20px" }}>
            Report
          </div>
          <div>
            <Markdown
              data={data1.report}
            />
          </div>
        </ResultWrapper>
      ) : null}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  padding: 24px 60px;
  background-color: #fff;
  border-radius: 18px;
  /* height: 100%; */
  text-align: left;
  position: relative;
  .loading {
    display: block;
    width: 70%;
    margin: auto;
  }
  .contract-info {
    display: grid;
    grid-template-columns: 50% 50%;
    column-gap: 20px;
    row-gap: 10px;
    background-color: #ddd;
    margin-top: 20px;
    margin-bottom: 20px;
    padding: 15px 10px;
    border-radius: 10px;
    & > div {
      /* display: flex; */
    }
    & .t {
      font-weight: bold;
      margin-right: 10px;
      white-space: nowrap;
      display: inline-block;
    }
    & .v {
      word-wrap: break-word;
      display: inline-block;
      line-height: 1.5;
    }
  }
`;

const ResultWrapper = styled.div`
  margin-bottom: 50px;
  .detail1 {
    color: #343434;
    font-size: 1.4rem;
    display: inline-flex;
    /* grid-template-columns: max-content max-content; */
    /* column-count: 2;
    column-gap: 20px; */
    background-color: #fcd3d3;
    border-radius: 10px;
    padding: 10px;
    & >div{
      margin-right: 20px;
    }
    span {
        font-weight: bold;
    }
  }
  .detail2 {
    color: #4e4e4e;
    font-size: 1.2rem;
    margin-top: 20px;
  }
  .detail3{
    color: #2d2d2d;
    font-size: 1.6rem;
    font-weight: 600;
    margin-top: 20px;
  }
  /* .label {
    font-size: 1.4rem;
    background-color: #ebebeb;
    border-radius: 5px;
    padding: 8px 15px;
    display: inline-flex;
    align-items: center;
    .beatymage {
      width: 18px;
      margin-right: 10px;
    }
  } */
`;
const InfoWrapper = styled.div`
  margin: 20px 0;
  background-color: #f1f1f1;
  padding: 10px;
  border-radius: 10px;
  margin-top: 10px;
  .detail {
    font-size: 1.3rem;
    color: #333;
  }
  .content {
    font-size: 1.5rem;
    color: #000;
    line-height: 1.5;
    /* */
  }
  &.error .content {
    font-size: 1.4rem;
    color: #ea6309;
  }
`;

const Error = styled.div`
  background-color: #f8e0e0;
  font-size: 1.4rem;
  position: absolute;
  left: 20px;
  padding: 2px 10px;
  top: 25px;
  color: #8c0808;
  border-radius: 3px;
`;

function convertMilliseconds(millisecond: number) {
  const seconds = Math.ceil(millisecond / 1000);

  return seconds + "s";
}
