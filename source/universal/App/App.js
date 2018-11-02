/* @flow */

import React from 'react'

import Routes from 'universal/Routes'
import { Route, Link, BrowserRouter } from 'react-router-dom'
import ScrollToTopOnRoute from 'universal/Routes/ScrollToTopOnRoute';
import Page from 'universal/components/Page'

export const App = () => (
  <ScrollToTopOnRoute>
    <Routes />
  </ScrollToTopOnRoute>
)

export default App
