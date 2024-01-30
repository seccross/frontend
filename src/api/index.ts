import axios from 'axios'
const baseUrl =' https://api.xguard.sh'  //https://api.tsniffer.net
const instance = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? '' : baseUrl,
  headers: {
    'Accept': '*/*',
    // 'Content-Type': 'application/x-www-form-urlencoded' 
  }
})

instance.interceptors.response.use((response) => {
  return response.data
}, (e) => Promise.reject(e))

type AnalyzeProps = {
  type: 'Go' | 'Solidity',
  test_type: 'function_verify' | 'known_debug',
  name: string,
  code: string
}
export async function analyze(data: FormData): Promise<[any, any]> {
  let error;
  const res = await instance({
    url: '/analyze',
    method: 'post',
    data
  }).catch(e => { error = e.response.data })
  return [res, error]
}

export async function getAnalyResult(hash: string): Promise<[any, any]> {
  let error;
  const res = await instance({
    url: '/result/' + hash,
    method: 'get',

  }).catch(e => { error = e.response.data })
  return [res, error]
}