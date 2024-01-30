import React, { useState } from "react";
import { GlobalContext } from "./useGlobal";
import useIndexDB from "../hooks/useIndexDB";
import readFile from "../utils/readFile";

export default function GlobalProvider({children}:React.PropsWithChildren) {
  const {getDBItem,saveFile} = useIndexDB()
  const [uploadFile,setUploadFile] = useState<File>({} as File)

  const getFileById = async (id:number) => {
     return await getDBItem(id, "file").then(async ({ id, file }: any) => {
      setUploadFile(file);
      return file
    });
  }
  return <GlobalContext.Provider value={{
    uploadFile,
    setUploadFile,
    getFileById,
    saveFile
  }}>{
    children}</GlobalContext.Provider>
}