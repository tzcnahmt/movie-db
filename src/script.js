'use strict';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/w780';
const ROOT = document.querySelector('.container');
const STAR = `<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" class="ipc-icon ipc-icon--star-inline" id="iconContext-star-inline" viewBox="0 0 24 24" fill="currentColor" role="presentation"><path d="M12 20.1l5.82 3.682c1.066.675 2.37-.322 2.09-1.584l-1.543-6.926 5.146-4.667c.94-.85.435-2.465-.799-2.567l-6.773-.602L13.29.89a1.38 1.38 0 0 0-2.581 0l-2.65 6.53-6.774.602C.052 8.126-.453 9.74.486 10.59l5.147 4.666-1.542 6.926c-.28 1.262 1.023 2.26 2.09 1.585L12 20.099z"></path></svg>`;

const autorun = () => {
  renderNavbar();
  searchBox();
  fetchFilterMovie();
};

const renderNavbar = () => {
  console.log('here');
  const nav = document.createElement('nav');
  nav.classList.add('navbar');
  const navDivContainer = document.createElement('div');
  navDivContainer.classList.add('nav-container');
  const navDiv = document.createElement('div');
  navDiv.classList.add('nav-logo');
  const navDivP = document.createElement('p');
  navDivP.innerHTML = `<a href="index.html">Moviedb</a>`;
  const navUL = document.createElement('ul');
  navUL.innerHTML = `
        <li><a href="./index.html">Home</a></li>
        <li class='drop-filter'>
                <div class="dropdown">
                    <p>Genres ↓</p>
                    <div class="dropdown-content">
                        <p onclick="fetchDiscoverGenres(28)">Action</p>
                        <p onclick="fetchDiscoverGenres(12)">Adventure</p>
                        <p onclick="fetchDiscoverGenres(16)">Animation</p>
                        <p onclick="fetchDiscoverGenres(35)">Comedy</p>
                        <p onclick="fetchDiscoverGenres(80)">Crime</p>
                        <p onclick="fetchDiscoverGenres(99)">Documentary</p>
                        <p onclick="fetchDiscoverGenres(18)">Drama</p>
                        <p onclick="fetchDiscoverGenres(10751)">Family</p>
                    </div>
                </div>
        </li>
        <li onClick="fetchActors()">Actors</li>
        <li class='drop-filter'>
            <div class="dropdown">
                <p>Filter ↓</p>
                <div class="dropdown-content">
                    <p onclick="fetchFilterMovie('now_playing')">Now Playing</p>
                    <p onclick="fetchFilterMovie('popular')">Popular</p>
                    <p onclick="fetchFilterMovie('top_rated')">Top Rated</p>
                    <p onclick="fetchFilterMovie('upcoming')">Upcoming</p>
                </div>
            </div>
        </li>
        <li><a href="#">About us</a></li>`;
  nav.appendChild(navDivContainer);
  navDiv.appendChild(navDivP);
  navDivContainer.appendChild(navDiv);
  navDivContainer.appendChild(navUL);
  ROOT.appendChild(nav);
  const tl = gsap.timeline();
  tl.from(nav, {
    y: -10,
    opacity: 0,
    delay: 0.5,
  })
    .from(navDivP, { opacity: 0 })
    .from('.nav-container ul li', {
      opacity: 0,
      stagger: 0.1,
    });
};
const searchBox = () => {
  const searchDiv = document.createElement('div');
  searchDiv.classList.add('search-box');
  searchDiv.innerHTML += `<h1>Search in our database</h1>`;
  searchDiv.innerHTML += `<input id = "search" type = "text" placeholder = "Enter movie name"/>`;
  ROOT.appendChild(searchDiv);
  document.getElementById('search').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.value.length > 0) {
      searchMovie(e.target.value);
    }
  });
  const tl = gsap.timeline();
  gsap.set('.search-box', { css: { zIndex: -1 } });
  tl.from('.search-box', {
    y: 50,
    opacity: 0,
    delay: 1,
  }).from('#search', {
    y: 50,
    opacity: 0,
  });
};
const renderMovies = (movies) => {
  if (ROOT.lastChild.className === 'main-content') {
    ROOT.removeChild(ROOT.lastChild);
  }
  const MAIN_CONTENT = document.createElement('div');
  MAIN_CONTENT.classList.add('main-content');
  ROOT.appendChild(MAIN_CONTENT);
  if (movies.length < 1) {
    MAIN_CONTENT.innerHTML += `<pre><h1>Oh :( We don't have that.</h1> 
            <h2>Try searching for another movie.</h2></pre>`;
  }
  movies.map((movie) => {
    const movieDiv = document.createElement('div');
    movieDiv.classList.add('movie-card');

    const moviePoster = document.createElement('div');
    moviePoster.classList.add('movie-poster');
    moviePoster.innerHTML = `
            <p class='vote-average'><span>${STAR}</span>${
      movie.vote_average
    }</p>
            ${
              movie.backdrop_path
                ? `<img src='${BACKDROP_BASE_URL}${movie.backdrop_path}' alt=''/>`
                : `<img src='https://www.publicdomainpictures.net/pictures/280000/nahled/not-found-image-15383864787lu.jpg' alt='' />`
            }
            `;

    const movieTitle = document.createElement('div');
    movieTitle.classList.add('movie-title');
    movieTitle.innerHTML = `
            <p>${movie.title}</p>
            <p>${movie.release_date}</p>
        `;
    movieDiv.appendChild(moviePoster);
    movieDiv.appendChild(movieTitle);
    movieDiv.addEventListener('click', () => {
      console.log('inside rendermovies and movie is', movie);
      movieDetailsPage(movie);
    });
    console.log('after calling function');
    MAIN_CONTENT.appendChild(movieDiv);
  });

  gsap.from('.movie-card', {
    opacity: 0,
    stagger: 0.1,
    delay: 0.5,
  });

  VanillaTilt.init(document.querySelectorAll('.movie-card'), {
    max: 15,
    speed: 500,
    reverse: true,
    scale: 1.07,
    reset: true,
    transition: true,
    glare: true,
    'max-glare': 0.5,
  });
};
const renderActorPage = (actorList) => {
  if (ROOT.lastChild.className === 'main-content') {
    ROOT.removeChild(ROOT.lastChild);
  }
  const MAIN_CONTENT = document.createElement('div');
  MAIN_CONTENT.classList.add('main-content');
  ROOT.appendChild(MAIN_CONTENT);
  if (actorList.length < 1) {
    MAIN_CONTENT.innerHTML += `<h1>Oh :( We don't have actors.</h1>`;
  }
  actorList.map((actor) => {
    const actorDiv = document.createElement('div');
    actorDiv.classList.add('movie-card');
    const actorPoster = document.createElement('div');
    actorPoster.classList.add('movie-poster');
    actorPoster.innerHTML = `${
      actor.profile_path
        ? `<img src="${BACKDROP_BASE_URL}${actor.profile_path}" alt="" />`
        : `<img
                    src="https://www.publicdomainpictures.net/pictures/280000/nahled/not-found-image-15383864787lu.jpg"
                    alt=""
                />`
    } `;
    const actorName = document.createElement('div');
    actorName.classList.add('movie-title');
    actorName.innerHTML = `<p>${actor.name}</p>`;

    actorDiv.appendChild(actorPoster);
    actorDiv.appendChild(actorName);
    actorDiv.addEventListener('click', () => {
      // console.log(actor);
      fetchLifeActor(actor.id, actor);
      // renderActor(bioOfActor);
    });

    MAIN_CONTENT.appendChild(actorDiv);
  });

  gsap.from('.movie-card', {
    opacity: 0,
    stagger: 0.1,
    delay: 0.5,
  });

  VanillaTilt.init(document.querySelectorAll('.movie-card'), {
    max: 15,
    speed: 500,
    reverse: true,
    scale: 1.07,
    reset: true,
    transition: true,
    glare: true,
    'max-glare': 0.5,
  });
};
const renderActor = (bioOfActor, actor) => {
  const renderer = document.querySelector('.main-content');

  const actorDetails = document.createElement('div');
  actorDetails.classList.add('movie-details');
  const actorIMG = document.createElement('div');
  actorIMG.classList.add('detail-img');
  actorIMG.style.backgroundImage = `linear-gradient(90deg, rgba(0,0,0,1) 40%, rgba(255,255,255,0) 100%), url("${
    BACKDROP_BASE_URL + bioOfActor.profile_path
  }")`;

  const detailContainer = document.createElement('div');
  detailContainer.innerHTML += `<h2>${bioOfActor['also_known_as'][0]}</h2>`;
  detailContainer.innerHTML += `<p><strong>Birthday:</strong> ${bioOfActor['birthday']}<p>`;
  detailContainer.innerHTML += `<p><strong>PLace of birth</strong> ${bioOfActor['place_of_birth']}<p>`;
  detailContainer.innerHTML += bioOfActor['deathday']
    ? `<p>Death day is ${bioOfActor['deathday']} </p>`
    : '';
  detailContainer.innerHTML += `<p><strong>Biography:</strong></p><p>${bioOfActor['biography']}</p>`;
  actorIMG.appendChild(detailContainer);
  actorDetails.appendChild(actorIMG);

  // console.log("Actor is ", actor["known_for"]);
  const relatedMoviesTitle = document.createElement('h1');
  relatedMoviesTitle.classList.add('actor-title');
  relatedMoviesTitle.innerText = 'Known For';

  const relatedMovies = document.createElement('div');

  relatedMovies.classList.add('similar-movies');

  // console.log(actor["known_for"]);
  actor['known_for'].map((movie) => {
    const movieDiv = document.createElement('div');
    movieDiv.classList.add('movie-card');

    const moviePoster = document.createElement('div');
    moviePoster.classList.add('movie-poster');
    moviePoster.innerHTML = `
                <p class='vote-average'><span>${STAR}</span>${
      Math.round(movie.vote_average * 10) / 10
    }</p>
                ${
                  movie.backdrop_path
                    ? `<img src='${BACKDROP_BASE_URL}${movie.backdrop_path}' alt=''/>`
                    : `<img src='https://www.publicdomainpictures.net/pictures/280000/nahled/not-found-image-15383864787lu.jpg' alt='' />`
                }
                `;

    const movieTitle = document.createElement('div');
    movieTitle.classList.add('movie-title');
    movieTitle.innerHTML = `
                <p>${movie.title}</p>
                <p>${movie.release_date}</p>
            `;
    movieDiv.appendChild(moviePoster);
    movieDiv.appendChild(movieTitle);

    movieDiv.addEventListener('click', () => {
      movieDetailsPage(movie);
    });

    relatedMovies.appendChild(movieDiv);
  });

  renderer.innerHTML = '';
  renderer.appendChild(actorDetails);
  renderer.appendChild(relatedMoviesTitle);
  renderer.appendChild(relatedMovies);

  VanillaTilt.init(actorDetails, {
    max: 5,
    speed: 100,
    reverse: true,
    scale: 1.05,
    reset: true,
    transition: true,
    glare: true,
    'max-glare': 0.3,
  });
};
const renderMovie = (movie) => {
  const renderer = document.querySelector('.main-content');

  const movieDetails = document.createElement('div');
  movieDetails.classList.add('movie-details');
  const detailIMG = document.createElement('div');
  detailIMG.classList.add('detail-img');
  detailIMG.style.backgroundImage = `linear-gradient(90deg, rgba(0,0,0,1) 40%, rgba(255,255,255,0) 100%), url("${
    BACKDROP_BASE_URL + movie.backdrop_path
  }")`;

  const detailContainer = document.createElement('div');
  detailContainer.innerHTML += `<h2>${movie.title}</h2>`;
  detailContainer.innerHTML += `<p>${movie.genres
    .map((genre) => genre.name)
    .join(', ')}</p>`;
  detailContainer.innerHTML += `<p><b>Release Date:</b> ${movie.release_date}</p>`;
  detailContainer.innerHTML += `<p><b>Runtime:</b> ${movie.runtime} Minutes</p>`;
  detailContainer.innerHTML += `<h3>Overview:</h3>`;
  detailContainer.innerHTML += `<p>${movie.overview}</p>`;
  detailContainer.innerHTML += `<button class="watch-button">WATCH</button>`;
  detailContainer.innerHTML += `<button class="add-list-button">♥ Add to list</button>`;

  detailIMG.appendChild(detailContainer);
  movieDetails.appendChild(detailIMG);

  const actorsContainer = document.createElement('div');
  actorsContainer.classList.add('movie-actors');
  const ACTORS_TITLE = document.createElement('h1');
  ACTORS_TITLE.innerText = 'Actors';
  const actorImage = document.createElement('div');
  actorImage.classList.add('movie-actors-img');

  fetchMovieActors(movie.id).then((cast) => {
    for (let i = 0; i < 5; i++) {
      actorImage.innerHTML += `
            <div>
                <div class='actor-img'>
                    <img src=${
                      BACKDROP_BASE_URL + cast.cast[i].profile_path
                    } alt='' />
                </div>
                <p>${cast.cast[i].name}</p>
            </div>
            `;
    }
  });

  /**THIS IS A FETCH FOR SIMILAR MOVIES */
  const SIMILAR_MOVIES = document.createElement('div');
  SIMILAR_MOVIES.classList.add('similar-movies');
  const SIMILAR_MOVIES_TITLE = document.createElement('h1');
  SIMILAR_MOVIES_TITLE.innerText = 'Similar Movies';

  fetchSimilarMovies(movie.id).then((movies) => {
    movies.results.slice(0, 6).map((movie) => {
      const movieDiv = document.createElement('div');
      movieDiv.classList.add('movie-card');

      const moviePoster = document.createElement('div');
      moviePoster.classList.add('movie-poster');
      moviePoster.innerHTML = `
                <p class='vote-average'><span>${STAR}</span>${
        Math.round(movie.vote_average * 10) / 10
      }</p>
                ${
                  movie.backdrop_path
                    ? `<img src='${BACKDROP_BASE_URL}${movie.backdrop_path}' alt=''/>`
                    : `<img src='https://www.publicdomainpictures.net/pictures/280000/nahled/not-found-image-15383864787lu.jpg' alt='' />`
                }
                `;

      const movieTitle = document.createElement('div');
      movieTitle.classList.add('movie-title');
      movieTitle.innerHTML = `
                <p>${movie.title}</p>
                <p>${movie.release_date}</p>
            `;
      movieDiv.appendChild(moviePoster);
      movieDiv.appendChild(movieTitle);

      movieDiv.addEventListener('click', () => {
        movieDetailsPage(movie);
      });

      SIMILAR_MOVIES.appendChild(movieDiv);

      VanillaTilt.init(
        document.querySelectorAll('.movie-actors .similar-movies .movie-card'),
        {
          max: 15,
          speed: 500,
          reverse: true,
          scale: 1.07,
          reset: true,
          transition: true,
          glare: true,
          'max-glare': 0.5,
        }
      );
    });
  });

  actorsContainer.appendChild(ACTORS_TITLE);
  actorsContainer.appendChild(actorImage);
  actorsContainer.appendChild(SIMILAR_MOVIES_TITLE);
  actorsContainer.appendChild(SIMILAR_MOVIES);

  renderer.innerHTML = '';
  renderer.appendChild(movieDetails);
  renderer.appendChild(actorsContainer);

  VanillaTilt.init(movieDetails, {
    max: 5,
    speed: 100,
    reverse: true,
    scale: 1.05,
    reset: true,
    transition: true,
    glare: true,
    'max-glare': 0.3,
  });
};
const constructUrl = (path) => {
  return `${TMDB_BASE_URL}/${path}?api_key=${atob(
    'NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI='
  )}`;
};
const movieDetailsPage = async (movie) => {
  const url = constructUrl(`movie/${movie.id}`);
  const res = await fetch(url);
  const myJson = await res.json();
  renderMovie(myJson);
};
const searchMovie = async (search) => {
  const url = `https://api.themoviedb.org/3/search/movie?api_key=542003918769df50083a13c415bbc602&query="${search}"
    `;
  const res = await fetch(url);
  const data = await res.json();
  renderMovies(data.results);
};
const fetchSimilarMovies = async (id) => {
  const URL = `https://api.themoviedb.org/3/movie/${id}/similar?api_key=542003918769df50083a13c415bbc602&language=en-US&page=1`;
  const res = await fetch(URL);
  return res.json();
};

const fetchDiscoverGenres = async (genre_id) => {
  const URL = `https://api.themoviedb.org/3/discover/movie?api_key=542003918769df50083a13c415bbc602&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate&with_genres=${genre_id}`;
  const res = await fetch(URL);
  const data = await res.json();
  renderMovies(data.results);
};

const fetchActors = async () => {
  const url = constructUrl(`person/popular`);
  const res = await fetch(url);
  const data = await res.json();
  renderActorPage(data.results);
};

const fetchFilterMovie = async (filter = 'now_playing') => {
  const url = constructUrl(`movie/${filter}`);
  const res = await fetch(url);
  const myJson = await res.json();
  renderMovies(myJson.results);
};

const fetchMovieActors = async (movie_id) => {
  const URL = `https://api.themoviedb.org/3/movie/${movie_id}/credits?api_key=542003918769df50083a13c415bbc602&language=en-US`;
  const res = await fetch(URL);
  return res.json();
};

const fetchLifeActor = async (personId, person) => {
  // const URL = `https://api.themoviedb.org/3/person/${person}?api_key=542003918769df50083a13c415bbc602&language=en-US`;
  const url = constructUrl(`person/${personId}`);
  const res = await fetch(url);
  const data = await res.json();
  renderActor(data, person);
};

autorun();
