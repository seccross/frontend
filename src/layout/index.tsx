import { Outlet } from "react-router-dom";
import styled from "styled-components";
import Nav from "./Nav";

export default function DefaultLayout() {
  return (
    <>
      <Nav />
      <Content>
        <Outlet />
      </Content>
      <Footer>
          <div >© 2024 XGuard Inc.</div>
          <div className="divider"></div>
          <div>Terms of Service</div>
          <div className="divider"></div>
          <div>Privacy Policy</div>
      </Footer>
    </>
  );
}

const Content = styled.div`
  padding: 20px 128px 0;
  /* max-width: 1280px; */
  min-width: 1280px;
  min-height: calc(100vh - 80px - 75px - 20px);
  margin: auto;
`;

const Footer =  styled.footer`
  display: flex;
  min-width: 1280px;
  gap: 10px;
  justify-content: center;
  align-items: center;
  color:hsl(0deg 0% 40%);
  margin: 32px 0;
  position: relative;
  font-family: Albert Sans,sans-serif;
  font-weight: 500;
  font-size: 1.1rem;
  line-height: 1.455;
  .divider {
    height: 15px;
    width: 1px;
    background-color: hsl(0deg 0% 67.11%);
  }
`
