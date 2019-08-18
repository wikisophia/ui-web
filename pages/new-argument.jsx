import React from 'react';

import getConfig from 'next/config';
import Head from 'next/head';
import Router from 'next/router';

import newClient from '@wikisophia/api-arguments-client';

import ImprovingArgument from '../components/improving-argument';
import NavBar from '../components/nav-bar';
import GlobalStyles from '../components/global-styles';


const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();
const apiUrl = serverRuntimeConfig.serverUrl || publicRuntimeConfig.clientUrl;

function NewArgument(props) {
  const {
    premises: initialPremises,
    conclusion: initialConclusion,
  } = props

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
            initialPremises={initialPremises}
            initialConclusion={initialConclusion}
            onSave={(arg) => {
              const client = newClient({
                url: apiUrl,
                fetch,
              });
              client.save(arg).then((response) => {
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
NewArgument.getInitialProps = async ({ query: { premise, conclusion }}) => {
  return {
    premises: normalizePremises(premise),
    conclusion: conclusion || '',
  };
}

// Make sure premises is an array with at least two elements.
// Next may send it as null, string, or array depending on how many query params there are.
function normalizePremises(premises) {
  if (premises === null) {
    return ['', ''];
  }
  if (typeof premises === 'string') {
    return [premises, ''];
  }
  return premises;
}

export default NewArgument;