import React from 'react';
import PropTypes from 'prop-types';
import { Paper, Container } from '@mui/material';

const styles = {
  paper: {
    pt: 2,
  },
};

const ImageItem = ({ image }) => {
  return (
    <Paper elevation={10} sx={styles.paper}>
      <Container>
        <img src={image} alt="property" width="100%"></img>
      </Container>
    </Paper>
  );
};

ImageItem.propTypes = {
  image: PropTypes.string,
};

export default ImageItem;
