import { createReactBlockSpec } from "@blocknote/react";
import Image from "next/image";
import useImageCropper from "./crop/ImageCrop";

export const ImageCrop = createReactBlockSpec(
  {
    type: "image-crop",
    propSchema: {
      url: {
        default: "",
      },
      // Image caption.
      caption: {
        default: "",
      },
    },
    content: "none",
  },
  {
    render: (props) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { CropperDialog, handleOpen } = useImageCropper();
      const imageUrl = props.block.props.url;
      const alt = props.block.props.caption;
      const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        e.target.value = null;

        // const reader = new FileReader();

        // reader.onloadend = () => {
        const bloburl = URL.createObjectURL(file);
        handleOpen(bloburl);

        // props.editor.updateBlock(props.block, {
        //   type: "image-crop",
        //   props: {
        //     url: bloburl,
        //   },
        // });
        // };
        // reader.readAsDataURL(file);
      };
      const handleImageCrop = (croppedImage) => {
        props.editor.updateBlock(props.block, {
          type: "image-crop",
          props: {
            url: croppedImage,
          },
        });
      };
      return (
        <div className="d-flex flex-column gap-2">
          <div className="position-relative">
            <input
              className="position-absolute top-0 end-0 opacity-0 w-100 h-100"
              type="file"
              onChange={handleFileChange}
              accept="image/*"
            />
            {imageUrl ? (
              <Image unoptimized width={920} height={500} className="w-100 h-100" alt={alt} src={imageUrl} />
            ) : (
              <div className="border d-flex align-items-center justify-content-center" style={{ height: "200px" }}>
                <div className="text-gray-500">Click to upload image</div>
              </div>
            )}

            <CropperDialog onCrop={handleImageCrop} />

            {/*Rich text field for user to type in*/}
            {/* <div className={"inline-content"} ref={props.contentRef} /> */}
          </div>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={props.block.props.caption}
            onChange={(event) => {
              props.editor.updateBlock(props.block, {
                type: "image-crop",
                props: {
                  url: imageUrl,
                  caption: event.target.value,
                },
              });
            }}
            placeholder="Caption"
          />
        </div>
      );
    },
    toExternalHTML: (props) => {
      return (
        <Image
          unoptimized
          width={920}
          height={200}
          className="w-full max-w-2xl"
          alt={props.block.props.caption}
          src={props.block.props.url}
        />
      );
    },
  }
);
