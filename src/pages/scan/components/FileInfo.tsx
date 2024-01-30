import styled from "styled-components";
// import transferImage from "../../../asset/icon/transfer.svg";
import successImage from "../../../asset/icon/success.svg";
import { useNavigate } from "react-router-dom";
import { convertFileSize } from "../../../utils/readFile";
const version = {
  "0.8.": [0, 24],
  "0.7.": [0, 6],
  "0.6.": [0, 12],
  "0.5.": [0, 17],
  "0.4.": [0, 26],
};
export type InfoProps = {
  name: string;
  size: number;
  contract_name: string;
  owner_address: string;
  function_signature: string;
  version: string;
  send_funcs: string;
  receive_funcs: string;
  events:string;
  send_stores: string
};
export default function FileInfo({
  onConfrim,
  process,
  info,
  onChange = () => {},
}: {
  onConfrim: () => void;
  process: number;
  info: InfoProps;
  onChange?: (value: string, props: string) => void;
}) {
  const navigate = useNavigate();
  return (
    <Wrapper>
      <div className="content">
        <h2> Start Scan</h2>
        <p className="text01">
          {" "}
          Your file has been uploaded.Please fill out the form and click <b>Scan</b> to start.
        </p>
        <div className="fileInfo">
          <div className="text">
            {" "}
            {info.name}
            <span> {convertFileSize(info.size)}</span>
            <img
              alt="successImage"
              src={successImage}
              className="successImage"
            />
          </div>
          <div className="processWrapper" style={{ width: process + "%" }}>
            <div></div>
          </div>
        </div>
        <div style={{display:"flex", justifyContent:"space-between",alignItems:"center",marginTop:"30px"}}>
          <div className="tip-area">
            <div>
              <img alt="code" className="transferImage" src="/images/solidity.png" />
            </div>
            <div>
              <h3>Solidity </h3>
              <p className="text01" style={{ color: "#000" }}>
                Source Code
              </p>
            </div>
          </div>
          <div className="compiler">
            <span>COMPILER:</span>
            <select
              value={info.version}
              onChange={(e) => {
                console.log(e.target.value);
                onChange(e.target.value, "version");
              }}
            >
              {Object.entries(version).map(([key, value]) => {
                const [start, end] = value;
                const options = [];
                for (let i = end; i >= start; i--) {
                  options.push(
                    <option key={key + i}  value={key + i}>
                      v{key + i}
                    </option>
                  );
                }
                return options;
              })}
            </select>
          </div>
        </div>
        <div className="contract-name">
          <h3>Source chain functions:</h3>
          <input
            defaultValue={info.send_funcs}
            onChange={(e) => onChange(e.target.value, "send_funcs")}
          />
        </div>
        <div className="contract-name">
          <h3>Destination chain functions:</h3>
          <input
            defaultValue={info.receive_funcs}
            onChange={(e) => onChange(e.target.value, "receive_funcs")}
          />
        </div>
        <div className="contract-name">
          <h3>Crosschain event:</h3>
          <input
            defaultValue={info.events}
            onChange={(e) => onChange(e.target.value, "events")}
          />
        </div>
        <div className="contract-name">
          <h3>Crosschain storage:</h3>
          <input
            defaultValue={info.send_stores}
            onChange={(e) => onChange(e.target.value, "send_stores")}
          />
        </div>
      </div>
      <div className="btns">
        <button
          className="btn cancel-btn"
          onClick={() => {
            navigate("/");
          }}
        >
          Cancel
        </button>
        <button className="btn scan-btn" onClick={onConfrim}>
          Scan
        </button>
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .btns {
    display: flex;
    justify-content: space-between;
    .btn {
      min-width: 100px;
    }
    .cancel-btn {
      background-color: #ddd;
    }
  }
  .tip-area {
    display: flex;
    align-items: center;
    .transferImage {
      width: 30px;
      height: 30px;
      margin-right: 10px;
    }
    h3 {
      font-size: 2rem;
      margin-bottom: 2px;
    }

    p {
      color: #444;
    }
  }
  .content {
    h2 {
      font-size: 2.5rem;
      margin-bottom: 10px;
    }
    .fileInfo {
      margin-top: 10px;
      .text {
        font-size: 1.1rem;
        font-weight: bold;
        color: #333;
        span {
          font-weight: normal;
          color: #666;
          margin-left: 10px;
        }
      }
      .successImage {
        float: right;
        width: 12px;
      }
      .processWrapper {
        background-color: rgb(var(--primary));
        height: 5px;
        width: 100%;
        margin-top: 10px;
        border-radius: 10px;
      }
    }
  }
  .contract-name {
    margin-top: 20px;
    h3 {
      font-size: 1.6rem;
      margin-bottom: 2px;
    }
    input {
      border: 1px solid #ddd;
      border-radius: 5px;
      padding: 5px 10px;
      font-size: 1.3rem;
      width: 100%;
      box-sizing: border-box;
      margin-top: 10px;
    }
  }
  .compiler {
    font-size: 1.6rem;
    select {
      background-color: #333;
      padding: 2px 10px;
      border-radius: 5px;
      color: #fff;
      margin-left: 10px;
      font-size: 1.6rem;
    }
  }
`;
