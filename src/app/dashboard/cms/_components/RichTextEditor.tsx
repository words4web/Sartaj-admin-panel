"use client";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import "@/styles/quill-custom.css";

// Dynamically import ReactQuill with no SSR to avoid 'document is not defined' errors
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="h-40 w-full animate-pulse bg-gray-100 rounded-md" />
  ),
});

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ color: [] }, { background: [] }],
    ["link", "table"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "color",
  "background",
  "link",
  "table",
];

export const RichTextEditor = ({
  value,
  onChange,
  placeholder = "Write something amazing...",
}: RichTextEditorProps) => {
  return (
    <div className="bg-white rounded-md border-gray-200 shadow-sm border overflow-hidden">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  );
};
