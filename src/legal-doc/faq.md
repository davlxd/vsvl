## FAQ

#### Why I can't open downloaded mp4 files?

The downloaded mp4 files are constructed directly from a stream of images, lacking some metadata, that's why some video players have problems opening the files, however [VLC](https://www.videolan.org) works fine (without jumping back and forth while playing) and so does Chrome & Opera browsers.

To attach metadata and complete the mp4 files, you can use [FFmpeg](https://www.ffmpeg.org/)

`ffmpeg -i input.mp4 -c copy output.mp4`


<br />

#### How to contact you?

[contact us](mailto:contact@videosurveillance.webcam)

