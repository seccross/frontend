import axios from 'axios'
import CryptoJS from 'crypto-js'
export default function readFile(file: File, onprogress?: (e: any) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()   // 新建一个FileReader
    reader.readAsText(file, 'UTF-8')  // 读取文件
    reader.onload = function (evt) {  // 读取完文件之后会回来这里 这是个异步
      const fileString = evt.target?.result?.toString()  // 读取文件内容
      fileString ? resolve(fileString) : reject(evt)
    }
    reader.onprogress = function (e) {
      onprogress && onprogress(e)
    }
  })
}

export function getSolidityDemo(url = '/RunbitWallet.sol') {
  return axios({
    method: 'get',
    url
  })
}

export function fileToBlob(file: File): Promise<string | Blob | null | undefined> {
  // 创建 FileReader 对象
  let reader = new FileReader();
  return new Promise(resolve => {
    // FileReader 添加 load 事件
    reader.addEventListener('load', (e) => {
      let blob;
      if (typeof e.target?.result === 'object' && e.target.result) {
        blob = new Blob([e.target.result])
      } else {
        blob = e.target?.result
      }
      // console.log(Object.prototype.toString.call(blob));
      resolve(blob)
    })
    // FileReader 以 ArrayBuffer 格式 读取 File 对象中数据
    reader.readAsArrayBuffer(file)
  })
}

export function convertFileSize(sizeInBytes: number) {
  var units = ['B', 'KiB', 'MiB', 'GiB']; // 定义可能使用到的单位数组

  for (var i = 0; sizeInBytes >= 1024 && i < units.length - 1; i++) {
    sizeInBytes /= 1024; // 除以 1024 来进行单位转换
  }

  return Math.round(sizeInBytes * 100) / 100 + " " + units[i]; // 返回结果并添加相应的单位后缀
}



export function createfileHash(fileStr: string) {
  return CryptoJS.SHA256(fileStr).toString()
}