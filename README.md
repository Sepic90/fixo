# Car Service Tracker

A web-based application for tracking car service history and managing vehicle data.

## Features

- Dashboard with car cards
- Service entry management
- Service history tracking
- Technical data management
- Photo uploads for cars and service entries
- Responsive design for both desktop and mobile

## Setup Instructions

### Prerequisites

- Node.js and npm installed
- A Firebase account

### Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd fixo
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Set up Firestore Database
   - Go to Firestore Database and click "Create database"
   - Choose "Start in production mode" and select your preferred location
4. Set up Firebase Storage
   - Go to Storage and click "Get started"
   - Choose production mode and select your preferred location
5. Register your app with Firebase
   - Go to Project Overview and click the web icon (</>) to add a web app
   - Register your app with a nickname (e.g., "car-service-tracker")
   - Copy the Firebase configuration object

### Step 4: Configure Firebase in the App

1. Open `src/firebase/config.js`
2. Replace the placeholder configuration with your Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Step 5: Set Up Firebase Storage Rules

1. Go to Firebase Console > Storage > Rules
2. Update the rules to allow read and write access (for development only):

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write;
    }
  }
}
```

For production, you should use more restrictive rules.

### Step 6: Run the Application

```bash
npm run dev
```

The application should now be running at http://localhost:5173/

## Project Structure

```
src/
├── components/         # UI components
├── pages/              # Page components
├── firebase/           # Firebase configuration and services
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── App.jsx             # Main app component
└── main.jsx            # Entry point
```

## Usage

1. Add your first car by clicking "Add Car" on the home page
2. Use the car card to access service entries, history, and technical data
3. Add new service entries when maintenance is performed
4. View your service history chronologically
5. Update technical data as needed

## Customization

- Edit `src/index.css` to customize the styling
- Modify `tailwind.config.js` to change color schemes
- Update components as needed to add new features

## License

This project is licensed under the MIT License.