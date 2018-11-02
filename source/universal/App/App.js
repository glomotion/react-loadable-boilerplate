/* @flow */

import React from 'react'

import Routes from 'universal/Routes'
import { Route, Link, BrowserRouter } from 'react-router-dom'

import Page from 'universal/components/Page'

export const App = () => (
  <Page>
    <Routes />
  </Page>
)

export default App
