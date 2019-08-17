import Head from 'next/head';
import React, { useState } from 'react';

import NavBar from '../components/nav-bar';
import GlobalStyles from '../components/global-styles';

export default () => {
  const [input, setInput] = useState('');

  return (
    <div>
      <Head>
        <title>Wikisophia</title>
        <link href="https://fonts.googleapis.com/css?family=Crimson+Text|Open+Sans&display=swap" rel="stylesheet" />
      </Head>
      <NavBar />
      <main>
        <h1 className="title">Wikisophia</h1>
        <h2 className="tagline">Reason Together</h2>
        <form id="search-form" action="/arguments" method="get">
          <input
            autoFocus
            autoComplete="off"
            id="search"
            name="search"
            className="main-search"
            type="text"
            value={input}
            onChange={(ev) => setInput(ev.target.value)}
          />
        </form>
      </main>

      <GlobalStyles />
      <style jsx>{`
        main {
          text-align: center;
        }

        .nav-link.home {
          display: none;
        }

        .title {
          font-size: 3.5rem;
          font-weight: 200;
          margin: 0;
        }

        .tagline {
          font-size: 1.25rem;
          margin-top: 0;
          margin-bottom: 5rem;
        }

        .main-search, .dropdown {
          margin: 0;
          box-sizing: border-box;
          font-size: 24px;
          max-width: 19em;
          line-height: 1.6em;
        }

        .main-search {
          padding: 0.1rem 0.25rem;
          border: 2px solid #7481e2;
          border-radius: 7px;
          min-width: 30rem;
        }

        .main-search:focus {
          border-color: #0b22d0;
        }

        .suggestion {
          padding: 0.05em calc(0.2em + 2px);
        }

        .dropdown {
          padding: 0;
          border: 2px solid #999;
          display: inline-block;
          box-sizing: border-box;
          border-top: 0;
          text-align: left;
          list-style-type: none;

        }

        .dropdown:empty {
          display: none;
        }

        .suggestion:hover {
          background-color: #ddd;
        }

        .suggestion a {
          color: #000;
          text-decoration: none;
        }
      `}</style>
    </div>
  );
}
