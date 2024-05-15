"use client";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { monokai } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { BlockNoteSchema, defaultBlockSpecs, filterSuggestionItems, insertOrUpdateBlock } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import {
  BlockNoteView,
  SuggestionMenuController,
  getDefaultReactSlashMenuItems,
  useCreateBlockNote,
} from "@blocknote/react";
import "@blocknote/react/style.css";

import { FaCropSimple } from "react-icons/fa6";

import { ImageCrop } from "./ImageCrop";
import { useState } from "react";
import useImageCropper from "./crop/ImageCrop";

// Our schema with block specs, which contain the configs and implementations for blocks
// that we want our editor to use.
const schema = BlockNoteSchema.create({
  blockSpecs: {
    // Adds all default blocks.
    ...defaultBlockSpecs,
    // Adds the Image Crop block.
    "image-crop": ImageCrop,
  },
});

const insertImageCrop = (editor) => ({
  title: "Image Crop",
  onItemClick: () => {
    insertOrUpdateBlock(editor, {
      type: "image-crop",
    });
  },
  aliases: ["image", "crop", "picture"],
  group: "Other",
  icon: <FaCropSimple />,
});

export default function App() {
  const [markdown, setMarkdown] = useState("");
  const [html, setHTML] = useState("");
  const { CropperDialog } = useImageCropper();
  // Creates a new editor instance.
  const editor = useCreateBlockNote({
    schema,
    initialContent: [
      {
        type: "paragraph",
        content: "Welcome to this demo!",
      },

      {
        type: "paragraph",
        content: "Press the '/' key to open the Slash Menu and add another",
      },
      {
        type: "paragraph",
      },
    ],
  });
  const onChange = async () => {
    // Converts the editor's contents from Block objects to Markdown and store to state.
    const markdown = await editor.blocksToMarkdownLossy(editor.document);
    setMarkdown(markdown);
    const html = await editor.blocksToHTMLLossy(editor.document);
    setHTML(html);
  };

  // Renders the editor instance.
  return (
    <>
      <BlockNoteView
        editor={editor}
        theme={"light"}
        slashMenu={false}
        onChange={onChange}
        className="border rounded-md"
      >
        {/* Replaces the default Slash Menu. */}
        <SuggestionMenuController
          triggerCharacter={"/"}
          getItems={async (query) =>
            // Gets all default slash menu items and `insertAlert` item.
            filterSuggestionItems([...getDefaultReactSlashMenuItems(editor), insertImageCrop(editor)], query)
          }
        />
      </BlockNoteView>
      <div>Output (Markdown):</div>
      <div className={"item bordered"}>
        <SyntaxHighlighter
          lineProps={{
            style: { wordBreak: "break-all", whiteSpace: "pre-wrap" },
          }}
          wrapLines={true}
          language="markdown"
          style={monokai}
        >
          {markdown}
        </SyntaxHighlighter>
      </div>
      <div>Output (HTML):</div>
      <div className="item bordered">
        <SyntaxHighlighter
          lineProps={{
            style: { wordBreak: "break-all", whiteSpace: "pre-wrap" },
          }}
          wrapLines={true}
          language="html"
          style={monokai}
        >
          {html}
        </SyntaxHighlighter>
      </div>
    </>
  );
}
