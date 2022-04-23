import { Container } from '@mui/material';
import React from 'react';
import PropTypes from 'prop-types';
import { SvgContainer } from '../listingInfo';

const style = {
  container: {
    maxWidth: '400px',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    height: '400px',
    marginTop: '50px',
  },
};

const LoadingContainer = ({ image }) => {
  return (
    <Container style={style.container}>
      <SvgContainer image={image}></SvgContainer>
      <p>Fetching listings...</p>
    </Container>
  );
};

LoadingContainer.propTypes = {
  image: PropTypes.string,
};

export default LoadingContainer;
