import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import { DesktopDatePicker } from '@mui/lab';
import { getDatefromDatetime } from '../../../utils/helper';

const styles = {
  dateInput: { mx: 2, my: 1 },
};

const DatePickerRange = ({ idx, availability, setAvailability, errors: { error, message } }) => {
  const setStartValue = (newStartValue) => {
    const newAvailability = [...availability];
    newAvailability[idx].start = getDatefromDatetime(newStartValue);
    setAvailability(newAvailability);
  };

  const setEndValue = (newEndValue) => {
    const newAvailability = [...availability];
    newAvailability[idx].end = getDatefromDatetime(newEndValue);
    setAvailability(newAvailability);
  };

  return (
    <>
      <DesktopDatePicker
        label="Start date"
        value={availability[idx].start}
        onChange={(newStartValue) => {
          setStartValue(newStartValue);
        }}
        renderInput={(params) => (
          <TextField
            id={`startDate${idx}`}
            sx={styles.dateInput}
            {...params}
            error={error}
            helperText={error ? message : ''}
          />
        )}
      />
      <DesktopDatePicker
        label="End date"
        value={availability[idx].end}
        onChange={(newEndValue) => {
          setEndValue(newEndValue);
        }}
        renderInput={(params) => (
          <TextField
            id={`endDate${idx}`}
            sx={styles.dateInput}
            {...params}
            error={error}
            helperText={error ? message : ''}
          />
        )}
      />
    </>
  );
};

DatePickerRange.propTypes = {
  idx: PropTypes.number,
  availability: PropTypes.array,
  setAvailability: PropTypes.func,
  errors: PropTypes.object,
};

export default DatePickerRange;
