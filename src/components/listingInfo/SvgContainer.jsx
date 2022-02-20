import React from 'react';
import PropTypes from 'prop-types';
import { Container } from '@mui/material';

const SvgContainer = ({ image }) => {
  return (
    <Container>
      <img src={image} width="100%"></img>
    </Container>
  );
};

SvgContainer.propTypes = {
  image: PropTypes.string,
};

export default SvgContainer;
