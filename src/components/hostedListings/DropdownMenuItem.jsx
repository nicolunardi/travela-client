import React from 'react';
import PropTypes from 'prop-types';
import { ListItemIcon, ListItemText, MenuItem } from '@mui/material';

const DropdownMenuItem = ({ onClick, icon, text }) => {
  return (
    <MenuItem onClick={onClick}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText>{text}</ListItemText>
    </MenuItem>
  );
};

DropdownMenuItem.propTypes = {
  onClick: PropTypes.func,
  icon: PropTypes.node,
  text: PropTypes.string,
};

export default DropdownMenuItem;
