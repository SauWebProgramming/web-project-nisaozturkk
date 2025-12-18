const movieListSection = document.getElementById('movieList');
const searchInput = document.getElementById('searchInput');
const favoritesBtn = document.getElementById('favoritesBtn');

const modal = document.getElementById('movieModal');
const modalBody = document.getElementById('modalBody'); // İçini JS ile dolduracağız
const closeBtn = document.querySelector('.close-btn');

let allMovies = [];
let favorites = JSON.parse(localStorage.getItem('myFavorites')) || [];
let isShowingFavorites = false; 

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
        movieListSection.innerHTML = '<p style="color:white; text-align:center;">Liste boş.</p>';
        return;
    }

    movies.forEach(movie => {
        const card = document.createElement('article');
        card.className = 'movie-card'; 
        
        const isFav = favorites.includes(movie.title);

        card.innerHTML = `
            <span class="favorite-btn ${isFav ? 'active' : ''}">♥</span>
            <img src="${movie.poster}" alt="${movie.title}">
            <div class="card-info">
                <h3>${movie.title}</h3> 
                <p style="color: #aaa; font-size: 0.9rem;">${movie.year} | ⭐️ ${movie.rating}</p>
            </div>
        `;
        
        const heartBtn = card.querySelector('.favorite-btn');
        heartBtn.addEventListener('click', (e) => {
            e.stopPropagation(); 
            toggleFavorite(movie.title);
        });

        card.addEventListener('click', () => openModal(movie));
        
        movieListSection.appendChild(card);
    });
}

function openModal(movie) {
    const director = movie.director ? movie.director : '-';
    const cast = movie.cast ? movie.cast : '-';

    const isFav = favorites.includes(movie.title);
    const btnText = isFav ? 'Favorilerden Çıkar 💔' : 'Favorilere Ekle ❤️';
    const btnColor = isFav ? '#d9534f' : '#28a745'; 

    modalBody.innerHTML = `
        <div class="modal-body-content">
            <img src="${movie.poster}" class="modal-poster" alt="${movie.title}">
            
            <div class="modal-info">
                <h2>${movie.title}</h2>
                
                <div style="margin: 15px 0; color: #ccc; line-height: 1.6;">
                    <p><strong>Yıl:</strong> ${movie.year} | ⭐️ ${movie.rating}</p>
                    <p><strong>Yönetmen:</strong> ${director}</p>
                    <p><strong>Oyuncular:</strong> ${cast}</p>
                    <p style="margin-top:10px;">${movie.description || 'Açıklama girilmemiş.'}</p>
                </div>

                <button id="dynamicFavBtn" class="modal-fav-btn" style="background-color:${btnColor};">
                    ${btnText}
                </button>
            </div>
        </div>
    `;

    const dynamicBtn = document.getElementById('dynamicFavBtn');
    dynamicBtn.onclick = () => {
        toggleFavorite(movie.title);
        modal.classList.remove('active'); 
        openModal(movie); 
    };

    modal.classList.add('active');
}

function toggleFavorite(title) {
    if (favorites.includes(title)) {
        favorites = favorites.filter(fav => fav !== title);
    } else {
        favorites.push(title);
    }
    localStorage.setItem('myFavorites', JSON.stringify(favorites));
    
    if (isShowingFavorites) {
        showOnlyFavorites();
    } else {
        const searchTerm = searchInput.value.toLowerCase();
        const currentList = allMovies.filter(m => m.title.toLowerCase().includes(searchTerm));
        displayMovies(currentList);
    }
}

favoritesBtn.addEventListener('click', () => {
    isShowingFavorites = !isShowingFavorites; 
    if (isShowingFavorites) {
        favoritesBtn.textContent = "Tüm Filmleri Göster";
        favoritesBtn.classList.add('active');
        showOnlyFavorites();
    } else {
        favoritesBtn.textContent = "Favorilerim ❤️";
        favoritesBtn.classList.remove('active');
        displayMovies(allMovies);
    }
});

function showOnlyFavorites() {
    const favMovies = allMovies.filter(movie => favorites.includes(movie.title));
    displayMovies(favMovies);
}

closeBtn.onclick = () => modal.classList.remove('active');
window.onclick = (e) => { 
    if (e.target == modal) modal.classList.remove('active'); 
}

searchInput.addEventListener('input', (e) => {
    if(isShowingFavorites) {
        isShowingFavorites = false;
        favoritesBtn.textContent = "Favorilerim ❤️";
    }
    const searchTerm = e.target.value.toLowerCase();
    const filteredMovies = allMovies.filter(movie => 
        movie.title.toLowerCase().includes(searchTerm)
    );
    displayMovies(filteredMovies);
});

document.addEventListener('DOMContentLoaded', fetchMovies);