import React from 'react';
import PropTypes from 'prop-types';
import {
  DialogContent,
  DialogTitle,
  Dialog,
  DialogContentText,
  Button,
  DialogActions,
} from '@mui/material';
import { formatDate, getDuration, getTotalCost } from '../../utils/helper';

const ConfirmBookModal = ({ isOpen, setIsOpen, handleConfirm, dateRange, price }) => {
  // handles the closing of the modal
  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Dialog open={isOpen} onClose={handleClose}>
        <DialogTitle>Confirm booking?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Book for {getDuration(dateRange)} night/s from {formatDate(dateRange.start)} to{' '}
            {formatDate(dateRange.end)} at the cost of ${getTotalCost(price, dateRange)}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button id="confirmBookBtn" variant="contained" color="success" onClick={handleConfirm}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

ConfirmBookModal.propTypes = {
  isOpen: PropTypes.bool,
  setIsOpen: PropTypes.func,
  handleConfirm: PropTypes.func,
  dateRange: PropTypes.object,
  price: PropTypes.number,
};

export default ConfirmBookModal;
