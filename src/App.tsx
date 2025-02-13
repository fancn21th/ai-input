import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const TiptapEditor = () => {
  const editor = useEditor({
    extensions: [StarterKit], // 使用 StarterKit 提供的扩展
    content: "<p>Hello, Tiptap!</p>", // 初始内容
  });

  return <EditorContent editor={editor} />;
};

function App() {
  return (
    <div className="App">
      <h1>Tiptap 最简示例</h1>
      <TiptapEditor />
    </div>
  );
}

export default App;
