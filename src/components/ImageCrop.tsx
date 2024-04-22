import { defaultProps } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";
import { Menu } from "@mantine/core";
import { url } from "inspector";
import { MdCancel, MdCheckCircle, MdError, MdInfo } from "react-icons/md";
import Image from "next/image";

export const ImageCrop = createReactBlockSpec(
  {
    type: "image-crop",
    propSchema: {
      url: {
        default: "" as const,
      },
      // Image caption.
      caption: {
        default: "" as const,
      },
    },
    content: "none",
  },
  {
    render: (props) => {
      const imageUrl = props.block.props.url;
      const alt = props.block.props.caption;
      const handleFileChange = (event: any) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            props.editor.updateBlock(props.block, {
              type: "image-crop",
              props: {
                url: reader?.result?.toString() || "",
              },
            });
            // setImageUrl(reader.result.toString());
          };
          reader.readAsDataURL(file);
        }
      };
      return (
        <div className="flex flex-col">
          <div className="flex flex-col w-full">
            <input type="file" onChange={handleFileChange} accept="image/*" />
            {imageUrl && (
              <Image unoptimized width={920} height={200} className="w-full max-w-2xl" alt={alt} src={imageUrl} />
            )}
            {/* for caption */}
            <input
              type="text"
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
              className="w-full"
            />

            {/*Rich text field for user to type in*/}
            {/* <div className={"inline-content"} ref={props.contentRef} /> */}
          </div>
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
