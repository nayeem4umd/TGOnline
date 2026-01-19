# Transgulf Readymix Online Portal

A Progressive Web App (PWA) for Transgulf Readymix Concrete Co. customers to manage orders, view dashboards, and interact with the online portal.

## Features

- **Login System**: Secure authentication with token-based sessions
- **Dashboard**: Overview of account balance, income/expenses, and session info
- **New Order**: Create concrete delivery requests with detailed specifications
- **Orders Management**: View and track existing orders
- **Profile Management**: User profile and settings
- **PWA Features**: Installable app, offline support, push notifications
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: HTML, CSS (Tailwind CSS), JavaScript
- **PWA**: Service Worker, Web App Manifest
- **Backend API**: Custom API at `http://192.168.12.102/api/tp/online/`
- **Icons**: Custom logo and icons in `assets/` folder

## Project Structure

```
OnlinePortal/
├── index.html          # Login page
├── dashboard.html      # Main dashboard
├── new-order.html      # Order creation form
├── orders.html         # Orders list
├── profile.html        # User profile
├── manifest.json       # PWA manifest
├── sw.js               # Service worker
├── app.js              # Shared app utilities
├── assets/
│   └── logo.png        # Company logo
└── README.md           # This file
```

## Setup Instructions

### Prerequisites
- Node.js (for development server) or Python 3.x
- Modern web browser with PWA support

### Local Development

1. **Clone or download the project** to your local machine.

2. **Serve the files over HTTP** (required for PWA features):
   - **Using Python** (recommended):
     ```
     cd path/to/OnlinePortal
     python -m http.server 8000
     ```
   - **Using Node.js**:
     ```
     cd path/to/OnlinePortal
     npx http-server -p 8000
     ```

3. **Open in browser**:
   - Navigate to `http://localhost:8000/index.html`
   - The app will load and PWA features will be available

### API Configuration

The app connects to a backend API at `http://192.168.12.102/api/tp/online/`. Endpoints used:

- `POST /gettoken` - User authentication
- `GET /GetCurrentOrds` - Fetch current orders
- `POST /SetRequest` - Submit new orders

### Demo Credentials

- **Admin**: admin@demo.com / Admin@123
- **User**: user@demo.com / User@123

## PWA Installation

When served over HTTP/HTTPS, the browser will show an "Install App" button. Click it to install the PWA for offline use.

## Key Components

### Authentication
- Token-based login with localStorage persistence
- Remember me functionality
- Offline login support for remembered sessions

### Order Management
- Create orders with site details, concrete grade, quantity, delivery info
- Attach images to orders
- View order history and status

### Responsive UI
- Mobile-first design using Tailwind CSS
- Adaptive layouts for different screen sizes
- Touch-friendly interactions

## Development Notes

- The app uses mock data for demonstration when API is unavailable
- Service worker caches static assets for offline functionality
- Form validation ensures data integrity before submission
- Error handling provides user-friendly feedback

## Browser Support

- Chrome/Edge (full PWA support)
- Firefox (partial PWA support)
- Safari (limited PWA support)

## Contributing

1. Make changes to HTML/JS files
2. Test locally with HTTP server
3. Ensure PWA features work correctly
4. Update this README if needed

## License

© 2026 Transgulf Readymix. All rights reserved.

## Contact

For support or questions, contact the development team.</content>
<parameter name="filePath">d:\POC\OnlinePortal\README.md