// 10. GÜN: JSON VERİSİNE TAM UYUMLU FINAL SÜRÜM

const movieListSection = document.getElementById('movieList');
const searchInput = document.getElementById('searchInput');
const favoritesBtn = document.getElementById('favoritesBtn');
const categoryFilter = document.getElementById('categoryFilter');

const modal = document.getElementById('movieModal');
const modalBody = document.getElementById('modalBody');
const closeBtn = document.querySelector('.close-btn');

let allMovies = [];
let favorites = JSON.parse(localStorage.getItem('myFavorites')) || [];
let isShowingFavorites = false; 

// Verileri Çek
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

// Filtreleme
categoryFilter.addEventListener('change', (e) => {
    const selectedCategory = e.target.value;
    if (isShowingFavorites) {
        isShowingFavorites = false;
        favoritesBtn.textContent = "Favorilerim ❤️";
        favoritesBtn.classList.remove('active');
    }
    searchInput.value = "";

    if (selectedCategory === 'all') {
        displayMovies(allMovies);
    } else {
        const filtered = allMovies.filter(movie => {
            const movieCat = movie.category || ''; 
            return movieCat.includes(selectedCategory);
        });
        displayMovies(filtered);
    }
});

// Listeleme
function displayMovies(movies) {
    movieListSection.innerHTML = '';
    if (movies.length === 0) {
        movieListSection.innerHTML = '<p style="color:white; text-align:center;">Aradığınız kriterde yapım bulunamadı.</p>';
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
        
        card.querySelector('.favorite-btn').addEventListener('click', (e) => {
            e.stopPropagation(); 
            toggleFavorite(movie.title);
        });
        card.addEventListener('click', () => openModal(movie));
        movieListSection.appendChild(card);
    });
}

// --- MODAL (SORUN ÇÖZÜLDÜ) ---
function openModal(movie) {
    const director = movie.director || 'Belirtilmemiş';
    const cast = movie.cast || 'Belirtilmemiş';
    const category = movie.category || 'Genel';
    
    // BURASI DÜZELTİLDİ: Senin JSON yapına göre (season ve duration)
    let timeInfo = '';
    
    // JSON'da "season": "3 Sezon" yazıyor, direkt onu alıyoruz.
    if (movie.season) {
        timeInfo = `📺 ${movie.season}`; 
    } 
    // JSON'da "duration": "2 Saat 3 Dk" yazıyor, direkt onu alıyoruz.
    else if (movie.duration) {
        timeInfo = `⏱️ ${movie.duration}`; 
    }

    const isFav = favorites.includes(movie.title);
    const btnText = isFav ? 'Favorilerden Çıkar 💔' : 'Favorilere Ekle ❤️';
    const btnColor = isFav ? '#d9534f' : '#28a745'; 

    modalBody.innerHTML = `
        <div class="modal-body-content">
            <img src="${movie.poster}" class="modal-poster" alt="${movie.title}">
            <div class="modal-info">
                <h2>${movie.title}</h2>
                <div class="modal-meta-info">
                    <span class="category-badge">${category}</span>
                    ${timeInfo ? `<span class="duration-info">${timeInfo}</span>` : ''}
                    <span class="duration-info">| ⭐️ ${movie.rating}</span>
                </div>
                <div style="margin: 15px 0; line-height: 1.6; color:#ddd;">
                    <p><strong>Yönetmen:</strong> ${director}</p>
                    <p><strong>Oyuncular:</strong> ${cast}</p>
                    <p style="margin-top:15px; color:#aaa;">${movie.description || 'Açıklama girilmemiş.'}</p>
                </div>
                <button id="dynamicFavBtn" class="modal-fav-btn" style="background-color:${btnColor}">
                    ${btnText}
                </button>
            </div>
        </div>
    `;

    document.getElementById('dynamicFavBtn').onclick = () => {
        toggleFavorite(movie.title);
        modal.classList.remove('active');
        openModal(movie); 
    };
    modal.classList.add('active');
}

// Favori İşlemleri
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
        // Görünümü yenile
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCat = categoryFilter.value;
        let listToFilter = allMovies;
        if (selectedCat !== 'all') {
            listToFilter = allMovies.filter(m => (m.category || '').includes(selectedCat));
        }
        const filtered = listToFilter.filter(m => m.title.toLowerCase().includes(searchTerm));
        displayMovies(filtered);
    }
}

favoritesBtn.addEventListener('click', () => {
    isShowingFavorites = !isShowingFavorites; 
    if (isShowingFavorites) {
        favoritesBtn.textContent = "Tüm Filmleri Göster";
        favoritesBtn.classList.add('active');
        categoryFilter.value = 'all'; 
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
window.onclick = (e) => { if (e.target == modal) modal.classList.remove('active'); }

searchInput.addEventListener('input', (e) => {
    if(isShowingFavorites) {
        isShowingFavorites = false;
        favoritesBtn.textContent = "Favorilerim ❤️";
        favoritesBtn.classList.remove('active');
    }
    const searchTerm = e.target.value.toLowerCase();
    const selectedCat = categoryFilter.value;
    let sourceList = allMovies;
    if (selectedCat !== 'all') {
        sourceList = allMovies.filter(m => (m.category || '').includes(selectedCat));
    }
    const filteredMovies = sourceList.filter(movie => movie.title.toLowerCase().includes(searchTerm));
    displayMovies(filteredMovies);
});

document.addEventListener('DOMContentLoaded', fetchMovies);