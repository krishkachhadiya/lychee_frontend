"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";

// jodit-react touches `document` at import time, so it must never be
// evaluated during SSR. next/dynamic with ssr:false keeps it client-only.
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export default function TextEditor({
  value = "",
  onChange,
  height = 400,
}) {
  const config = useMemo(
    () => ({
      readonly: false,
      height,
      toolbarAdaptive: false,
      toolbarSticky: false,
      spellcheck: true,
      showXPath: false,
      showCharsCounter: true,
      showWordsCounter: true,
      allowResizeY: true,

      buttons: [
        "source",
        "|",
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "|",
        "superscript",
        "subscript",
        "|",
        "font",
        "fontsize",
        "|",
        "brush",
        "paragraph",
        "|",
        "ul",
        "ol",
        "|",
        "outdent",
        "indent",
        "|",
        "align",
        "|",
        "link",
        "image",
        "video",
        "table",
        "|",
        "hr",
        "|",
        "copyformat",
        "|",
        "undo",
        "redo",
        "|",
        "fullsize",
        "|",
        "print",
        "|",
        "preview",
      ],
    }),
    [height]
  );

  return (
    <JoditEditor
      value={value}
      config={config}
      onBlur={onChange}
    />
  );
}