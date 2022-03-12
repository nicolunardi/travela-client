import React, { useContext, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Container, Grid, Link, Paper, TextField, Typography } from '@mui/material';
import { AlertMsg } from '../alerts';
import { register } from '../../service/api';
import { UserContext } from '../../contexts/UserContext';

const styles = {
  paperStyle: {
    padding: 20,
    height: 'fit-content',
    minHeight: '70vh',
    margin: '20px auto',
    width: 400,
  },
  inputs: { mt: 2 },
  container: { display: 'flex', pt: 2, justifyContent: 'space-between' },
};

const RegisterForm = () => {
  const { setUser } = useContext(UserContext);
  const [fields, setFields] = useState({
    name: '',
    email: '',
    password: '',
    confPassword: '',
  });
  const [errors, setErrors] = useState({
    name: {
      error: false,
      errorMessage: 'Invalid name',
    },
    email: {
      error: false,
      errorMessage: 'Invalid email',
      helper: 'example@email.com',
    },
    password: {
      error: false,
      errorMessage: 'Invalid password',
    },
    confPassword: {
      error: false,
      errorMessage: 'Invalid password',
    },
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorMsg, setShowErrorMsg] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e, error) => {
    setFields({ ...fields, [error]: e.target.value });
    const newErrors = {
      ...errors,
    };
    if (!e.target.value) {
      newErrors[error].error = true;
      setErrors(newErrors);
    } else {
      newErrors[error].error = false;
      setErrors(newErrors);
    }
  };

  const handleSubmit = async () => {
    setShowErrorMsg(true);
    if (
      !errors.name.error &&
      !errors.email.error &&
      !errors.password.error &&
      !errors.confPassword.error
    ) {
      const newErrors = {
        ...errors,
      };
      // check passwords match
      if (fields.password !== fields.confPassword) {
        newErrors.password.error = true;
        newErrors.confPassword.error = true;
        setErrors(newErrors);
        setErrorMessage('Passwords must match');
        setSuccess(false);
      } else {
        newErrors.password.error = false;
        newErrors.confPassword.error = false;
        setErrors(newErrors);
        const response = await register({
          email: fields.email,
          password: fields.password,
          name: fields.name,
        });
        if (response.status >= 200 && response.status < 300) {
          setErrorMessage('successfully registered in');
          setSuccess(true);
          setUser({ token: response.data.token, email: localStorage.getItem('email') });
        } else {
          setErrorMessage(response.data.detail);
          setSuccess(false);
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
                Register
              </Typography>
              <Container sx={{ mt: 4 }}>
                <TextField
                  id="registerName"
                  label="name"
                  value={fields.name}
                  onChange={(e) => handleChange(e, 'name')}
                  fullWidth
                  sx={styles.inputs}
                  type="text"
                  error={errors.name.error}
                  helperText={errors.name.error ? errors.name.errorMessage : ''}
                  required
                />
                <TextField
                  id="registerEmail"
                  label="email"
                  value={fields.email}
                  onChange={(e) => handleChange(e, 'email')}
                  fullWidth
                  required
                  sx={styles.inputs}
                  type="email"
                  error={errors.email.error}
                  helperText={errors.email.error ? errors.email.errorMessage : errors.email.helper}
                />
                <TextField
                  id="registerPassword"
                  label="password"
                  value={fields.password}
                  onChange={(e) => handleChange(e, 'password')}
                  fullWidth
                  required
                  sx={styles.inputs}
                  type="password"
                  error={errors.password.error}
                  helperText={errors.password.error ? errors.password.errorMessage : ''}
                />
                <TextField
                  id="registerConfPassword"
                  label="confirm password"
                  value={fields.confPassword}
                  onChange={(e) => handleChange(e, 'confPassword')}
                  fullWidth
                  required
                  type="password"
                  sx={styles.inputs}
                  error={errors.confPassword.error}
                  helperText={errors.confPassword.error ? errors.confPassword.errorMessage : ''}
                />
              </Container>
            </Grid>
          </form>
          <Grid mt={2}>
            <Container sx={styles.container}>
              <Button variant="contained" onClick={handleSubmit}>
                register
              </Button>
              <Link component={RouterLink} to="/login">
                Already Registered?
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

export { RegisterForm };
