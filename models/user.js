const database = require('../database/dbConfig');

// Get a user
const find = (filter) => {
  return database('users').where(filter).first();
};

// Add a user
const add = (user) => {
  return database('users').insert(user).returning('*');
};

// Update a user
const update = (id, value) => {
  return database('users').where('id', id).update(value).returning('*');
};

// Delete a user
const remove = (userID) => {
  return database('users').where('id', userID).del();
};

// Fetch all of a users posts
const fetchPosts = (userID) => {
  return database('posts').where('user_id', userID);
};

// Fetch all of a users comments
const fetchComments = (userID) => {
  return database('comments').where('user_id', userID);
};

// Fetch all posts a user has liked
const fetchUsersLikedPosts = (userID) => {
  return database('liked_posts').where('user_id', userID);
};

// Fetch all comments a user has liked
const fetchUsersLikedComments = (userID) => {
  return database('liked_comments').where('user_id', userID);
};

// Set a users onboarded field to true
const onboard = (userID) => {
  return database('users')
    .where('id', userID)
    .update('onboarded', 'true')
    .returning('*');
};

module.exports = {
  find,
  add,
  update,
  remove,
  fetchPosts,
  fetchComments,
  fetchUsersLikedPosts,
  fetchUsersLikedComments,
  onboard,
};
