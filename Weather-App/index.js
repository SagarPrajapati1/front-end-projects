const API_KEY = '11252bf88169c20e732cf87f5c10218b';

const userTab = document.querySelector('[data-userWeather]')
const searchTab = document.querySelector('[data-searchWeather]')
const searchForm = document.querySelector('[data-searchForm]')

const grantAccessContainer = document.querySelector('.grant-location-container')
const grantAccessBtn = document.querySelector('[data-grantAccess]')
const loadingScreen = document.querySelector('.loading-screen')
const userInfoContainer = document.querySelector('.user-info-container')
const searchInput = document.querySelector('[data-searchInput]')


const notFound = document.querySelector('.errorContainer');
const errorBtn = document.querySelector('[data-errorButton]');
const errorText = document.querySelector('[data-errorText]');
const errorImage = document.querySelector('[data-errorImg]');


let currentTab = userTab;
// add the background to the current tab
currentTab.classList.add("current-tab");
getFromStorageSession();

// nine
async function fetchSeacrhWeatherInfo(city) {
	loadingScreen.classList.add('active');
	userInfoContainer.classList.remove('active');
	grantAccessContainer.classList.remove('active');

	try {
		const response = await fetch(
			`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
		);
		const data = await response.json();

		loadingScreen.classList.remove('active');
		userInfoContainer.classList.add('active');
		renderWeatherInfo(data);
	} catch (error) {
		// homework
	}
}


// eigth
searchForm.addEventListener('submit', (e) => {
	e.preventDefault();
	let cityName = searchInput.value;

	if (cityName === "") {
		return;
	}
	else {
		// console.log(searchInput.value);
    fetchSeacrhWeatherInfo(searchInput.value);
    searchInput.value = "";
	}
});



// seventh
function showPosition(position) {
	const userCoordinates = {
		lat: position.coords.latitude,
		lon: position.coords.longitude
	};

	sessionStorage.setItem("userCoordinates", JSON.stringify(userCoordinates));
	fetchUserWeatherInfo(userCoordinates);
}

// sixth
function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showPosition);
	}
	else {
		// alert
	}
}

// fifth
grantAccessBtn.addEventListener('click', getLocation);


// fourth
function renderWeatherInfo(weatherInfo) {
	const cityName = document.querySelector('[data-cityName]');
	const countryIcon = document.querySelector('[data-countryIcon]');
	const desc = document.querySelector('[data-weatherDesc]');
	const weatherIcon = document.querySelector('[data-weatherIcon]');
	const temp = document.querySelector('[data-temp]');
	const windSpeed = document.querySelector('[data-windSpeed]');
	const humidity = document.querySelector('[data-humidity]');
	const clouds = document.querySelector('[data-clouds]');


	// fetch values from weatherInfo object and put in the UI elements
	cityName.innerText = weatherInfo?.name;
	countryIcon.src = `https://flagcdn.com/48x36/${weatherInfo?.sys?.country.toLowerCase()}.png`;
	desc.innerText = weatherInfo?.weather?.[0]?.description;
	weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
	temp.innerText = `${weatherInfo?.main?.temp} °C`;
	windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
	humidity.innerText = `${weatherInfo?.main?.humidity} %`;
	clouds.innerText = `${weatherInfo?.clouds?.all} %`;
}


// third
async function fetchUserWeatherInfo(coordinates) {
	const { lat, lon } = coordinates;
	// make grantaccesscontainer invisible
	grantAccessContainer.classList.remove('active');
	// make loding visible
	loadingScreen.classList.add('active');

	// API call
	try {
		const response = await fetch(
			`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
		);

		const data = await response.json();
		if (!data.sys) throw data;
		// remove loader
		loadingScreen.classList.remove('active');
		userInfoContainer.classList.add('active');
		renderWeatherInfo(data);
	} catch (err) {
		// homework
		loadingContainer.classList.remove('active');
		notFound.classList.add('active');
		errorImage.style.display = 'none';
		errorText.innerText = `Error: ${err?.message}`;
		errorBtn.style.display = 'block';
		errorBtn.addEventListener("click", fetchUserWeatherInfo);
	}
}


// second
// check if coordinates are already present in session storage
function getFromStorageSession() {
	const localCoordinates = sessionStorage.getItem("userCoordinates");

	if (!localCoordinates) {
		grantAccessContainer.classList.add('active');
	}
	else {
		const coordinates = JSON.parse(localCoordinates);
		fetchUserWeatherInfo(coordinates);
	}
}

// first
// switch the tab according to the user click
function switchTab(clickedTab){
	// check if current tab is not equal to the clickTab
	if (clickedTab != currentTab) {
		// it means we are clicking on the another tab
		// remove the background of current-tab and add to the clicked-tab
		currentTab.classList.remove("current-tab");
		currentTab = clickedTab;
		currentTab.classList.add("current-tab");

		// switch the tabs
		if (!searchForm.classList.contains('active')) {

			searchForm.classList.add('active');
			userInfoContainer.classList.remove('active');
			grantAccessContainer.classList.remove('active');

		} else {

			// search tab to your weather
			searchForm.classList.remove('active');
			userInfoContainer.classList.remove('active');
			// in the your weather tab we have to display the weather so let's check local storage first for coordinates, if we have saved them before
			getFromStorageSession();
			
		}
	}
}


// click on any of the tab
userTab.addEventListener('click', () => {
	switchTab(userTab);
});

searchTab.addEventListener('click', () => {
	switchTab(searchTab);
});