"use client";
import { Block } from "@blocknote/core";
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
  // Creates a new editor instance.
  const editor = useCreateBlockNote({
    schema,
    initialContent: [
      {
        type: "paragraph",
        content: "Welcome to this demo!",
      },
      {
        type: "alert",
        content: "This is an example alert",
      },
      {
        type: "paragraph",
        content: "Press the '/' key to open the Slash Menu and add another",
      },
      {
        type: "paragraph",
      },
      {
        type: "image-crop",
        props: {
          url: "https://images.unsplash.com/photo-1713365829670-d8df1e593248?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          caption: "This is an example image",
        },
      },
    ],
  });
  const onChange = async () => {
    // Converts the editor's contents from Block objects to Markdown and store to state.
    const markdown = await editor.blocksToMarkdownLossy(editor.document);
    setMarkdown(markdown);
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
        <pre>
          <code>{markdown}</code>
        </pre>
      </div>
    </>
  );
}
