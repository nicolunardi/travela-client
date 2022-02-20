import React from 'react';
import PropTypes from 'prop-types';
import { DialogTitle, Dialog } from '@mui/material';
import { ReviewForm } from '../forms';

const ReviewModal = ({ isOpen, setIsOpen, handlePost }) => {
  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <Dialog fullWidth open={isOpen} onClose={handleClose}>
        <DialogTitle>Leave a review</DialogTitle>
        <ReviewForm handleClose={handleClose} handlePost={handlePost}></ReviewForm>
      </Dialog>
    </div>
  );
};

ReviewModal.propTypes = {
  isOpen: PropTypes.bool,
  setIsOpen: PropTypes.func,
  handlePost: PropTypes.func,
};

export default ReviewModal;
