import { Router, Route } from 'react-router';
import BrowserHistory from 'react-router/lib/BrowserHistory';
import relayNestedRoutes from 'relay-nested-routes';
import App from './components/App';
import Contact from './components/Contact/Contact';

const NestedRootContainer = relayNestedRoutes(React, Relay);

var HomeQueries = {
  viewer: (Component) => Relay.QL`
    query RootQuery {
      viewer {
        ${Component.getFragment('viewer')},
      },
    }
  `,
};

var ContactQueries = {
  contact: (Component) => Relay.QL`
    query RootQuery {
      node(id: $id) {
        ${Component.getFragment('contact')},
      },
    }
  `,
  viewer: (Component) => Relay.QL`
    query RootQuery {
      viewer {
        ${Component.getFragment('viewer')},
      },
    }
  `,
};

React.render(
  <Router history={new BrowserHistory()}>
    <Route component={NestedRootContainer}>
      <Route
        name='home'
        path='/'
        component={App}
        queries={HomeQueries}
      />
      <Route
        name='contact'
        path='/contact/:id'
        component={Contact}
        queries={ContactQueries}
      />
    </Route>
  </Router>,
  document.getElementById('root')
);
