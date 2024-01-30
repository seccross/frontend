import styled from "styled-components";
import FileInfo, { InfoProps } from "./components/FileInfo";
import Editer from "../../components/Editer";
import { useNavigate, useParams } from "react-router-dom";
import { ChangeEvent, useEffect, useState } from "react";
import readFile, { createfileHash } from "../../utils/readFile";
// import useGlobal from "../../store/useGlobal";

import useApi from "../../hooks/useApi";
// import exampleData from "../../api/example";
export default function ScanPage() {
  const navigate = useNavigate();
  const { getExampleById, getScanById, updateExampleById,createScanByExamplePath, updateScanById } =
    useApi();
  const { id } = useParams();
  const [codeStr, setCodeStr] = useState<string>("");
  const [check, setCheck] = useState<string[]>(["T1","T2","T3"]);
  const [current, setCurrent] = useState<any>({});
  const [info, setInfo] = useState<InfoProps>({
    version: "",
  } as InfoProps);
  const [process, setProcess] = useState<number>(0);
  const [hash, setHash] = useState<string>("");

  useEffect(() => {
    init();
  }, [id]);
  useEffect(() => {
    if (codeStr) {
      if (!current.hash) {
        const hash = createfileHash(codeStr);
        console.log("hash", hash);
        setHash(hash);
      } else {
        setHash(current.hash);
      }
    }
  }, [codeStr, current]);
  const init = async () => {
    if (!id) return;
    if (id.startsWith("example_")) {
      // 测试数据
      const example = await getExampleById(id + "");
      setCurrent(example);
      if (!example) {
        navigate("/");
        return;
      }
      console.log('example',example)
      setCodeStr(example.code_str);

      const urls = example.file_url.split("/");
      setInfo({
        name: urls[urls.length - 1],
        contract_name: example.contract_name,
        size: example.size,
        owner_address: example.owner_address || "",
        function_signature: example.function_signature || "",
        version: example.version || "0.8.12",
        send_funcs: example.send_funcs || "deposit(uint8,bytes32,bytes);depositETH(uint8,bytes32,bytes)",
        receive_funcs: example.receive_funcs || "executeProposal(uint8,uint64,bytes,bytes32)",
        events: example.events || "Deposit",
        send_stores: example.send_stores || "balanceOf",
      });
      setCheck((example.check || '').split(','))
      console.log("info", example.version || "0.8.12",(example.check || '').split(','));
      setProcess(100);
    } else {
      const scan = await getScanById(Number(id));
      console.log('scan', scan)
      if (!scan?.file) {
        navigate("/");
        return;
      }
      setInfo({
        name: scan.file.name,
        contract_name: scan.contract_name,
        size: scan.file.size,
        owner_address: scan.owner_address || "",
        function_signature: scan.function_signature || "",
        version: scan.version || "0.8.12",
        send_funcs: scan.send_funcs || "deposit(uint8,bytes32,bytes);depositETH(uint8,bytes32,bytes)",
        receive_funcs: scan.receive_funcs || "executeProposal(uint8,uint64,bytes,bytes32)",
        events: scan.events || "Deposit",
        send_stores: scan.send_stores || "balanceOf",
      });
      readFile(scan.file, ({ loaded, total }) => {
        setProcess(Math.ceil((loaded / total) * 100));
      }).then((res) => {
        setCodeStr(res);
      });
    }
  };
  const onChangeCheckbox = (e:ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const checked = e.target.checked
    console.log('value',value,check)
    let res = [...check]
    if(checked) {
      res.push(value)
    }else {
      res = res.filter(e => e !== value)
    }
    setCheck(res)
  }
  return (
    <Wrapper>
      <FileInfo
        info={info}
        process={process}
        onConfrim={async () => {
          if (process !== 100) return;
          console.log("info", info, check);

          if (
            !info.send_funcs ||
            !info.receive_funcs ||
            !info.events||
            !info.send_funcs
          ) {
            return;
          }
          
          let scanId:any = id
          if (id?.startsWith("example_")) {
            scanId = await createScanByExamplePath({
              description: '',
              result: null,
              status: -1,
              create: Date.now(),
              hash,
              file:current.file,
              example_path: current.file_url,
              contract_name: info.contract_name,
              owner_address: info.owner_address,
              function_signature: info.function_signature,
              send_funcs: info.send_funcs,
              receive_funcs: info.receive_funcs,
              events: info.events,
              send_stores: info.send_stores,
              version: info.version,
              source_type: codeStr.startsWith("Ox") ? 2 : 1,
              check: check.join(',')
            });
          } else {
            await updateScanById(Number(id), {
              ...current,
              contract_name: info.contract_name,
              hash,
              owner_address: info.owner_address,
              function_signature: info.function_signature,
              version: info.version,
              send_funcs: info.send_funcs,
              receive_funcs: info.receive_funcs,
              events: info.events,
              send_stores: info.send_stores,
              source_type: codeStr.startsWith("Ox") ? 2 : 1,
              check: check.join(',')
            });
          }

          navigate("/analy/" + scanId, { replace: true });
        }}
        onChange={(value, prop) => {
          setInfo({
            ...info,
            [prop]: value,
          });
        }}
      />
      <div className="content" style={{ display: "flex", flexDirection: "column" }}>
        <Editer data={codeStr} readOnly={true} />
        <div className="checkboxGroup">
          <label>
            <input name="check" type="checkbox" value="T1" checked={check.includes('T1')} onChange={onChangeCheckbox}/> T1 Crosschain
            events check
          </label>
          <label>
            <input name="check" type="checkbox" value="T2" checked={check.includes('T2')}  onChange={onChangeCheckbox}/> T2 Crosschain data
            check
          </label>
          <label>
            <input name="check" type="checkbox" value="T3" checked={check.includes('T3')}  onChange={onChangeCheckbox}/> T3 Crosschain
            externel check
          </label>
        </div>
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: grid;
  height: calc(100vh - 145px);
  min-height: 650px;
  grid-template-columns: 40% 58%;
  column-gap: 2%;
  margin-top:20px;
  grid-template-rows: auto;
  text-align: left;
  .content {
    display: flex;
    flex-direction: column;
    .checkboxGroup {
      margin-top: 20px;
      label {
        margin-right: 20px;
      }
    }
  }
`;
