import styled from "styled-components";
import React, { useRef } from "react";
import uploadIcon from "../asset/icon/upload.svg";

// import fileIcon from "../asset/icon/transfer.svg";

export default function Upload({
  hanlderFile,
}: {
  hanlderFile: (file: File) => void;
}) {
  const inputRef = useRef(null);
  return (
    <Wrapper>
      <input
        accept=".sol"
        ref={inputRef}
        type="file"
        style={{ display: "none" }}
        onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
          console.log(e.target.files);
          if (!e.target.files) return;
          const file = e.target.files[0];
          hanlderFile(file);
        }}
      />
      <div className="container">
        <div
          className="content"
          onDragOver={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          onDrop={(e) => {
            e.stopPropagation();
            e.preventDefault();
            hanlderFile(e.dataTransfer.files[0]);
          }}
          onClick={() => {
            if (!inputRef.current) return;
            (inputRef.current as any).click();
          }}
        >
          <div className="icon">
            <img src={uploadIcon} alt="upload" />
          </div>
          <div>
            <h3>Upload solidity file or binary</h3>
            <p>
              Drag and drop a file here or
              <span> click to browse</span>
            </p>
          </div>
        </div>
        <div className="details">
          <div className="code" onClick={() => {
              if (!inputRef.current) return;
              (inputRef.current as any).click();
            }}>
            <div className="code-img">
              <img src="/images/solidity.png" alt=""/>
            </div>
            <div>
              <div className="t">Solidity source code</div>
              <div className="v">.sol file</div>
            </div>
          </div>
          {/* <ItemComponents
            icon={fileIcon}
            title="Solidity file"
            desrc=""
            onClick={() => {
              if (!inputRef.current) return;
              (inputRef.current as any).click();
            }}
          /> */}
          {/* <ItemComponents
            icon={codeIcon}
            title="binary"
            desrc=""
            onClick={() => {
              if (!inputRef.current) return;
              (inputRef.current as any).click();
            }}
          /> */}
        </div>
      </div>
    </Wrapper>
  );
}

type ItemProps = {
  icon: string;
  title: string;
  desrc: string;
  onClick: () => void;
};
function ItemComponents({ icon, title, desrc, onClick }: ItemProps) {
  return (
    <ItemWrapper onClick={onClick}>
      <div className="icon">
        <img src={icon} alt={title} />
      </div>
      <div className="text">
        <p>{title}</p>
        <p>{desrc}</p>
      </div>
    </ItemWrapper>
  );
}

const ItemWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: 50px;
  & > .icon {
    padding: 8px;
    border-radius: 12px;
    background-color: hsl(0deg 0% 90%);
    color: hsl(0deg 0% 20%);
    margin-right: 10px;
    img {
      width: 20px;
    }
  }
  & > .text {
    font-family: Albert Sans, sans-serif;
    font-weight: 600;
    font-size: 1.4rem;
    line-height: 1.286;
  }
`;

const Wrapper = styled.div`
  height: 130px;
  cursor: pointer;
  border-radius: 15px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin-bottom: 32px;
  padding: 0 24px;
  padding-right: 10%;
  background-color: hsl(0deg 0% 99%);
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='15' ry='15' stroke='%230E0E0E33' stroke-width='1' stroke-dasharray='6%2c 4' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
  & > .container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .content {
      text-align: left;
      display: flex;
      align-items: center;
      .icon {
        margin-right: 20px;
        img {
          width: 25px;
        }
      }
      p {
        font-family: Albert Sans, sans-serif;
        font-weight: 600;
        font-size: 1.4rem;
        line-height: 1.286;
        color: hsl(0deg 0% 40%);
        span {
          color: rgb(1 214 158);
          text-decoration: underline;
        }
      }
      h3 {
        font-family: Albert Sans, sans-serif;
        font-weight: 500;
        font-size: 1.9rem;
        line-height: 1.21;
        margin-bottom: 5px;
      }
    }
    .details {
      display: flex;
      .code {
        display: flex;
        text-align: left;
        align-items: center;
        .code-img{
          margin-right: 15px;
        }
        .code-img img{
          height: 35px;
        }
        .t {
          font-size: 2rem;
          font-weight: bold;
        }
        .v {
          font-size: 1.6rem;
          color:#333;
          margin-top: 2px;
        }
      }
    }
  }
`;
function saveFile(file: File) {
  throw new Error("Function not implemented.");
}
