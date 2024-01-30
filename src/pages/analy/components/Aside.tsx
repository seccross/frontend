import styled from "styled-components";
import rightarrowImage from "../../../asset/icon/rightarrow.svg";
export default function Aside({
  info,
  status,
  index,
  onClick,
  process,
  loading,
}: {
  info: any;
  status: number;
  index: number;
  onClick: (index: number) => void;
  loading: boolean;
  process: number;
}) {
  const renderSuccessful = () => {
    return (
      <>
        <div className="content">
          {(info.detectors || []).map((e: any, i: number) => {
            return (
              <div
                key={i}
                className={index === i ? "item active" : "item"}
                onClick={() => {
                  onClick(i);
                }}
              >
                <div className="head">
                  {/* <img src={bugImage} className="bugImage" alt="bugImage" /> */}
                  <div className="check">{e.check}</div>
                  <div className={"impact " +e.impact}>{e.impact}</div>
                </div>
                {index === i ? (
                  <div>
                    <span className="link">
                      <img src={rightarrowImage} className="rightarrowImage" alt="rightarrowImage"/>
                    </span>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </>
    );
  };
  const renderError = () => {
    return (
      <>
        <img className="oops" src="/images/oops.jpg" alt="oops" />
        <h1 style={{ textAlign: "center" }}>Something went wrong!</h1>
      </>
    );
  };

  const renderNobug = () => {
    return (
      <>
        <img className="empty" src="/images/verified.gif" alt="empty" />
        <h1 style={{ textAlign: "center" }}>No bugs found</h1>
      </>
    );
  };
  return (
    <Wrapper>
      <div className="content-inner">
      {loading ? (
        <>
          <p className="waiting">Please wait...</p>
          <div className="process-box">
            <h5>Project Process</h5>
            <div className="process">
              <div className="text">{process}%</div>
              <div className="inner" style={{ width: process + "%" }}></div>
            </div>
          </div>
        </>
      ) : status === 0 ? (
        renderError()
      ) : status === 1 ? (
        renderSuccessful()
      ) : (
        renderNobug()
      )}
      </div>
      
    </Wrapper>
  );
}

const Wrapper = styled.div`
.content-inner {
  padding: 24px 24px 30px 24px;
  background-color: #fff;
  border-radius: 18px;
  min-height: calc(100vh - 400px);
  text-align: center;
}
  
  .empty {
    width: 40%;
    margin: auto;
    margin-top: 10vh;
    margin-bottom: 20px;
  }
  .content {
    .item {
      padding: 15px 20px;
      margin-bottom: 20px;
      background-color: #efeeee96;
      border-radius: 10px;
      text-align: left;
      box-sizing: border-box;
      font-weight: bold;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .bugImage {
        width: 25px;
        margin-right: 20px;
      }
      &:hover,
      &.active {
        background-color:#dbdfe1;
      }
      .head {
        .check {
          font-size: 1.8rem;
          margin-bottom: 10px;
        }
        .impact {
          font-size: 1.2rem;
          color: #f13d3d;
          display: inline-block;
          padding: 5px 10px;
          border-radius: 5px;
          background-color: #fcd3d3;
          &.Informational {
            background-color: #feeeb5a8;
            color: #c55d19;
          }
          &::before{
            display: inline-block;
            content: "";
            width: 4px;
            height: 4px;
            background-color:#f13d3d ;
            border-radius: 50%;
            margin-right: 8px;
            vertical-align: middle;
          }
          /* &.High::before {

          } */
          &.Informational::before {
            background-color:#c55d19;
          }
        }
      }
    }
    .link {
      float: right;
      margin-left: 20px;
      img {
        width: 12px;
      }
    }
  }
  .waiting {
    font-size: 3rem;
    margin-top: 5rem;
  }
  .process-box {
    --color: #b41b1b;
    border: 4px solid var(--color);
    border-radius: 10px;
    text-align: center;
    padding: 20px;
    background-color: #f9f9f9;

    margin: 20vh 20px 0;

    box-sizing: content-box;

    h5 {
      font-size: 2rem;
      color: var(--color);
      font-weight: bold;
      margin-bottom: 20px;
    }
    .process {
      height: 20px;
      border: 2px solid var(--color);
      background-color: #b41b1b30;
      position: relative;
      .inner {
        width: 30%;
        background-color: var(--color);
        height: 100%;
      }
      .text {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
  .oops {
    width: 100%;
  }
`;
