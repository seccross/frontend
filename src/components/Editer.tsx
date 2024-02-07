import styled from "styled-components";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-markdown";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-cloud9_day";
import "ace-builds/src-noconflict/ext-language_tools";
import { useEffect, useRef } from "react";

export default function Editer({
  data,
  onChange = (value) => {},
  readOnly = false,
  annotations,
  markers,
  style,
  mode = "javascript",
  name,
  showLineNumbers = true,
}: {
  data: string;
  onChange?: (e: string) => void;
  readOnly?: boolean;
  annotations?: any[];
  markers?: any[];
  mode?: string;
  name?: string;
  showLineNumbers?: boolean;
  style?: { [key: string]: string };
}) {
  const editerRef = useRef<any>(null);
  const timer = useRef<any>(null)
  useEffect(() => {
    if (editerRef.current && markers?.length) {
      console.log("markers ===>", markers, editerRef.current.gotoLine);
      timer.current  && clearTimeout(timer.current )
      timer.current = setTimeout(() => {
        editerRef.current.gotoLine(markers[0].startRow + 15);
      },300);
    }
    return () => {
      timer.current  && clearTimeout(timer.current )
    }
  }, [markers,data]);
  return (
    <Wrapper style={style}>
      <AceEditor
        style={{ width: "100%", height: "100%", borderRadius: "10px" }}
        placeholder="Placeholder Text"
        mode="javascript"
        theme="cloud9_day"
        name={name || "blah"}
        onLoad={(intance) => {
          editerRef.current = intance;
          console.log("intance", intance, markers);
          // editerRef.current.gotoLine(15);
          // const session:any = intance.getSession();
          // console.log('session',session)
          // session.$highlightLine( 280, "myHighlightClass");
        }}
        onChange={(e) => {
          console.log('onChange',e)
          onChange(e)
        }}
        fontSize={14}
        readOnly={readOnly}
        annotations={annotations}
        markers={markers}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        value={data}
        setOptions={{
          enableBasicAutocompletion: false,
          enableLiveAutocompletion: false,
          enableSnippets: true,
          useWorker: false, // 检查语法错误
          showLineNumbers: showLineNumbers,
          tabSize: 2,
        }}
      />
    </Wrapper>
  );
}
const Wrapper = styled.div`
  background-color: #fff;
  border-radius: 18px;
  padding: 5px;
  height: 100%;
`;
