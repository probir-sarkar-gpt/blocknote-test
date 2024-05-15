"use client";
import { useState, useCallback, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Crop from "./Crop";
import { Button } from "@/components/ui/button";
import { getCroppedImg } from "./utils";

const useImageCropper = () => {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(null);
  const croppedArea = useRef(null);

  const handleOpen = useCallback((image) => {
    setOpen(true);
    setImage(image);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const CropperDialog = ({ onCrop }) => (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
          <DialogDescription>
            Crop the image to fit the frame. Click on the image and drag to move it around. Use
          </DialogDescription>
        </DialogHeader>
        <div className="w-full min-h-[20rem] relative">
          <Crop imageUrl={image} croppedAreaRef={croppedArea} />
        </div>

        <DialogFooter className="">
          <div className="w-full">
            <div className="flex justify-end mt-4">
              <Button
                type="button"
                variant="outline"
                // onClick={() => {
                //   setShowImageModal(false);
                // }}
                className="mr-2"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={async () => {
                  const croppedImage = await getCroppedImg(image, croppedArea.current);
                  onCrop(croppedImage);
                  handleClose();
                }}
                className="flex justify-end"
              >
                Save
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return { CropperDialog, handleOpen, handleClose };
};

export default useImageCropper;
