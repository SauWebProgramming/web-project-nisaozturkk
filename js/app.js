const movieListSection = document.getElementById('movieList');
const searchInput = document.getElementById('searchInput');
let allMovies = [];

async function fetchMovies() {
    try {
        const response = await fetch('./data/movies.json');
        if (!response.ok) throw new Error('Veri okunamadı');
        
        allMovies = await response.json();
        displayMovies(allMovies); 
    } catch (error) {
        console.error('Hata:', error);
        movieListSection.innerHTML = '<p style="color:white; text-align:center;">Veriler yüklenemedi.</p>';
    }
}

function displayMovies(movies) {
    movieListSection.innerHTML = '';
    
    if (movies.length === 0) {
        movieListSection.innerHTML = '<p style="color:#aaa; text-align:center; width:100%;">Aradığınız kriterde film bulunamadı.</p>';
        return;
    }

    movies.forEach(movie => {
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

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    const filteredMovies = allMovies.filter(movie => 
        movie.title.toLowerCase().includes(searchTerm)
    );

    displayMovies(filteredMovies);
});

document.addEventListener('DOMContentLoaded', fetchMovies);