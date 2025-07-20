# ChatApp

**ChatApp** is a real-time chatting application built with the MERN stack and powered by `socket.io` to enable real-time messaging between users. It supports user authentication, dynamic conversations, image uploads, and responsive design — all packed into a full-stack modern web app.

---

## 🚀 Features

- User authentication (JWT-based)
- Real-time messaging with Socket.IO
- Upload profile pictures using Cloudinary
- Global state management using Zustand
- Toast alerts for user feedback
- Responsive and modern UI (Tailwind + Lucide icons)
- Environment-based configuration using `.env`

---

## 🛠️ Technologies Used

### Frontend

- **React.js** + **Vite.js** – Fast and modern React tooling
- **Zustand** – Lightweight global state management
- **Tailwind CSS** – Utility-first responsive styling
- **Lucide-react** – Clean and scalable icons
- **Toast** – In-app notifications
- **Render** – Full-stack deployment (frontend + backend)

### Backend

- **Node.js** + **Express.js** – RESTful API backend
- **Socket.IO** – Real-time WebSocket communication
- **MongoDB** – NoSQL database for storing users and messages
- **Cloudinary** – Image upload and storage
- **Render** – PaaS that redeploys on every Git commit

### Development & Tools

- **Postman** – API testing
- **Git** – Version control
- **.env** – Environment configuration

---

## 📦 Deployment Details

Both the frontend and backend are deployed together using **Render**, a platform-as-a-service (PaaS) that integrates with GitHub and automatically redeploys on each commit.

- **Live App:** [https://chatapp-xlyo.onrender.com/](https://chatapp-xlyo.onrender.com/)
- **Repository:** [https://github.com/Venkateshkamat/ChatApp](https://github.com/Venkateshkamat/ChatApp)

---

## ⚙️ Installation

### Prerequisites

Make sure the following are installed:

- Node.js (v16+)
- npm or yarn
- MongoDB Atlas account or local instance
- Cloudinary account (for image uploads)

---

### Backend Setup

1. Clone the repository and navigate to the backend:

   ```bash
   git clone https://github.com/Venkateshkamat/ChatApp.git
   cd ChatApp/backend
   ```

2. Install backend dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   PORT=3001
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. Start the backend server:

   ```bash
   npm run dev
   ```

---

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd ../frontend
   ```

2. Install frontend dependencies:

   ```bash
   npm install
   ```

3. (Optional) Create a `.env` file if using environment-based API URLs:

   ```env
   VITE_API_URL=http://localhost:3001
   ```

4. Start the frontend development server:

   ```bash
   npm run dev
   ```

---

## 🤝 Contributing

Contributions are welcome!

To contribute:

1. Fork the repository
2. Create a new branch:  
   `git checkout -b feature/your-feature-name`
3. Commit your changes:  
   `git commit -m "Add your message"`
4. Push to your forked branch:  
   `git push origin feature/your-feature-name`
5. Submit a pull request

Please follow standard contribution practices. No special guidelines required.

---

## 📄 License

No license has been assigned to this project yet. All rights reserved.

---

**ChatApp** · [Live Demo](https://chatapp-xlyo.onrender.com) · [GitHub Repo](https://github.com/Venkateshkamat/ChatApp)
