const movieListSection = document.getElementById('movieList');
const searchInput = document.getElementById('searchInput');

const modal = document.getElementById('movieModal');
const closeBtn = document.querySelector('.close-btn');
const modalTitle = document.getElementById('modalTitle');
const modalImg = document.getElementById('modalImg');
const modalDesc = document.getElementById('modalDesc');
const modalRating = document.getElementById('modalRating');

let allMovies = [];

async function fetchMovies() {
    try {
        const response = await fetch('./data/movies.json');
        if (!response.ok) throw new Error('Veri okunamadı');
        allMovies = await response.json();
        displayMovies(allMovies);
    } catch (error) {
        console.error('Hata:', error);
    }
}

function displayMovies(movies) {
    movieListSection.innerHTML = '';
    
    if (movies.length === 0) {
        movieListSection.innerHTML = '<p style="color:white; text-align:center;">Bulunamadı.</p>';
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
        
        card.addEventListener('click', () => openModal(movie));

        movieListSection.appendChild(card);
    });
}


function openModal(movie) {
    modal.style.display = 'block'; 
    modalTitle.textContent = movie.title;
    modalImg.src = movie.poster;
    modalRating.textContent = `IMDB: ${movie.rating}`;
    
    modalDesc.textContent = movie.description ? movie.description : "Bu film için henüz detaylı açıklama girilmemiş.";
}

closeBtn.onclick = function() {
    modal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredMovies = allMovies.filter(movie => 
        movie.title.toLowerCase().includes(searchTerm)
    );
    displayMovies(filteredMovies);
});

document.addEventListener('DOMContentLoaded', fetchMovies);