"use client";
import { Block } from "@blocknote/core";
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

import { RiAlertFill } from "react-icons/ri";
import { Alert } from "./Alert";
import { ImageCrop } from "./ImageCrop";
import { useState } from "react";

// Our schema with block specs, which contain the configs and implementations for blocks
// that we want our editor to use.
const schema = BlockNoteSchema.create({
  blockSpecs: {
    // Adds all default blocks.
    ...defaultBlockSpecs,
    // Adds the Alert block.
    alert: Alert,
    // Adds the Image Crop block.
    "image-crop": ImageCrop,
  },
});

// Slash menu item to insert an Alert block
const insertAlert = (editor: typeof schema.BlockNoteEditor) => ({
  title: "Alert",
  onItemClick: () => {
    insertOrUpdateBlock(editor, {
      type: "alert",
    });
  },
  aliases: ["alert", "notification", "emphasize", "warning", "error", "info", "success"],
  group: "Other",
  icon: <RiAlertFill />,
});

const insertImageCrop = (editor: typeof schema.BlockNoteEditor) => ({
  title: "Image Crop",
  onItemClick: () => {
    insertOrUpdateBlock(editor, {
      type: "image-crop",
    });
  },
  aliases: ["image", "crop", "picture"],
  group: "Other",
  icon: <RiAlertFill />,
});

export default function App() {
  const [markdown, setMarkdown] = useState<string>("");
  const [html, setHTML] = useState<string>("");
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
      <BlockNoteView editor={editor} slashMenu={false} onChange={onChange}>
        {/* Replaces the default Slash Menu. */}
        <SuggestionMenuController
          triggerCharacter={"/"}
          getItems={async (query) =>
            // Gets all default slash menu items and `insertAlert` item.
            filterSuggestionItems(
              [...getDefaultReactSlashMenuItems(editor), insertAlert(editor), insertImageCrop(editor)],
              query
            )
          }
        />
      </BlockNoteView>
      <div>Output (Markdown):</div>
      <div className={"item bordered"}>
        <SyntaxHighlighter
          lineProps={{ style: { wordBreak: "break-all", whiteSpace: "pre-wrap" } }}
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
          lineProps={{ style: { wordBreak: "break-all", whiteSpace: "pre-wrap" } }}
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
