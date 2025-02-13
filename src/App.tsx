import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import content from "./content.txt?raw";

const TiptapEditor = () => {
  const editor = useEditor({
    extensions: [StarterKit], // 使用 StarterKit 提供的扩展
    content, // 初始内容
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none",
      },
    },
  });

  return <EditorContent editor={editor} />;
};

function App() {
  return (
    <div>
      <h1>Tiptap React 编辑器</h1>
      <hr />
      <TiptapEditor />
    </div>
  );
}

export default App;
