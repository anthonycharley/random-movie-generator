// TMDB API URL and API key
const tmdbApiUrl = 'https://api.themoviedb.org/3/';
const tmdbApiKey = 'bf5cc00a266e929bf7bf172bf4633465';

// YouTube API URL and API key
const youtubeApiUrl = 'https://www.googleapis.com/youtube/v3/search';
const youtubeApiKey = 'AIzaSyB-cZY_5Kp2FiLQ0kQqWITdf6o3jgRNq38';

// HTML elements
const movieTitleElement = document.getElementById('movie-title');
const movieDescriptionElement = document.getElementById('movie-description');
const trailerElement = document.getElementById('trailer');
const loadingAnimation = document.getElementById('loading-animation');
const movieSuggestionForm = document.getElementById('movie-suggestion-form');
const getMovieSuggestionButton = document.getElementById('get-movie-suggestion');

// Newly added event listener for customer review score
const value = document.querySelector("#review-score");
const input = document.querySelector("#pi_input");
value.textContent = input.value;
input.addEventListener("input", (event) => {
  value.textContent = event.target.value;
});

// Function to get a movie suggestion
async function getMovieSuggestion() {
  // Get the user's input from the form
  const genre = document.getElementById('genre').value;
  const releaseDate = document.getElementById('release-date').value;
  const rating = document.getElementById('rating').value;

  // Get the genre ID from TMDB
  const genreResponse = await fetch(`${tmdbApiUrl}genre/movie/list?api_key=${tmdbApiKey}`);
  const genreData = await genreResponse.json();
  let genreId;

  for (const item of genreData.genres) {
    if (item.name.toLowerCase() === genre.toLowerCase()) {
      genreId = item.id;
      break;
    }
  }

  // Fetch a random movie from TMDB with the selected genre and release date
  const movieResponse = await fetch(`${tmdbApiUrl}discover/movie?api_key=${tmdbApiKey}&with_genres=${genreId}&primary_release_date.gte=${releaseDate}&vote_average.gte=${rating}`);
  const movieData = await movieResponse.json();
  const randomMovie = movieData.results[Math.floor(Math.random() * movieData.results.length)];

  // Display the movie title and description
  movieTitleElement.textContent = randomMovie.title;
  movieDescriptionElement.textContent = randomMovie.overview;

  // Get the movie trailer from YouTube
  const trailerResponse = await fetch(`${youtubeApiUrl}?key=${youtubeApiKey}&part=id,snippet&q=${randomMovie.title}+trailer`);
  const trailerData = await trailerResponse.json();
  const trailerId = trailerData.items[0].id.videoId;

  // Display the movie trailer
  trailerElement.src = `https://www.youtube.com/embed/${trailerId}`;

  // Show the loading animation
  loadingAnimation.style.display = 'none';
}

// Event listener for the "Get a movie suggestion" button
getMovieSuggestionButton.addEventListener('click', () => {
  // Show the form
  movieSuggestionForm.style.display = 'block';

  // Scroll to the form
  window.scrollTo(0, document.body.scrollHeight);
});

// Event listener for the "Generate Movie" button
document.getElementById('generate-movie').addEventListener('click', getMovieSuggestion);

