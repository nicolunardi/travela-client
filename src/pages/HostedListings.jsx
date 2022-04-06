import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { Grid, Container, SpeedDial, Tooltip } from '@mui/material';
import { UserListingCard } from '../components/hostedListings';
import { getListing, getListings } from '../service/api';
import AddIcon from '@mui/icons-material/Add';
import { UserContext } from '../contexts/UserContext';

const styles = {
  container: { position: 'relative', my: 4 },
  addBtn: { position: 'fixed', bottom: 16, right: 16 },
};

const HostedListings = () => {
  const history = useHistory();
  const [userListings, setUserListings] = useState(null);
  const { user } = useContext(UserContext);

  useEffect(async () => {
    const allUserListings = [];
    const response = await getListings();
    if (response.status >= 200 && response.status < 300) {
      const listings = response.data.listings.filter(
        (listing) => listing.owner_id === parseInt(user.id),
      );
      for (const listing of listings) {
        const response = await getListing(listing.id);
        if (response.status >= 200 && response.status < 300) {
          allUserListings.push({ ...response.data });
        } else {
          //   TODO ERROR POPUP
        }
      }
      setUserListings(allUserListings);
    } else {
      //   TODO ERROR POPUP
    }
  }, []);

  return (
    <>
      <Typography variant="h2" align="center" color="initial">
        My Listings
      </Typography>
      <Container sx={styles.container}>
        <Grid container spacing={2} justifyContent="center">
          {userListings &&
            userListings.map((listing) => (
              <UserListingCard
                key={listing.id}
                listing={listing}
                setListings={setUserListings}
                listings={userListings}
              ></UserListingCard>
            ))}
        </Grid>
        <Tooltip title="Create listing" placement="left">
          <SpeedDial
            ariaLabel="Add new listing"
            sx={styles.addBtn}
            onClick={() => history.push('/user/listings/newListing')}
            icon={<AddIcon id="newListingBtn"></AddIcon>}
          ></SpeedDial>
        </Tooltip>
      </Container>
    </>
  );
};

export default HostedListings;
