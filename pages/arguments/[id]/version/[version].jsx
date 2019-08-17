import React from 'react';

import ErrorPage from 'next/error';
import Link from 'next/link';
import Head from 'next/head';
import Router from 'next/router';

import newClient from '@wikisophia/api-arguments-client';
import 'isomorphic-fetch';

import NavBar from '../../../../components/nav-bar';
import GlobalStyles from '../../../../components/global-styles';
import StaticArgument from '../../../../components/static-argument';

function VersionedArgument({ id, premises, conclusion, outdated }) {
  if (!conclusion) {
    return <ErrorPage statusCode={404} />
  }

  return <div>
    <Head>
      <title>{conclusion} - Wikisophia</title>
      <link href="https://fonts.googleapis.com/css?family=Crimson+Text|Open+Sans&display=swap" rel="stylesheet" />
    </Head>
    <GlobalStyles />
    <NavBar />
    <main>
      <section className="main-content">
      {outdated
          ? <p className="outdated">
              <span>This argument is outdated. <Link href={`/arguments/${id}`}><a>See the most recent version</a></Link></span>
            </p>
          : null
        }
        <StaticArgument
          premises={premises}
          conclusion={conclusion}
          outdated={outdated}
          onEdit={outdated ? null : () => Router.push(`/arguments/${id}/edit`)}
        />
      <style jsx>{`
        .outdated {
          background-color: #e1e1e6;
          border: 1px solid #bcbcbc;
          color: #322222;
          border-radius: 7px;
          padding: 2rem;
          margin-top: 0;
          margin-bottom: 2rem;
        }
      `}</style>
      </section>
    </main>
  </div>;
}

VersionedArgument.getInitialProps = async ({ query: { id, version }}) => {
  const api = newClient({
    url: 'http://localhost:8001',
    fetch,
  });

  const argument = await api.getOne(id, version);
  if (!argument) {
    return {};
  }
  const { argument: { premises, conclusion }} = argument;

  const calls = premises.map(async (premise) => {
    const { arguments: args } = await api.getSome({
      conclusion: premise,
      count: 1,
    })
    return args.length > 0;
  });
  const nextVersionPromise = api.getOne(id, parseInt(version, 10) + 1);

  const support = await Promise.all(calls);
  const nextVersion = await nextVersionPromise;

  return {
    id,
    premises: premises.map((premise, index) => ({
      text: premise,
      supported: support[index],
    })),
    conclusion,
    outdated: nextVersion !== null
  }
}

export default VersionedArgument;
