import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import ActivityStore from '../../../app/stores/activityStore';
import { Card, Image, Button } from 'semantic-ui-react';

const ActivityDetails: React.FC = () => {
  const activityStore = useContext(ActivityStore);
  const {
    selectedActivity: activity,
    selectActivity,
    openEditForm
  } = activityStore;

  return (
    activity && (
      <Card fluid>
        <Image
          src={`/assets/categoryImages/${activity.category}.jpg`}
          wrapped
          ui={false}
        />
        <Card.Content>
          <Card.Header>{activity.title}</Card.Header>
          <Card.Meta>
            <span>{activity.date}</span>
          </Card.Meta>
          <Card.Description>{activity.description}</Card.Description>
        </Card.Content>
        <Card.Content extra>
          <Button.Group widths={2}>
            <Button
              basic
              color="blue"
              content="Edit"
              onClick={() => openEditForm(activity.id)}
            />
            <Button
              basic
              color="grey"
              content="Cancel"
              onClick={() => selectActivity('')}
            />
          </Button.Group>
        </Card.Content>
      </Card>
    )
  );
};

export default observer(ActivityDetails);
