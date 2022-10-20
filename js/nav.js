"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".user-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

function navSubmitStory(evt){
  console.log('navSubmitStory',evt);
  hidePageComponents();
  $allStoriesList.show();
  $newStoryForm.show();
}

$navNewStory.on('click',navSubmitStory);

function navFavorites(evt){
  console.log('navFavorites',evt)
  hidePageComponents();
  putFavoritesOnPage();
}

$navFavorites.on('click',navFavorites)

function navUserStories(evt){
  console.log('navUserStories',evt)
  hidePageComponents();
  putUserStoriesOnPage();
  $userStories.show();
}

$navUserStories.on('click',navUserStories)