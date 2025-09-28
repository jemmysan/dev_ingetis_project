// Configuration de l'API OpenWeatherMap
const API_KEY = 'a57e92746e2527de3ff700f160b1ca9c'; // Clé API gratuite
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Éléments DOM
const cityForm = document.getElementById('cityForm');
const cityInput = document.getElementById('cityInput');
const getLocationBtn = document.getElementById('getLocationBtn');
const cityResult = document.getElementById('cityResult');
const locationResult = document.getElementById('locationResult');

// Éléments d'affichage météo
const weatherDisplay = document.getElementById('weatherDisplay');
const weatherContent = document.getElementById('weatherContent');
const loadingIndicator = document.getElementById('loadingIndicator');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');

const currentCity = document.getElementById('currentCity');
const weatherIcon = document.getElementById('weatherIcon');
const currentTemp = document.getElementById('currentTemp');
const weatherDesc = document.getElementById('weatherDesc');
const feelsLike = document.getElementById('feelsLike');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');

// Historique des recherches
let searchHistory = JSON.parse(localStorage.getItem('weatherSearchHistory')) || [];

// Initialisation
// document.addEventListener('DOMContentLoaded', function() {
//     // Charger la météo d'Aubervilliers par défaut
//     getWeatherByCity('Aubervilliers');
// });

// Recherche par ville
cityForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const city = cityInput.value.trim();
    
    if (city) {
        getWeatherByCity(city);
        cityInput.value = '';
    }
});

// Géolocalisation
getLocationBtn.addEventListener('click', function() {
    if (!navigator.geolocation) {
        showError('La géolocalisation n\'est pas supportée par votre navigateur');
        return;
    }
    
    showLoading();
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords;
            getWeatherByCoords(latitude, longitude);
        },
        error => {
            let errorMsg = 'Impossible d\'obtenir votre position';
            
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMsg = 'Permission de géolocalisation refusée';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMsg = 'Position indisponible';
                    break;
                case error.TIMEOUT:
                    errorMsg = 'Délai de géolocalisation dépassé';
                    break;
            }
            
            showError(errorMsg);
        }
    );
});

// Obtenir la météo par nom de ville
async function getWeatherByCity(city) {
    showLoading();
    hideError();
    
    try {
        const response = await fetch(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric&lang=fr`);
        
        if (!response.ok) {
            throw new Error('Ville non trouvée');
        }
        
        const data = await response.json();
        displayWeather(data);
        updateCityResult(city, data.sys.country);
        // addToSearchHistory(city);
    } catch (error) {
        if (error.message === 'Ville non trouvée') {
            showError('Ville non trouvée. Vérifiez l\'orthographe.');
        } else {
            showError('Erreur lors de la récupération des données météo');
        }
        console.error('Erreur API:', error);
    }
}

// Obtenir la météo par coordonnées
async function getWeatherByCoords(lat, lon) {
    showLoading();
    hideError();
    
    try {
        const response = await fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=fr`);
        
        if (!response.ok) {
            throw new Error('Erreur API');
        }
        
        const data = await response.json();
        displayWeather(data);
        // updateLocationResult(data.name, data.sys.country);
    } catch (error) {
        showError('Erreur lors de la récupération des données météo');
        console.error('Erreur API:', error);
    }
}

// Afficher les données météo
function displayWeather(data) {
    hideLoading();
    
    // Informations de base
    currentCity.textContent = `${data.name}, ${data.sys.country}`;
    currentTemp.textContent = `${Math.round(data.main.temp)}°C`;
    weatherDesc.textContent = data.weather[0].description;
    
    // Icône météo
    const iconCode = data.weather[0].icon;
    weatherIcon.className = `fas ${getWeatherIcon(iconCode)}`;
    
    // Détails supplémentaires
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`; // Conversion m/s -> km/h
    
    // Afficher le contenu
    weatherContent.style.display = 'block';
}

// Obtenir l'icône météo appropriée
function getWeatherIcon(iconCode) {
    const iconMap = {
        '01d': 'fa-sun',           // Ciel dégagé (jour)
        '01n': 'fa-moon',          // Ciel dégagé (nuit)
        '02d': 'fa-cloud-sun',     // Peu nuageux (jour)
        '02n': 'fa-cloud-moon',    // Peu nuageux (nuit)
        '03d': 'fa-cloud',         // Nuageux (jour)
        '03n': 'fa-cloud',         // Nuageux (nuit)
        '04d': 'fa-cloud',         // Très nuageux (jour)
        '04n': 'fa-cloud',         // Très nuageux (nuit)
        '09d': 'fa-cloud-rain',    // Averses (jour)
        '09n': 'fa-cloud-rain',    // Averses (nuit)
        '10d': 'fa-cloud-sun-rain',// Pluie (jour)
        '10n': 'fa-cloud-moon-rain',// Pluie (nuit)
        '11d': 'fa-bolt',          // Orage (jour)
        '11n': 'fa-bolt',          // Orage (nuit)
        '13d': 'fa-snowflake',     // Neige (jour)
        '13n': 'fa-snowflake',     // Neige (nuit)
        '50d': 'fa-smog',          // Brouillard (jour)
        '50n': 'fa-smog'           // Brouillard (nuit)
    };
    
    return iconMap[iconCode] || 'fa-cloud';
}

// Mettre à jour l'affichage des résultats de recherche
function updateCityResult(city, country) {
    cityResult.innerHTML = `
        <div class="alert alert-success mt-3">
            <i class="fas fa-check-circle me-2"></i>
            Météo chargée pour <strong>${city}, ${country}</strong>
        </div>
    `;
}

// Mettre à jour l'affichage de la géolocalisation
// function updateLocationResult(city, country) {
//     locationResult.innerHTML = `
//         <div class="alert alert-success mt-3">
//             <i class="fas fa-check-circle me-2"></i>
//             Météo locale chargée pour <strong>${city}, ${country}</strong>
//         </div>
//     `;
// }

// Gestion de l'historique des recherches
// function addToSearchHistory(city) {
//     // Éviter les doublons
//     if (!searchHistory.includes(city)) {
//         searchHistory.unshift(city);
        
//         // Garder seulement les 5 dernières recherches
//         if (searchHistory.length > 5) {
//             searchHistory = searchHistory.slice(0, 5);
//         }
        
//         // Sauvegarder dans le localStorage
//         localStorage.setItem('weatherSearchHistory', JSON.stringify(searchHistory));
//     }
// }

// Gestion de l'affichage du chargement
function showLoading() {
    loadingIndicator.style.display = 'block';
    weatherContent.style.display = 'none';
    hideError();
}

function hideLoading() {
    loadingIndicator.style.display = 'none';
}

// Gestion des erreurs
function showError(message) {
    errorText.textContent = message;
    errorMessage.style.display = 'block';
    hideLoading();
    weatherContent.style.display = 'none';
}

function hideError() {
    errorMessage.style.display = 'none';
}