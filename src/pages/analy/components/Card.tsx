import styled from "styled-components";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { statusMap } from "../../../utils/utils";
import copeImage from '../../../asset/icon/copy.svg'
import { useEffect, useState } from "react";

export type CardInfoProps= {
  
    file_name: string,
    create: number,
    sourceType: string,
    issues: number,
    version:string,
    contract_name:string,
    function_signature:string,
    owner_address:string,
    send_funcs: string;
    receive_funcs: string;
    events:string;
    send_stores: string;
    check: string;
    hash: string
}
export default function Card({
  info,
  loading,
  status,
  result,
  contractInfo
}: {
  info: CardInfoProps;
  loading: boolean;
  result: any;
  status: number
  contractInfo?: any;
}) {
  const navigate = useNavigate();
  const [issues,setIssues]= useState<number>(0)
  useEffect(() => {
    console.log('result',result)
    if(status === 1 && result){
      setIssues(result.result.results.detectors.length)
    }
  },[status,result])
  return (
    <>
      <Bread>
        <span
          style={{ color: "rgb(var(--primary))" }}
          onClick={() => {
            navigate("/");
          }}
        >
          Dashboard{" "}
        </span>{" "}
        &gt; <span> {info.file_name}</span>{" "}
      </Bread>
      <Wrapper>
        <div className="row bewteen">
          <div className="report-title">
            <div className="time">
              {" "}
              Binary Analysis Report /{" "}
              {moment(info.create).format("YYYY-MM-DD a hh:mm")}
            </div>
            <div className="name">{info.contract_name}</div>
          </div>
          {loading ? (
            <div className="analyzing">
              <span>Analyzing ...</span>
            </div>
          ) : 
            <div
              className={statusMap[ status]}
            >
              { statusMap[status] }
            </div>}
        </div>
        <div className="row">
          <div className="item">
            <div className="t">File Type</div>
            <div className="v">
              {info.sourceType}
            </div>
          </div>
          <div className="item">
            <div className="t">Issues</div>
            <div className="v ">
              {issues}
            </div>
          </div>
          <div className="item">
            <div className="t">Compiler</div>
            <div className="v ">
              v{info.version}
            </div>
          </div>
          <div className="item">
            <div className="t">Checks</div>
            <div className="v ">{info.check}</div>
          </div>
          <div className="item">
            <div className="t">Digest(SHA-256)</div>
            <div className="v ">{info.hash ? info.hash.slice(0,15) + '...' : ''}
            <img alt="copy" src={copeImage} className="copeImage" onClick={() =>{
              exeCommandCopyText(info.hash)
            }}/></div>
          </div>
          {/* <div className="item">
            <div className="t">Owner Address</div>
            <div className="v bold">{info.owner_address}</div>
          </div> */}
  
        </div>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  background-color: hsl(0deg 0% 5%);
  padding:15px 24px;
  /* padding-bottom: 40px; */
  border-radius: 18px;
  color: hsl(0deg 0% 100%);
  .row {
    display: flex;
    align-items: center;
  }
  .bewteen {
    justify-content: space-between;
  }
  .icon {
    width: 15px;
  }
  .item {
    margin-right: 40px;
    text-align: left;
    .t {
      margin-bottom: 10px;
      font-family: Albert Sans, sans-serif;
      font-weight: 400;
      font-size: 1.1rem;
      line-height: 1.455;
      /* opacity: 0.4; */
    }
    .v {
      color: hsl(0deg 0% 100%);
      font-family: Albert Sans, sans-serif;
      font-weight: normal;
      font-size: 1.6rem;
      line-height: 1.21;
      /* opacity: 0.5; */
      height: 23px;
    }
    .bold {
      font-weight: bold;
      
    }
    .copeImage {
      width: 18px;
      margin-left: 10px;
    }
  }
  .analyzing,
  .successful,
  .error {
    background-color: #292f41;
    padding: 10px 20px;
    border-radius: 10px;
    font-size: 1.6rem;
    text-transform: capitalize;
  }
  .successful {
    color: rgb(8 255 190);
    background-color: #294139;
  }
  .error {
    color: rgb(214 31 1);
    background-color: #413429;
  }
  .report-title {
    text-align: left;
    margin-bottom: 15px;

    .time {
      font-family: Albert Sans, sans-serif;
      font-weight: 400;
      font-size: 1.6rem;
      line-height: 1.375;
      margin-bottom: 10px;
      opacity: 0.8;
    }
    .name {
      font-family: Albert Sans, sans-serif;
      font-weight: 500;
      font-size: 2.3rem;
      line-height: 1.174;
    }
  }
`;

function exeCommandCopyText(text: string) {
  try {
    const t = document.createElement("textarea");
    t.nodeValue = text;
    t.value = text;
    document.body.appendChild(t);
    t.select();
    document.execCommand("copy");
    document.body.removeChild(t);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

const Bread = styled.div`
  text-align: left;
  font-size: 1.2rem;
  margin-bottom: 20px;
  span {
    padding: 0 10px;
    cursor: pointer;
  }
`;
