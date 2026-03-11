# Fashion Design E-Commerce Backend (Node.js/Express)

A complete REST API for the Fashion Design E-Commerce platform built with Node.js and Express.

## Setup

1. Install Node.js dependencies:
```bash
npm install
```

2. Create a `.env` file with your configuration:
```
PORT=5000
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development
```

3. Run the server:
```bash
npm start
# or for development with auto-reload
npm run dev
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication
- **GET** `/api/admin/exists` - Check if admin exists
- **POST** `/api/auth/login` - Admin login
- **POST** `/api/auth/register` - Admin registration (first admin only)

### Customers
- **POST** `/api/customers/register` - Customer signup
- **POST** `/api/customers/login` - Customer login

### Designs
- **GET** `/api/designs` - Get all designs
- **GET** `/api/designs/<id>` - Get specific design
- **POST** `/api/designs` - Add new design (requires auth)
- **PUT** `/api/designs/<id>` - Update design (requires auth)
- **DELETE** `/api/designs/<id>` - Delete design (requires auth)

### Orders
- **GET** `/api/orders` - Get all orders
- **POST** `/api/orders` - Create new order
- **PUT** `/api/orders/<id>` - Update order status (requires auth)

### Statistics
- **GET** `/api/stats` - Get dashboard statistics (requires auth)

## Database

SQLite database is automatically created on first run: `fashion_store.db`

### Admin Setup
- The first admin is created via `/api/auth/register`.
- After one admin exists, further admin registrations are blocked.

## Project Structure

```
backend/
├── server.js           # Main Express server
├── package.json        # Dependencies
├── .env                # Environment variables
├── .gitignore          # Git ignore file
├── schema.sql          # Database schema (reference)
├── sample_data.sql     # Sample data (reference)
└── fashion_store.db    # SQLite database (auto-created)
```

## Technologies

- **Express.js** - Web framework
- **SQLite3** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests
- **Nodemon** - Development auto-reload

## Features

✅ JWT-based authentication
✅ Password hashing with bcryptjs
✅ Complete CRUD operations for designs
✅ Order management
✅ Dashboard statistics
✅ SQLite database
✅ CORS enabled for frontend integration

## Environment Variables

- `PORT` - Server port (default: 5000)
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Environment mode (development/production)

## Security Notes

⚠️ **Before Production:**
1. Change `JWT_SECRET` in `.env`
2. Use strong admin credentials
3. Enable HTTPS/SSL
4. Add input validation
5. Add rate limiting
6. Set `NODE_ENV=production`
7. Use environment-specific database

## Development

Install dev dependencies:
```bash
npm install --save-dev nodemon
```

Run in development mode with auto-reload:
```bash
npm run dev
```
