# 🚖 Tech.Mobility — Local Ride-Hailing App

A full-stack, real-time ride-hailing app developed for local environments, combining live maps, driver/customer dashboards, and socket-based updates.

---

## 🚀 Features

- Realtime driver location tracking via WebSockets
- Interactive pickup and destination selection using Leaflet.js
- Route calculation via GraphHopper API
- Customer & Driver roles with separate dashboards
- Ride history and active ride management
- Driver statistics (accepted, rejected, earnings)
- Secure file uploads and JWT-based authentication

---

## 📁 Project Structure

```
taxiProject/
│
├── frontend/        # React app (Vite-based)
│   └── src/
│       ├── api/               # Axios instance
│       ├── assets/            # UI assets
│       ├── components/        # UI components
│       ├── mapComponent/      # MapView component (Leaflet)
│       └── ...                # Pages, routing, styles, etc.
│
├── backend/         # Node.js + Express server
│   ├── controllers/         # Business logic
│   ├── models/              # MongoDB Schemas
│   ├── routes/              # API routes
│   ├── services/            # Socket.IO, helpers
│   └── ...                  # server.js, config, middlewares
```

---

## ⚙️ Installation & Running

### 1. Backend (Express API)

```bash
cd backend
npm install
npm run dev
```

### 2. Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

> Make sure to set your `.env` variables in both folders.
> Example: `VITE_APP_API_URL=http://localhost:5000`

---

## 🧰 Built With

- React + Vite
- Node.js + Express
- MongoDB + Mongoose
- Socket.IO
- Leaflet.js + GraphHopper API
- Multer (for file uploads)

---

## 🛠️ TODO / Roadmap

- [ ] Add support for intermediate stops (temp riders)
- [ ] Add driver rating and feedback system
- [ ] Integrate payments (Paybox / Bit / Stripe)
- [ ] Push notifications (mobile)
- [ ] Admin dashboard for monitoring system
- [ ] Enable matching additional passengers (hitchhikers) with overlapping routes (route matching + socket update logic)
- [ ] Hitchhiker approval flow: Ask both main passenger and hitchhiker before combining routes. Apply discount only to hitchhiker.

---

## 👨‍💻 Author

Made with ❤️ by [Your Name]  
Feel free to reach out or contribute in the future!

---
