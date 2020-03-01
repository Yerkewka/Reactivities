import React, { useContext, useState } from 'react';
import { RootStoreContext } from '../../app/stores/rootStore';
import { Tab, Grid, Header, Button } from 'semantic-ui-react';
import ProfileEditForm from './ProfileEditForm';

const ProfileDescription = () => {
  const rootStore = useContext(RootStoreContext);
  const { profile, isCurrentUser } = rootStore.profileStore;
  const [editMode, setEditMode] = useState(false);

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16} style={{ paddingBottom: 0 }}>
          <Header
            floated="left"
            icon="user"
            content={`About ${profile!.displayName}`}
          />
          {isCurrentUser && (
            <Button
              basic
              floated="right"
              content={editMode ? 'Cancel' : 'Edit Profile'}
              onClick={() => setEditMode(!editMode)}
            />
          )}
        </Grid.Column>
        <Grid.Column width={16}>
          {editMode ? <ProfileEditForm /> : <div>{profile!.bio}</div>}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default ProfileDescription;
