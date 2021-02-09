import { Controlled as CodeMirror } from "react-codemirror2";
import { useState, useEffect } from "react";
import axios from "axios";
import { cppTemplate, javaTemplate } from "./data";
require("codemirror/mode/xml/xml");
require("codemirror/mode/javascript/javascript");

export default function CodeEditor() {
  const [editorValue, setEditorValue] = useState("");
  const [output, setOutput] = useState("");
  const [stdin, setStdin] = useState("");
  const [lang, setLang] = useState("cpp");
  const [isEdited, setIsEdited] = useState(false);

  useEffect(() => {
    if (isEdited) {
      return;
    }
    if (lang === "cpp") {
      setEditorValue(cppTemplate);
    } else if (lang === "java") {
      setEditorValue(javaTemplate);
    }
  }, [lang]);

  const handleRun = () => {
    axios
      .post("https://codeground-backend.herokuapp.com/api/exec", {
        language: lang,
        versionIndex: "3",
        script: editorValue,
        stdin: stdin,
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
      <div className="editor-panel">
        <select name="languages" onChange={handleLangChange} value={lang}>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
        </select>
        <CodeMirror
          value={editorValue}
          options={{
            mode: "text/x-c++src",
            theme: "cobalt",
            lineNumbers: true,
          }}
          className="editor"
          onBeforeChange={(editor, data, value) => {
            if (!isEdited) {
              console.log("edited.");
              setIsEdited(true);
            }
            setEditorValue(value);
          }}
          onChange={(editor, data, value) => {
            setEditorValue(value);
          }}
        />
        <div className="flex flex-row">
          <CodeMirror
            value={stdin}
            options={{
              mode: "text",
              theme: "material",
            }}
            className="stdin"
            onBeforeChange={(editor, data, value) => {
              setStdin(value);
            }}
            onChange={(editor, data, value) => {
              setStdin(value);
            }}
          />
          <textarea value={output} readOnly={true} className="output-panel" />
        </div>
        <button className="btn-run" onClick={handleRun}>
          Run
        </button>
      </div>
    </>
  );
}
