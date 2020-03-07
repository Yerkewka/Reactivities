import React, { useContext, useEffect } from 'react';
import ProfileHeader from './ProfileHeader';
import ProfileContent from './ProfileContent';
import { Grid } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';
import { RouteComponentProps } from 'react-router-dom';
import LoadingComponent from '../../app/layout/LoadingComponent';
import { observer } from 'mobx-react-lite';

interface RouteParams {
  username: string;
}

interface IProps extends RouteComponentProps<RouteParams> {}

const ProfilePage: React.FC<IProps> = ({ match }) => {
  const rootStore = useContext(RootStoreContext);
  const {
    profile,
    profileLoading,
    getProfile,
    follow,
    unfollow,
    isCurrentUser,
    loading,
    setActiveTab
  } = rootStore.profileStore;

  useEffect(() => {
    getProfile(match.params.username);
  }, [getProfile, match]);

  if (profileLoading) return <LoadingComponent content="Loading profile..." />;

  return (
    <Grid>
      <Grid.Column width={16}>
        <ProfileHeader
          profile={profile!}
          isCurrentUser={isCurrentUser}
          loading={loading}
          follow={follow}
          unfollow={unfollow}
        />
        <ProfileContent setActiveTab={setActiveTab} />
      </Grid.Column>
    </Grid>
  );
};

export default observer(ProfilePage);
