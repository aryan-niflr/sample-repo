const {fork} = require('child_process')
require('dotenv').config();

const startRecording = async (req, res) => {
    try {
      const { container, fileName, streamUrl } = req.body
      const worker = fork('./record.js')
      worker.send({ container, fileName, streamUrl })
  
      return {
        message: 'Started recording',
        pid: worker.pid
        }
    } catch (error) {
        return { error: error.message }
    }
}
startRecording({body:{container:process.env.AZURE_CONTAINER_NAME,fileName:process.env.fileName,streamUrl:process.env.rtmpServerUrl}})
.then((res)=>{
    console.log(res)
})
.catch((err)=>{
    console.log(err)
})
