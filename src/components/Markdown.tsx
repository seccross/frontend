import ReactMarkdown from 'react-markdown'
import styled from 'styled-components'
export default function Markdown ({data}:{data:string}){
   return <Wrapper>
    <ReactMarkdown>{data}</ReactMarkdown>
   </Wrapper>
}

const Wrapper = styled.div`
font-size: 1.6rem;
background-color: #fbfbfb;
border-radius: 10px;
padding: 20px;
padding-left: 35px;
line-height: 2;

`