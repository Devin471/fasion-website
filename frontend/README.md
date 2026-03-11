# Fashion Design Frontend (React.js)

A modern React.js frontend for the Fashion Design E-Commerce platform with separate customer shopping and admin management interfaces.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The app opens at `http://localhost:3000`

## Project Structure

```
frontend/
├── public/
│   └── index.html              # HTML root file
├── src/
│   ├── index.js                # React entry point
│   ├── index.css               # Global styles
│   ├── App.js                  # Main app component with routing
│   ├── App.css                 # App styles
│   ├── components/             # Reusable components
│   │   ├── Navbar.js          # Navigation bar
│   │   ├── Navbar.css
│   │   ├── ProductCard.js      # Product display card
│   │   └── ProductCard.css
│   ├── pages/                  # Page components
│   │   ├── Home.js            # Landing page
│   │   ├── Home.css
│   │   ├── Shop.js            # Product catalog
│   │   ├── Shop.css
│   │   ├── Admin.js           # Admin dashboard
│   │   ├── Admin.css
│   │   ├── Login.js           # Admin login
│   │   └── Login.css
│   └── context/               # React Context (for future use)
├── package.json               # Dependencies
└── README.md
```

## Pages

### Home Page (/)
- Landing page with hero section
- Features overview
- Call-to-action to view collection

### Shop Page (/shop)
- Browse all products
- Search by name/description
- Filter by category (Men's, Women's, Kids)
- Add to cart (placeholder)

### Viewer Access
- Visitors can open the shop without signing in

### Admin Login Page (/login)
- Admin authentication
- JWT token storage
- Redirects to admin dashboard on success

### Admin Dashboard (/admin)
- Dashboard with statistics
  - Total designs
  - Total orders
  - Total revenue
- Add new design form
- Manage existing designs (edit/delete)
- View orders and their status
- Analytics (placeholder)

## Components

### Navbar
Navigation bar with:
- Logo/Home link
- Navigation links (Home, Shop, Admin)
- Logout button (when authenticated)

### ProductCard
Reusable card component displaying:
- Product image
- Name, category, description
- Price and stock status
- Action button (Add to Cart for customers, Edit/Delete for admin)

## Features

✅ Responsive design (mobile, tablet, desktop)
✅ Client-side routing with React Router v6
✅ JWT-based authentication
✅ Search and filter functionality
✅ Admin CRUD operations
✅ Statistics dashboard
✅ Form validation
✅ Error handling
✅ Loading states

## API Integration

All API calls go to `http://localhost:5000` (configured as proxy in package.json)

### Endpoints Used
- `GET /api/designs` - Fetch all products
- `POST /api/designs` - Create product (auth)
- `PUT /api/designs/:id` - Update product (auth)
- `DELETE /api/designs/:id` - Delete product (auth)
- `GET /api/orders` - Fetch orders
- `POST /api/auth/login` - Admin login
- `GET /api/stats` - Dashboard statistics (auth)

## Available Scripts

### `npm start`
Runs the app in development mode.
Opens [http://localhost:3000](http://localhost:3000) in the browser.

### `npm build`
Builds the app for production to the `build` folder.

### `npm test`
Launches the test runner.

### `npm eject`
Ejects from Create React App configuration (irreversible).

## Technologies

- **React 18** - UI library
- **React Router 6** - Client-side routing
- **Axios** - HTTP client for API calls
- **CSS3** - Styling with Flexbox/Grid

## Styling

- Global styles in `index.css`
- Component-specific styles (`.css` files alongside components)
- Mobile-responsive design with media queries
- Color scheme: Blue/Purple (#667eea, #764ba2), Green (#27ae60), etc.

## Authentication Flow

1. User visits `/login`
2. Enters admin credentials
3. API returns JWT token
4. Token stored in `localStorage`
5. Token sent with protected API requests
6. User redirected to `/admin` dashboard
7. Logout clears token from localStorage

## Folder Structure Best Practices

- `/components` - Reusable UI components
- `/pages` - Full page components
- `/context` - React Context for state management (if needed)
- `/utils` - Helper functions (future)
- `/hooks` - Custom React hooks (future)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Environment Variables

Frontend uses proxy in `package.json`:
```json
"proxy": "http://localhost:5000"
```

This allows API calls to use relative URLs like `/api/designs`

## Performance Optimizations

- Code splitting via React Router
- Lazy loading of pages
- Memoized components where needed
- Optimized images (use CSS for placeholders)

## Future Enhancements

- [ ] Shopping cart state management
- [ ] User accounts and registration
- [ ] Order history page
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Payment integration
- [ ] Image gallery per product
- [ ] Advanced filtering/sorting
- [ ] Dark mode toggle
- [ ] Internationalization (i18n)

## Common Issues & Solutions

### API calls failing
- Ensure backend is running on port 5000
- Check Network tab in DevTools
- Verify proxy setting in package.json

### CSS not applying
- Check file path matches component location
- Clear browser cache (Ctrl+Shift+Delete)
- Ensure CSS file is imported correctly

### Authentication not working
- Check browser DevTools → Application → localStorage for token
- Verify admin credentials
- Check backend is returning valid token

### Routing not working
- Ensure React Router is properly set up in App.js
- Check page components are exported correctly
- Verify paths in Link components match Route paths

## Development Tips

1. Use React DevTools browser extension
2. Console logs appear in terminal (not browser) during development
3. Hot reload: Changes save automatically
4. F12 Developer Tools for debugging
5. Network tab shows API calls

## Production Build

```bash
npm run build
```

Creates optimized `build/` folder suitable for deployment to:
- Netlify
- Vercel
- GitHub Pages
- AWS S3
- Any static hosting

## Deployment Steps

1. Run `npm run build`
2. Upload `build/` folder contents to hosting
3. Update backend API URL if different
4. Set `NODE_ENV=production` on backend

## Support

For issues, check:
1. Browser console (F12 → Console)
2. Network tab for API errors
3. Backend logs
4. GitHub issues if using version control

---

**Built with React 18 | Part of Fashion Design E-Commerce Platform**
