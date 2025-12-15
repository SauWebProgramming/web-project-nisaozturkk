const movieListSection = document.getElementById('movieList');
let allMovies = [];

async function fetchMovies() {
    try {
        const response = await fetch('./data/movies.json');
        
        if (!response.ok) {
            throw new Error('Veri okunamadı');
        }

        allMovies = await response.json();
        displayMovies(allMovies);
    } catch (error) {
        console.error('Hata:', error);
        movieListSection.innerHTML = '<p style="color:white; text-align:center;">Veriler yüklenirken bir sorun oluştu.</p>';
    }
}

function displayMovies(movies) {
    movieListSection.innerHTML = ''; 
    
    if (movies.length === 0) {
        movieListSection.innerHTML = '<p style="color:white; text-align:center;">Listelenecek yapım bulunamadı.</p>';
        return;
    }

    movies.forEach((movie) => {
        const card = document.createElement('article');
        card.className = 'movie-card'; 
        
        card.innerHTML = `
            <img src="${movie.poster}" alt="${movie.title}">
            <div class="card-info">
                <h3>${movie.title}</h3> 
                <p style="color: #aaa; font-size: 0.9rem;">${movie.year} | ⭐️ ${movie.rating}</p>
            </div>
        `;
        
        movieListSection.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', fetchMovies);