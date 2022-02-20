import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

/**
 * Alert dialog asking if the user is sure they want to delete
 * a particular listing
 * @param {Boolean}  isOpen - if the dialog is open
 * @param {Func}  setIsOpen
 * @param {Func}  setAgree - Set agree based on the users response
 */
const DeleteListingAlert = ({ isOpen, setIsOpen, setAgree }) => {
  const handleClose = () => {
    setAgree(false);
    setIsOpen(false);
  };

  const handleAgree = () => {
    setAgree(true);
    setIsOpen(false);
  };
  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Are you sure you want to delete this listing?
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Deleting a listing will remove it permanently. Are you sure you would like to
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Disagree</Button>
        <Button onClick={handleAgree} autoFocus>
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DeleteListingAlert.propTypes = {
  isOpen: PropTypes.bool,
  setIsOpen: PropTypes.func,
  setAgree: PropTypes.func,
};

export default DeleteListingAlert;
