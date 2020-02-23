import React, { useContext, Fragment } from 'react';
import { observer } from 'mobx-react-lite';
import { Item, Label } from 'semantic-ui-react';
import ActivityListItem from './ActivityListItem';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { format } from 'date-fns';

const ActivityList: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const { activitiesByDate } = rootStore.activityStore;

  return (
    <Fragment>
      {activitiesByDate.map(([group, activity]) => (
        <Fragment key={group}>
          <Label size="large" color="blue">
            {format(group, 'eeee do MMMM')}
          </Label>
          <Item.Group divided>
            {activity.map(activity => (
              <ActivityListItem key={activity.id} activity={activity} />
            ))}
          </Item.Group>
        </Fragment>
      ))}
    </Fragment>
  );
};

export default observer(ActivityList);
