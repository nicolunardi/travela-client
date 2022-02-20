import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';

const styles = {
  alert: { width: '100%', zIndex: 2000 },
};

const AlertMsg = ({ message, isOpen, setIsOpen, success, style = {} }) => {
  // Creates and alert banner that displays an error/success message
  return (
    <Box sx={{ ...styles.alert, ...style }}>
      <Collapse in={isOpen}>
        <Alert
          severity={success ? 'success' : 'error'}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setIsOpen(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2, mt: 2 }}
        >
          {message}
        </Alert>
      </Collapse>
    </Box>
  );
};

AlertMsg.propTypes = {
  message: PropTypes.string,
  isOpen: PropTypes.bool,
  setIsOpen: PropTypes.func,
  success: PropTypes.bool,
  style: PropTypes.object,
};

export default AlertMsg;
