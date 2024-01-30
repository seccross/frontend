import styled from "styled-components";
import scanIcon from "../../../asset/icon/scan.svg";
import chartIcon from "../../../asset/icon/chart.svg";
import plusIcon from "../../../asset/icon/plus.svg";
import deleteIcon from "../../../asset/icon/delete.svg";
import refushIcon from "../../../asset/icon/refush.svg";
import filterIcon from "../../../asset/icon/filter.svg";
import searchIcon from "../../../asset/icon/search.svg";
import { useEffect, useRef, useState } from "react";

type Props = {
  active: number;
  onChange: (index: number) => void;
  onSearch: (type: string, value?: any) => void;

  hanlderFile: (file: File) => void;
};
export default function Tools({ active = 1, onChange, onSearch ,hanlderFile}: Props) {
  const [activeIndex, setActiveIndex] = useState<number>(active);
  const [filter, setFilter] = useState<number>(0);
  const [refresh, setRefresh] = useState<number>(0);

  const inputRef = useRef(null);
  useEffect(() => {
    setActiveIndex(active);
  }, [active]);
  return (
    <Wrapper>
      <input
        ref={inputRef}
        accept=".sol"
        type="file"
        style={{ display: "none" }}
        onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
          if (!e.target.files) return;
          const file = e.target.files[0];
          hanlderFile(file);
        }}
      />
      <div className="tabs">
        <div
          className={"scan-tab tab-item " + (activeIndex === 1 ? "active" : "")}
          onClick={() => {
            setActiveIndex(1);
            onChange(1);
          }}
        >
          <img src={scanIcon} className="icon" alt="scanIcon" />
          <span>Scans</span>
        </div>
        <div
          className={
            "example-tab tab-item " + (activeIndex === 2 ? "active" : "")
          }
          onClick={() => {
            setActiveIndex(2);
            onChange(2);
          }}
        >
          <img src={chartIcon} className="icon" alt="chartIcon" />
          <span>Examples</span>
        </div>
      </div>
      <div className="searchPanel">
        <div
          className="item"
          onClick={(e) => {
            if (!inputRef.current) return;
              (inputRef.current as any).click();
          }}
        >
          <img alt="plus" className="icon" src={plusIcon} />
        </div>
        {/* <div className="item">
          <img alt="delete" className="icon" src={deleteIcon} />
        </div> */}
        <div
          className="item"
          onClick={(e) => {
            const f = Number(!refresh);
            setRefresh(f);
            onSearch("refresh", "");
          }}
        >
          <img
            alt="refush"
            style={{
              transform: !refresh ? "rotate(0deg)" : "rotate(360deg)",
              transition: "1s",
            }}
            className="icon"
            src={refushIcon}
          />
        </div>
        <div
          className="item"
          onClick={(e) => {
            const f = Number(!filter);
            setFilter(f);
            onSearch("filter", f);
          }}
        >
          <img
            alt="filter"
            style={{
              transform: !filter ? "rotate(0deg)" : "rotate(180deg)",
              transition: "500ms",
            }}
            className="icon"
            src={filterIcon}
          />
        </div>
        <div className="item item-input">
          <input
            placeholder="Search"
            onChange={(e) => {
              onSearch("search", e.target.value);
            }}
          />
          <img alt="search" className="icon" src={searchIcon} />
        </div>
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  .tabs,
  .searchPanel {
    display: grid;
    align-items: center;
    grid-template-columns: max-content max-content max-content max-content max-content;
    column-gap: 15px;
    .item {
      cursor: pointer;
    }
    .item-input {
      position: relative;
      input {
        border: none;
        border-radius: 5px;
        padding: 5px 15px;
        padding-right: 30px;
      }
      .icon {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
  .tabs .tab-item {
    display: flex;
    align-items: center;
    margin-right: 20px;
    cursor: pointer;
    border-radius: 5px;
    padding: 6px 10px;
    font-family: Albert Sans, sans-serif;
    font-weight: 500;
    font-size: 1.4rem;
    line-height: 1.286;
    &.active {
      background-color: hsl(0deg 0% 90%);
    }
    .icon {
      width: 16px;
    }
    img {
      margin-right: 10px;
    }
  }
  .icon {
    width: 16px;
  }
`;
