import React from 'react';

const globalStyles = () => (
  <style jsx="true" global>
    {`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  button {
    border-radius: 0.25rem;
    cursor: pointer;
  }

  html, input, html button {
    font: 22px/1.5 'Open sans', sans-serif;
  }

  h1 {
    font: 28px/1.5 'Crimson Text', serif;
  }

  body {
    background-color: #fbfbfb;
    color: #322222;
    padding: 0;
    margin: 0.5rem;
  }

  a {
    color: #132cec;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  main {
    margin-top: 2rem;
  }

  .main-content {
    max-width: 33rem;
    margin-left: auto;
    margin-right: auto;
  }
  `}
  </style>
);

export default globalStyles;