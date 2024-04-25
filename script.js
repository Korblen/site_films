
const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list-results');
const resultGrid = document.getElementById('result-grid');

// load movies from API
async function loadMovies(searchTerm){
    const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=${API_KEY}`;
    const res = await fetch(`${URL}`);
    const data = await res.json();
    // console.log(data.Search);
    if(data.Response == "True") displayMovieList(data.Search);
}

function findMovies(){
    let searchTerm = (movieSearchBox.value).trim();
    if(searchTerm.length > 0){
        searchList.classList.remove('hide-search-list');
        loadMovies(searchTerm);
    } else {
        searchList.classList.add('hide-search-list');
    }
}

function displayMovieList(movies){
    searchList.innerHTML = "";  // Clear existing entries
    for(let idx = 0; idx < movies.length; idx++){
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movies[idx].imdbID;
        movieListItem.classList.add('search-list-item'); // Ensure this class is added for styling and selection

        let moviePoster = movies[idx].Poster !== "N/A" ? movies[idx].Poster : "image_not_found.png";

        movieListItem.innerHTML = `
        <div class="card" style="width: 18rem;">
            <img class="card-img-top" src="${moviePoster}" alt="${movies[idx].Title} poster">
            <div class="card-body">
                <h5 class="card-title">${movies[idx].Title}</h5>
                <p class="card-text">${movies[idx].Year}</p>
                <button class="btn btn-primary button-show">Voir plus</button>
            </div>
        </div>
        `;
        searchList.appendChild(movieListItem);
    }

    attachEventListeners(); // Setup listeners after the list has been populated
}

function attachEventListeners(){
    const buttons = searchList.querySelectorAll('.button-show');
    buttons.forEach(button => {
        button.addEventListener('click', async function(event) {
            const movieId = this.closest('.search-list-item').dataset.id;
            const result = await fetch(`https://www.omdbapi.com/?i=${movieId}&apikey=${API_KEY}`);
            const movieDetails = await result.json();
            displayMovieDetails(movieDetails);
        });
    });
}

function displayMovieDetails(details){
    const modal = document.getElementById('movieModal');
    const span = document.getElementsByClassName("close")[0]; // Get the <span> element that closes the modal
    const resultGrid = document.getElementById('resultGrid');

    resultGrid.innerHTML = `
    <div class="movie-poster">
        <img src="${(details.Poster != "N/A") ? details.Poster : 'image_not_found.png'}" alt="movie poster">
    </div>
    <div class="movie-info">
        <h3 class="movie-title">${details.Title}</h3>
        <ul class="movie-misc-info">
            <li class="year">Year: ${details.Year}</li>
            <li class="rated">Ratings: ${details.Rated}</li>
            <li class="released">Released: ${details.Released}</li>
        </ul>
        <p class="genre"><b>Genre:</b> ${details.Genre}</p>
        <p class="writer"><b>Writer:</b> ${details.Writer}</p>
        <p class="actors"><b>Actors: </b>${details.Actors}</p>
        <p class="plot"><b>Plot:</b> ${details.Plot}</p>
        <p class="language"><b>Language:</b> ${details.Language}</p>
        <p class="awards"><b><i class="fas fa-award"></i></b> ${details.Awards}</p>
    </div>
    `;

    modal.style.display = "block"; // Show the modal

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    };

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
}

function displayPlot(details){
    resultplot.innerHTML=`    <p class = "plot"><b>Plot:</b> ${details.Plot}</p>
    `;
}

window.addEventListener('click', (event) => {
    if(event.target.className != "form-control"){
        searchList.classList.add('hide-search-list');
    }
});