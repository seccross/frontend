import styled from "styled-components";
import helpImg from "../asset/icon/help.svg";
import noticeImg from "../asset/icon/github.svg";
import { useNavigate } from "react-router-dom";
export default function Nav() {
  const navigate = useNavigate();
  return (
    <Wrapper>
      <div className="inner">
        <div
          className="logo"
          onClick={() => {
            navigate("/");
          }}
        >
          <span style={{ color: "green" }}>X</span>
          <span style={{ color: "red" }}>G</span>UARD
        </div>
        <div className="setting">
          <div>
            <img className="icon" src={helpImg} alt="help" />
            <a href="https://github.com/seccross/xguard" target="_blank" rel="noreferrer">
            <img className="icon_github" src={noticeImg} alt="github" />
            </a>
           
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  /* width: 100%; */
  
  min-width: 1280px;
  margin: auto;
  padding: 0 128px;
  z-index: 99999;
  box-shadow: 0 4px 20px #0000000f;

  /* position: sticky; */
  background-color: #fff;
  /* top: 0; */
  .inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 75px;

    padding: 0 5px;
  }
  .logo {
    font-size: 3rem;
    font-weight: 500;
    cursor: pointer;
    span {
      font-size: 3.5rem;
    }
  }
  .icon {
    width: 18px;
    height: 20px;
   
  }
  .icon_github{
    width:20px;
    margin-left: 20px;
  }
`;
