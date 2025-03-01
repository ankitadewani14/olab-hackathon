import React, { useState, useEffect } from 'react';
import Editor from './Editor';
import useBackendStorage from '../hooks/useBackendStorage';

function App() {
  const [token, setToken] = useState(''); // Replace this with the token received after login
  const [html, setHtml] = useBackendStorage('html', '', token);
  const [css, setCss] = useBackendStorage('css', '', token);
  const [js, setJs] = useBackendStorage('js', '', token);
  const [srcDoc, setSrcDoc] = useState('');

  // Update the live preview for HTML/CSS/JS
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

  const handleLogout = () => {
    setToken(''); // Clear token on logout
  };

  return (
    <div className="app">
      {!token ? (
        <div>
          <h2>Please Login</h2>
          <p>Navigate to the login page to start editing.</p>
        </div>
      ) : (
        <>
          <div className="pane top-pane">
            <Editor
              language="xml"
              displayName="HTML"
              value={html}
              onChange={setHtml}
            />
            <Editor
              language="css"
              displayName="CSS"
              value={css}
              onChange={setCss}
            />
            <Editor
              language="javascript"
              displayName="JS"
              value={js}
              onChange={setJs}
            />
          </div>

          <div className="output-container">
            <div className="output-section">
              <h3>HTML Output</h3>
              <iframe
                srcDoc={srcDoc}
                title="output"
                sandbox="allow-scripts"
                frameBorder="0"
                width="100%"
                height="300px"
              />
            </div>
          </div>
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
    </div>
  );
}

export default App;
