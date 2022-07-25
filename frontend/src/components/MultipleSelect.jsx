import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import axios from 'axios';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 100,
    },
  },
};

function getStylesMealtype(name, mealtypeName, theme) {
  return {
    fontWeight:
      mealtypeName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

function getStylesCuisine(name, cuisineName, theme) {
  return {
    fontWeight:
      cuisineName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function MultipleSelect({ submit }) {

  const theme = useTheme();
	const [mealtypeName, setmealtypes] = React.useState([]);
  const [cuisineName, setCuisines] = React.useState([]);
  const [ingredientsName, setIngredients] = React.useState([]);
  const [cuisineList, setCuisineList] = React.useState([]);
  const [mealtypeList, setMealtypeList] =  React.useState([]);
  const [ingredientsList, setIngredientsList] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');

  const onSubmit = () => {
    submit(mealtypeName, cuisineName, ingredientsName, searchQuery);
  }

  const handleChangeMealtype = (event) => {
    const {
      target: { value },
    } = event;
    setmealtypes(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(',') : value,
    );
  };

  const handleChangeCuisine = (event, value) => {
    setCuisines(
      typeof value === "string" ? value.split(',') : value,
    );
  };

  const handleChangeIngredients = (event, value) => {
    setIngredients(value);
    console.log(value);
    /*if(value.target.innerText === undefined) {
      //Do Nothing
    } else {
      if(ingredientsName !== []){
        ingredientsName.forEach((i) => {
          if(ingredientsName.ingredient === value.target.innerText){
            //Do Nothing
          } else {
            setIngredients(ingredientsName => [...ingredientsName, {ingredient: value.target.innerText}]);
          }
        })
        setIngredients(ingredientsName => [...ingredientsName, {ingredient: value.target.innerText}]);
      }
    }*/
  };

  const getCuisines = async () => {
    const configdata = await axios.get('http://localhost:5000/search');
    setMealtypeList(configdata.data.MealTypes);
    setCuisineList(configdata.data.Cuisine);
    configdata.data.Ingredients.forEach((i) => {
      setIngredientsList(ingredientsList => [...ingredientsList, {name: i}]);
    })
  };

  React.useEffect(() => {
    getCuisines();
  }, []);

  const options = ingredientsList.map((option) => {
    //console.log(option.name);
		const firstLetter = option.name.Name[0].toUpperCase();
		return {
			firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
			...option.name,
		};
	});

  return (
    <div>
      <TextField sx={{ m: 1, width: 400}}
			margin="normal"
			label="Search for Recipes.."
			type="text"
			onChange={e => setSearchQuery(e.target.value)}
		  />
      <FormControl sx={{ m: 1, width: 200}}>
        <InputLabel id="Mealtype_inputlabel">Select Mealtype(s)...</InputLabel>
        <Select
          multiple
          value={mealtypeName}
          onChange={handleChangeMealtype}
          input={<OutlinedInput label="Mealtypes" />}
          MenuProps={MenuProps}
        >
          {mealtypeList.map((name) => (
            <MenuItem
              key={name}
              value={name}
              style={getStylesMealtype(name, mealtypeName, theme)}
            >
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ m: 1, width: 200}}>
        <InputLabel id="Cuisine_selectbox">Select Cuisine(s)...</InputLabel>
        <Select
          multiple
          value={cuisineName}
          onChange={handleChangeCuisine}
          input={<OutlinedInput label="Cuisines" />}
          MenuProps={MenuProps}
        >
        {cuisineList.map((name) => (
          <MenuItem
            key={name}
            value={name}
            style={getStylesCuisine(name, cuisineName, theme)}
          >
            {name}
          </MenuItem>
        ))}
        </Select>
      </FormControl>
      <Autocomplete
        multiple
        id="grouped"
        options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
        groupBy={(option) => option.firstLetter}
        getOptionLabel={(option) => option.Name}
        sx={{ m: 1, width: 400 }}
        onChange={handleChangeIngredients}
        renderInput={(params) => <TextField {...params} label="Select Ingredient(s)" />}
      />
      <Button variant="outlined"
        sx={{ mt: 3, mb: 2 }}
        type="submit" 
        onClick={onSubmit}>Search
      </Button>
    </div>
  );
}
