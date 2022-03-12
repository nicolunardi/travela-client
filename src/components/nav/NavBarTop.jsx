import React, { useContext } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { UserContext } from '../../contexts/UserContext';
import { LogoutButton } from '.';
import { useHistory } from 'react-router-dom';

const NavBarTop = () => {
  const history = useHistory();
  const { user } = useContext(UserContext);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Travela
          </Typography>
          <Button color="inherit" onClick={() => history.push('/')}>
            All listings
          </Button>
          {user.token && (
            <Button
              id="myListingsBtn"
              color="inherit"
              onClick={() => history.push('/user/listings')}
            >
              My listings
            </Button>
          )}
          {!user.token && (
            <Button id="loginBtn" color="inherit" onClick={() => history.push('/login')}>
              Login
            </Button>
          )}
          {user.token && <LogoutButton />}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export { NavBarTop };
