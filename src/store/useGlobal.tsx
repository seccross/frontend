import { createContext, useContext } from "react";

type ContentProps = {
  setUploadFile: (file:File) => void,
  uploadFile: File,
  getFileById: (id:number) => Promise<File>,
  saveFile: (file:File) =>  Promise<any>
}
export const GlobalContext = createContext({} as ContentProps)

export default function useGlobal() {
  return useContext(GlobalContext)
}