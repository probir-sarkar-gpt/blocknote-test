"use client";
import { useState, useCallback, useRef } from "react";
import Crop from "./Crop";
// import { Button } from "@/components/ui/button";
import { getCroppedImg } from "./utils";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

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
    <Modal show={open} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Crop Image</Modal.Title>
      </Modal.Header>
      <Modal.Body
        className="position-relative "
        style={{
          minHeight: "300px",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Crop imageUrl={image} croppedAreaRef={croppedArea} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={async () => {
            const croppedImage = await getCroppedImg(image, croppedArea.current);
            onCrop(croppedImage);
            handleClose();
          }}
        >
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );

  return { CropperDialog, handleOpen, handleClose };
};

export default useImageCropper;
