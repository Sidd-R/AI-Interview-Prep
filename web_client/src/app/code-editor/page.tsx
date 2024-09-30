'use client';
import React, { useState } from 'react';
// import Prism from "prismjs";
// // import { highlight, languages } from 'prismjs/components/prism-core';
// require('prismjs/components/prism-clike')
// require('prismjs/components/prism-javascript');
// require('prismjs/themes/prism.css');
import Editor from '@monaco-editor/react';

function CodeEditor() {
  const [code, setCode] = useState('');

  const handleCodeSubmit = () => {
    const myHeaders = new Headers();
    myHeaders.append(
      'x-rapidapi-key',
      '76948d9705mshb7d816824d0b102p132dfcjsn0af7c3873f28'
    );
    myHeaders.append('x-rapidapi-host', 'judge0-ce.p.rapidapi.com');
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify({
      source_code: code,
      language_id: 72,
      stdin: 'world',
    });

    console.log(raw);
    
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
    };

    fetch(
      'https://judge0-ce.p.rapidapi.com/submissions/?base64_encoded=false&wait=true',
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <Editor
        height="90vh"
        defaultLanguage="python"
        // defaultValue="// write your code here"
        value={code}
        onChange={(value) => setCode(value as string)}
        // theme=''
      />
      <button onClick={handleCodeSubmit}>Log Code</button>;
    </div>
  );
}

export default CodeEditor;
