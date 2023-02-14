# sample-repo

Steps to stream a video using rtmp server url:
1. Open terminal 
2. mkdir nms
3. cd nms
4. npm install node-media-server
5. vi app.js
6. Copy the following code in app.js:
   const NodeMediaServer = require('node-media-server');

    const config = {
    rtmp: {
        port: 1935,
        chunk_size: 60000,
        gop_cache: true,
        ping: 30,
        ping_timeout: 60
    },
    http: {
        port: 8000,
        allow_origin: '*'
    }
    };

    var nms = new NodeMediaServer(config)
    nms.run();
6. Run: node app.js
7. Open a new terminal
8. cd sample-repo 
9. Type the following command:
  ffmpeg -re -i "test.mp4" -c copy -f flv rtmp://localhost:1935/live/test.mp4


Steps to start the app:
1. Update all the env variables in you local env file. 
2. npm i
3. npm run start


First start streaming the video using the ffmpeg command. Then start the node application.

Expectation:
The live stream must be appended to the blob storage until the stream stops.
