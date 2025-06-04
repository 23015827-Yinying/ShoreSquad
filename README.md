# ShoreSquad Beach Cleanup Community

A modern, accessible web application for organizing and participating in beach cleanup events. Built with HTML5, CSS3, and vanilla JavaScript.

## 🌊 Features

- **Real-time Weather Updates**: Check current and 4-day weather forecasts
- **Interactive Map**: Find and join cleanup events at Pasir Ris Beach
- **Mobile-First Design**: Fully responsive across all devices
- **Accessibility**: WCAG compliant with ARIA labels and keyboard navigation
- **Live Chat Support**: Integrated Tawk.to widget for community support

## 🚀 Quick Start

1. Clone this repository
2. Install [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) in VS Code
3. Right-click `index.html` and select "Open with Live Server"
4. The site will open at `http://127.0.0.1:5500/index.html`

## 💻 Development

### Prerequisites
- Visual Studio Code
- Live Server extension

### Local Development
1. Open the project in VS Code
2. Make your changes to the HTML, CSS, or JavaScript files
3. The Live Server will automatically reload the page

### File Structure
```
shoresquad/
├── index.html      # Main HTML file
├── css/
│   └── styles.css  # Styles and animations
├── js/
│   └── app.js      # JavaScript functionality
└── README.md       # Documentation
```

### Key Features Implementation
- **Weather Display**: Uses mock data (to be replaced with NEA API)
- **Map Integration**: Google Maps iframe showing Pasir Ris location
- **Responsive Design**: Mobile-first approach with CSS Grid and Flexbox
- **Loading States**: Spinners and error handling for better UX

## 🎨 Styling

The application uses a custom color palette defined in CSS variables:
- Primary: Ocean Blue (#1AA7EC)
- Secondary: Sea Green (#2ED1A2)
- Accent: Coral Orange (#FF7E47)

## 📱 Mobile Support

Fully responsive design with:
- Hamburger menu for mobile navigation
- Touch-friendly buttons and cards
- Optimized images and maps
- Mobile-first media queries

## 🔧 Error Handling

The application includes robust error handling:
- Loading states for async operations
- Fallback content for failed loads
- Clear error messages with retry options
- Network error recovery

## 📝 To-Do
- [ ] Integrate NEA Weather API
- [ ] Add user authentication
- [ ] Implement event registration
- [ ] Add community photo gallery

## 📄 License

This project is licensed under the MIT License.
