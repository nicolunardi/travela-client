import { Button } from '@mui/material';
import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';

const LogoutButton = () => {
  const history = useHistory();
  const { setUser } = useContext(UserContext);
  const handleLogout = () => {
    localStorage.clear();
    setUser({ token: null, email: null });
    history.push('/');
  };
  return (
    <Button id="logoutBtn" onClick={handleLogout} color="inherit">
      logout
    </Button>
  );
};

export { LogoutButton };
