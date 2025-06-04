// ShoreSquad App
class ShoreSquad {
    constructor() {
        this.initializeApp();
    }

    async initializeApp() {
        this.setupNavigation();
        await this.setupGeolocation();
        // More features will be added here
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
    }

    // Weather feature - to be implemented
    async getWeather() {
        if (!this.userLocation) return;
        // We'll add weather API integration here
    }

    // Map feature - to be implemented
    initMap() {
        if (!this.userLocation) return;
        // We'll add map initialization here
    }
}

// Initialize the app when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.shoreSquad = new ShoreSquad();
});
