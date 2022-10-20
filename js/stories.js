"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDelBtn = false) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  const favoriteStar = Boolean(currentUser);

  return $(`
      <li id="${story.storyId}">
        ${favoriteStar ? favStarHTML(story,currentUser): ''}
        ${showDelBtn ? delBtnHTML(): ''}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}


async function addNewStory(evt){
  evt.preventDefault();

  const title = $('#new-title').val();
  const author = $('#new-author').val();
  const url = $('#new-url').val();
  const username = currentUser.username;

  const newStory = await storyList.addStory(currentUser, {title, author, url, username})
  const storyMarkup = generateStoryMarkup(newStory);
  $allStoriesList.append(storyMarkup);

  $newStoryForm.slideUp();
}

$newStoryForm.on('submit',addNewStory)

function starFavs(story,user){
  const fav = user.starFavorite(story);
  const starFilled = fav ? 'fas' : 'far';
  return 
    `<span class='star' id='star'>
      <i class='${starFilled} fa-star'></i>
    </span>`
}

function putFavoritesOnPage(){
  console.debug('putFavoritesOnPage');

  $favStories.empty();

  if(currentUser.favorites.length > 0){
    for(let fav of currentUser.favorites){
      let story = generateStoryMarkup(fav);
      $favStories.append(story);
    }
  }
  else{
    $favStories.append('<h4>No favorites added yet!</h4>')
  }
  $favStories.show();
}

function delBtnHTML(){
  return `<span>
  <i class='fas fa-trash-alt'></i>
  </span>`
}

function favStarHTML(story,user){
  let starFavorite = user.starFavorite(story);
  let starFilled = starFavorite ? 'fas' : 'far';
  return `<span>
  <i class='${starFilled} fa-star'></i>
  </span>`
}

async function putUserStoriesOnPage(){
  $userStories.empty();
  if(currentUser.ownStories.length > 0){
    for(let userStory of currentUser.ownStories){
      let story = generateStoryMarkup(userStory,true);
      $userStories.append(story);
    }
  }
  else{
    $userStories.append('<h4>No stories added by user yet!</h4>')
  }
  $userStories.show();
}

async function removeStory(evt){
  const $selectedStory = $(evt.target).closest('li');
  const $storyId = $selectedStory.attr('id');
  await storyList.deleteStory(currentUser,$storyId);
  await putUserStoriesOnPage();
}
$userStories.on('click',removeStory)

async function switchStoryFav(evt){
  console.log(evt)
  const $li = $(evt.target).closest('li');
  const storyId = $li.attr('id');
  const story = storyList.stories.find(story => story.storyId === storyId)
  if ($(evt.target).hasClass('fas')){
    await currentUser.removeFavorite(story);
    $(evt.target).closest('i').toggleClass('fas far');
  }
  else{
    await currentUser.newFavorite(story);
    $(evt.target).closest('i').toggleClass('fas far');
  }
}
$allStoriesList.on('click',switchStoryFav);