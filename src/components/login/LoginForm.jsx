import React, { useState, useContext } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { Button, Container, Grid, Link, Paper, TextField, Typography } from '@mui/material';

import { UserContext } from '../../contexts/UserContext';
import { login } from '../../service/api';
import { AlertMsg } from '../alerts';

const styles = {
  paperStyle: {
    padding: 20,
    height: 'fit-content',
    margin: '20px auto',
    width: 400,
  },
  container: { display: 'flex', pt: 2, justifyContent: 'space-between' },
};

const LoginForm = () => {
  const history = useHistory();
  const { setUser } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState({
    error: false,
    errorMessage: 'Invalid email',
    default: 'example@email.com',
  });
  const [passwordError, setPasswordError] = useState({
    error: false,
    errorMessage: 'Invalid password',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorMsg, setShowErrorMsg] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e, errorSetter, valueSetter, error) => {
    valueSetter(e.target.value);
    if (!e.target.value) {
      errorSetter({ ...error, error: true });
    } else {
      errorSetter({ ...error, error: false });
    }
  };

  const handleSubmit = async () => {
    setShowErrorMsg(true);
    // if there are no errors
    if (!emailError.error && !passwordError.error) {
      // if the email and password fields are not empty
      if (email && password) {
        const response = await login({ email: email, password: password });
        if (response.status === 200) {
          setSuccess(true);
          setErrorMessage('successfully logged in');
          setUser({ token: response.data.token, email: localStorage.getItem('email') });
          history.goBack();
        } else {
          setErrorMessage(response.data.error);
          setSuccess(false);
        }
      } else {
        if (!email) {
          setEmailError({ ...emailError, error: true });
          setShowErrorMsg(false);
        }
        if (!password) {
          setPasswordError({ ...passwordError, error: true });
          setShowErrorMsg(false);
        }
      }
    } else {
      setErrorMessage('All fields are required');
      setSuccess(false);
    }
  };
  return (
    <div>
      <Grid>
        <Paper elevation={10} style={styles.paperStyle}>
          <form
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleSubmit();
            }}
          >
            <Grid mt={4} align="center">
              <Typography variant="h2" color="initial">
                Login
              </Typography>
              <Container sx={{ mt: 4 }}>
                <TextField
                  name="email"
                  id="loginEmail"
                  label="email"
                  value={email}
                  onChange={(e) => handleChange(e, setEmailError, setEmail, emailError)}
                  fullWidth
                  required
                  type="email"
                  error={emailError.error}
                  helperText={emailError.error ? emailError.errorMessage : emailError.default}
                />
                <TextField
                  name="password"
                  id="loginPassword"
                  label="password"
                  value={password}
                  onChange={(e) => handleChange(e, setPasswordError, setPassword, passwordError)}
                  fullWidth
                  sx={{ mt: 2 }}
                  type="password"
                  error={passwordError.error}
                  helperText={passwordError.error ? passwordError.errorMessage : ''}
                  required
                />
              </Container>
            </Grid>
          </form>
          <Grid mt={2}>
            <Container sx={styles.container}>
              <Button id="loginSubmit" variant="contained" onClick={handleSubmit}>
                Login
              </Button>
              <Link id="registerBtn" component={RouterLink} to="/register">
                Register
              </Link>
            </Container>
          </Grid>
          <AlertMsg
            message={errorMessage}
            isOpen={showErrorMsg}
            setIsOpen={setShowErrorMsg}
            success={success}
          ></AlertMsg>
        </Paper>
      </Grid>
    </div>
  );
};

export default LoginForm;
