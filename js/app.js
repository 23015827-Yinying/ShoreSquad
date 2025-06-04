// ShoreSquad App
class ShoreSquad {
    constructor() {
        this.MOCK_WEATHER_DATA = {
            current: {
                date: "2025-06-04",
                temperature: 29.5,
                forecast: "Partly Cloudy",
                relative_humidity: { low: 65, high: 75 },
                wind: { speed: { low: 15, high: 25 }, direction: "NE" }
            },
            fourDay: [
                {
                    date: "2025-06-05",
                    forecast: "Afternoon Thunderstorms",
                    temperature: { low: 26, high: 32 },
                    relative_humidity: { low: 70, high: 90 },
                    wind: { speed: { low: 10, high: 20 } }
                },
                {
                    date: "2025-06-06",
                    forecast: "Light Rain",
                    temperature: { low: 25, high: 31 },
                    relative_humidity: { low: 75, high: 85 },
                    wind: { speed: { low: 15, high: 25 } }
                },
                {
                    date: "2025-06-07",
                    forecast: "Fair and Warm",
                    temperature: { low: 27, high: 33 },
                    relative_humidity: { low: 60, high: 80 },
                    wind: { speed: { low: 10, high: 20 } }
                },
                {
                    date: "2025-06-08",
                    forecast: "Sunny",
                    temperature: { low: 26, high: 32 },
                    relative_humidity: { low: 65, high: 75 },
                    wind: { speed: { low: 12, high: 22 } }
                }
            ]
        };
        
        this.initializeApp();
    }

    async initializeApp() {
        this.setupNavigation();
        this.setupEventListeners();
        
        // Show loading state
        this.showLoading();
        
        // Simulate API delay with mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        await this.getWeather();
    }

    showLoading() {
        const container = document.querySelector('.weather-container');
        if (container) {
            container.innerHTML = '<div class="loading"></div>';
        }
    }    setupNavigation() {
        const menuToggle = document.querySelector('.menu-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (menuToggle && navMenu) {
            // Toggle menu on button click
            menuToggle.addEventListener('click', () => {
                const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
                navMenu.classList.toggle('active');
                menuToggle.setAttribute('aria-expanded', !isExpanded);
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                    navMenu.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            });

            // Close menu when a link is clicked
            navMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                });
            });

            // Handle escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            });
        }
    }async getWeather() {
        try {
            this.showLoading();
            
            // Simulate API delay with mock data for Week 2
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Use mock data for now - will be replaced with real API in Week 3
            this.displayWeather(this.MOCK_WEATHER_DATA);
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
                    <p>🌥️ Unable to load weather data. Please try again later.</p>
                    <button onclick="window.shoreSquad.getWeather()" class="cta-button">
                        Retry
                    </button>
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
