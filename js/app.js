// ShoreSquad App
class ShoreSquad {
    constructor() {
        this.map = null;
        this.markers = new Map();
        this.cleanupEvents = new Map();
        this.initializeApp();
    }

    async initializeApp() {
        this.setupNavigation();
        await this.setupGeolocation();
        this.initMap();
        await this.getWeather();
        this.setupEventListeners();
    }

    setupNavigation() {
        const menuToggle = document.querySelector('.menu-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (menuToggle && navMenu) {
            menuToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                menuToggle.setAttribute('aria-expanded', 
                    menuToggle.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'
                );
            });
        }
    }

    async setupGeolocation() {
        try {
            if ('geolocation' in navigator) {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject);
                });

                const { latitude, longitude } = position.coords;
                // We'll use these coordinates for the map and weather features
                this.userLocation = { latitude, longitude };
                console.log('Location acquired:', this.userLocation);
            }
        } catch (error) {
            console.error('Error getting location:', error);
            // Handle error gracefully - we'll add error UI later
        }
    }    async getWeather() {
        try {
            const today = new Date();
            const formattedDate = today.toISOString().split('T')[0];
            
            // Fetch 24-hour weather forecast
            const response = await fetch(`https://api.data.gov.sg/v1/environment/24-hour-weather-forecast?date=${formattedDate}`);
            if (!response.ok) throw new Error('Weather forecast fetch failed');
            const data = await response.json();
            
            // Fetch 4-day weather forecast
            const fourDayResponse = await fetch(`https://api.data.gov.sg/v1/environment/4-day-weather-forecast?date=${formattedDate}`);
            if (!fourDayResponse.ok) throw new Error('4-day forecast fetch failed');
            const fourDayData = await fourDayResponse.json();

            // Get current temperature readings
            const tempResponse = await fetch(`https://api.data.gov.sg/v1/environment/air-temperature?date=${formattedDate}`);
            if (!tempResponse.ok) throw new Error('Temperature fetch failed');
            const tempData = await tempResponse.json();

            // Check if we have valid data
            if (!data.items || !data.items.length || !fourDayData.items || !fourDayData.items.length) {
                throw new Error('No weather data available');
            }

            const weatherInfo = {
                current: {
                    forecast: data.items[0].general.forecast,
                    temperature: this.findPasirRisTemperature(tempData),
                    relative_humidity: data.items[0].general.relative_humidity,
                    wind: data.items[0].general.wind
                },
                fourDay: fourDayData.items[0].forecasts
            };

            this.displayWeather(weatherInfo);
        } catch (error) {
            console.error('Error fetching weather:', error);
            this.displayWeatherError();
        }
    }

    findPasirRisTemperature(tempData) {
        if (!tempData.items || !tempData.items.length) return null;
        
        // Find the Pasir Ris station reading (station_id might be different, adjust as needed)
        const pasirRisReading = tempData.items[0].readings.find(
            r => r.station_id === 'S50' || // Pasir Ris
                 r.station_id === 'S104' || // Changi
                 r.station_id === 'S107' // Tampines
        );

        return pasirRisReading ? pasirRisReading.value : null;
    }    displayWeather(data) {
        const container = document.querySelector('.weather-container');
        if (!container) return;

        const getWeatherIcon = (forecast) => {
            const conditions = forecast.toLowerCase();
            if (conditions.includes('thundery')) return '⛈️';
            if (conditions.includes('rain')) return '🌧️';
            if (conditions.includes('cloudy')) return '☁️';
            if (conditions.includes('fair') || conditions.includes('sunny')) return '☀️';
            if (conditions.includes('windy')) return '💨';
            if (conditions.includes('showers')) return '🌦️';
            return '🌤️';
        };

        const html = `
            <div class="weather-current">
                <h3>Current Weather at Pasir Ris</h3>
                <div class="weather-details">
                    <div class="current-conditions">
                        <p class="temperature">${data.current.temperature ? data.current.temperature.toFixed(1) : '--'}°C</p>
                        <p class="description">
                            ${getWeatherIcon(data.current.forecast)} ${data.current.forecast}
                        </p>
                    </div>
                    <div class="current-info">
                        <p class="humidity">Humidity: ${data.current.relative_humidity.low}-${data.current.relative_humidity.high}%</p>
                        <p class="wind">Wind: ${data.current.wind.speed.low}-${data.current.wind.speed.high} km/h</p>
                    </div>
                </div>
            </div>
            <div class="weather-forecast">
                <h3>4-Day Forecast</h3>
                <div class="forecast-container">
                    ${data.fourDay.map(day => `
                        <div class="forecast-day">
                            <p class="date">${new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                            <p class="weather-icon">${getWeatherIcon(day.forecast)}</p>
                            <p class="temperature">${day.temperature.low}°C - ${day.temperature.high}°C</p>
                            <p class="description">${day.forecast}</p>
                            <p class="humidity">Humidity: ${day.relative_humidity.low}-${day.relative_humidity.high}%</p>
                            <p class="wind">Wind: ${day.wind.speed.low}-${day.wind.speed.high} km/h</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    displayWeatherError() {
        const container = document.querySelector('.weather-container');
        if (container) {
            container.innerHTML = `
                <div class="weather-error">
                    <p>Unable to load weather data. Please try again later.</p>
                </div>
            `;
        }
    }initMap() {
        if (!this.userLocation) return;
        
        const mapContainer = document.getElementById('cleanup-map');
        if (!mapContainer) return;

        this.map = L.map('cleanup-map').setView(
            [this.userLocation.latitude, this.userLocation.longitude],
            13
        );

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);

        // Add user location marker
        const userMarker = L.marker([this.userLocation.latitude, this.userLocation.longitude])
            .addTo(this.map)
            .bindPopup('Your Location')
            .openPopup();

        // Add some sample cleanup events
        this.addSampleCleanupEvents();
    }    addSampleCleanupEvents() {
        const sampleEvents = [
            {
                id: 'event1',
                lat: 1.381497,
                lng: 103.955574,
                title: 'Pasir Ris Beach Cleanup',
                date: '2025-06-08',
                participants: 15
            }
        ];

        sampleEvents.forEach(event => {
            this.addCleanupEvent(event);
        });
    }

    addCleanupEvent(event) {
        const marker = L.marker([event.lat, event.lng])
            .addTo(this.map)
            .bindPopup(`
                <h3>${event.title}</h3>
                <p>Date: ${event.date}</p>
                <p>Participants: ${event.participants}</p>
                <button class="join-cleanup" data-event-id="${event.id}">Join Cleanup</button>
            `);

        this.markers.set(event.id, marker);
        this.cleanupEvents.set(event.id, event);
    }

    setupEventListeners() {
        // CTA button click handler
        const ctaButton = document.querySelector('.cta-button');
        if (ctaButton) {
            ctaButton.addEventListener('click', () => {
                const mapSection = document.getElementById('map');
                if (mapSection) {
                    mapSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }

        // Handle cleanup event joins
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('join-cleanup')) {
                const eventId = e.target.dataset.eventId;
                this.joinCleanup(eventId);
            }
        });
    }

    joinCleanup(eventId) {
        const event = this.cleanupEvents.get(eventId);
        if (!event) return;

        event.participants++;
        const marker = this.markers.get(eventId);
        
        if (marker) {
            marker.setPopupContent(`
                <h3>${event.title}</h3>
                <p>Date: ${event.date}</p>
                <p>Participants: ${event.participants}</p>
                <button class="join-cleanup" data-event-id="${event.id}">Join Cleanup</button>
            `);
        }

        // Show success message (you can enhance this with a proper notification system)
        alert('Successfully joined the cleanup event! We\'ll send you more details soon.');
    }
}

// Initialize the app when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.shoreSquad = new ShoreSquad();
});
