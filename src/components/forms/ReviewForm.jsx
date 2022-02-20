import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, DialogActions, DialogContent, Rating, TextField } from '@mui/material';

const styles = {
  rating: {
    py: 2,
  },
  // message: {

  // }
};

const ReviewForm = ({ handlePost, handleClose }) => {
  const [rating, setRating] = useState(3);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({ error: false, message: 'Must not be empty' });

  const handleSubmit = () => {
    if (!message) {
      setErrors({ ...errors, error: true });
    } else {
      setErrors({ ...errors, error: false });
      handlePost(rating, message);
    }
  };

  return (
    <>
      <DialogContent>
        <div>
          <Rating
            aria-label="rating"
            name="rating"
            value={rating}
            onChange={(event, newRating) => {
              if (!newRating) {
                newRating = 1;
              }
              setRating(newRating);
            }}
            sx={styles.rating}
          />
        </div>
        <div>
          <TextField
            label="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            error={errors.error}
            helperText={errors.error ? errors.message : ''}
            fullWidth
            multiline
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={handleClose}>
          Cancel
        </Button>
        <Button color="success" onClick={handleSubmit}>
          Submit
        </Button>
      </DialogActions>
    </>
  );
};

ReviewForm.propTypes = {
  handlePost: PropTypes.func,
  handleClose: PropTypes.func,
};

export default ReviewForm;
