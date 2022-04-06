import React from 'react';
import PropTypes from 'prop-types';
import { capitalize, Container, Paper, Rating, Typography } from '@mui/material';
import { Box } from '@mui/system';

const styles = {
  paper: {
    py: 2,
    px: 3,
    my: 2,
  },
  box: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  reviewText: {
    py: 2,
    mx: 4,
    maxWidth: '100%',
    overflowWrap: 'anywhere',
  },
};

const ReviewContainer = ({ review }) => {
  return (
    <Paper sx={styles.paper}>
      <Container>
        <Box sx={styles.box}>
          <Typography variant="subtitle2">By {capitalize(review.owner_name)}</Typography>
          <Rating name="read-only" value={review.rating} precision={0.1} readOnly size="small" />
        </Box>
        <Typography variant="body2" sx={styles.reviewText}>
          {review.text}
        </Typography>
      </Container>
    </Paper>
  );
};

ReviewContainer.propTypes = {
  review: PropTypes.object,
};

export default ReviewContainer;
