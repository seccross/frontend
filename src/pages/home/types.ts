export enum Status  {
  Successful,
  Faild
}
export type ScanTableItem = {
  id:number,
  name:string,
  total: number,
  unconfirmed: 0|1,
  status:  0 | 1,

  create: number
} 

export type ExampleTableItem = {
  id:number,
  name: string,
  description: string,
  bugs: number,
  fileType: string,
  create: number,
}