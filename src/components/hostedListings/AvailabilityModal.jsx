import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import AvailabilityForm from '../forms/AvailabilityForm';

const AvailabilityModal = ({ isOpen, setIsOpen, handlePublish }) => {
  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <Dialog open={isOpen} onClose={handleClose}>
        <DialogTitle>Availability</DialogTitle>
        <AvailabilityForm
          handleClose={handleClose}
          handlePublish={handlePublish}
        ></AvailabilityForm>
      </Dialog>
    </div>
  );
};

AvailabilityModal.propTypes = {
  isOpen: PropTypes.bool,
  setIsOpen: PropTypes.func,
  handlePublish: PropTypes.func,
};

export default AvailabilityModal;
