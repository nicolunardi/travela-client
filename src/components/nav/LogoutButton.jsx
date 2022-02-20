import { Button } from '@mui/material';
import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';

import { logout } from '../../service/api';

const LogoutButton = () => {
  const history = useHistory();
  const { setUser } = useContext(UserContext);
  const handleLogout = async () => {
    const response = await logout();
    if (response.status === 200) {
      localStorage.clear();
      setUser({ token: null, email: null });
      history.push('/');
    }
  };
  return (
    <Button id="logoutBtn" onClick={handleLogout} color="inherit">
      logout
    </Button>
  );
};

export { LogoutButton };
