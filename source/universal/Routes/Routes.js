/* @flow */

import React from 'react'
import { Route, Link } from 'react-router-dom'
import Loadable from 'react-loadable'

import LoadingPage from 'universal/pages/LoadingPage'

const NotFound = Loadable({
  loader: () => import('universal/pages/NotFoundPage/NotFoundPage'),
  loading: LoadingPage,
})

const About = ({ routes, account, user }) => {
  console.log('ABOUT:', account, user);
  return (
    <div>
      <h2>Nested About ... </h2>
      <div>{JSON.stringify(user)}</div>
      <div>{JSON.stringify(account)}</div>
      {mapNestedRoutes(routes)}
    </div>
  );
};

class Counter extends React.Component {
  state = {
    val: 0,
  }

  componentDidMount() {
    this.interval = setInterval(() => this.setState({ val: this.state.val + 1 }), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return <h3>counter value is: {this.state.val}</h3>;
  }
}

const Moo = () => {
  return <h2>Nested Moo cow</h2>;
};

const App = ({ children, routes }) => {
  // console.log(children); // undefined
  return (
    <div>
      <h1>app stuff in here...</h1>
      <Link to='/'>root</Link><br/>
      <Link to='/404'>async 404</Link><br/>
      <Link to='/moo'>/moo</Link><br/>
      <Link to='/counter'>/counter</Link><br/>
      <Link to='/about'>/about</Link><br/>
      <Link to='/about/moo'>/about/moo</Link><br/>
      {mapNestedRoutes(routes, {
        account: {
          wallet: 'moo cow',
        },
        user: {
          id: 'bob the builder',
          email: 'bob@builder.com',
        }
      })}
    </div>
  );
}

const routes = [
  {
    path: "/",
    Component: App,
    routes: [
      {
        path: "/404",
        Component: NotFound,
      },
      {
        path: "/moo",
        Component: Moo
      },
      {
        path: "/counter",
        onEnter: () => console.log('counter route/component onEnter!!!'),
        Component: Counter,
      },
      {
        path: "/about",
        Component: About,
        routes: [
          {
            path: "/about/moo",
            Component: Moo
          },
        ],
      },
    ],
  },
];

export const Routes = () => mapNestedRoutes(routes);

function mapNestedRoutes(routes, mergeInProps) {
  return routes.map((route, i) => (
    <RouteWithSubRoutes key={i} {...route} mergeInProps={mergeInProps} />
  ))
}

function RouteWithSubRoutes(route) {
  const { Component, path, routes, onEnter, mergeInProps } = route;
  return (
    <Route
      path={route.path}
      render={routerProps => {
        if (typeof onEnter === 'function') onEnter();
        return (
          <Component
            routes={routes}
            {...routerProps}
            {...mergeInProps}
          />
        );
      }}
    />
  );
}

export default Routes


// const withRouteOnEnter = callback => BaseComponent => {
//   const routeOnEnterCallback = (props) => {
//     if (callback && typeof callback === 'function') {
//       callback(props)
//     }
//   }
//
//   class routeOnEnterComponent extends React.Component {
//     componentWillMount() {
//       routeOnEnterCallback(this.props)
//     }
//
//     componentWillReceiveProps(nextProps) {
//       // not 100% sure about using `locatoin.key` to distinguish between routes
//       if (nextProps.location.key !== this.props.location.key) {
//         routeOnEnterCallback(nextProps)
//       }
//     }
//
//     render() {
//       return <BaseComponent {...this.props} />
//     }
//   }
//
//   return routeOnEnterComponent
// }
//
// ...
//
// const loadData = props => {
//   fetchStuff(props.someId)
// }
//  
// <Route path="/articles/:id" component={withRouteOnEnter(loadData)(ArticleViewContainer)} />
