async function fetchMovies() {
    const query = document.getElementById("search").value.trim();
    if (query === "") {
        document.getElementById("movies").innerHTML = "";
        return;
    }
    const apiKey = "9afcca01";
    const url = `https://www.omdbapi.com/?s=${query}&apikey=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.Response === "False") {
            document.getElementById("movies").innerHTML = `
                <div class="no-results">
                    <p>No movies found. Try another search.</p>
                </div>
            `;
            return;
        }
        displayMovies(data.Search);
    } catch (error) {
        console.error("Fetch error:", error);
        document.getElementById("movies").innerHTML = `
            <div class="error-message">
                <p>Unable to fetch movies. Please check your connection.</p>
            </div>
        `;
    }
}

function displayMovies(movies) {
    const moviesContainer = document.getElementById("movies");
    moviesContainer.innerHTML = "";
    movies.forEach(movie => {
        const movieCard = document.createElement("div");
        movieCard.classList.add("movie-card");
        movieCard.innerHTML = `
            <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/180x270?text=No+Poster"}" alt="${movie.Title}">
            <div class="movie-card-overlay">
                <h4>${movie.Title} (${movie.Year})</h4>
            </div>
        `;

        movieCard.onclick = () => fetchMovieDetails(movie.imdbID);
        moviesContainer.appendChild(movieCard);
    });
}

async function fetchMovieDetails(movieID) {
    const apiKey = "9afcca01";
    const url = `https://www.omdbapi.com/?i=${movieID}&apikey=${apiKey}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.Response === "False") return;

        document.getElementById("movie-details").innerHTML = `
            <img src="${data.Poster !== "N/A" ? data.Poster : "https://via.placeholder.com/300x450?text=No+Poster"}" alt="${data.Title}">
            <h2>${data.Title} (${data.Year})</h2>
            <p>${data.Plot}</p>
            <h4>IMDB Rating: ⭐ ${data.imdbRating}/10</h4>
            <p><strong>Genre:</strong> ${data.Genre}</p>
            <p><strong>Director:</strong> ${data.Director}</p>
            <p><strong>Actors:</strong> ${data.Actors}</p>
            <p><strong>More Info:</strong> <a href="https://www.imdb.com/title/${movieID}" target="_blank">View on IMDb</a></p>
        `;

        document.getElementById("movie-popup").style.display = "block";
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

function closePopup() {
    document.getElementById("overlay").style.display = "none";
    document.getElementById("movie-popup").style.display = "none";
}
