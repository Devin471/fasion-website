# Fashion Design E-Commerce Platform

A complete e-commerce platform for showcasing fashion designs built with **React.js** (frontend) and **Node.js/Express** (backend) with separate admin and customer interfaces.

## Project Structure

```
fashion wesite/
├── frontend/                 # React.js Web Interface
│   ├── public/
│   │   └── index.html       # HTML entry point
│   ├── src/
│   │   ├── index.js         # React entry point
│   │   ├── App.js           # Main app component
│   │   ├── components/      # Reusable components
│   │   │   ├── Navbar.js
│   │   │   └── ProductCard.js
│   │   └── pages/           # Page components
│   │       ├── Home.js      # Landing page
│   │       ├── Shop.js      # Product catalog
│   │       ├── Admin.js     # Admin dashboard
│   │       └── Login.js     # Admin login
│   └── package.json         # Frontend dependencies
│
├── backend/                  # Node.js/Express REST API
│   ├── server.js            # Express server & routes
│   ├── package.json         # Node.js dependencies
│   ├── .env                 # Environment variables
│   ├── schema.sql           # Database schema (reference)
│   └── sample_data.sql      # Sample data (reference)
│
└── README.md & QUICKSTART.md
```

## Features

### For Customers
- 🛍️ Browse all fashion designs
- 🔍 Filter by category (Men's, Women's, Kids)
- 🔎 Search for designs
- 📱 Responsive mobile design

### For Admins
- 🔐 Secure login with JWT authentication
- 📊 Dashboard with statistics
- ➕ Add new designs
- ✏️ Edit design details
- 🗑️ Delete designs
- 📦 Manage orders
- 📈 View analytics

## Technologies Used

### Frontend
- **React.js 18** - UI library
- **React Router v6** - Navigation
- **Axios** - HTTP client
- **CSS3** - Styling
- **React Scripts** - Build tools

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **SQLite3** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin support

## Getting Started

### Prerequisites
- Node.js 14+ and npm
- SQLite3

### Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file (already provided)
# The file contains default settings

# Start the server
npm start
# or for development with auto-reload
npm run dev
```

**Backend runs at:** `http://localhost:5000`

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start the React development server
npm start
```

**Frontend runs at:** `http://localhost:3000`

## Access Points

### Customer Interface
- **Home:** http://localhost:3000/
- **Shop:** http://localhost:3000/shop

### Admin Interface
- **Login:** http://localhost:3000/login
- **Dashboard:** http://localhost:3000/admin (after login)
- **Setup:** Create the first admin account on the login page

## API Endpoints

### Authentication
- `GET /api/admin/exists` - Check if admin exists
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Admin registration (first admin only)

### Designs
- `GET /api/designs` - Get all designs
- `GET /api/designs/:id` - Get single design
- `POST /api/designs` - Add design (auth required)
- `PUT /api/designs/:id` - Update design (auth required)
- `DELETE /api/designs/:id` - Delete design (auth required)

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order status (auth required)

### Stats
- `GET /api/stats` - Dashboard statistics (auth required)

## Database Schema

### Tables
1. **admins** - Admin user accounts
2. **designs** - Fashion designs/products
3. **orders** - Customer orders
4. **order_items** - Items within orders

SQLite database is automatically created on first run as `fashion_store.db`

## File Reference

### React Component Files (Frontend)
| File | Purpose |
|------|---------|
| `App.js` | Main app with routing |
| `components/Navbar.js` | Navigation bar |
| `components/ProductCard.js` | Product card component |
| `pages/Home.js` | Home/landing page |
| `pages/Shop.js` | Product catalog page |
| `pages/Admin.js` | Admin dashboard |
| `pages/Login.js` | Admin login page |

### Backend Files (Node.js)
| File | Purpose |
|------|---------|
| `server.js` | Express server with all API routes |
| `package.json` | Node.js dependencies |
| `.env` | Environment configuration |
| `schema.sql` | Database schema (reference) |
| `sample_data.sql` | Sample test data |

## Environment Variables

**Backend (.env)**
```
PORT=5000
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development
```

## Admin Setup

- Create the first admin account on the login page.
- After one admin exists, further admin registrations are blocked.

## Project Setup Workflow

```
1. Install Node.js and npm
2. cd backend → npm install → npm start
3. cd frontend → npm install → npm start
4. Open http://localhost:3000 in browser
5. Shop page shows products
6. Create the first admin account (only once)
7. Admin dashboard to manage products
```

## Security Considerations

⚠️ **Before Production:**
1. Change JWT_SECRET in backend/.env
2. Use strong admin credentials
3. Implement HTTPS/SSL
4. Add input validation on both sides
5. Add rate limiting
6. Set NODE_ENV=production
7. Use environment-specific database
8. Enable CORS only for your domain
9. Add logging and monitoring
10. Use password reset functionality

## Future Enhancements

- [ ] User registration and customer accounts
- [ ] Shopping cart functionality
- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] Email notifications
- [ ] Review and rating system
- [ ] Wishlist feature
- [ ] Social media integration
- [ ] Advanced analytics
- [ ] Inventory management
- [ ] Multiple image uploads
- [ ] Product filtering by price range
- [ ] Customer order history

## Project Documentation

- **Backend:** See `backend/README.md` for API details
- **Quick Start:** See `QUICKSTART.md` for rapid setup
- **Database Schema:** See `backend/schema.sql` for table structures

## Running Tests

```bash
# Backend (add test script to package.json when needed)
cd backend
npm test

# Frontend
cd frontend
npm test
```

## Build for Production

```bash
# Frontend build
cd frontend
npm run build
# Generates optimized build in ./build folder

# Backend is ready to run as-is
# Just ensure NODE_ENV=production in .env
```

## Troubleshooting

**Frontend shows blank page:**
- Check browser console (F12 → Console tab)
- Ensure backend is running on port 5000
- Check network tab for API errors

**Backend won't start:**
```bash
# Reinstall dependencies
npm install

# Check Node.js version
node --version

# Check if port 5000 is in use
netstat -ano | findstr :5000
```

**Database issues:**
- Delete `fashion_store.db` and restart backend
- It will auto-create a fresh database

**CORS errors:**
- Ensure backend has CORS enabled
- Check frontend is calling correct API URL

## License

MIT License - Feel free to use for commercial and personal projects.

## Support

For issues, check:
1. `backend/README.md` - Backend-specific help
2. `QUICKSTART.md` - Quick reference guide
3. Browser console for frontend errors
4. Server logs for backend errors

---

**Built with React + Node.js | Perfect for E-Commerce Fashion Platforms**
