console.log(process.env)
const {BlobServiceClient} = require("@azure/storage-blob");
const { ClientSecretCredential } = require("@azure/identity");
const azure = require('azure-storage');
const ffmpeg = require('fluent-ffmpeg');
const {PassThrough} = require('stream')
const fs = require('fs')

const appID = process.env.AZURE_APP_ID 
const appSec = process.env.AZURE_APP_SEC 
const tenantID = process.env.AZURE_TENANT_ID 
const clientCred = new ClientSecretCredential(tenantID,appID,appSec)

const key=process.env.AZURE_ACCOUNT_KEY;
const blobService=azure.createBlobService(process.env.AZURE_ACCOUNT_NAME,key);

const blobServiceClient=new BlobServiceClient(
    `https://${process.env.AZURE_ACCOUNT_NAME}.blob.core.windows.net`,
    clientCred
  )

async function appendingFile(content, toBeAdded) {
    return new Promise((resolve, reject) => {
      let temp = content.concat(toBeAdded);
      console.log(temp);
      resolve(temp);
      reject(new Error("Error occurred"));
    });
  }

async function streamToBuffer(readableStream) {
return new Promise((resolve, reject) => {
    const chunks = [];
    readableStream.on("data", (data) => {
    chunks.push(data instanceof Buffer ? data : Buffer.from(data));
    });
    readableStream.on("end", () => {
    resolve(Buffer.concat(chunks));
    });
    readableStream.on("error", reject);
});
}

process.on('message',async(data) => {
    
    try {
        let { container, fileName, streamUrl } = data
        console.log('message from', data, container, fileName);
        console.log(`About to record the video...`, data)
        const callback = function(error, result, response){
            if(!error){
                console.log('No error');
                console.log("result",result)
                console.log("response",response)
            }else{
                console.error(error);
            }
          }; 
          
        ffmpeg(streamUrl)
        .addOptions([
            '-vcodec copy',
            '-acodec copy',
            '-movflags frag_keyframe+empty_moov',
            '-movflags +faststart'
        ])
        .toFormat('mp4')
        .on('error', function (err, stdout, stderr) {
            console.log(`Error during stream recording ${err.stack}`, JSON.stringify(stderr),
            JSON.stringify({
                payload: data
            }))
        })
        .pipe(blobService.createWriteStreamToNewAppendBlob(container, fileName, null, callback))

        /* .on('data', async function (chunk) {
            console.log(`Writing chunk of size ${chunk.length}`)
            let streaming = new PassThrough({
            highWaterMark: chunk.length
            });
            
            const res=await streamToBuffer(streaming);
            const append=await appendingFile(res,chunk);
            const blockBlobResponse= await blobServiceClient.getContainerClient(bucketOrContainer).getAppendBlobClient(fileName).appendBlock(append, append.length);
            console.log("blockBlobResponse",blockBlobResponse)
            console.log("res",res)
        })
        .on('end', function () {
            console.log('Finished processing');
        }) */
    }
    catch (err) {
        console.log(`Error during stream recording ${err.stack}`, JSON.stringify({
            payload: data
        }))
    }
})

process.on('SIGTERM', async () => {
    try {
        console.log(`Stream Recording Process with pid ${process.pid} about to die...`)
        
    } catch (e) {
        console.error(e);
    }
})