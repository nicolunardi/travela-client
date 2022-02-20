import React from 'react';
import PropTypes from 'prop-types';
import { Rating, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { calculateRating } from '../../utils/helper';

const styles = {
  BoxContainer: { display: 'flex', justifyContent: 'flex-start' },
};

const RatingContainer = ({ reviews }) => {
  return (
    <Box sx={styles.BoxContainer}>
      <Rating
        name="read-only"
        value={calculateRating(reviews)}
        precision={0.1}
        readOnly
        size="small"
        sx={{ mr: 1 }}
      />
      <Typography variant="body2" color="text.secondary">
        {reviews.length}
      </Typography>
    </Box>
  );
};

RatingContainer.propTypes = {
  reviews: PropTypes.array,
};

export default RatingContainer;
