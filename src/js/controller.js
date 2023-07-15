import 'core-js/stable';
import { async } from 'regenerator-runtime';

import { MODAL_CLOSE_SEC } from './config.js';
import 'regenerator-runtime/runtime';

import * as model from './model.js';

import { deleteRecipeFromAPI } from './helper.js';

import recipeView from './views/recipeView.js';

import searchView from './views/searchView.js';

import resultsView from './views/resultsView.js';

import paginationView from './views/paginationView.js';

import bookmarksView from './views/bookmarksView.js';

import addRecipeView from './views/addRecipeView.js';

// if (module.hot) {
//   module.hot.accept();
// }

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlPagination = function (goToPage) {
  // render new results

  resultsView.render(model.getSearchResultsPage(goToPage));

  // render new pagination buttons

  paginationView.render(model.state.search);
};

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    //0) update resultsview mark selected
    resultsView.update(model.getSearchResultsPage());

    // 1)update bookmarks list
    bookmarksView.update(model.state.bookmarks);

    // 2)loading the recipe
    await model.loadRecipe(id);
    // const { recipe } = model.state;

    // 3)rendering the recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    //1)get search querry
    const query = searchView.getQuery();

    if (!query) return;

    //2)load search results
    await model.loadSearchResults(query);

    // 3) render results

    resultsView.render(model.getSearchResultsPage());

    // render initial pagination buttons

    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlServings = function (newServings) {
  // update recipe servings in state
  model.updateServings(newServings);
  //Update recipe view
  // recipeView.render(model.state.recipe);
  //without rendering all only update neccessary
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //render recipe view
  recipeView.update(model.state.recipe);

  // render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

// const controlDeleteRecipe = function () {
//   model.deleteRecipe();
// };

const controlAddRecipe = async function (newRecipe) {
  try {
    // show loading spinner
    addRecipeView.renderSpinner();

    // upload new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // render recipe
    recipeView.render(model.state.recipe);

    //success message
    addRecipeView.renderMessage();

    // render bookmark view( we want to add an element so we use render not the update method)
    bookmarksView.render(model.state.bookmarks);

    // change id in url: history API from browser
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // close form window.
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);

    // addRecipeView._parentElement.innerHTML = `${formView._generateMarkup()}`;
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  // recipeView.addHandlerDelete(controlDeleteRecipe);
};

init();
