## FAQ

#### Why I can't use this Web App in my browser

This Web App uses several late Web technologies that haven't been supported by every browser. If you are using Safari or Edge then that's the case. Internet Explorer is not considered at all.

And with iOS, thrid party browsers (Chrome, firefox) cannot access device Camera, blame Apple.


#### What does it mean by _saving raw video files_

Raw video files are mp4 files constructed directly from a stream of images, lacking some metadata, and most of video players won't be able to open them, except for [VLC](https://www.videolan.org) and Chrome browser. To complete the mp4 files and make them ready for most of the video players, you can use [FFmpeg](https://www.ffmpeg.org/) command line tool `ffmpeg -i input.mp4 output.mp4`.

If you are familiar with command line utility and tend to perform video encoding/decoding by yourself, you can check _saving raw video files_ and those video files will be presented to you immediately as is. Otherwise you just leave it uncheck and this Web App will do this for you, although it may take some time, you can find progress circulars at the bottom right corner.


#### How to contact you?

[contact us](mailto:contact@videosurveillance.webcam)
