export const request=(params)=>{

  // 定义公共的url
  const baseUrl="http://api.ddup.cn:8010/service";
  return new Promise((resolve,reject)=>{
    wx.request({
     ...params,
     url:baseUrl+params.url,
     success:(result)=>{
       resolve(result.data);
     },
     fail:(err)=>{
       reject(err);
     }
    });
  })
}