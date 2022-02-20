import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import { DesktopDatePicker } from '@mui/lab';

const styles = {
  dateInput: { mx: 2, my: 1 },
};

const FilterDatePicker = ({
  errors: { error, message },
  setStartDate,
  startDate,
  setEndDate,
  endDate,
}) => {
  const setStartValue = (newStartValue) => {
    setStartDate(newStartValue);
  };

  const setEndValue = (newEndValue) => {
    setEndDate(newEndValue);
  };
  return (
    <>
      <DesktopDatePicker
        label="Start date"
        value={startDate}
        onChange={(newStartValue) => {
          setStartValue(newStartValue);
        }}
        renderInput={(params) => (
          <TextField
            id="startDate"
            sx={styles.dateInput}
            {...params}
            error={error}
            helperText={error ? message : ''}
          />
        )}
      />
      <DesktopDatePicker
        label="End date"
        value={endDate}
        onChange={(newEndValue) => {
          setEndValue(newEndValue);
        }}
        renderInput={(params) => (
          <TextField
            id="endDate"
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

FilterDatePicker.propTypes = {
  errors: PropTypes.object,
  setStartDate: PropTypes.func,
  startDate: PropTypes.any,
  setEndDate: PropTypes.func,
  endDate: PropTypes.any,
};

export default FilterDatePicker;
