import { useState } from 'react';
import PropTypes from 'prop-types';
import copy from 'clipboard-copy';
import shareImage from '../images/shareIcon.svg';
import favorite from '../images/blackHeartIcon.svg';
import noFavorite from '../images/whiteHeartIcon.svg';

export default function MealsInProgress({ data, pathname }) {
  const lineStyle = { textDecorationLine: 'line-through',
    textDecorationColor: 'rgb(0,0,0)',
    textDecorationStyle: 'solid' };

  const [line, setLine] = useState([]);

  const ingredientes = (initialData) => {
    const recipes = Object.entries(initialData.meals[0])
      .filter(
        ([key, value]) => (key.includes('strIngredient') || key.includes('strMeasure'))
      && value && value !== ' ',
      );
    const item = recipes
      .reduce((acc, [key, value]) => {
        if (key.includes('strIngredient')) {
          acc[key] = value;
        }
        return acc;
      }, {});
    const quantidade = recipes
      .reduce((acc, [key, value]) => {
        if (key.includes('strMeasure')) {
          acc[key] = value;
        }
        return acc;
      }, {});
    return Object.values(item)
      .map((e, i) => `${e} ${Object.values(quantidade)[i]}`);
  };
  const ingrediente = ingredientes(data);

  localStorage.setItem('doneRecipes', JSON.stringify([]));

  const [link, setLink] = useState(false);

  const saveFavorites = (object) => {
    const lastFavorites = JSON.parse(localStorage.getItem('favoriteRecipes'));
    if (lastFavorites === null) {
      return localStorage.setItem('favoriteRecipes', JSON.stringify([object]));
    }
    if (lastFavorites.find((r) => r.id === object.id)) {
      return localStorage.setItem('favoriteRecipes', JSON.stringify(lastFavorites
        .filter((r) => r.id !== object.id)));
    }
    localStorage.setItem('favoriteRecipes', JSON.stringify([...lastFavorites, object]));
  };

  const favorites = JSON.parse(localStorage.getItem('favoriteRecipes'));

  const [fav, setFav] = useState(false);
  return (
    <div>
      <img
        src={ data.meals[0].strMealThumb }
        alt=""
        data-testid="recipe-photo"
        style={ { height: 150 } }
      />
      <h2 data-testid="recipe-title">{ data.meals[0].strMeal }</h2>
      <button
        type="button"
        data-testid="share-btn"
        src={ shareImage }
        onClick={ () => {
          copy(`http://localhost:3000${pathname}`);
          setLink(true);
        } }
      >
        <img src={ shareImage } alt="Compartilhar" />
      </button>
      {link && <p>Link copied!</p>}
      <button
        type="button"
        src={ (favorites && favorites.find((r) => r.id === data.meals[0].idMeal))
          ? favorite : noFavorite }
        data-testid="favorite-btn"
        onClick={ () => {
          saveFavorites({
            id: data.meals[0].idMeal,
            type: 'meal',
            nationality: data.meals[0].strArea,
            category: data.meals[0].strCategory,
            alcoholicOrNot: '',
            name: data.meals[0].strMeal,
            image: data.meals[0].strMealThumb,
          });
          setFav(!fav);
        } }
      >
        { (favorites && favorites.find((r) => r.id === data.meals[0].idMeal))
          ? <img src={ favorite } alt="Receita favoritada" />
          : <img src={ noFavorite } alt="Receita não favoritada" /> }
      </button>

      <p data-testid="recipe-category">{ data.meals[0].strCategory }</p>

      <ul>
        { ingrediente.map((item, index) => {
          if (line.includes(index)) {
            return (
              <>
                <label
                  id={ index }
                  htmlFor={ item }
                  key={ index }
                  data-testid={ `${index}-ingredient-step` }
                  style={ lineStyle }
                >
                  <input
                    type="checkbox"
                    value={ item }
                    id={ item }
                    onClick={ () => setLine(line.filter((e) => e !== index)) }
                  />
                  { item }

                </label>
                <br />
              </>
            );
          } return (
            <>
              <label
                id={ index }
                htmlFor={ item }
                key={ index }
                data-testid={ `${index}-ingredient-step` }
              >
                <input
                  type="checkbox"
                  value={ item }
                  id={ item }
                  onClick={ () => setLine([...line, index]) }
                />
                { item }

              </label>
              <br />

            </>
          );
        })}
      </ul>

      <p data-testid="instructions">{ data.meals[0].strInstructions }</p>

      <button
        type="button"
        data-testid="finish-recipe-btn"
      >
        Finish Recipe
      </button>
    </div>
  );
}

MealsInProgress.propTypes = {
  data: PropTypes.shape({ meals: PropTypes.obj }),
}.isRequired;