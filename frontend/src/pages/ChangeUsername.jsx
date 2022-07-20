import React from 'react';
import ChangePasswordForm from '../components/ChangePasswordForm'; // [TODO] fix this
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ChangeUsername () {

	const navigate = useNavigate();

	const previous = () => {
		navigate('/profile');
	}

	return <>
		<div>
			<h1>Change Username</h1>
			<button onClick={previous}>Go Back</button>
		</div>
		<ChangePasswordForm submit={async (newusername) => { //[TODO fix this]
			console.log(newusername)
            let authToken = localStorage.getItem('token');
            let headers = {
          		'Content-Type': 'application/json',
				'Authorisation': `Bearer ${authToken}`
      };
      var body = {
				newusername
      };
      axios.put('http://localhost:5000/auth/change-username', body, headers)
			.then((response) => {
				console.log(response);
			}).catch((error) => {
				console.log(error)
				alert(error);
			})
            }}/>
	</>
}

export default ChangeUsername;