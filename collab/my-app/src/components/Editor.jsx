import React, { useState, useEffect } from "react";
import axios from "axios";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/xml/xml";
import "codemirror/mode/css/css";
import "codemirror/mode/javascript/javascript";
import { Controlled as CodeMirror } from "react-codemirror2";
import "../index.css"; // Use only index.css for styling

function Editor({ token }) {
  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [js, setJs] = useState("");
  const [srcDoc, setSrcDoc] = useState("");

  useEffect(() => {
    // Fetch user-specific data on load
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/fetch", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHtml(response.data.html || "");
        setCss(response.data.css || "");
        setJs(response.data.js || "");
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, [token]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(`
        <html>
          <body>${html}</body>
          <style>${css}</style>
          <script>${js}</script>
        </html>
      `);
    }, 250);

    return () => clearTimeout(timeout);
  }, [html, css, js]);

  const saveData = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/save",
        { html, css, js },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Data saved successfully!");
    } catch (err) {
      console.error("Error saving data:", err);
      alert("Failed to save data.");
    }
  };

  return (
    <div className="pane">
      {/* Editors section */}
      <div className="editors-container">
        <div className="editor-container">
          <div className="editor-title">HTML</div>
          <CodeMirror
            value={html}
            options={{
              mode: "xml",
              theme: "default",
              lineNumbers: true,
            }}
            onBeforeChange={(editor, data, value) => setHtml(value)}
          />
        </div>
        <div className="editor-container">
          <div className="editor-title">CSS</div>
          <CodeMirror
            value={css}
            options={{
              mode: "css",
              theme: "default",
              lineNumbers: true,
            }}
            onBeforeChange={(editor, data, value) => setCss(value)}
          />
        </div>
        <div className="editor-container">
          <div className="editor-title">JS</div>
          <CodeMirror
            value={js}
            options={{
              mode: "javascript",
              theme: "default",
              lineNumbers: true,
            }}
            onBeforeChange={(editor, data, value) => setJs(value)}
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="save-container">
        <button className="save-button" onClick={saveData}>
          Save
        </button>
      </div>

      {/* Output section */}
      <div className="output-container">
        <iframe
          srcDoc={srcDoc}
          title="Output"
          sandbox="allow-scripts"
          frameBorder="0"
        />
      </div>
    </div>
  );
}

export default Editor;
