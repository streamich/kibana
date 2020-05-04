/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { Component, Fragment } from 'react';
import { Route, Switch, Redirect, withRouter, RouteComponentProps } from 'react-router-dom';
import { History } from 'history';
import { i18n } from '@kbn/i18n';
import { FormattedMessage } from '@kbn/i18n/react';

import {
  EuiEmptyPrompt,
  EuiFlexGroup,
  EuiFlexItem,
  EuiLoadingSpinner,
  EuiPageContent,
  EuiSpacer,
  EuiTitle,
} from '@elastic/eui';

import { BASE_PATH } from '../../common/constants';
import { getFatalErrors } from './services/notifications';
import { SectionError } from './components';
import { routing } from './services/routing';
// @ts-ignore
import { loadPermissions } from './services/api';

// @ts-ignore
import {
  CrossClusterReplicationHome,
  AutoFollowPatternAdd,
  AutoFollowPatternEdit,
  FollowerIndexAdd,
  FollowerIndexEdit,
} from './sections';

interface AppProps {
  history: History;
  location: any;
}

interface AppState {
  isFetchingPermissions: boolean;
  fetchPermissionError: any;
  hasPermission: boolean;
  missingClusterPrivileges: any[];
}

class AppComponent extends Component<RouteComponentProps & AppProps, AppState> {
  constructor(props: any) {
    super(props);
    this.registerRouter();

    this.state = {
      isFetchingPermissions: false,
      fetchPermissionError: undefined,
      hasPermission: false,
      missingClusterPrivileges: [],
    };
  }

  componentDidMount() {
    this.checkPermissions();
  }

  async checkPermissions() {
    this.setState({
      isFetchingPermissions: true,
    });

    try {
      const { hasPermission, missingClusterPrivileges } = await loadPermissions();

      this.setState({
        isFetchingPermissions: false,
        hasPermission,
        missingClusterPrivileges,
      });
    } catch (error) {
      // Expect an error in the shape provided by Angular's $http service.
      if (error && error.body) {
        return this.setState({
          isFetchingPermissions: false,
          fetchPermissionError: error,
        });
      }

      // This error isn't an HTTP error, so let the fatal error screen tell the user something
      // unexpected happened.
      getFatalErrors().add(
        error,
        i18n.translate('xpack.crossClusterReplication.app.checkPermissionsFatalErrorTitle', {
          defaultMessage: 'Cross-Cluster Replication app',
        })
      );
    }
  }

  registerRouter() {
    const { history, location } = this.props;
    routing.reactRouter = {
      history,
      route: {
        location,
      },
    };
  }

  render() {
    const {
      isFetchingPermissions,
      fetchPermissionError,
      hasPermission,
      missingClusterPrivileges,
    } = this.state;

    if (isFetchingPermissions) {
      return (
        <EuiPageContent horizontalPosition="center">
          <EuiFlexGroup alignItems="center" gutterSize="m">
            <EuiFlexItem grow={false}>
              <EuiLoadingSpinner size="l" />
            </EuiFlexItem>

            <EuiFlexItem>
              <EuiTitle size="s">
                <h2>
                  <FormattedMessage
                    id="xpack.crossClusterReplication.app.permissionCheckTitle"
                    defaultMessage="Checking permissions…"
                  />
                </h2>
              </EuiTitle>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiPageContent>
      );
    }

    if (fetchPermissionError) {
      return (
        <Fragment>
          <SectionError
            title={
              <FormattedMessage
                id="xpack.crossClusterReplication.app.permissionCheckErrorTitle"
                defaultMessage="Error checking permissions"
              />
            }
            error={fetchPermissionError}
          />

          <EuiSpacer size="m" />
        </Fragment>
      );
    }

    if (!hasPermission) {
      return (
        <EuiPageContent horizontalPosition="center">
          <EuiEmptyPrompt
            iconType="securityApp"
            title={
              <h2>
                <FormattedMessage
                  id="xpack.crossClusterReplication.app.deniedPermissionTitle"
                  defaultMessage="You're missing cluster privileges"
                />
              </h2>
            }
            body={
              <p>
                <FormattedMessage
                  id="xpack.crossClusterReplication.app.deniedPermissionDescription"
                  defaultMessage="To use Cross-Cluster Replication, you must have {clusterPrivilegesCount,
                    plural, one {this cluster privilege} other {these cluster privileges}}: {clusterPrivileges}."
                  values={{
                    clusterPrivileges: missingClusterPrivileges.join(', '),
                    clusterPrivilegesCount: missingClusterPrivileges.length,
                  }}
                />
              </p>
            }
          />
        </EuiPageContent>
      );
    }

    return (
      <div>
        <Switch>
          <Redirect exact from={`${BASE_PATH}`} to={`${BASE_PATH}/follower_indices`} />
          <Route
            exact
            path={`${BASE_PATH}/auto_follow_patterns/add`}
            component={AutoFollowPatternAdd}
          />
          <Route
            exact
            path={`${BASE_PATH}/auto_follow_patterns/edit/:id`}
            component={AutoFollowPatternEdit}
          />
          <Route exact path={`${BASE_PATH}/follower_indices/add`} component={FollowerIndexAdd} />
          <Route
            exact
            path={`${BASE_PATH}/follower_indices/edit/:id`}
            component={FollowerIndexEdit}
          />
          <Route exact path={`${BASE_PATH}/:section`} component={CrossClusterReplicationHome} />
        </Switch>
      </div>
    );
  }
}

export const App = withRouter(AppComponent);
