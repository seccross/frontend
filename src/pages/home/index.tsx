import { useEffect, useState } from "react";
import moment from "moment";
import styled from "styled-components";
import Upload from "../../components/Upload";
import Tools from "./components/Tools";
import Table from "./components/Table";

import deleteImg from "../../asset/icon/delete.svg";
import { useNavigate } from "react-router-dom";
import exampleData, { ExampleProps } from "../../api/example";
import useApi, { ScanProps } from "../../hooks/useApi";
import { statusMap } from "../../utils/utils";

const scanHead = [
  {
    text: "Name",
    styles: { width: "25%", minWidth: "200px" },
    prop: "contract_name",
  },
  {
    text: "Findings",
    styles: { width: "20%", minWidth: "100px" },
    prop: "result",
  },
  {
    text: "Compiler",
    styles: { width: "15%", minWidth: "100px" },
    prop: "version",
  },
  {
    text: "Checks",
    styles: { width: "15%", minWidth: "100px" },
    prop: "check",
  },
  {
    text: "Status",
    styles: { width: "15%", minWidth: "150px" },
    prop: "status",
  },
  {
    text: "Created",
    styles: { width: "10%", minWidth: "150px" },
    prop: "create",
  },
];
const exampleHead = [
  {
    text: "Name",
    styles: { width: "30%", minWidth: "200px" },
    prop: "contract_name",
  },
  {
    text: "Description",
    styles: { width: "20%", minWidth: "100px" },
    prop: "description",
  },
  { text: "Bugs", styles: { width: "20%", minWidth: "200px" }, prop: "bugs" },
  {
    text: "File type",
    styles: { width: "20%", minWidth: "150px" },
    prop: "file_type",
  },
  {
    text: "Created",
    styles: { width: "10%", minWidth: "150px" },
    prop: "create",
  },
];
const scanStatusMap: { [key: number]: string } = {
  0: "",
  1: "Successful",
  2: "Failed",
};
export default function HomePage() {
  const navgaite = useNavigate();
  const { createScan, getScans, deleteScanById } = useApi();
  const [active, setActive] = useState<number>(1);
  const [toolOption, setToolOption] = useState<{type: string,
  value: string}>({
    type: '',
    value: ''
  });

  const [scanData, setScanData] = useState<ScanProps[]>([]);
  const [examplesData, setExampleData] = useState<ExampleProps[]>([]);
  const scanRender = {
    name: (item: any, value: any) => {
      return <Name>{value}</Name>;
    },
    result: (item: any, result: any) => {
      console.log("result", result);
      let num = 0;
      if (result && item.status === 1) {
        num = result.result.results.detectors.length;
      }

      return (
        <div
          style={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "30px 60%",
            columnGap: "20px",
          }}
        >
          <div>
            <span
              style={{ fontSize: "1.2rem", color: "#000", fontWeight: "600" }}
            >
              {num}
            </span>
            {/* <div
              style={{
                fontSize: "1.2rem",
                color: "#000",
                fontWeight: "400",
                marginTop: "5px",
              }}
            >
              Total
            </div> */}
          </div>
          {/* <div>
            <span
              style={{
                fontSize: "1.2rem",
                color: "#b90505",
                fontWeight: "600",
                backgroundColor: "#ff333314",
                padding: "2px 5px",
                borderRadius: "5px",
              }}
            >
              1
            </span>
            <div
              style={{
                height: "5px",
                backgroundColor: "#b90505",
                borderRadius: "5px",
                marginTop: "12px",
              }}
            ></div>
          </div> */}
        </div>
      );
    },
    status: (item: any, value: any) => {
      
      return (
        <div
          style={{ textTransform: "capitalize" }}
          className={statusMap[value] + "_label"}
        >
          {statusMap[value] === 'nobug' ? 'successful':statusMap[value]}
        </div>
      );
    },
    create: (item: any, value: any) => {
      return (
        <Time style={{ textAlign: "left", width: "100px" }}>
          {moment(value).format("YYYY-MM-DD ")}
          <br />
          <span>{moment(value).format("a h:mm")}</span>
        </Time>
      );
    },
    version: (item: any, value: any) => {
      return <>v{value}</>
    }
  };
  const examplesRender = {
    name: (item: any, value: any) => {
      return <Name>{value}</Name>;
    },
    file_type:(item: any, value: any) => {
      const text = value === 1 ? 'Source Code': 'Binary'
      return <span>{item.file_source_type || text}</span>;
    },
    create: (item: any, value: any) => {
      return (
        <Time style={{ textAlign: "left", width: "100px" }}>
          {moment(value).format("YYYY-MM-DD ")}
          <br />
          <span>{moment(value).format("a h:mm")}</span>
        </Time>
      );
    },
  };
  const loadingData = async () => {
    console.log('toolOption',toolOption)
    // 加载scan数据
    if (active === 1) {
      let scans: ScanProps[] = await getScans();
      if(toolOption.type === 'filter' && toolOption.value){
        scans = scans.reverse()
      }
      if(toolOption.type === 'search' && toolOption.value){
        scans = scans.filter(e => e.contract_name.indexOf(toolOption.value) !== -1)
      }
      setScanData(scans);
    }
    // 加载example 数据
    if (active === 2) {
      let examples = exampleData
      if(toolOption.type === 'filter' && toolOption.value){
        examples = examples.reverse()
      }
      if(toolOption.type === 'search' && toolOption.value){
        examples = examples.filter(e => e.contract_name.indexOf(toolOption.value) !== -1)
      }
      setExampleData(examples);
    }
  };
  const handlerFile = async (file: File) => {
    try {
      const scanId = await createScan(file);
      navgaite("/scan/" + scanId);
    } catch (e) {
      console.error("文件上传错误：", e);
    }
  };
  const deleteScan = async (scan: any) => {
    console.log("scan", scan);
    await deleteScanById(scan.id);
    loadingData();
  };
  useEffect(() => {
    loadingData();
  }, [active,toolOption]);
  return (
    <>
      <Upload hanlderFile={handlerFile} />
      <div>
        <Tools
          active={active}
          hanlderFile={handlerFile}
          onChange={(index) => {
            setActive(index);
          }}
          onSearch={(type, value) => {
           

            setToolOption({type,value})
            
          }}
        />
        <Table
          head={active === 1 ? scanHead : exampleHead}
          data={active === 1 ? scanData || [{}] : examplesData}
          renders={active === 1 ? scanRender : examplesRender}
          iconRender={(row) => {
            return (
              <>
                {active === 1 ? (
                  <span
                    onClick={(ev) => {
                      ev.stopPropagation();
                      deleteScan(row);
                    }}
                  >
                    <img alt="delete" className="icon" src={deleteImg} />
                  </span>
                ) : null}
              </>
            );
          }}
          onClick={(row: any) => {
            console.log(row, active);
            if (active === 1) {
              // if (row.result )  {
                navgaite("/analy/" + row.id);
              // } else{

              //   navgaite("/scan/" + row.id);
              // }
            }
            if (active === 2) {
              navgaite("/scan/example_" + row.id);
            }
          }}
        />
      </div>
    </>
  );
}

const Name = styled.div`
  font-family: Albert Sans, sans-serif;
  font-weight: 600;
  font-size: 1.4rem;
  line-height: 1.286;
`;

const Time = styled.div`
  font-family: Albert Sans, sans-serif;
  font-weight: 500;
  font-size: 1.4rem;
  line-height: 1.286;
  span {
    font-family: Albert Sans, sans-serif;
    font-weight: 600;
    font-size: 1.1rem;
    line-height: 1.455;
  }
`;
