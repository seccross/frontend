import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Card, { CardInfoProps } from "./components/Card";
import { useNavigate, useParams } from "react-router-dom";
import Aside from "./components/Aside";
import Content from "./components/Content";
import { analyze, getAnalyResult } from "../../api";
import readFile, { getSolidityDemo } from "../../utils/readFile";
import useApi from "../../hooks/useApi";
import { getProcess } from "../../utils/utils";
const typeMap: { [key: number]: string } = {
  1: "Source Code",
  2: "ByteCode",
};
export type FileInfoProps = {
  report_type: string;
  contract_name: string;
  file?: {
    name: string;
    size: number;
  };
  result?: {
    bugs: number;
    functions: number;
  } | null;
  file_type: 1 | 2; // 1: Source Code 2: ByteCode
  create: number;
  id?: number;
  hash: string;
  owner_address?: string;
  function_signature?: string;
  version?: string;
};
export default function AnalyPage() {
  const navigate = useNavigate();
  const [result, setResult] = useState<any>(null);

  const [codeStr, setCodeStr] = useState<string>("");
  const [process, setProcess] = useState<number>(0);
  const [status, setStatus] = useState<number>(-1);
  const [index, setIndex] = useState<number>(0);
  const [current, setCurrent] = useState<any>({});
  const [cardInfo, setCardInfo] = useState<CardInfoProps>({} as CardInfoProps);
  const [resultHash, setResultHash] = useState<string>("");
  const { getExampleById, getScanById, updateScanById } = useApi();
  const [fileInfo, setFileInfo] = useState<FileInfoProps>({} as FileInfoProps);
  const [loading, setLoading] = useState<boolean>(false);
  const { id } = useParams();

  const processTimer = useRef<any>();
  useEffect(() => {
    init();
    return () => {
      processTimer.current && clearInterval(processTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const init = async () => {
    if (!id) return;
    // if (id.startsWith("example_")) {
    //   // 测试数据
    //   const example = await getExampleById(id + "");
    //   setCurrent(example);
    //   if (!example) {
    //     navigate("/");
    //     return;
    //   }
    //   setCodeStr(example.code_str);
    //   const urls = example.file_url.split("/");
    //   setFileInfo({
    //     hash: example.hash,
    //     report_type:
    //       (example.code_str.startsWith("Ox") ? "Binary" : "Source Code") +
    //       "Analysis Report",

    //     contract_name: example.contract_name,
    //     file: {
    //       name: urls[urls.length - 1],
    //       size: example.size,
    //     },
    //     result: null,
    //     file_type: example.code_str.startsWith("Ox") ? 2 : 1, // 1: Source Code 2: ByteCode
    //     create: example.create,
    //     id: example.id,
    //   });
    //   // example.result_id = window.sessionStorage.getItem(id);
    //   toAnaly(example);
    //   console.log("example", example);
    //   setCardInfo({
    //     file_name: example.file.name,
    //     create: example.create,
    //     sourceType: example.source_type ? typeMap[example.source_type ] : example.code_str.startsWith("Ox")
    //       ? "ByteCode"
    //       : "Source Code",
    //     issues: 0,
    //     version: example?.version || "",
    //     contract_name: example.contract_name,
    //     function_signature: example.function_signature || "",
    //     owner_address: example.owner_address || "",
    //     send_funcs: example.send_funcs || "",
    //     receive_funcs: example.receive_funcs || "",
    //     events: example.events || "",
    //     send_stores: example.send_stores || "",
    //     check: example.check || "",
    //     hash: example.hash
    //   });
    // } else {
    const scan = await getScanById(Number(id));

    if (!scan|| !scan.file) {
      navigate("/");
      return;
    }
    console.log("scan", scan);
    setCurrent(scan);
    if (!scan.result) {
      toAnaly(scan);
    } else {
      setResult(scan.result);
      setStatus(scan.status);
    }
    if (scan.example_path) {
      getSolidityDemo(scan.example_path).then((res: any) => {
        setCodeStr(res.data);
      });
    }else {
      if (scan.file) {
        readFile(scan.file).then((res) => {
          setCodeStr(res);
        });
      }
    }

    setFileInfo({
      report_type:
        (codeStr.startsWith("Ox") ? "Binary" : "Source Code") +
        "Analysis Report",

      contract_name: scan.contract_name,
      file: {
        name: scan.file.name,
        size: scan.file.size,
      },
      hash: scan.hash,
      result: null,
      file_type: codeStr.startsWith("Ox") ? 2 : 1, // 1: Source Code 2: ByteCode
      create: scan.create,
      id: scan.id,
    });
    setCardInfo({
      file_name: scan.file.name,
      create: scan.create,
      sourceType: scan.source_type ? typeMap[scan.source_type] : "Source Code",
      issues:
        scan.status === 1 && scan.result
          ? scan.result.result.results.detectors.length
          : 0,
      version: scan?.version || "",
      contract_name: scan.contract_name,
      function_signature: scan.function_signature || "",
      owner_address: scan.owner_address || "",
      send_funcs: scan.send_funcs || "",
      receive_funcs: scan.receive_funcs || "",
      events: scan.events || "",
      send_stores: scan.send_stores || "",
      check: scan.check || "",
      hash: scan.hash,
    });
    // }
  };
  const toAnaly = (data: any) => {
    setLoading(true);
    processTimer.current = getProcess((value) => {
      setProcess(value);
    });
    if (data.result_id) {
      asyncAnalyResult(data.result_id);

      return;
    }
    const formData = new FormData();
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    formData.append("file", data.file);
    formData.append("contract_name", data.contract_name);
    formData.append("solc_version", data.version);
    formData.append("send_funcs", data.send_funcs);
    formData.append("receive_funcs", data.receive_funcs);
    formData.append("events", data.events);
    formData.append("send_stores", data.send_stores);
    formData.append("check", data.check);
    analyze(formData).then(([res, error]) => {
      if (error) {
        setLoading(false);
        return;
      }
      setResultHash(res.request_id);
      current.result_id = res.request_id;

      if (id && id.startsWith("example_")) {
        window.sessionStorage.setItem(id, res.request_id);
      }
      if (id && !id.startsWith("example_")) {
        updateScanById(Number(id), current);
      }
      asyncAnalyResult(res.request_id);
    });
  };

  const timer = useRef<any>(null);
  const asyncAnalyResult = async (hash: string) => {
    const [res, error] = await getAnalyResult(hash);
    console.log("error", error, res);
    if (error) {
      setLoading(false);
      if (error.error) {
        setStatus(0);
        setResult(error);
        setProcess(100);
        processTimer.current && clearInterval(processTimer.current);
        if (id && !id.startsWith("example_")) {
          // demo 不用存在缓存
          current.result = error;
          current.status = 0;
          updateScanById(Number(id), current);
        }
      }
      return;
    }

    if (res.passed) {
      // nobug
      setStatus(2);
      setResult(res);
      setProcess(100);
      processTimer.current && clearInterval(processTimer.current);
      if (id && !id.startsWith("example_")) {
        // demo 不用存在缓存
        current.result = res;
        current.status = 2;
        updateScanById(Number(id), current);
      }
      setLoading(false);
    } else {
      if (res.result && res.result.success) {
        //  success

        setStatus(1);
        setResult(res);
        setProcess(100);
        processTimer.current && clearInterval(processTimer.current);
        if (id && !id.startsWith("example_")) {
          // demo 不用存在缓存
          console.log("更新scan", current);
          updateScanById(Number(id), {
            result: res,
            status: 1,
          } as any);
        }
        setLoading(false);
        return;
      }
      if (res.error) {
        setLoading(false);

        setStatus(0);
        setResult(res);
        setProcess(100);
        processTimer.current && clearInterval(processTimer.current);
        if (id && !id.startsWith("example_")) {
          // demo 不用存在缓存
          current.result = res;
          current.status = 0;
          updateScanById(Number(id), current);
        }
        return;
      }
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => {
        asyncAnalyResult(hash);
      }, 500);
    }
  };

  return (
    <Wrapper>
      <Card
        info={cardInfo}
        loading={loading}
        result={result}
        status={status}
        contractInfo={current}
      />
      <div
        style={{
          gridTemplateColumns: "30% 68%",
          columnGap: "2%",
          marginTop: "24px",
          minHeight: "calc(100vh - 400px)",
          display: "grid",
        }}
      >
        <Aside
          info={status === 1 ? result.result.results : {}}
          status={status}
          index={index}
          loading={loading}
          process={process}
          onClick={(index) => {
            setIndex(index);
          }}
        />
        <Content
          data={codeStr}
          loading={loading}
          result={result}
          status={status}
          index={index}
          contractInfo={current}
        />
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div``;
