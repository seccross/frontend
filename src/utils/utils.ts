
export function getProcess(cb:(value:number) => void) {
  let start = 0
  const interval =   setInterval(() => {
    start += 1
    if(start >= 99){
      clearInterval(interval)
    }
    cb(start)
  },500)
  return interval
}

export const statusMap:{ [key:number]: string}= {
  0:'error',
  1: 'successful',
  2: 'successful'  // no bug
}