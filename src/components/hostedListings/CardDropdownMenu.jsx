import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { IconButton, Menu } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import { DeleteListingAlert } from '../alerts';
import { deleteListing, publishListing, unpublishListing } from '../../service/api';
import { useHistory } from 'react-router';
import { DropdownMenuItem, AvailabilityModal } from '.';

const CardDropdownMenu = ({ published, setListings, listings, listingId }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [agree, setAgree] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const open = Boolean(anchorEl);
  const history = useHistory();
  // handle the popup confirmation to delete a listing
  useEffect(async () => {
    if (agree) {
      const response = await deleteListing(listingId);
      if (response.status === 200) {
        setListings(listings.filter((listing) => listing.id !== listingId));
      } else {
        //   TODO display alert
      }
    }
  }, [agree]);

  const handleOpenMenu = (event) => {
    setAgree(false);
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    setShowAlert(true);
    setAnchorEl(null);
  };

  const handlePublish = async (availability) => {
    if (!published) {
      const res = await publishListing(listingId, {
        availability: availability,
      });
      if (res.status === 200) {
        const newListings = listings.map((listing) => {
          if (listing.id === listingId) {
            listing.published = true;
            listing.availability = availability;
            return listing;
          } else {
            return listing;
          }
        });
        setListings(newListings);
      }
    } else {
      const res = await unpublishListing(listingId);
      if (res.status === 200) {
        const newListings = listings.map((listing) => {
          if (listing.id === listingId) {
            listing.published = false;
            return listing;
          } else {
            return listing;
          }
        });
        setListings(newListings);
      }
    }
    handleCloseMenu();
  };

  // open the modal to input availability dates
  const handleOpenModal = () => {
    setShowAvailabilityModal(true);
    handleCloseMenu();
  };

  return (
    <>
      <IconButton
        aria-controls="basic-menu"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleOpenMenu}
        aria-label="options"
      >
        <MoreVertIcon></MoreVertIcon>
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        MenuListProps={{
          'aria-labelledby': 'moreOptionsBtn',
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <DropdownMenuItem
          onClick={() => history.push(`/user/listings/edit/${listingId}`)}
          icon={<EditOutlinedIcon fontSize="small" />}
          text="Edit"
        ></DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleDelete}
          icon={<DeleteIcon fontSize="small" />}
          text="Delete"
        ></DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => history.push(`/user/listings/info/${listingId}`)}
          icon={<LibraryBooksOutlinedIcon fontSize="small" />}
          text={'Vew bookings'}
        ></DropdownMenuItem>
        <DropdownMenuItem
          onClick={published ? handlePublish : handleOpenModal}
          icon={<CheckCircleOutlinedIcon fontSize="small" />}
          text={published ? 'Go offline' : 'Go live'}
        ></DropdownMenuItem>
      </Menu>
      <DeleteListingAlert
        isOpen={showAlert}
        setIsOpen={setShowAlert}
        setAgree={setAgree}
      ></DeleteListingAlert>
      {showAvailabilityModal && (
        <AvailabilityModal
          isOpen={showAvailabilityModal}
          setIsOpen={setShowAvailabilityModal}
          handlePublish={handlePublish}
        ></AvailabilityModal>
      )}
    </>
  );
};

CardDropdownMenu.propTypes = {
  published: PropTypes.bool,
  setListings: PropTypes.func,
  listings: PropTypes.array,
  listingId: PropTypes.number,
};

export default CardDropdownMenu;
