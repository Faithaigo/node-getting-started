//Async code doesn't execute immediately 

const fetchData = callback =>{
    const promise = new Promise((res, reject)=>{
        console.log('yeey')
        setTimeout(()=>{
            res('Done')
        }, 1)
    })
    return promise
   
}


setTimeout(()=>{
console.log('timer is done')
fetchData().then(teext=>{
        console.log(teext)
        return fetchData()
    }).then(text2=>{
        console.log(text2)
    })
}, 1000)

console.log('Hello')
console.log('Hi')
