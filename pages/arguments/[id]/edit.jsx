import React from 'react';
import ErrorPage from 'next/error';
import Head from 'next/head';
import Router from 'next/router';
import getConfig from 'next/config';

import newClient from '@wikisophia/api-arguments-client';
import 'isomorphic-fetch';

import ImprovingArgument from '../../../components/improving-argument';
import NavBar from '../../../components/nav-bar';
import GlobalStyles from '../../../components/global-styles';


const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();
const apiUrl = serverRuntimeConfig.serverUrl || publicRuntimeConfig.clientUrl;

function EditArgument(props) {
  const {
    id,
    premises,
    conclusion,
  } = props;

  if (!conclusion) {
    return <ErrorPage statusCode={404} />;
  }
  return (
    <div>
      <Head>
        <title>New Argument - Wikisophia</title>
        <link href="https://fonts.googleapis.com/css?family=Crimson+Text|Open+Sans&display=swap" rel="stylesheet" />
      </Head>
      <GlobalStyles />
      <NavBar />
      <main>
        <section className="main-content">
          <ImprovingArgument
            initialPremises={premises}
            initialConclusion={conclusion}
            onCancel={() => Router.push(`/arguments/${id}`)}
            onSave={(arg) => {
              const client = newClient({
                url: apiUrl,
                fetch,
              });
              client.update(id, arg).then((response) => {
                Router.push(`/arguments/${response.argument.id}`);
              }).catch((err) => {
                console.error(`Failed to save argument: ${err}`);
              })
            }}
          />
        </section>
      </main>
    </div>
  )
}

// See https://github.com/zeit/next.js/#dynamic-routing
//
// Pages that are statically optimized by automatic prerendering will be hydrated
// without their route parameters provided (query will be empty, i.e. {}).
// After hydration, Next.js will trigger an update to your application to provide
// the route parameters in the query object.
//
// Props can only be used to initialize state once... and since the user edits these
// inputs, they are page state. So in this case the initial render does make them
// turn up blank.
EditArgument.getInitialProps = async ({ query: { id: idString }}) => {
  const id = parseInt(idString, 10);
  if (Number.isNaN(id)) {
    return {};
  }
  const api = newClient({
    url: apiUrl,
    fetch,
  });

  const argument = await api.getOne(id);
  if (!argument) {
    console.log('argument not found.');
    return {};
  }
  const { argument: { premises, conclusion}} = argument;

  return {
    id,
    premises,
    conclusion,
  };
}

export default EditArgument;