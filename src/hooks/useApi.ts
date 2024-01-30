import exampleData, { ExampleProps } from "../api/example"
import { getSolidityDemo } from "../utils/readFile"
import useIndexDB from "./useIndexDB"

export type AnalyResult = {
  info: string[],
  linenumber: (number[] | string[])[]
  type: string,
  result: string[]
} | null
export type ScanProps = {
  hash: string,
  id?: number
  contract_name: string,
  description: string,
  result: any,
  result_id?: string,
  status: 0 | 1 | 2 | -1,  // 0: 未scan， 1: successful 2: failed
  create: number,
  file_id?: number,
  file?: File,
  owner_address?: string;
  function_signature?: string;
  version?: string;
  source_type?: number;
  send_funcs?: string;
  receive_funcs?: string;
  events?: string;
  send_stores?: string;
  check?: string;
  example_path?:string
}
export default function useApi() {
  const { saveFile, setDBItem, getDBItem, getAllStoreData, deleteDBItem } = useIndexDB()
  const createScan = async (file: File) => {
    const fileId = await saveFile(file)
    const scanId = await setDBItem({
      contract_name: file.name.split('.')[0],
      description: '',
      result: null,
      status: 0,
      create: Date.now(),
      file_id: fileId,
    }, 'scan')
    console.log('scanId', scanId)
    // getScanById(scanId)
    return scanId
  }
  const createScanByExamplePath = async (data:ScanProps) => {
    const scanId = await setDBItem(data, 'scan')

    return scanId
  }
  const getScanById = async (id: number) => {
    const scan: ScanProps | null = await getDBItem(id, 'scan')
    if (scan?.file_id) {
      const file: File = await getDBItem(scan.file_id, 'file')
      if (file) {
        scan.file = file
      }
    }
    return scan
  }

  const getScans = async () => {
    const scans: ScanProps[] = await getAllStoreData('scan')
    console.log('scans', scans)
    const pms: Promise<any>[] = []
    scans.forEach(async scan => {
      if (scan?.file_id) {
        pms.push(getDBItem(scan.file_id, 'file'))
      }
    });
    return Promise.allSettled(pms).then(res => {
      res.forEach((e, i) => {
        if (e.status === 'fulfilled') {
          const scan = scans[i]
          if (scan) {
            scan.file = e.value
          }
        }
      })
      return scans.reverse()
    })
  }
  const updateScanById = async (id: number, scan: ScanProps) => {

    const scanOri = await getScanById(id)
    console.log('updateScanById', id, scanOri, scan)
    return setDBItem({ ...scanOri, ...scan }, 'scan')
  }

  const getExampleById = async (id: string) => {
    // let storage = window.localStorage.getItem('solidity_examples')
    // const examples: ExampleProps[] = storage ? JSON.parse(storage) : exampleData
    const examples = exampleData
    const example = examples.find((e: ExampleProps) => ('example_' + e.id) === id);
    if (!example) return
    const codeRes = await getSolidityDemo(example.file_url);
    const urls = example.file_url.split('/')
    const blob: any = new Blob([codeRes.data], {
      type: 'text/plain;charset=utf-8'
    })
    const file = new File([blob], urls[urls.length - 1])
    return {
      ...example,
      code_str: codeRes.data,
      file: file,
    }
  }
  const updateExampleById = async (id: string, info: ExampleProps) => {
    let storage = window.localStorage.getItem('solidity_examples')
    const examples: ExampleProps[] = storage ? JSON.parse(storage) : exampleData
    const index = examples.findIndex((e: ExampleProps) => ('example_' + e.id) === id);
    examples.splice(index, 1, info)
    window.localStorage.setItem('solidity_examples', JSON.stringify(examples))
  }

  const deleteScanById = (id: number) => {
    return deleteDBItem(id, 'scan')
  }
  return {
    createScan,
    getScanById,
    getScans,
    getExampleById,
    createScanByExamplePath,
    updateExampleById,
    updateScanById,
    deleteScanById
  }
}