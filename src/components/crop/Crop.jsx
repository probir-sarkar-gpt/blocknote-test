import React, { useState, useCallback, useEffect, memo } from "react";
import Cropper from "react-easy-crop";

const Crop = ({ imageUrl, croppedAreaRef }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  // const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
    croppedAreaRef.current = croppedAreaPixels;
  }, []);
  return (
    <Cropper
      image={imageUrl}
      crop={crop}
      zoom={zoom}
      aspect={4 / 2}
      onCropChange={setCrop}
      onCropComplete={onCropComplete}
      onZoomChange={setZoom}
      zoomSpeed={0.25}
    />
  );
};

export default memo(Crop);
