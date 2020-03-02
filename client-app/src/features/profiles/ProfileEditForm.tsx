import React, { useContext } from 'react';
import { Form as FinalForm, Field } from 'react-final-form';
import { RootStoreContext } from '../../app/stores/rootStore';
import TextInput from '../../app/common/form/TextInput';
import TextAreaInput from '../../app/common/form/TextAreaInput';
import { Form, Button } from 'semantic-ui-react';
import {
  combineValidators,
  isRequired,
  composeValidators,
  hasLengthGreaterThan,
  hasLengthLessThan
} from 'revalidate';
import { observer } from 'mobx-react-lite';

const validate = combineValidators({
  displayName: composeValidators(
    isRequired('displayName'),
    hasLengthGreaterThan(2)({
      message: 'Length should be greater than 3'
    })
  )(),
  bio: composeValidators(
    isRequired('bio'),
    hasLengthLessThan(1000)({
      message: 'Length should be less than 1000'
    })
  )()
});

const ProfileEditForm = () => {
  const rootStore = useContext(RootStoreContext);
  const { profile, editProfile } = rootStore.profileStore;
  const profileFormValues = {
    displayName: profile!.displayName,
    bio: profile!.bio
  };

  return (
    <FinalForm
      initialValues={profileFormValues}
      validate={validate}
      onSubmit={editProfile}
      render={({ handleSubmit, invalid, pristine, submitting }) => (
        <Form onSubmit={handleSubmit} error>
          <Field
            name="displayName"
            placeholder="displayName"
            value={profileFormValues.displayName}
            component={TextInput}
          />
          <Field
            name="bio"
            placeholder="bio"
            rows={3}
            value={profileFormValues.bio}
            component={TextAreaInput}
          />
          <Button
            floated="right"
            type="submit"
            loading={submitting}
            disabled={invalid || pristine}
            positive
            content="Update profile"
          />
        </Form>
      )}
    ></FinalForm>
  );
};

export default observer(ProfileEditForm);
