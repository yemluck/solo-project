import React, { useEffect, useState } from 'react';
import LogOutButton from '../LogOutButton/LogOutButton';
import {useSelector, useDispatch} from 'react-redux';
import './UserPageFlyer.css';
import { Link, useHistory } from 'react-router-dom';
import swal from 'sweetalert';
// mui imports
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';


function UserPageFlyer() {

  const history = useHistory();
  const dispatch = useDispatch();
  // this component doesn't do much to start, just renders some user reducer info to the DOM
  const user = useSelector((store) => store.user);
  const itineraries = useSelector(store => store.itinerary)
  const image = useSelector(store => store.photoReducer)
  console.log('this is my photo from the store', image);
  console.log('this is the itineraries from the store', itineraries);
  console.log('this is the user:', user);

  const onCreateItinerary = () => {
    console.log('in onCreateItinerary');
  }

  // want to call the function to get all itineraries on login to dashboard
  useEffect(() => {
    // dispatch to fetch user itineraries
    dispatch({type: 'FETCH_ITINERARY'});
    dispatch({
      type: 'GET_PHOTO'
    })

    // There's opportunity to dispatch more than one type
  }, []); // end useEffect

  const selectItinerary = (itinerary) => {
    console.log('in selectItinerary');

    // move to detail page for individual itinerary
    history.push(`/itinerary/flyer/${itinerary.id}`)
  }

  const deleteItinerary = (id) => {
    // id is being sent from the client on click of delete button
    // now the id is dispatched as payload to delete saga
    //console.log('in deleteItinerary', id);

    swal({
      title: "Delete?",
      text: "Are you sure? this is irreversible ",
      icon: "warning",
      buttons: true,
      dangerMode: true
    })
    .then((value) => {
      if (value) {
        swal("Poof! deleted", { icon: "success"})
      dispatch({
        type: 'DELETE_ITINERARY',
        payload: id
      }) // end dispatch
    } else {
      swal("Itinerary not deleted")
    }
    })
  
  }

  // setup to upload profile picture
  // initial state
  const [photo, setPhoto] = useState();

  // run this function on submission of upload form
  const onUploadPhoto = (evt) => {
    evt.preventDefault();
    console.log('in onUploadPhoto');
    const data = new FormData();

    data.append('image', photo)

    // dispatch to saga
    dispatch({
      type: 'UPLOAD',
      payload: data
    })

   

    setPhoto('');
  }






  return (
    <div className="container">
      <h2>Welcome to your dashboard, {user.username}!</h2>
      
      <div className="userProfileBox">
       
        <img src={`/images/${image.path}`} width={150} height={150} alt="upload profile picture" />
        
        {/* <div> */}
        <form onSubmit={onUploadPhoto}>
          <input type="file" onChange={(evt) => setPhoto(evt.target.files[0]) }/><br></br>
          <input type="submit" name="upload" vale="upload" />
        </form>
        {/* </div> */}
      </div>
      <div className="itineraryBox">
        <p> Itineraries are here</p>
        {
          itineraries.map((itinerary) => {
            return (
              <Card sx={{margin: 0.5}}>
                <CardContent>
              <div className="itineraryBox2"
              key={itinerary.id}
              
              >
                <h4>Departing City: {itinerary.departing_city}</h4>
                <h4>Departure date: {itinerary.departure_date}</h4>
                <h4>Arrival date: {itinerary.arrival_date}</h4>
                <h4>Destination country: {itinerary.destination_country}</h4>
                <h4>Destination City: {itinerary.destination_city}</h4>
                <h4>Location: {itinerary.location}</h4>
                <h4>Note: {itinerary.note}</h4>
                <h4>Weight Limit: {itinerary.weight_limit}</h4>
                <button onClick={() => selectItinerary(itinerary)}>detail</button>
                <button onClick={() => deleteItinerary(itinerary.id)}>delete</button>
             
              </div>
                </CardContent>
              </Card>
            )
          })

        }
       
      </div>
      {/* <div className="shippingRequestBox">
        <p> Shipping requests</p>
      </div> */}
      <div>
        <Link to="/itinerary"> <button className="btn" onClick={onCreateItinerary}>create Itinerary</button> </Link>
      </div>
      <LogOutButton className="btn" />
    </div>
  );
}

// this allows us to use <App /> in index.js
export default UserPageFlyer;
