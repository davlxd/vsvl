## FAQ

#### What does it mean by _saving raw video files_

Raw video files are mp4 files constructed directly from a stream of images, lacking some metadata, and most of video players won't be able to open them, excpet for [VLC](https://www.videolan.org) and Chrome browser. To attach metadata and complete the mp4 files, you can use [FFmpeg](https://www.ffmpeg.org/) `ffmpeg -i input.mp4 output.mp4`.

If you uncheck _saving raw video files_, this Web App will use embeded FFmpeg to perform encoding for you, so the downloaded video clips will be ready for most of the video players, however, FFmpeg in browser is not very efficient, it may take a very long time to prepare even a pretty short video clip.


#### How to contact you?

[contact us](mailto:contact@videosurveillance.webcam)
