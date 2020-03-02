import React from 'react';
import { List, Popup, Image } from 'semantic-ui-react';
import { IAttendee } from '../../../app/models/activity';

interface IProps {
  attendees: IAttendee[];
}

const styles = {
  borderColor: 'orange',
  borderWidth: 2
};

const ActivityListItemAttendees: React.FC<IProps> = ({ attendees }) => {
  return (
    <List horizontal>
      {attendees.map(attendee => (
        <List.Item key={attendee.username}>
          <Popup
            content={attendee.displayName}
            trigger={
              <Image
                src={attendee.image || 'assets/user.png'}
                circular
                size="mini"
                bordered
                style={attendee.following ? styles : {}}
              />
            }
          />
        </List.Item>
      ))}
    </List>
  );
};

export default ActivityListItemAttendees;
