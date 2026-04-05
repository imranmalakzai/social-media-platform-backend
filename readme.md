# 🚀 Social Media Backend API (Node.js + Express)

A **production-ready, scalable backend** for a social media platform built with **Node.js, Express, MySQL**, and modern backend architecture patterns.

---

## ✨ Features

- 🔐 Authentication & Authorization (JWT Access + Refresh Tokens)
- 👤 User Management (profile, avatar, password, account)
- 📝 Posts (CRUD + visibility control + image upload)
- ❤️ Likes System
- 💬 Comments System
- 👥 Follow/Unfollow System
- 📚 Saved Posts (Bookmarks)
- 📸 Stories (like Instagram stories)
- 🔔 Real-time Notifications (SSE - Server-Sent Events)
- ⚡ Event-driven architecture
- ⏱ Cron Jobs (background tasks)
- 📧 Email OTP Verification (SendGrid or fallback to console)
- 🛡 Rate Limiting & Validation (Zod)
- 📁 File Upload Support (Multer)
- 🌐 CORS Enabled

---

## 🧱 Tech Stack

- Node.js
- Express.js
- MySQL
- JWT (Authentication)
- Zod (Validation)
- Multer (File Upload)
- SendGrid (Emails)
- SSE (Real-time notifications)

---

## ⚙️ Environment Setup

Create a `.env` file in the root directory:

```
PORT=5000
DB_NAME=social_media
HOST=localhost
USER=root
PASSWORD=

CORS_ORIGIN=http://localhost:5173

JWT_ACCESS_TOKEN_SECRET=your_access_secret
JWT_REFRESH_TOKEN_SECRET=your_refresh_secret
JWT_ACCESS_TOKEN_EXPIRY=1h
JWT_REFRESH_TOKEN_EXPIRY=7d

SEND_GRID_API_KEY=your_sendgrid_key
EMAIL_FROM=test@example.com
```

> ⚠️ If you do NOT provide `SEND_GRID_API_KEY`, OTP will be logged in the console.

---

## 📦 Installation & Run

```bash
# Clone repository
 git clone https://github.com/imranmalakzai/social-media-platform-backend

# Navigate
 cd project-folder

# Install dependencies
 npm install

# Run development server
 npm run dev

# Run production
 npm start
```

Server runs on:

```
http://localhost:5000
```

---

## 🧪 API Base URL

```
http://localhost:5000/api
```

---

# 🔐 AUTH ROUTES

### Register

`POST /auth/register`

### Login

`POST /auth/login`

### Logout

`POST /auth/logout`

### Refresh Token

`POST /auth/refresh-token`

### Verify Email

`POST /auth/verify-email`

### Forgot Password

`POST /auth/forget-password`

### Reset Password

`POST /auth/reset-password`

---

# 👤 USER ROUTES

### Get Current User

`GET /users/me`

### Delete Account

`DELETE /users/me`

### Update Profile

`PATCH /users/me/update-profile`

### Change Password

`PATCH /users/me/change-password`

### Change Avatar

`PATCH /users/me/change-avatar`

### Change Cover Image

`PATCH /users/me/change-coverimage`

### Get All Users

`GET /users`

### Get User by ID

`GET /users/:userId`

---

# 📝 POSTS ROUTES

### Get Public Posts

`GET /posts`

### Get Post by ID

`GET /posts/:postId`

### Create Post

`POST /users/me/posts`

### Get My Posts

`GET /users/me/posts`

### Get My Post by ID

`GET /users/me/posts/:postId`

### Update Post

`PATCH /users/me/posts/:postId`

### Delete Post

`PATCH /users/me/posts/:postId`

### Update Visibility

`PATCH /users/me/posts/:postId/visibility`

### Get User Posts

`GET /users/:userId/posts`

### Get User Post by ID

`GET /users/:userId/posts/:postId`

---

# ❤️ LIKES ROUTES

### Like a Post

`POST /likes/post/:postId`

### Get Users Who Liked

`GET /likes/post/:postId`

---

# 💬 COMMENTS ROUTES

### Create Comment

`POST /posts/:postId/comments`

### Get All Comments

`GET /posts/:postId/comments`

### Get Comment by ID

`GET /posts/:postId/comments/:commentId`

### Delete Comment

`DELETE /posts/:postId/comments/:commentId`

### Update Comment

`PATCH /posts/:postId/comments/:commentId`

---

# 👥 FOLLOW ROUTES

### Follow User

`POST /users/me/follow/:userId`

### Unfollow User

`DELETE /users/me/follow/:userId`

### My Following

`GET /users/me/following`

### My Followers

`GET /users/me/followers`

### User Followers

`GET /users/:userId/followers`

### User Following

`GET /users/:userId/following`

---

# 📚 SAVED POSTS

### Get Saved Posts

`GET /me/saved-posts`

### Save Post

`POST /me/saved-posts/:postId`

### Remove Saved Post

`DELETE /me/saved-posts/:postId`

### Get Saved Post by ID

`GET /me/saved-posts/:postId`

---

# 📸 STORIES ROUTES

### Create Story

`POST /stories`

### Get All Stories

`GET /stories`

### Get Story by ID

`GET /stories/:storyId`

### Delete Story

`DELETE /stories/:storyId`

---

# 🔔 NOTIFICATIONS

### Real-time Notifications (SSE)

`GET /me/notifications/stream`

### Get Notifications

`GET /me/notifications`

### Get Notification by ID

`GET /me/notifications/:notificationId`

### Mark All as Read

`PATCH /me/notifications/read-all`

---

## ⚡ Real-time (SSE Usage)

Example:

```js
const eventSource = new EventSource(
  "http://localhost:5000/api/me/notifications/stream",
  { withCredentials: true },
);

eventSource.onmessage = (event) => {
  console.log(JSON.parse(event.data));
};
```

---

## 📁 File Uploads

- Uses **Multer**
- Supported in:
  - Posts (image)
  - Avatar
  - Cover Image
  - Stories

---

## 🛡 Security Features

- JWT Authentication
- HTTP-only Cookies
- Rate Limiting
- Input Validation (Zod)
- Global Error Handler

---

## 🧠 Architecture

- MVC Pattern
- Event-driven system (listeners)
- Modular routes & controllers
- Middleware-based architecture

---

## 🧑‍💻 Author

**Imran Malakzai**

---

## ⭐ Final Notes

This project is designed as a **real-world, scalable backend system** and is suitable for:

- Learning advanced Node.js concepts
- Portfolio / GitHub showcase
- Production-level API design reference

---

🔥 If you like this
