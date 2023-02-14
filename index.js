const {fork} = require('child_process')

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

startRecording({body:{container:"test",fileName:"test.mp4",streamUrl:"example.com"}})
.then((res)=>{
    console.log(res)
})
.catch((err)=>{
    console.log(err)
})
