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
        if (!this.userLocation) return;

        try {
            // For demo purposes, we'll use a mock weather response
            // In production, you would use a real weather API
            const mockWeather = {
                current: {
                    temp: 25,
                    humidity: 65,
                    wind_speed: 12,
                    weather: [{ description: 'Sunny with light clouds' }]
                },
                daily: [
                    { temp: { day: 25 }, weather: [{ description: 'Sunny' }] },
                    { temp: { day: 24 }, weather: [{ description: 'Partly cloudy' }] },
                    { temp: { day: 23 }, weather: [{ description: 'Light rain' }] }
                ]
            };

            this.displayWeather(mockWeather);
        } catch (error) {
            console.error('Error fetching weather:', error);
            this.displayWeatherError();
        }
    }

    displayWeather(data) {
        const container = document.querySelector('.weather-container');
        if (!container) return;

        const html = `
            <div class="weather-current">
                <h3>Current Weather</h3>
                <div class="weather-details">
                    <p class="temperature">${Math.round(data.current.temp)}°C</p>
                    <p class="description">${data.current.weather[0].description}</p>
                    <p class="humidity">Humidity: ${data.current.humidity}%</p>
                    <p class="wind">Wind: ${Math.round(data.current.wind_speed)} km/h</p>
                </div>
            </div>
            <div class="weather-forecast">
                <h3>3-Day Forecast</h3>
                <div class="forecast-container">
                    ${data.daily.slice(0, 3).map((day, index) => `
                        <div class="forecast-day">
                            <p class="date">${new Date(Date.now() + (index + 1) * 86400000).toLocaleDateString('en-US', { weekday: 'short' })}</p>
                            <p class="temperature">${Math.round(day.temp.day)}°C</p>
                            <p class="description">${day.weather[0].description}</p>
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
    }

    addSampleCleanupEvents() {
        const sampleEvents = [
            {
                id: 'event1',
                lat: this.userLocation.latitude + 0.01,
                lng: this.userLocation.longitude + 0.01,
                title: 'Weekend Beach Cleanup',
                date: '2025-06-08',
                participants: 12
            },
            {
                id: 'event2',
                lat: this.userLocation.latitude - 0.01,
                lng: this.userLocation.longitude - 0.01,
                title: 'Coastal Crew Meetup',
                date: '2025-06-15',
                participants: 8
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
