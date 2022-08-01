import NavBar from "./NavBar";
import React from 'react';
import { useNavigate } from "react-router";
import './MyRecipes.css';
import Button from '@mui/material/Button';
import axios from "axios";

// axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`

/* MyRecipes Page */
function MyRecipes() {

	const [myRecipes, setMyRecipes] = React.useState('You have created no recipes, please create one via the button below.')
	const [recentViewed, setRecentViewed] = React.useState([]);

	//React navigate functions
	const navigate = useNavigate();
	const previous = () => {
		navigate('/dashboard');
	};
	const navigateRecipeForm = () => {
		navigate('/create-recipe');
	};
	
	const getMyRecipes = async () => {
		const token = localStorage.getItem('token');
		let headers = {
			"Authorization": `Bearer ${token}`,
		}
		axios.get('http://localhost:5000/my-recipes', { headers: headers })
		.then((response) => {
			setRecentViewed([]);
			console.log(response);
			response.data.recipes.forEach((rec) => {
				console.log(rec);
				setRecentViewed(recentViewed => [...recentViewed, {id: rec.ID, name: rec.Name, description: rec.Description, cuisine: rec.Cuisine, mealtype: rec.MealType, servingsize: rec.ServingSize}]);
			})
		}).catch(err => {
			alert(err);
		})
	};

	const getRecentlyViewed = async () => {
		//Retrieves list of recent recipes that user has viewed
		const recent = JSON.parse(localStorage.getItem('recent'));
		const token = localStorage.getItem('token');
		if (recent === null) setRecentViewed([]);
		let body = {"recentlyViewed": recent};
		console.log(body);
		let headers = {
			"Content-Type": 'application/json',
			"Authorization": `Bearer ${token}`
		}
		// axios.get('http://localhost:5000/recentlyviewed', body, { headers: headers })
		axios.get('http://localhost:5000/recentlyviewed', body, { headers: headers })
		.then((response) => {
			console.log(response);
		}).catch(err => {
			alert(err);
		})
	}

	React.useEffect(() => {
		getMyRecipes();
		getRecentlyViewed();
	}, [])

	return <>
		<div className="wrapper">
			<NavBar/>
			<div className="main-content">
				<button onClick={previous}>Go Back</button>
				<h2>My Recipes</h2>
				<p>{myRecipes}</p>
				<Button
      		sx={{ mt: 3, mb: 2 }}
      		id='create_recipe'
      		variant="outlined"
					onClick={() => navigateRecipeForm()}>
					Create Recipe
				</Button>
				<div className="recent_viewed">
					<h2>Recently Viewed</h2>
					<p>{recentViewed}</p>
				</div>
			</div>
		</div>
	</>
}

export default MyRecipes;
