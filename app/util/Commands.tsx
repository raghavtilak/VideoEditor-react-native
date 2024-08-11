import RNFS from 'react-native-fs';
import {FFmpegKit, ReturnCode} from 'ffmpeg-kit-react-native';
import {
  convertSecondstoTime,
  getFileExtension,
  getFileNameFromTime,
  notifyMessage,
} from './Util';
import FFmpegWrapper from './FFmpegWrapper';
import {CommandProps, CropProps, FlipProps, OverlayProps, RotateProps, TextOverlayProps} from './Types';
import {overlayImageDefaultDimensions} from '../../App';

export const fastForward = ({
  setCurrentVideoInfo,
  currentVideoInfo,
  setLoading,
  cacheVideoPath,
  seekbarValue,
  setFrames,
}: CommandProps) => {
  if (currentVideoInfo === undefined || currentVideoInfo.path === '') {
    notifyMessage('Select a video');
    return;
  }

  setLoading({progress: 0.0, isLoading: true, message: 'Applying Filters..'});

  const resultVideoPath =
    RNFS.CachesDirectoryPath +
    '/' +
    getFileNameFromTime() +
    getFileExtension(cacheVideoPath.current);
  const ffmpegCommand =
    '-y -i ' +
    cacheVideoPath.current +
    ' -filter_complex [0:v]trim=0:' +
    seekbarValue[0] +
    ',setpts=PTS-STARTPTS[v1];[0:v]trim=' +
    seekbarValue[0] +
    ':' +
    seekbarValue[1] +
    ',setpts=0.5*(PTS-STARTPTS)[v2];[0:v]trim=' +
    seekbarValue[1] +
    ',setpts=PTS-STARTPTS[v3];[0:a]atrim=0:' +
    seekbarValue[0] +
    ',asetpts=PTS-STARTPTS[a1];[0:a]atrim=' +
    seekbarValue[0] +
    ':' +
    seekbarValue[1] +
    ',asetpts=PTS-STARTPTS,atempo=2[a2];[0:a]atrim=' +
    seekbarValue[1] +
    ',asetpts=PTS-STARTPTS[a3];[v1][a1][v2][a2][v3][a3]concat=n=3:v=1:a=1 -b:v 2097k -vcodec mpeg4 -crf 0 -preset superfast ' +
    resultVideoPath;
  console.log('FFMPEG CMD=', ffmpegCommand);

  let finalVideoTime = 0;

  FFmpegKit.executeAsync(
    ffmpegCommand,
    session => {
      session.getReturnCode().then(ret => {
        if (ret.isValueSuccess()) {
          console.log('SUCCESS!!', resultVideoPath);

          updateVideoTimelineFrames(
            setLoading,
            cacheVideoPath,
            setFrames,
            finalVideoTime,
            () => {
              setLoading({progress: 0.0, isLoading: false, message: ''});
              setCurrentVideoInfo(prev => ({
                ...prev,
                duration: finalVideoTime,
                path: resultVideoPath,
              }));
              cacheVideoPath.current = resultVideoPath;
            },
          );
        } else if (ret.isValueError()) {
          // ERROR
          console.log('FAIL!!');
          session.getOutput().then(logs => {
            console.log(logs);
          });
          setLoading({progress: 0.0, isLoading: false, message: ''});
          notifyMessage('Video processing failed');
        } else {
          // CANCEL
          console.log('CANCEL!!');
          setLoading({progress: 0.0, isLoading: false, message: ''});
          notifyMessage('Video processing cancelled');
        }
      });
    },
    log => {},
    stats => {
      const videoDuration =
        currentVideoInfo.duration - (seekbarValue[1] - seekbarValue[0]) / 2;

      console.log('TIME=', stats.getTime(), videoDuration);
      const timeInMilliseconds = stats.getTime() / 1000;
      if (timeInMilliseconds > 0) {
        let completePercentage = timeInMilliseconds / videoDuration;
        console.log('PROGRESS=', completePercentage);
        setLoading(prev => ({...prev, progress: completePercentage}));
      }

      finalVideoTime = stats.getTime() / 1000;
    },
  );
};

export const slowMotion = ({
  setCurrentVideoInfo,
  currentVideoInfo,
  setLoading,
  cacheVideoPath,
  seekbarValue,
  setFrames,
}: CommandProps) => {
  if (currentVideoInfo === undefined || currentVideoInfo.path === '') {
    notifyMessage('Select a video');
    return;
  }
  setLoading({progress: 0.0, isLoading: true, message: 'Applying Filters..'});

  const resultVideoPath =
    RNFS.CachesDirectoryPath +
    '/' +
    getFileNameFromTime() +
    getFileExtension(cacheVideoPath.current);
  const ffmpegCommand =
    '-y -i ' +
    cacheVideoPath.current +
    ' -filter_complex [0:v]trim=0:' +
    seekbarValue[0] +
    ',setpts=PTS-STARTPTS[v1];[0:v]trim=' +
    seekbarValue[0] +
    ':' +
    seekbarValue[1] +
    ',setpts=2*(PTS-STARTPTS)[v2];[0:v]trim=' +
    seekbarValue[1] +
    ',setpts=PTS-STARTPTS[v3];[0:a]atrim=0:' +
    seekbarValue[0] +
    ',asetpts=PTS-STARTPTS[a1];[0:a]atrim=' +
    seekbarValue[0] +
    ':' +
    seekbarValue[1] +
    ',asetpts=PTS-STARTPTS,atempo=0.5[a2];[0:a]atrim=' +
    seekbarValue[1] +
    ',asetpts=PTS-STARTPTS[a3];[v1][a1][v2][a2][v3][a3]concat=n=3:v=1:a=1 -b:v 2097k -vcodec mpeg4 -crf 0 -preset superfast ' +
    resultVideoPath;
  console.log('FFMPEG CMD=', ffmpegCommand);

  let finalVideoTime = 0;

  FFmpegKit.executeAsync(
    ffmpegCommand,
    session => {
      session.getReturnCode().then(ret => {
        if (ret.isValueSuccess()) {
          console.log('SUCCESS!!', resultVideoPath);
          updateVideoTimelineFrames(
            setLoading,
            cacheVideoPath,
            setFrames,
            finalVideoTime,
            () => {
              setLoading({progress: 0.0, isLoading: false, message: ''});
              setCurrentVideoInfo(prev => ({
                ...prev,
                duration: finalVideoTime,
                path: resultVideoPath,
              }));
              cacheVideoPath.current = resultVideoPath;
            },
          );
        } else if (ret.isValueError()) {
          // ERROR
          console.log('FAIL!!');
          session.getOutput().then(logs => {
            console.log(logs);
          });
          setLoading({progress: 0.0, isLoading: false, message: ''});
          notifyMessage('Video processing failed');
        } else {
          // CANCEL
          console.log('CANCEL!!');
          setLoading({progress: 0.0, isLoading: false, message: ''});
          notifyMessage('Video processing cancelled');
        }
      });
    },
    log => {},
    stats => {
      const videoDuration =
        currentVideoInfo.duration + (seekbarValue[1] - seekbarValue[0]);

      console.log('TIME=', stats.getTime(), videoDuration);
      const timeInMilliseconds = stats.getTime() / 1000;
      if (timeInMilliseconds > 0) {
        let completePercentage = timeInMilliseconds / videoDuration;
        console.log('PROGRESS=', completePercentage);
        setLoading(prev => ({...prev, progress: completePercentage}));
      }

      finalVideoTime = stats.getTime() / 1000;
    },
  );
};

export const reverse = ({
  setCurrentVideoInfo,
  currentVideoInfo,
  setLoading,
  cacheVideoPath,
  seekbarValue,
  setFrames,
}: CommandProps) => {
  if (currentVideoInfo === undefined || currentVideoInfo.path === '') {
    notifyMessage('Select a video');
    return;
  }
  setLoading({progress: 0.0, isLoading: true, message: 'Applying Filters..'});

  const resultVideoPath =
    RNFS.CachesDirectoryPath +
    '/' +
    getFileNameFromTime() +
    getFileExtension(cacheVideoPath.current);
  const ffmpegCommand =
    '-y -i ' +
    cacheVideoPath.current +
    ' -filter_complex [0:v]trim=0:' +
    seekbarValue[1] +
    ',setpts=PTS-STARTPTS[v1];[0:v]trim=' +
    seekbarValue[0] +
    ':' +
    seekbarValue[1] +
    ',reverse,setpts=PTS-STARTPTS[v2];[0:v]trim=' +
    seekbarValue[0] +
    ',setpts=PTS-STARTPTS[v3];[v1][v2][v3]concat=n=3:v=1 -b:v 2097k -vcodec mpeg4 -crf 0 -preset superfast ' +
    resultVideoPath;

  console.log('FFMPEG CMD=', ffmpegCommand);

  let finalVideoTime = 0;

  FFmpegKit.executeAsync(
    ffmpegCommand,
    session => {
      session.getReturnCode().then(ret => {
        if (ret.isValueSuccess()) {
          console.log('SUCCESS!!', resultVideoPath);
          updateVideoTimelineFrames(
            setLoading,
            cacheVideoPath,
            setFrames,
            finalVideoTime,
            () => {
              setLoading({progress: 0.0, isLoading: false, message: ''});
              setCurrentVideoInfo(prev => ({
                ...prev,
                duration: finalVideoTime,
                path: resultVideoPath,
              }));
              cacheVideoPath.current = resultVideoPath;
            },
          );
        } else if (ret.isValueError()) {
          // ERROR
          console.log('FAIL!!');
          session.getOutput().then(logs => {
            console.log(logs);
          });
          setLoading({progress: 0.0, isLoading: false, message: ''});
          notifyMessage('Video processing failed');
        } else {
          // CANCEL
          console.log('CANCEL!!');
          setLoading({progress: 0.0, isLoading: false, message: ''});
          notifyMessage('Video processing cancelled');
        }
      });
    },
    log => {},
    stats => {
      const videoDuration =
        currentVideoInfo.duration + (seekbarValue[1] - seekbarValue[0]) * 3;

      console.log('TIME=', stats.getTime(), videoDuration);
      const timeInMilliseconds = stats.getTime() / 1000;
      if (timeInMilliseconds > 0) {
        let completePercentage = timeInMilliseconds / videoDuration;
        console.log('PROGRESS=', completePercentage);
        setLoading(prev => ({...prev, progress: completePercentage}));
      }

      finalVideoTime = stats.getTime() / 1000;
    },
  );
};

export const overlay = ({
  setCurrentVideoInfo,
  currentVideoInfo,
  setLoading,
  cacheVideoPath,
  seekbarValue,
  overlayImagesInfo,
  setFrames,
  setOverlayImagesInfo,
  videoPlayerDimensions,
}: CommandProps & OverlayProps) => {
  setLoading({progress: 0.0, isLoading: true, message: 'Applying Filters..'});

  //get Ratio

  const w = currentVideoInfo.width / videoPlayerDimensions.width;
  const h = currentVideoInfo.height / videoPlayerDimensions.height;

  console.log(
    'OVERLAY=',
    'W=',
    w,
    'H=',
    h,
    currentVideoInfo.width,
    currentVideoInfo.height,
    videoPlayerDimensions.width,
    videoPlayerDimensions.height,
  );

  const resultVideoPath =
    RNFS.CachesDirectoryPath +
    '/' +
    getFileNameFromTime() +
    getFileExtension(cacheVideoPath.current);
  let ffmpegCommand = '-y -i ' + cacheVideoPath.current;

  overlayImagesInfo.forEach((value, index) => {
    ffmpegCommand = ffmpegCommand + ' -i ' + value.filePath;
  });

  ffmpegCommand = ffmpegCommand + ' -filter_complex "';

  overlayImagesInfo.forEach((value, index) => {
    ffmpegCommand =
      ffmpegCommand +
      '[' +
      (index + 1) +
      ':v]scale=' +
      value.width * w +
      ':' +
      value.height * h +
      '[ovr' +
      (index + 1) +
      '];';
  });

  ffmpegCommand = ffmpegCommand + '[0]';

  overlayImagesInfo.forEach((value, index) => {
    if (index === 0) {
      ffmpegCommand =
        ffmpegCommand +
        '[ovr' +
        (index + 1) +
        ']overlay=x=' +
        value.x * w +
        ':y=' +
        value.y * h +
        ":enable='between(t," +
        seekbarValue[0] +
        ',' +
        seekbarValue[1] +
        ")'[v" +
        (index + 1) +
        '];';
    } else {
      ffmpegCommand =
        ffmpegCommand +
        '[v' +
        index +
        '][ovr' +
        (index + 1) +
        ']overlay=x=' +
        value.x * w +
        ':y=' +
        value.y * h +
        ":enable='between(t," +
        seekbarValue[0] +
        ',' +
        seekbarValue[1] +
        ")'[v" +
        (index + 1) +
        '];';
    }
  });

  //     "ffmpeg -i video -i image1 -i image2 -i image3
  //  -filter_complex
  //     "[0][1]overlay=x=X:y=Y:enable='between(t,23,27)'[v1];
  //      [v1][2]overlay=x=X:y=Y:enable='between(t,44,61)'[v2];
  //      [v2][3]overlay=x=X:y=Y:enable='gt(t,112)'[v3]"
  // -map "[v3]" -map 0:a  out.mp4"

  ffmpegCommand =
    ffmpegCommand +
    '" -map "[v' +
    overlayImagesInfo.length +
    ']" -map 0:a -b:v 2097k -vcodec mpeg4 -crf 0 -preset superfast ' +
    resultVideoPath;

  console.log('FFMPEG CMD=', ffmpegCommand);

  let finalVideoTime = 0;

  FFmpegKit.executeAsync(
    ffmpegCommand,
    session => {
      session.getReturnCode().then(ret => {
        if (ret.isValueSuccess()) {
          console.log('SUCCESS!!', resultVideoPath);
          updateVideoTimelineFrames(
            setLoading,
            cacheVideoPath,
            setFrames,
            finalVideoTime,
            () => {
              setLoading({progress: 0.0, isLoading: false, message: ''});
              setCurrentVideoInfo(prev => ({
                ...prev,
                duration: finalVideoTime,
                path: resultVideoPath,
              }));
              setOverlayImagesInfo([]);
              cacheVideoPath.current = resultVideoPath;
            },
          );
        } else if (ret.isValueError()) {
          // ERROR
          console.log('FAIL!!');
          session.getOutput().then(logs => {
            console.log(logs);
          });
          setLoading({progress: 0.0, isLoading: false, message: ''});
          notifyMessage('Video processing failed');
        } else {
          // CANCEL
          console.log('CANCEL!!');
          setLoading({progress: 0.0, isLoading: false, message: ''});
          notifyMessage('Video processing cancelled');
        }
      });
    },
    log => {},
    stats => {
      const videoDuration = currentVideoInfo.duration;

      console.log('TIME=', stats.getTime(), videoDuration);
      const timeInMilliseconds = stats.getTime() / 1000;
      if (timeInMilliseconds > 0) {
        let completePercentage = timeInMilliseconds / videoDuration;
        console.log('PROGRESS=', completePercentage);
        setLoading(prev => ({...prev, progress: completePercentage}));
      }

      finalVideoTime = stats.getTime() / 1000;
    },
  );
};

export const trimVideo = ({
  setCurrentVideoInfo,
  currentVideoInfo,
  setLoading,
  cacheVideoPath,
  seekbarValue,
  setFrames,
}: CommandProps) => {
  if (currentVideoInfo === undefined || currentVideoInfo.path === '') {
    notifyMessage('Select a video');
    return;
  }

  setLoading({progress: 0.0, isLoading: true, message: 'Applying Filters..'});

  const resultVideoPath =
    RNFS.CachesDirectoryPath +
    '/' +
    getFileNameFromTime() +
    getFileExtension(cacheVideoPath.current);
  const ffmpegCommand =
    '-y -ss ' +
    convertSecondstoTime(seekbarValue[0]) +
    ' -accurate_seek -i ' +
    cacheVideoPath.current +
    ' -t ' +
    convertSecondstoTime(seekbarValue[1] - seekbarValue[0]) +
    ' -b:v 2097k -vcodec mpeg4 -crf 0 -preset superfast ' +
    resultVideoPath;

  // -i input.mp4 -vf trim=3:6,setpts=PTS-STARTPTS output.mp4
  // -i input.mp4 -ss 00:05:20 -t 00:10:00 -c:v copy -c:a copy output1.mp4
  // -ss 00:05:20 -accurate_seek -i input.mp4 -t 00:10:00 -c:v libx264 -c:a aac output7.mp4
  console.log('FFMPEG CMD=', ffmpegCommand);
  //-b:v 2097k -vcodec mpeg4 -crf 0 -preset superfast
  let finalVideoTime = 0;

  FFmpegKit.executeAsync(
    ffmpegCommand,
    session => {
      session.getReturnCode().then(ret => {
        if (ret.isValueSuccess()) {
          console.log('SUCCESS!!', resultVideoPath);
          updateVideoTimelineFrames(
            setLoading,
            cacheVideoPath,
            setFrames,
            finalVideoTime,
            () => {
              setLoading({progress: 0.0, isLoading: false, message: ''});
              setCurrentVideoInfo(prev => ({
                ...prev,
                duration: finalVideoTime,
                path: resultVideoPath,
              }));
              cacheVideoPath.current = resultVideoPath;
            },
          );
        } else if (ret.isValueError()) {
          // ERROR
          console.log('FAIL!!');
          session.getOutput().then(logs => {
            console.log(logs);
          });
          session.getOutput().then(logs => {
            console.log(logs);
          });
          setLoading({progress: 0.0, isLoading: false, message: ''});
          notifyMessage('Video processing failed');
        } else {
          // CANCEL
          console.log('CANCEL!!');
          setLoading({progress: 0.0, isLoading: false, message: ''});
          notifyMessage('Video processing cancelled');
        }
      });
    },
    log => {},
    stats => {
      const videoDuration = seekbarValue[1] - seekbarValue[0];

      console.log('TIME=', stats.getTime(), videoDuration);
      const timeInMilliseconds = stats.getTime() / 1000;
      if (timeInMilliseconds > 0) {
        let completePercentage = timeInMilliseconds / videoDuration;
        console.log('PROGRESS=', completePercentage);
        setLoading(prev => ({...prev, progress: completePercentage}));
      }

      finalVideoTime = stats.getTime() / 1000;
    },
  );
};

export const applyTextOverlay = async ({
  setCurrentVideoInfo,
  currentVideoInfo,
  setLoading,
  cacheVideoPath,
  seekbarValue,
  viewShotRef,
  videoPlayerDimensions,
  setTextOverlay,
  setFrames,
  textOverlayXY,
  textOverlayRef,
}: CommandProps & TextOverlayProps) => {
  const uri: string = await viewShotRef.current.capture();
  console.log('do something with ', uri);

  setLoading({progress: 0.0, isLoading: true, message: 'Applying Filters..'});

  //get Ratio

  const w = currentVideoInfo.width / videoPlayerDimensions.width;
  const h = currentVideoInfo.height / videoPlayerDimensions.height;

  console.log(
    'OVERLAY=',
    'W=',
    w,
    'H=',
    h,
    currentVideoInfo.width,
    currentVideoInfo.height,
    videoPlayerDimensions.width,
    videoPlayerDimensions.height,
  );

  // const font = require("./assets/opensansbold.ttf")
  const resultVideoPath =
    RNFS.CachesDirectoryPath +
    '/' +
    getFileNameFromTime() +
    getFileExtension(cacheVideoPath.current);
  let ffmpegCommand =
    '-y -i ' + cacheVideoPath.current + ' -i ' + uri.substring(7);

  //drawtext method
  //ffmpegCommand = ffmpegCommand + ' -vf "drawtext=text=\'Your Text\':fontfile=./assets/opensansbold.ttf:fontsize=24:fontcolor=red:x=(w-text_w)/2:y=(h-text_h)/2:enable=\'between(t,0,10)\':borderw=2:bordercolor=black:box=1:boxcolor=black@0.5, drawbox=x=(w-text_w)/2:y=(h-text_h)/2+fontsize+5:w=text_w:h=2:color=red@1:enable=\'between(t,0,10)\'" -codec:a copy '+resultVideoPath

  ffmpegCommand = ffmpegCommand + ' -filter_complex "';

  ffmpegCommand =
    ffmpegCommand +
    '[1:v]scale=' +
    textOverlayRef.current.width * w +
    ':' +
    textOverlayRef.current.height * h +
    '[ovr1];';

  ffmpegCommand = ffmpegCommand + '[0]';

  ffmpegCommand =
    ffmpegCommand +
    '[ovr1]overlay=x=' +
    textOverlayXY.current.x * w +
    ':y=' +
    textOverlayXY.current.y * h +
    ":enable='between(t," +
    seekbarValue[0] +
    ',' +
    seekbarValue[1] +
    ")'[v0];";

  ffmpegCommand =
    ffmpegCommand +
    '" -map "[v0]" -map 0:a -b:v 2097k -vcodec mpeg4 -crf 0 -preset superfast ' +
    resultVideoPath;

  console.log('FFMPEG CMD=', ffmpegCommand);

  let finalVideoTime = 0;

  FFmpegKit.executeAsync(
    ffmpegCommand,
    session => {
      session.getReturnCode().then(ret => {
        if (ret.isValueSuccess()) {
          console.log('SUCCESS!!', resultVideoPath);

          updateVideoTimelineFrames(
            setLoading,
            cacheVideoPath,
            setFrames,
            finalVideoTime,
            () => {
              setLoading({progress: 0.0, isLoading: false, message: ''});
              setCurrentVideoInfo(prev => ({
                ...prev,
                duration: finalVideoTime,
                path: resultVideoPath,
              }));
              textOverlayXY.current = {x: 0, y: 0};
              setTextOverlay(null);
              cacheVideoPath.current = resultVideoPath;
            },
          );
        } else if (ret.isValueError()) {
          // ERROR
          console.log('FAIL!!');
          session.getOutput().then(logs => {
            console.log(logs);
          });
          setLoading({progress: 0.0, isLoading: false, message: ''});
          notifyMessage('Video processing failed');
        } else {
          // CANCEL
          console.log('CANCEL!!');
          setLoading({progress: 0.0, isLoading: false, message: ''});
          notifyMessage('Video processing cancelled');
        }
      });
    },
    log => {},
    stats => {
      const videoDuration = currentVideoInfo.duration;

      console.log('TIME=', stats.getTime(), videoDuration);
      const timeInMilliseconds = stats.getTime() / 1000;
      if (timeInMilliseconds > 0) {
        let completePercentage = timeInMilliseconds / videoDuration;
        console.log('PROGRESS=', completePercentage);
        setLoading(prev => ({...prev, progress: completePercentage}));
      }

      finalVideoTime = stats.getTime() / 1000;
    },
  );
};

export const applyCrop = ({
  currentVideoInfo,
  setLoading,
  cacheVideoPath,
  setCurrentVideoInfo,
  cropInfo,
  setCropInfo,
  videoPlayerDimensions,
  setFrames,
}: CommandProps & CropProps) => {
  setLoading({progress: 0.0, isLoading: true, message: 'Cropping Video..'});

  //get Ratio

  const w = currentVideoInfo.width / videoPlayerDimensions.width;
  const h = currentVideoInfo.height / videoPlayerDimensions.height;

  console.log(
    'OVERLAY=',
    'W=',
    w,
    'H=',
    h,
    currentVideoInfo.width,
    currentVideoInfo.height,
    videoPlayerDimensions.width,
    videoPlayerDimensions.height,
  );

  const resultVideoPath =
    RNFS.CachesDirectoryPath +
    '/' +
    getFileNameFromTime() +
    getFileExtension(cacheVideoPath.current);
  let ffmpegCommand =
    '-y -i ' +
    cacheVideoPath.current +
    ' -vf ' +
    '"crop=' +
    cropInfo?.width * w +
    ':' +
    cropInfo?.height * h +
    ':' +
    cropInfo?.x +
    ':' +
    cropInfo?.y +
    '"' +
    ' -c:a copy ' +
    resultVideoPath;

  //ffmpeg -i in.mp4 -vf "crop=80:60:200:100" -c:a copy out.mp4

  console.log('FFMPEG CMD=', ffmpegCommand);

  let finalVideoTime = 0;

  FFmpegKit.executeAsync(
    ffmpegCommand,
    session => {
      session.getReturnCode().then(ret => {
        if (ret.isValueSuccess()) {
          console.log('SUCCESS!!', resultVideoPath);
          updateVideoTimelineFrames(
            setLoading,
            cacheVideoPath,
            setFrames,
            finalVideoTime,
            () => {
              setLoading({progress: 0.0, isLoading: false, message: ''});
              setCurrentVideoInfo(prev => ({
                ...prev,
                duration: finalVideoTime,
                path: resultVideoPath,
              }));
              setCropInfo(undefined);
              cacheVideoPath.current = resultVideoPath;
            },
          );
        } else if (ret.isValueError()) {
          // ERROR
          console.log('FAIL!!');
          session.getOutput().then(logs => {
            console.log(logs);
          });
          setLoading({progress: 0.0, isLoading: false, message: ''});
          notifyMessage('Video processing failed');
        } else {
          // CANCEL
          console.log('CANCEL!!');
          setLoading({progress: 0.0, isLoading: false, message: ''});
          notifyMessage('Video processing cancelled');
        }
      });
    },
    log => {},
    stats => {
      const videoDuration = currentVideoInfo.duration;

      console.log('TIME=', stats.getTime(), videoDuration);
      const timeInMilliseconds = stats.getTime() / 1000;
      if (timeInMilliseconds > 0) {
        let completePercentage = timeInMilliseconds / videoDuration;
        console.log('PROGRESS=', completePercentage);
        setLoading(prev => ({...prev, progress: completePercentage}));
      }

      finalVideoTime = stats.getTime() / 1000;
    },
  );
};

export const updateVideoTimelineFrames = (
  setLoading: React.Dispatch<
    React.SetStateAction<{
      isLoading: boolean;
      message: string;
      progress: number;
    }>
  >,
  cacheVideoPath: React.MutableRefObject<string>,
  setFrames: React.Dispatch<React.SetStateAction<string[]>>,
  duration: number,
  onResult: () => void,
) => {
  setLoading(prev => ({...prev, message: 'Updating Video Timeline..'}));

  const numberOfFrames = Math.ceil(duration);
  FFmpegWrapper.getFrames(
    getFileNameFromTime(),
    cacheVideoPath.current,
    numberOfFrames,
    1,
    80,
    filePath => {
      console.log('Empty success callback');
      const _frames = [];
      for (let i = 0; i < numberOfFrames; i++) {
        _frames.push(
          `${filePath.replace('%4d', String(i + 1).padStart(4, 0))}`,
        );
      }
      setFrames(_frames);
      onResult();
    },
    () => {
      console.log('Empty error callback');
    },
  );
};


export const applyFlip = ({
  currentVideoInfo,
  setLoading,
  cacheVideoPath,
  setCurrentVideoInfo,
  setFlipInfo,
  seekbarValue,
  flipInfo,
  setFrames,
}: CommandProps & FlipProps) => {
  
  if (currentVideoInfo === undefined || currentVideoInfo.path === '') {
    notifyMessage('Select a video');
    return;
  }

  setLoading({progress: 0.0, isLoading: true, message: 'Applying Filters..'});

  const resultVideoPath =
    RNFS.CachesDirectoryPath +
    '/' +
    getFileNameFromTime() +
    getFileExtension(cacheVideoPath.current);

  let ffmpegCommand = '-y -i ' + cacheVideoPath.current + ' -vf ';  
  if(flipInfo?.horizontal && flipInfo.vertical){
    ffmpegCommand += "\"hflip, vflip\" "
  }else if(flipInfo?.horizontal){
    ffmpegCommand += "\"hflip\" "
  }else if(flipInfo?.vertical){
    ffmpegCommand += "\"vflip\" "
  }else{

  }
  ffmpegCommand += resultVideoPath

  
  console.log('FFMPEG CMD=', ffmpegCommand);
  
  let finalVideoTime = 0;

  FFmpegKit.executeAsync(
    ffmpegCommand,
    session => {
      session.getReturnCode().then(ret => {
        if (ret.isValueSuccess()) {
          console.log('SUCCESS!!', resultVideoPath);
          updateVideoTimelineFrames(
            setLoading,
            cacheVideoPath,
            setFrames,
            finalVideoTime,
            () => {
              setLoading({progress: 0.0, isLoading: false, message: ''});
              setCurrentVideoInfo(prev => ({
                ...prev,
                duration: finalVideoTime,
                path: resultVideoPath,
              }));
              setFlipInfo(undefined)
              cacheVideoPath.current = resultVideoPath;
            },
          );
        } else if (ret.isValueError()) {
          // ERROR
          console.log('FAIL!!');
          session.getOutput().then(logs => {
            console.log(logs);
          });
          session.getOutput().then(logs => {
            console.log(logs);
          });
          setLoading({progress: 0.0, isLoading: false, message: ''});
          notifyMessage('Video processing failed');
        } else {
          // CANCEL
          console.log('CANCEL!!');
          setLoading({progress: 0.0, isLoading: false, message: ''});
          notifyMessage('Video processing cancelled');
        }
      });
    },
    log => {},
    stats => {
      const videoDuration = seekbarValue[1] - seekbarValue[0];

      console.log('TIME=', stats.getTime(), videoDuration);
      const timeInMilliseconds = stats.getTime() / 1000;
      if (timeInMilliseconds > 0) {
        let completePercentage = timeInMilliseconds / videoDuration;
        console.log('PROGRESS=', completePercentage);
        setLoading(prev => ({...prev, progress: completePercentage}));
      }

      finalVideoTime = stats.getTime() / 1000;
    },
  );
};

export const applyRotate = ({
  currentVideoInfo,
  setLoading,
  cacheVideoPath,
  setCurrentVideoInfo,
  seekbarValue,
  setFrames,
  setRotateInfo,
  rotateInfo
}: CommandProps & RotateProps) => {
  
  if (currentVideoInfo === undefined || currentVideoInfo.path === '') {
    notifyMessage('Select a video');
    return;
  }

  setLoading({progress: 0.0, isLoading: true, message: 'Applying Filters..'});

  const resultVideoPath =
    RNFS.CachesDirectoryPath +
    '/' +
    getFileNameFromTime() +
    getFileExtension(cacheVideoPath.current);

  let ffmpegCommand = '-y -i ' + cacheVideoPath.current + ' -vf ';  
  if(flipInfo?.horizontal && flipInfo.vertical){
    ffmpegCommand += "\"hflip, vflip\" "
  }else if(flipInfo?.horizontal){
    ffmpegCommand += "\"hflip\" "
  }else if(flipInfo?.vertical){
    ffmpegCommand += "\"vflip\" "
  }else{

  }
  ffmpegCommand += resultVideoPath

  
  console.log('FFMPEG CMD=', ffmpegCommand);
  
  let finalVideoTime = 0;

  FFmpegKit.executeAsync(
    ffmpegCommand,
    session => {
      session.getReturnCode().then(ret => {
        if (ret.isValueSuccess()) {
          console.log('SUCCESS!!', resultVideoPath);
          updateVideoTimelineFrames(
            setLoading,
            cacheVideoPath,
            setFrames,
            finalVideoTime,
            () => {
              setLoading({progress: 0.0, isLoading: false, message: ''});
              setCurrentVideoInfo(prev => ({
                ...prev,
                duration: finalVideoTime,
                path: resultVideoPath,
              }));
              setFlipInfo(undefined)
              cacheVideoPath.current = resultVideoPath;
            },
          );
        } else if (ret.isValueError()) {
          // ERROR
          console.log('FAIL!!');
          session.getOutput().then(logs => {
            console.log(logs);
          });
          session.getOutput().then(logs => {
            console.log(logs);
          });
          setLoading({progress: 0.0, isLoading: false, message: ''});
          notifyMessage('Video processing failed');
        } else {
          // CANCEL
          console.log('CANCEL!!');
          setLoading({progress: 0.0, isLoading: false, message: ''});
          notifyMessage('Video processing cancelled');
        }
      });
    },
    log => {},
    stats => {
      const videoDuration = seekbarValue[1] - seekbarValue[0];

      console.log('TIME=', stats.getTime(), videoDuration);
      const timeInMilliseconds = stats.getTime() / 1000;
      if (timeInMilliseconds > 0) {
        let completePercentage = timeInMilliseconds / videoDuration;
        console.log('PROGRESS=', completePercentage);
        setLoading(prev => ({...prev, progress: completePercentage}));
      }

      finalVideoTime = stats.getTime() / 1000;
    },
  );
};
