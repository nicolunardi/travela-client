import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';
import DateAdapter from '@mui/lab/AdapterDateFns';
import { differenceInCalendarDays } from 'date-fns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { Box } from '@mui/system';
import { Button, Typography } from '@mui/material';
import { FilterDatePicker } from './formInputs';
import { UserContext } from '../../contexts/UserContext';
import loginImage from '../../assets/svg/mustLogIn.svg';
import { SvgContainer } from '../listingInfo';
import { ConfirmBookModal } from '../modals';
import { newBooking } from '../../service/api';
import { getTotalCost } from '../../utils/helper';
import { AlertMsg } from '../alerts';

const styles = {
  box: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    gap: 3,
    pt: 5,
  },
  alert: {
    width: '100vw !important',
    position: 'fixed',
    top: 0,
    left: 0,
  },
};

const BookingForm = ({
  start,
  end,
  price,
  listingId,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}) => {
  const { user } = useContext(UserContext);
  const history = useHistory();
  const [errors, setErrors] = useState({ error: false, message: 'Enter valid dates' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [success, setSuccess] = useState(true);
  const [alertMessage, setAlertMessage] = useState('');

  // checks if the dates are invalid. This means the date is the same
  // or the end date is before the first date. Does so by checking the range
  // between the dates.
  const isInvalidDate = () => {
    return differenceInCalendarDays(endDate, startDate) < 1;
  };

  // checks for errors in the dates and if none present then opens the
  // confirmation modal
  const handleOpenModal = () => {
    if (!startDate || !endDate || isInvalidDate()) {
      setErrors({ ...errors, error: true });
    } else {
      setErrors({ ...errors, error: false });
      setIsModalOpen(true);
    }
  };

  const handleConfirm = async () => {
    const dateRange = { start: startDate, end: endDate };
    const body = {
      dateRange: dateRange,
      totalPrice: getTotalCost(price, dateRange),
    };
    const res = await newBooking(listingId, body);
    if (res.status === 200) {
      setAlertMessage('Booked successfully, now the host just needs to confirm.');
      setSuccess(true);
      setShowAlert(true);
      setIsModalOpen(false);
      setTimeout(() => setShowAlert(false), 3000);
    } else {
      const errorMessage = res.data?.error || 'Something went wrong, please try again';
      setAlertMessage(errorMessage);
      setSuccess(false);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  return (
    <Box sx={styles.box}>
      {user.token && (
        <>
          <Typography variant="h6" align="center">
            Would you like to book?
          </Typography>
          <LocalizationProvider dateAdapter={DateAdapter}>
            <FilterDatePicker
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              startDate={startDate}
              endDate={endDate}
              errors={errors}
            />
          </LocalizationProvider>
          <Button id="bookBtn" variant="contained" onClick={handleOpenModal}>
            Book
          </Button>
          {isModalOpen && (
            <ConfirmBookModal
              isOpen={isModalOpen}
              setIsOpen={setIsModalOpen}
              dateRange={{ start: startDate, end: endDate }}
              handleConfirm={handleConfirm}
              price={price}
            ></ConfirmBookModal>
          )}
        </>
      )}
      {!user.token && (
        <>
          <SvgContainer image={loginImage}></SvgContainer>
          <Typography align="center">You must be logged in to book</Typography>
          <Button variant="contained" onClick={() => history.push('/login')}>
            Login
          </Button>
        </>
      )}
      {showAlert && (
        <AlertMsg
          isOpen={showAlert}
          setIsOpen={setShowAlert}
          success={success}
          style={styles.alert}
          message={alertMessage}
        ></AlertMsg>
      )}
    </Box>
  );
};

BookingForm.propTypes = {
  start: PropTypes.string,
  end: PropTypes.string,
  price: PropTypes.number,
  listingId: PropTypes.string,
  setStartDate: PropTypes.func,
  setEndDate: PropTypes.func,
  endDate: PropTypes.any,
  startDate: PropTypes.any,
};

export default BookingForm;
