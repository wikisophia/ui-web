import React from 'react';
import PropTypes from 'prop-types';

import ErrorPage from 'next/error';
import Head from 'next/head';
import Router from 'next/router';

import newClient from '@wikisophia/api-arguments-client';
import 'isomorphic-fetch';

import NavBar from '../../components/nav-bar';
import GlobalStyles from '../../components/global-styles';
import StaticArgument from '../../components/static-argument';

function LatestArgument({ id, premises, conclusion }) {
  if (!conclusion) {
    return <ErrorPage statusCode={404} />;
  }
  return (
    <div>
      <Head>
        <title>
          {conclusion}
          {' '}
- Wikisophia
        </title>
        <link href="https://fonts.googleapis.com/css?family=Crimson+Text|Open+Sans&display=swap" rel="stylesheet" />
      </Head>
      <GlobalStyles />
      <NavBar />
      <main>
        <section className="main-content">
          <StaticArgument
            premises={premises}
            conclusion={conclusion}
            onEdit={() => Router.push(`/arguments/${id}/edit`)}
          />
        </section>
      </main>
    </div>
  );
}

LatestArgument.propTypes = {
  id: PropTypes.number.isRequired,
  premises: PropTypes.exact({
    text: PropTypes.string.isRequired,
    supported: PropTypes.bool.isRequired,
  }).isRequired,
  conclusion: PropTypes.string.isRequired,
};

LatestArgument.getInitialProps = async ({ query: { id } }) => {
  const api = newClient({
    url: 'http://localhost:8001',
    fetch,
  });

  const argument = await api.getOne(id);
  if (!argument) {
    return {};
  }
  const { argument: { premises, conclusion } } = argument;
  const support = await Promise.all(premises.map(async (premise) => {
    const { arguments: args } = await api.getSome({
      conclusion: premise,
      count: 1,
    });
    return args.length > 0;
  }));

  return {
    id,
    premises: premises.map((premise, index) => ({
      text: premise,
      supported: support[index],
    })),
    conclusion,
  };
};

export default LatestArgument;
