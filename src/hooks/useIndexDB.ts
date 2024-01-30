import { useRef } from 'react'
import { fileToBlob } from '../utils/readFile'
type Props = {
  dbname?: string,
  version?: number
}
export default function useIndexDB() {
  const dbname = "solidity"
  const version = 1

  const windowindexedDB = window.indexedDB

  const indexDB = useRef<any>();
  const initDb = () => {
    return new Promise((resolve, reject) => {
      // console.log('打开数据库')
      const request = windowindexedDB.open(dbname, version);

      request.onsuccess = function (event) {
        // 监听数据库创建成功事件
        indexDB.current = (event.target as any)?.result; // 数据库对象
        // console.log(indexDB.current);
        console.log("数据库打开成功");
        resolve('success');
      };
      request.onerror = function (error) {
        console.log("数据库打开报错");
        reject(error);
      };

      request.onupgradeneeded = function (event) {
        // 数据库创建或升级的时候会触发
        console.log("数据库创建或升级");
        const db = (event.target as any)?.result;

        // 文件
        if (!db.objectStoreNames.contains('file')) {
          // 判断表是否存在
          let objectStore = db.createObjectStore('file', {
            keyPath: "id",
            autoIncrement: true,
          });
          objectStore.createIndex("id", "id", { unique: true }); // 创建索引 可以让你搜索任意字段
          //objectStore.deleteIndex("indexName");删除索引
        }
        if (!db.objectStoreNames.contains('example')) {

          let objectStore = db.createObjectStore('example', {
            keyPath: "id",
            autoIncrement: true,
          });
          objectStore.createIndex("id", "id", { unique: true });
        }
        if (!db.objectStoreNames.contains('scan')) {
          // 判断表是否存在
          let objectStore = db.createObjectStore('scan', {
            keyPath: "id",
            autoIncrement: true,
          });
          objectStore.createIndex("id", "id", { unique: true });
        }
      };
    });
  };
  const setDBItem = (value: any, storeName: string): Promise<number> => {
    return new Promise(async (resolve, reject) => {
      if (!indexDB.current) {
        await initDb();
      }
      if (!value || !storeName) return;
      // 创建事务对象
      const transaction = indexDB.current.transaction(storeName, "readwrite");
      // 添加仓库对象
      const store = transaction.objectStore(storeName);
      // 添加数据 .put(修改/没有的话新增) / add（新增）
      const request = store.put(value);
      request.onsuccess = function (e: any) {
        console.info("添加数据成功");
        resolve(e.target.result);
      };
      request.onerror = function (e: any) {
        console.info("添加数据失败");
        reject(e);
      };
    });
  };
  const getDBItem = <T>(key: number, storeName: string): Promise<T> => {
    return new Promise(async (resolve, reject) => {
      if (!indexDB.current) {
        await initDb();
      }
      // this.indexDB创建数据库时候存下的数据库对象
      // itemName是存储的key
      // newValue是存储的value
      const transaction = indexDB.current.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.get(key);
      request.onsuccess = function (e: any) {
        // console.info("获取数据成功", e.target);
        resolve(e.target.result);
      };
      request.onerror = function (e: any) {
        console.info("获取数据失败");
        reject(e);
      };
    });
  };
  const deleteDBItem = ( key: number, storeName: string ) => {
    return new Promise(async (resolve, reject) => {
      if (!indexDB.current) {
        await initDb();
      }
      const transaction = indexDB.current.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);
      request.onsuccess = function (e: any) {
        resolve('success');
      };
      request.onerror = function (e: any) {
        console.info("数据删除失败");
        reject(e);
      };
    });
  };

  const closeDB = () => {
    indexDB.current && indexDB.current.close();
    console.log("数据库已关闭");
  };

  const saveFile = (file: File) => {
    return new Promise(async (resolve, reject) => {
      if (!file) return
      if (!indexDB.current) {
        await initDb();
      }
      const transaction = indexDB.current.transaction('file', "readwrite");
      const store = transaction.objectStore('file');
      const request = store.put(file);
      request.onsuccess = function (e: any) {
        console.info("添加数据成功");
        resolve(e.target.result);
      };
      request.onerror = function (e: any) {
        console.info("添加数据失败");
        reject(e);
      };
    })
  }
  const getAllStoreData = <T>(storeName: string): Promise<T[]>=> {
    return new Promise(async (resolve, reject) => {
      if (!storeName) return
      if (!indexDB.current) {
        await initDb();
      }
      const transaction = indexDB.current.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      request.onsuccess = function (e: any) {
        console.log(storeName, e.target)
        resolve(e.target.result);
      };
      request.onerror = function (e: any) {
        console.info("获取数据失败");
        reject(e);
      };
    })
  }

  return {
    getDBItem,
    getAllStoreData,
    setDBItem,
    deleteDBItem,
    closeDB,
    saveFile
  }
}

function guid() {
  return Math.floor(Math.random() * Math.pow(10, 6))
}