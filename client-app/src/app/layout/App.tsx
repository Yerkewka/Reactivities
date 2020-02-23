import React, { Fragment, useContext, useEffect } from 'react';
import {
  Route,
  withRouter,
  RouteComponentProps,
  Switch
} from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import Navbar from '../../features/nav/Navbar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import HomePage from '../../features/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import NotFound from './NotFound';
import { ToastContainer } from 'react-toastify';
import { RootStoreContext } from '../stores/rootStore';
import LoadingComponent from './LoadingComponent';
import { observer } from 'mobx-react-lite';
import ModalContainer from '../common/modals/ModalContainer';

const App: React.FC<RouteComponentProps> = ({ location }) => {
  const rootStore = useContext(RootStoreContext);
  const { setAppLoaded, token, appLoaded } = rootStore.commonStore;
  const { getUser } = rootStore.userStore;

  useEffect(() => {
    if (token) {
      getUser().finally(() => setAppLoaded());
    } else {
      setAppLoaded();
    }
  }, [token, getUser, setAppLoaded]);

  if (!appLoaded) return <LoadingComponent content="Loading app..." />;

  return (
    <Fragment>
      <ModalContainer />
      <ToastContainer position="bottom-right" />
      <Route exact path="/" component={HomePage} />
      <Route
        path="/(.+)"
        render={() => (
          <Fragment>
            <Navbar />
            <Container style={{ marginTop: '7em' }}>
              <Switch>
                <Route exact path="/activities" component={ActivityDashboard} />
                <Route
                  exact
                  path="/activities/:id"
                  component={ActivityDetails}
                />
                <Route
                  exact
                  path={['/createActivity', '/manage/:id']}
                  key={location.key}
                  component={ActivityForm}
                />
                <Route component={NotFound} />
              </Switch>
            </Container>
          </Fragment>
        )}
      />
    </Fragment>
  );
};

export default withRouter(observer(App));
