export interface CropProps {
  cropInfo:
    | {
        x: number;
        y: number;
        width: number;
        height: number;
      }
    | undefined;
  setCropInfo: React.Dispatch<
    React.SetStateAction<
      | {
          x: number;
          y: number;
          width: number;
          height: number;
        }
      | undefined
    >
  >;
  videoPlayerDimensions: {
    width: number;
    height: number;
  };
}

export interface CommandProps {
  currentVideoInfo:
    | {
        width: number;
        height: number;
        path: string;
        duration: number;
      }
    | undefined;
  seekbarValue: number[];
  setCurrentVideoInfo: React.Dispatch<
    React.SetStateAction<
      | {
          width: number;
          height: number;
          path: string;
          duration: number;
        }
      | undefined
    >
  >;
  setLoading: React.Dispatch<
    React.SetStateAction<{
      isLoading: boolean;
      message: string;
      progress: number;
    }>
  >;
  setFrames: React.Dispatch<React.SetStateAction<string[]>>;
  cacheVideoPath: React.MutableRefObject<string>;
}

export interface OverlayProps {
  overlayImagesInfo: {
    filePath: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }[];
  videoPlayerDimensions: {
    width: number;
    height: number;
  };
  setOverlayImagesInfo: React.Dispatch<
    React.SetStateAction<
      {
        filePath: string;
        x: number;
        y: number;
        width: number;
        height: number;
      }[]
    >
  >;
}

export interface TextOverlayProps {
  viewShotRef: React.MutableRefObject<undefined>;
  videoPlayerDimensions: {
    width: number;
    height: number;
  };
  textOverlayXY: React.MutableRefObject<{
    x: number;
    y: number;
  }>;
  textOverlayRef: React.MutableRefObject<{
    width: number;
    height: number;
  }>;
  setTextOverlay: React.Dispatch<
    React.SetStateAction<{
      text: string;
      color: string;
      size: number;
      style: 'italic' | 'bold' | 'normal' | 'underline';
    } | null>
  >;
  textOverlay: {
    text: string;
    color: string;
    size: number;
    style: 'italic' | 'bold' | 'normal' | 'underline';
  } | null;
}

export interface BottomSheetButtonsProps extends CommandProps {
  cropInfo:
    | {
        x: number;
        y: number;
        width: number;
        height: number;
      }
    | undefined;
  setCropInfo: React.Dispatch<
    React.SetStateAction<
      | {
          x: number;
          y: number;
          width: number;
          height: number;
        }
      | undefined
    >
  >;
  videoPlayerDimensions: {
    width: number;
    height: number;
  };
  viewShotRef: React.MutableRefObject<undefined>;
  textOverlayXY: React.MutableRefObject<{
    x: number;
    y: number;
  }>;
  setTextOverlay: React.Dispatch<
    React.SetStateAction<{
      text: string;
      color: string;
      size: number;
      style: 'italic' | 'bold' | 'normal' | 'underline';
    } | null>
  >;
  overlayImagesInfo: {
    filePath: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }[];
  setOverlayImagesInfo: React.Dispatch<
    React.SetStateAction<
      {
        filePath: string;
        x: number;
        y: number;
        width: number;
        height: number;
      }[]
    >
  >;
  setFlipInfo: React.Dispatch<
    React.SetStateAction<
      | {
          vertical: boolean;
          horizontal: boolean;
        }
      | undefined
    >
  >;
  setRotateInfo: React.Dispatch<React.SetStateAction<number | undefined>>;
}

export interface FlipProps {
  setFlipInfo: React.Dispatch<
    React.SetStateAction<
      | {
          vertical: boolean;
          horizontal: boolean;
        }
      | undefined
    >
  >,
  flipInfo: {
    vertical: boolean;
    horizontal: boolean;
  } | undefined
}

export interface RotateProps {
  setRotateInfo: React.Dispatch<React.SetStateAction<number | undefined>>,
  rotateInfo: number | undefined
}
