import React from 'react';
import PropTypes from 'prop-types';
import { CardContent, Container, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import WifiIcon from '@mui/icons-material/Wifi';
import KitchenIcon from '@mui/icons-material/Kitchen';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import TvIcon from '@mui/icons-material/Tv';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import MicrowaveIcon from '@mui/icons-material/Microwave';
import PoolIcon from '@mui/icons-material/Pool';

const amenityIcons = {
  wifi: <WifiIcon fontSize="small"></WifiIcon>,
  aircon: <AcUnitIcon fontSize="small"></AcUnitIcon>,
  kitchen: <RestaurantIcon fontSize="small"></RestaurantIcon>,
  tv: <TvIcon fontSize="small"></TvIcon>,
  heating: <DeviceThermostatIcon fontSize="small"></DeviceThermostatIcon>,
  fridge: <KitchenIcon fontSize="small"></KitchenIcon>,
  microwave: <MicrowaveIcon fontSize="small"></MicrowaveIcon>,
  pool: <PoolIcon fontSize="small"></PoolIcon>,
};

const styles = {
  amenityContainer: {
    px: 0,
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    mx: 0,
  },
};

const CardAmenityContainer = ({ amenities }) => {
  return (
    <CardContent>
      <Container sx={styles.amenityContainer}>
        {Object.entries(amenities)
          .filter((item) => item[1])
          .map((item) => {
            const amenity = item[0];
            return (
              <List key={amenity} dense={true}>
                <ListItem sx={{ px: 1 }}>
                  <ListItemIcon>{amenityIcons[amenity]}</ListItemIcon>
                  <ListItemText primary={amenity} />
                </ListItem>
              </List>
            );
          })}
      </Container>
    </CardContent>
  );
};

CardAmenityContainer.propTypes = {
  amenities: PropTypes.object,
};

export default CardAmenityContainer;
