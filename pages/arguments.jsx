import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

import newClient from '@wikisophia/api-arguments-client';
import 'isomorphic-fetch';

import NavBar from '../components/nav-bar';
import GlobalStyles from '../components/global-styles';

function ArgumentsPage(props) {
  const {
    arguments: args,
    search
  } = props;
  const content = renderMainContent(args);

  return (
    <div>
      <Head>
        <title>{search} - Search Results - Wikisophia</title>
        <link href="https://fonts.googleapis.com/css?family=Crimson+Text|Open+Sans&display=swap" rel="stylesheet" />
      </Head>

      <NavBar />
      <main>
        {content}
      </main>
      <GlobalStyles />
    </div>
  )
}

function renderMainContent(args) {
  if (args.length === 0) {
    return (
      <section className="main-content">
        <p className="contribute">
          <span>No beliefs match that search yet.</span><br />
          <span>Would you like to </span><Link href="/new-argument"><a>share one</a></Link><span>?</span>
        </p>
      </section>
    );
  }

  const nodes = args.map((argument) => {
    const { id, conclusion } = argument;
    return <li className="conclusion" key={id}>
      <Link href={`/arguments/${id}`}><a>{conclusion}</a></Link>
    </li>
  })

  return (
    <section className="main-content">
      <h1 className="learn">See why...</h1>
      <ul className="search-results">
        {nodes}
      </ul>
      <h1 className="contribute"><span>or </span><Link href="/new-argument"><a className="teach">share your own beliefs</a></Link></h1>
      <style jsx>{`
        .learn {
          margin: 0 0 2rem 0;
        }

        .search-results {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .search-results > :global(.conclusion) {
          padding: 1rem 2rem;
          margin-left: 0;
        }

        .search-results > :global(.conclusion) a {
          text-decoration: none;
        }

        .search-results > :global(.conclusion) a:hover {
          text-decoration: underline;
        }

        .contribute {
          margin-top: 2rem;
        }

        .search-results .search-results > :global(.conclusion:first-child) {
          margin-top: 1rem;
        }

        .search-results > :global(.conclusion:nth-child(odd)) {
          background-color: #e1e1e6;
          border-radius: 0.25rem;
        }
      `}</style>
    </section>
  )
}

ArgumentsPage.getInitialProps = async ({ query: { search } }) => {
  const api = newClient({
    url: 'http://localhost:8001',
    fetch,
  });

  const { arguments: args } = await api.getSome({
    search,
  });
  return {
    arguments: args,
    search,
  };
}

export default ArgumentsPage;