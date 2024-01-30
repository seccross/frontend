import { useEffect, useRef } from "react"
import lottie from 'lottie-web'
import hb from '../asset/icon/loading.json'

export default function Loading(props:any) {
  const ani:any = useRef()
  useEffect(() => {
    if(!ani.current) return
    lottie.loadAnimation({
      container: ani.current, //选择渲染dom
      renderer: "svg", //渲染格式
      loop: true, //循环播放
      autoplay: true, //是否i自动播放,
      animationData: hb, //渲染动效json
    });

  },[])
  return <div ref={ani} {...props}></div>
}