import React, { useState } from 'react';
import PropTypes from 'prop-types';
import DateAdapter from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePickerRange from './formInputs/DatePickerRange';
import {
  Button,
  Grid,
  Typography,
  IconButton,
  DialogContent,
  DialogContentText,
  Divider,
  DialogActions,
} from '@mui/material';
import { isValidDateRange } from '../../utils/helper';
import DeleteIcon from '@mui/icons-material/Delete';
import { pink } from '@mui/material/colors';

const styles = {
  addBtn: {
    width: '100%',
  },
};

const AvailabilityForm = ({ handleClose, handlePublish }) => {
  const [availability, setAvailability] = useState([{ start: '', end: '' }]);
  const [errors, setErrors] = useState([{ error: false, message: 'Enter valid dates' }]);

  const handleAddMore = () => {
    // ensure every date is valid and filled
    if (validateDates()) {
      setAvailability(availability.concat({ start: '', end: '' }));
      setErrors(availability.concat({ error: false, message: 'Enter valid dates' }));
    }
  };

  // checks that all the dates provided are valid, ie. first date comes before
  // second date and not empty
  const validateDates = () => {
    const newErrors = [...errors];
    let noErrors = true;
    for (const idx in availability) {
      const date1 = availability[idx].start;
      const date2 = availability[idx].end;
      if (
        !availability[idx].start ||
        !availability[idx].end ||
        !isValidDateRange(new Date(date1), new Date(date2))
      ) {
        newErrors[idx].error = true;
        noErrors = false;
      } else {
        newErrors[idx].error = false;
      }
    }
    setErrors(newErrors);
    return noErrors;
  };

  // removes extra date range pickers
  const removeDateRange = (idx) => {
    setAvailability(availability.filter((date, index) => index !== idx));
    setErrors(errors.filter((date, index) => index !== idx));
  };

  const handleSubmit = () => {
    if (validateDates()) {
      handlePublish(availability);
      handleClose();
    }
  };

  return (
    <>
      <DialogContent>
        <DialogContentText>
          Enter the dates you wish the listing to be available for.
        </DialogContentText>
        <Grid container align="center">
          <LocalizationProvider dateAdapter={DateAdapter}>
            {availability.map((dateRange, idx) => (
              <div key={idx}>
                <Typography variant="body1" color="initial">
                  Date range {idx + 1}
                  {availability.length > 1 && (
                    <IconButton aria-label="remove dates" onClick={() => removeDateRange(idx)}>
                      <DeleteIcon sx={{ color: pink[400] }} fontSize="small"></DeleteIcon>
                    </IconButton>
                  )}
                </Typography>
                <DatePickerRange
                  idx={idx}
                  availability={availability}
                  setAvailability={setAvailability}
                  errors={errors[idx]}
                ></DatePickerRange>
              </div>
            ))}
          </LocalizationProvider>
        </Grid>
        <Button onClick={handleAddMore} sx={styles.addBtn}>
          Add more
        </Button>
      </DialogContent>
      <Divider light />
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button id="submitAvailabilityBtn" color="success" onClick={handleSubmit}>
          Submit
        </Button>
      </DialogActions>
    </>
  );
};

AvailabilityForm.propTypes = {
  handlePublish: PropTypes.func,
  handleClose: PropTypes.func,
};

export default AvailabilityForm;
