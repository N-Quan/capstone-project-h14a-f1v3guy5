import NavBar from "./NavBar";
import React from 'react';
import { useNavigate } from "react-router";
import './MyRecipes.css';
import Button from '@mui/material/Button';
import axios from "axios";

axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
axios.defaults.headers.post['Content-Type'] = 'application/json';

/* MyRecipes Page */
function MyRecipes() {

	const [myRecipes, setMyRecipes] = React.useState([]);
	const [recentViewed, setRecentViewed] = React.useState([]);

	const token = localStorage.getItem('token');

	//React navigate functions
	const navigate = useNavigate();
	const previous = () => {
		navigate('/dashboard');
	};
	const navigateRecipeForm = () => {
		navigate('/create-recipe');
	};
	
	async function getMyRecipes() {
		let headers = {
			headers: {
				"Authorization": `Bearer ${token}`
			}
		}
		console.log(headers);
		axios.get('http://localhost:5000/my-recipes', headers)
		.then((response) => {
			response.data.Recipes.forEach((rec) => {
				console.log(rec);
				setMyRecipes(myRecipes => [...myRecipes, {name: rec.Name, description: rec.Description, cuisine: rec.Cuisine, mealtype: rec.MealType, servingsize: rec.ServingSize}]);
			})
			console.log(myRecipes);
		}).catch(err => {
			console.log(err);
		})
	};

	async function getRecentlyViewed() {
		//Retrieves list of recent recipes that user has viewed
		const recent = JSON.parse(localStorage.getItem('recent'));
		let body = {
			recentlyViewed: recent
		};
		let headers = {
			headers: {
				"Content-type": "application/json",
				"Authorization": `Bearer ${token}`
			}
		}
		console.log(body);
		axios.post('http://localhost:5000/recentlyviewed', body, headers)
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
				<div className='list_recipes'>
					{myRecipes.map((recipe, key) => {
						return (
							<div className='recipe_box' key={key}>
								<h3>Name: {recipe.name}</h3>
								<p>Cuisine: {recipe.cuisine}</p>
								<p>Description: {recipe.description}</p>
								<p>Mealtype: {recipe.mealtype}</p>
								<p>Serving Size: {recipe.servingsize}</p>
							</div>
						)})}
				</div>
				<Button
      		sx={{ mt: 3, mb: 2 }}
      		id='create_recipe'
      		variant="outlined"
					onClick={() => navigateRecipeForm()}>
					Create Recipe
				</Button>
				<div className="recent_viewed">
					<h2>Recently Viewed</h2>
					<div className='list_recipes'>
          	{recentViewed.map((recipe, key) => {
            	return (
              	<div className='recipe_box' key={key}>
									<h3>Name: {recipe.name}</h3>
									<p>Cuisine: {recipe.cuisine}</p>
									<p>Description: {recipe.description}</p>
									<p>Mealtype: {recipe.mealtype}</p>
									<p>Serving Size: {recipe.servingsize}</p>
								</div>
							)})}
					</div>
				</div>
			</div>
		</div>
	</>
}

export default MyRecipes;
