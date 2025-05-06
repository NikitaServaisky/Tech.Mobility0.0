# 🧠 LEARNING.md — Tech.Mobility Development Notes

This document tracks the development process of the **Tech.Mobility** ride-hailing app. It includes architectural decisions, feature planning, system flow, and validation logic.

---

## 🚀 Project Kickoff

**Goal:** Build a real-time local taxi booking system for small-scale environments (demo setup).

**Vision:** A lightweight clone of services like **Yango** or **Wolt**, optimized for clarity and simplicity.

---

## 🧱 Architecture Overview

### Client Side (React)

- `CustomerDashboard.jsx`: Order rides, track status, cancel, and monitor driver movement.
- `DriverDashboard.jsx`: View and respond to incoming ride requests.
- `MapView.jsx`: Displays:
  - Current location
  - Pickup, destination, and nearby drivers
  - Routes via GraphHopper API

### Server Side (Node.js)

- `ridesController.js`: Create, accept, reject, and cancel rides.
- `socket.js`: Handles real-time events like `rideUpdate` and `driverLocationUpdate`.
- `driverController.js`: Collects and returns driver statistics.
- `rideSchema.js`: MongoDB schema for storing ride details.

---

## 🔄 Client-Server Ride Flow

1. Customer selects pickup and destination.
2. POST `/rides` request sent.
3. Server emits `rideUpdate` to all available drivers.
4. Driver clicks "Accept" → PUT `/rides/:id/accept`.
5. Server updates ride status and emits to customer.
6. Driver emits `driverLocationUpdate` periodically.
7. Customer sees the driver approaching in real-time on the map.

---

## 🗺️ MapView Flow

- Uses Leaflet.js to initialize map.
- Adds markers for:
  - User location
  - Pickup & destination
  - Driver location (if available)
- Sends request to GraphHopper for routing.
- Draws polyline for route.
- Updates coordinates when clicking on the map.

---

## 🧪 Testing Checklist

- [ ] `rideUpdate` is received by both drivers and customers.
- [ ] Driver location updates show in real-time.
- [ ] Route renders only when both pickup and destination exist.
- [ ] Only responsible users can cancel a ride.
- [ ] Input validation on login/registration.
- [ ] Error messages are clear and field-specific.
- [ ] Rate limiting prevents brute-force login.
- [ ] File upload validation (type, size) works correctly.
- [ ] Filenames are secured and randomized.
- [ ] Users can only upload role-relevant files.
- [ ] Step 1/2 registration flow cannot be bypassed.

---

## 🔐 Input Validation & Security

### Validation Middleware

- Centralized `validateRequestMiddleware` using `express-validator`
- Protects against NoSQL injection patterns like:
  ```js
  from: { "$ne": null }
  userId: { "$gt": "" }
  ```

### Validators

- `loginValidator.js` – Email + password
- `registerStepOneValidator.js` – Basic user validation
- `registerStepTwoValidator.js` – Role-specific validation:
  - Customer: payment info, ID
  - Driver: vehicle info, license, account details

### Usage

- `/login`: with validation + rate-limit
- `/register/:role`: step 1 validation
- `/register/:role/step2`: step 2 + file handling + error catching

---

## 📁 File Upload Security

Using **Multer**:

- Randomized, secure file naming (timestamp + random hex)
- MIME type restrictions: only `.jpeg` and `.png`
- File size limit: 5MB
- Files stored in safe folder with auto-creation
- Custom `handleUploadErrors.js` middleware returns detailed messages

---

## 🔌 Real-Time Location (Socket.IO)

- `socket.js` manages connections/events
- `rideUpdate` — new rides to drivers
- `driverLocationUpdate` — location stream from driver
- `rideAccepted` / `rideRejected` — status change feedback to customer

---

## 💬 Secure Chat Between Driver & Customer

Real-time communication between the customer and the driver — **only during active rides**.

### ⚙️ How It Works

- When a ride starts, both users join a dedicated Socket.IO room (`joinRoom`).
- Messages are sent via the `chatMessage` event:
  - Validates: `rideId`, `senderId`, and `message`.
  - Verifies sender is either `driverId` or `customerId` of the ride.
  - Sanitizes message (removes HTML, scripts, and limits length).
  - Broadcasts to the room if valid.

### 🔒 Security Features

- **Authorization check**: Messages only sent if sender belongs to the ride.
- **XSS protection**: All messages pass through `sanitizeMessage()`.
- **Spam prevention**: Long messages are truncated at 1000 characters.

### 🧪 Events

| Event Name        | Direction        | Description                            |
|-------------------|------------------|----------------------------------------|
| `joinRoom`        | client → server  | User joins ride-specific room          |
| `chatMessage`     | client ↔ server  | Secure, validated message broadcast    |
| `chatError`       | server → client  | Error if unauthorized or failed checks |

### 🗂️ Code References

- `/services/socket.js` → `chatMessage` handler  
- `/utils/sanitize.js` → `sanitizeMessage(msg)`  
- `DriverDashboard.jsx` / `CustomerDashboard.jsx` → client emit/listen logic


## 🌐 Deployment & Environment Setup

- Split codebase: `frontend/` and `backend/`
- Separate `.env.production` and `.env.example` files
- API keys and environment vars stored in Render/Vercel securely
- `render.yaml` handles Render deployment
- `.gitignore` excludes sensitive config files

---

## 🔮 Planned Features

- Improve real-time syncing and driver ETA accuracy
- Add chat between driver and customer
- Add Admin dashboard
- Add payments and ride history visualization

---

This document is continuously updated throughout development.

---

## 🚕 Ride Flow — Step-by-Step Breakdown

### 1. Customer Sends Ride Request
- **API:** `POST /rides`
- **Payload:** Pickup & destination coordinates
- **Action:** Server saves new ride with status `"pending"`

### 2. Server Notifies Drivers
- **Socket.IO Event:** `rideUpdate`
- **To:** All available drivers
- **Content:** New ride request details

### 3. Driver Accepts Ride
- **API:** `PUT /rides/:rideId/accept`
- **Auth:** JWT from driver
- **Action:** Server updates ride to `"accepted"` and links driver

### 4. Server Notifies Customer
- **Socket.IO Event:** `rideAccepted`
- **To:** The requesting customer
- **Content:** Assigned driver info

### 5. Driver Sends Location Updates
- **Socket.IO Event:** `driverLocationUpdate`
- **Interval:** Every 2–3 seconds
- **To:** The customer
- **Content:** Driver’s current coordinates

### 6. Customer Sees Driver on Map
- **Client Logic:** Listens to `driverLocationUpdate`
- **Map View:** Updates driver's marker on map in real-time

### 7. Driver Marks Ride as Complete
- **API:** `PUT /rides/:rideId/complete`
- **Action:** Server updates ride status to `"completed"`

### 8. Server Sends Final Status
- **Socket.IO Event:** `rideCompleted`
- **To:** The customer
- **Content:** Ride is done – optional: feedback prompt, stats update

## 📆 May 6, 2025

### What I learned today:
- How to extract reusable logic into React hooks (custom hook for Socket.IO).
- The power of separation of concerns in React – moving chat, ride list, and socket logic out of the main dashboard.
- Better folder and import organization for large components.
- Practical use of async/await with `Promise.all` to optimize API data fetching.
- Writing cleaner and testable functional components.

### Next focus:
- Modularize map and address input logic.
- Add loading spinners or skeletons.
- Write first unit test for `RideList` or `useCustomerSocket`.
