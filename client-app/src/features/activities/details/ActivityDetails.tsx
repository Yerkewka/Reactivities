import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import ActivityStore from '../../../app/stores/activityStore';
import { Grid } from 'semantic-ui-react';
import { RouteComponentProps } from 'react-router-dom';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import ActivityDetailedHeader from './ActivityDetailedHeader';
import ActivityDetailedInfo from './ActivityDetailedInfo';
import ActivityDetailedChat from './ActivityDetailedChat';
import ActivityDetailedSidebar from './ActivityDetailedSidebar';

interface IDetailParams {
  id: string;
}

const ActivityDetails: React.FC<RouteComponentProps<IDetailParams>> = ({
  match
}) => {
  const activityStore = useContext(ActivityStore);
  const {
    selectedActivity: activity,
    loadActivity,
    loadingInitial
  } = activityStore;

  useEffect(() => {
    loadActivity(match.params.id);
  }, [loadActivity, match.params.id]);

  if (loadingInitial) return <LoadingComponent content="Loading activity..." />;

  return (
    activity && (
      <Grid>
        <Grid.Column width="10">
          <ActivityDetailedHeader activity={activity} />
          <ActivityDetailedInfo activity={activity} />
          <ActivityDetailedChat />
        </Grid.Column>
        <Grid.Column width="6">
          <ActivityDetailedSidebar />
        </Grid.Column>
      </Grid>
    )
  );
};

export default observer(ActivityDetails);
