/* @flow */

import React, { Component } from 'react'
import { Route, Link, BrowserRouter } from 'react-router-dom'
import Loadable from 'react-loadable'
import ScrollToTopOnRoute from 'universal/Routes/ScrollToTopOnRoute';
import LoadingPage from 'universal/pages/LoadingPage'


function withRouteOnEnter(WrappedComponent, onEnter) {
  return class OnEnterComponent extends Component {
    componentDidMount() {
      typeof onEnter === 'function' && onEnter(this.props)
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }
}

function withRouteOnLeave(WrappedComponent, onLeave) {
  return class OnLeaveComponent extends Component {
    componentWillUnmount() {
      typeof onLeave === 'function' && onLeave()
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }
}

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
    children: mapNestedRoutes(this.props.routes),
  }

  componentDidMount() {
    this.interval = setInterval(() => this.setState({ val: this.state.val + 1 }), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { children, val } = this.state;
    return <div>
      <h3>counter value is: {val}</h3>
      {children}
    </div>;
  }
}


class Moo extends React.Component {
  render() {
    return <div>
      <h3>Nested Moo component!</h3>
      <div>{JSON.stringify(this.props.match)}</div>
    </div>;
  }
}

const App = ({ children, routes, ...props }) => {
  console.log('!!!!!!!!!! App', children); // children === undefined
  return (
    <ScrollToTopOnRoute>
      <div>
        <h1>app stuff in here...</h1>
        <Link to='/'>root</Link><br/>
        <Link to='/404'>async 404</Link><br/>
        <Link to='/moo'>/moo</Link><br/>
        <Link to='/counter'>/counter</Link><br/>
        <Link to='/counter/moo'>/counter/moo</Link><br/>
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
    </ScrollToTopOnRoute>
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
        onLeave: (props) => console.log('leaving route: /moo', props),
        Component: Moo
      },
      {
        path: "/counter",
        onEnter: (props) => console.log('entering route: /counter', props),
        Component: Counter,
        routes: [
          {
            path: "/counter/moo",
            onEnter: (props) => console.log('entering route: /counter/moo', props),
            Component: Moo
          },
        ],
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

function mapNestedRoutes(routes, provideProps) {
  return routes.map((route, i) => (
    <RouteWithSubRoutes
      key={`${route.path}-${i}`}
      provideProps={provideProps}
      {...route}
    />
  ));
}

function RouteWithSubRoutes(route) {
  const { Component, path, routes, onLeave, onEnter, provideProps } = route;
  return (
    <Route
      path={route.path}
      component={routeProps => {
        console.log('(re)rendering out WrappedComponent!!!');
        const WrappedComponent = withRouteOnLeave(withRouteOnEnter(Component, onEnter), onLeave);
        return (
          <WrappedComponent
            key={route.path}
            routes={routes}
            {...routeProps}
            {...provideProps}
          />
        );
      }}
    />
  );
}

export default () => mapNestedRoutes(routes)
