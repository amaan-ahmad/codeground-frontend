import { UnControlled as CodeMirror } from "react-codemirror2";
import { useState } from "react";
import axios from "axios";
require("codemirror/mode/xml/xml");
require("codemirror/mode/javascript/javascript");

export default function CodeEditor() {
  const [editorValue, setEditorValue] = useState("");
  const [output, setOutput] = useState("");
  const [lang, setLang] = useState("cpp");
  const handleRun = () => {
    axios
      .post("http://localhost:5000/api/exec", {
        language: lang,
        versionIndex: "3",
        script: editorValue,
      })
      .then((res) => {
        console.log(res.data);
        setOutput(res.data.output);
      })
      .catch((err) => console.error(err));
  };

  const handleLangChange = (e) => {
    console.log(e.target.value);
    setLang(e.target.value);
  };
  return (
    <>
      <select name="languages" onChange={handleLangChange} value={lang}>
        <option value="cpp">C++</option>
        <option value="java">Java</option>
      </select>
      <CodeMirror
        value={editorValue}
        options={{
          mode: "text/x-c++src",
          theme: "material",
          lineNumbers: true,
        }}
        className="editor"
        onChange={(editor, data, value) => {
          setEditorValue(value);
        }}
      />
      <button onClick={handleRun}>Run</button>
      <textarea value={output} readOnly={true} />
    </>
  );
}
