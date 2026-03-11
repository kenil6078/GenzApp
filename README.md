# 🎬 GenZ Movie App

A **Full Stack Movie Discovery Platform** where users can explore trending movies, watch trailers, search content in real time, and manage their favorites and watch history.

This project demonstrates **production-level architecture, scalable backend design, API integration, authentication, and performance optimization.**

---

## 🚀 Live Demo

🔗 **Live Application**  
https://genz-app-nine.vercel.app/

---

## ✨ Features

### 🔎 Movie Discovery
- Browse **Trending Movies**
- Explore **Popular Movies**
- Search movies, TV shows, and actors in real time
- Infinite scrolling for smooth browsing

### 🎥 Trailer Preview
- Watch movie trailers inside the app
- Integrated with **YouTube trailers from TMDB**

### ❤️ Favorites System
- Add movies to favorites
- Remove movies
- View personal favorite list

### 🕘 Watch History
- Track recently watched movies
- Automatically stored in database

### 🔐 Authentication
- Secure **JWT authentication**
- Login / Register functionality
- HTTP-only cookie security

### 🛠 Admin Dashboard
Admin can:
- Add movies
- Edit movie details
- Delete movies
- Manage users
- Ban users

---

## 🧠 Performance Optimizations

- Redis caching for faster API responses
- Lazy loading components
- Debounced search requests
- Infinite scrolling
- Optimized API usage

---

## 🧰 Tech Stack

### Frontend
- React.js
- Redux Toolkit
- React Router
- Axios
- Lazy Loading
- Responsive UI

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Cookie-based authentication

### External Services
- TMDB API (Movie Data)
- ImageKit (Image Storage)
- Redis (Caching)

### Deployment
- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas

---

## 📂 Project Structure

```
GENZ
│
├── backend
│   ├── routes
│   ├── models
│   ├── middleware
│   ├── config
│   ├── server.js
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── redux
│   │   ├── services
│   │   └── utils
│   └── vite.config.js
```

---

## ⚙️ Environment Variables

### Backend `.env`

```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
TMDB_API_KEY=your_tmdb_api_key
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env`

```
VITE_API_URL=http://localhost:5000
```

---

## 🛠 Installation

### Clone Repository

```
git clone https://github.com/yourusername/genz-movie-app.git
cd genz-movie-app
```

---

### Install Backend Dependencies

```
cd backend
npm install
```

---

### Install Frontend Dependencies

```
cd ../frontend
npm install
```

---

### Run Backend

```
npm run dev
```

---

### Run Frontend

```
npm run dev
```

---

## 📸 Screenshots

*(Add screenshots of your UI here for better presentation)*

---

## 🚀 Future Improvements

- AI movie recommendations
- Dark / Light theme
- Advanced movie filters
- Watchlist feature
- Social movie sharing

---

## 🤝 Contributing

Contributions are welcome!  
Feel free to fork this repo and submit a pull request.

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Author

**Kenil Bhuva**

Full Stack Developer

If you like this project, give it a ⭐ on GitHub!

---

## ⚠️ Disclaimer

This product uses the **TMDB API** but is **not endorsed or certified by TMDB**.
