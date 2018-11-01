/* @flow */

import React from 'react'
import { Route } from 'react-router-dom'
import Loadable from 'react-loadable'

import { LoadingPage } from 'universal/pages/LoadingPage/LoadingPage'


const Loading = () => Loadable({
  loader: () => import('../LoadingPage'),
  loading: LoadingPage,
})

const About = () => {
  return <h2>About ...</h2>;
};

const Moo = () => {
  return <h2>Moo cow</h2>;
};

const App = ({ children, routes }) => {
  console.log(children);
  return (
    <div>
      <h1>app in here...</h1>
      {routes.map((route, i) => (
        <RouteWithSubRoutes key={i} {...route} />
      ))}
    </div>
  );
}

const routes = [
  {
    path: "/",
    component: App,
    routes: [
      {
        path: "/moo",
        component: Moo
      },
      {
        path: "/about",
        component: About
      }
    ]
  }
];

export const Routes = () => {
  return routes.map((route, i) => {
    return <RouteWithSubRoutes key={i} {...route} />
  });
}

function RouteWithSubRoutes(route) {
  return (
    <Route
      path={route.path}
      render={props => (
        // pass the sub-routes down to keep nesting
          <route.component {...props} routes={route.routes} />
      )}
    />
  );
}

export default Routes
