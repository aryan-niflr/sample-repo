# sample-repo

Steps to stream a video using rtmp server url:
1. Open terminal 
2. ffmpeg -re -i "test.mp4" -c copy -f flv rtmp://{rtmpServerUrl}/live/test


Steps to start the app:
1. npm i
2. npm run start

First start streaming the video usinf the ffmpeg command. Then start the node application.

Expectation:
The live stream must be appended to the blob storage until the stream stops.
