import React from 'react';
import { FieldRenderProps } from 'react-final-form';
import { Form, Label } from 'semantic-ui-react';
import { DateTimePicker } from 'react-widgets';
import { DateTimePickerProps } from 'react-widgets/lib/DateTimePicker';

interface IProps
  extends FieldRenderProps<Date, HTMLElement>,
    DateTimePickerProps {}

const DateInput: React.FC<IProps> = ({
  input,
  width,
  date = false,
  time = false,
  placeholder,
  meta: { touched, error },
  ...rest
}) => {
  return (
    <Form.Field error={touched && !!error} width={width}>
      <DateTimePicker
        value={input.value || null}
        onChange={input.onChange}
        onBlur={input.onBlur}
        onKeyDown={e => e.preventDefault()}
        placeholder={placeholder}
        date={date}
        time={time}
        {...rest}
      />
      {touched && error && (
        <Label basic color="red">
          {error}
        </Label>
      )}
    </Form.Field>
  );
};

export default DateInput;
