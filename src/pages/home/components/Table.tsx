import styled from "styled-components";
import deleteImg from "../../../asset/icon/delete.svg";
import { ReactNode } from "react";

type Props = {
  head: { text: string; styles: { [key: string]: string }; prop: string }[];
  data: Object[];
  renders?: { [key: string]: <T, R>(item: T, value: R) => any };
  onClick?: (e: any) => void;
  iconRender?: (e: any) => ReactNode;
};
export default function Table({
  head,
  data,
  renders = {},
  onClick,
  iconRender
}: Props) {
  return (
    <Wrapper>
      
      {
        !data.length ? <div className="not_found">
          <div>
          <img className="icon" src="/images/not-found.png" alt="not-found"/>
          </div>
          <div>
            <div className="font1">No Scans Yet</div>
            <div className="font2">Please upload a file to scan or use the contracts in Examples</div>
          </div>
        </div>:<table cellSpacing="0px">
        <thead>
          <tr>
            <th></th>
            {head.map((e, i) => (
              <th key={i} style={e.styles}>
                {e.text}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((e: { [key: string]: any }, i) => (
            <tr
              key={i}
              onClick={() => {
                onClick && onClick(e);
              }}
            >
              <td>
                
                  {iconRender ? iconRender(e) : (
                    <img alt="delete" className="icon" src={deleteImg} />
                  )}
              </td>
              {head.map((h, hi) => (
                <td key={hi + "_" + i}>
                  {renders[h.prop] ? renders[h.prop](e, e[h.prop]) : e[h.prop]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      }
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  text-align: left;
  table {
    width: 100%;
    /* table-layout: fixed; */
    background-color: #fff;
    border-radius: 18px;
    padding: 18px 0;
    font-size: 1.4rem;
    .icon {
      width: 15px;
    }
    th {
      padding: 18px 0;
      color: hsl(0deg 0% 40%);
      font-weight: 500;
      font-size: 1.4rem;
      line-height: 1.3;
    }
    tr td:first-child,
    tr th:first-child {
      /* background-color: antiquewhite; */
      width: 100px;
      min-width: 80px;
      text-align: center;
    }
    tbody td {
      padding: 18px 0;
      border-bottom: 1px solid hsl(0deg 0% 90%);
      word-wrap: break-word;
      word-break: break-all;
    }
    tbody tr:hover {
      background-color: #fdfaff;
    }
    tbody tr:last-child td {
      border-bottom:none;
    }
  }
  .not_found {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    border-radius: 18px;
    padding: 50px 0;
   
    .icon{
      width: 100px;
    }
    .font1{
      font-size: 4rem;
      color:#ddd;
      padding-left: 20px;
    }
    .font2 {
      font-size: 1.6rem;
      color:#868686;
      padding-left: 20px;
      width: 300px;
    }
  }
`;
