import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const UserContext = createContext({});

const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    token: localStorage.getItem('token') || null,
    email: localStorage.getItem('email') || null,
    id: localStorage.getItem('id') || null,
  });

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

UserProvider.propTypes = {
  children: PropTypes.any,
};

export default UserProvider;
