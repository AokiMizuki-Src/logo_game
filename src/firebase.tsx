import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyBTILEKIa3x1QgIuEaHcHgZOYWquyUEnLs",
	authDomain: "logo-game-27ddf.firebaseapp.com",
	projectId: "logo-game-27ddf",
	storageBucket: "logo-game-27ddf.firebasestorage.app",
	messagingSenderId: "450988934008",
	appId: "1:450988934008:web:529024e07d38431cf9fe8d",
	measurementId: "G-T8PMB0TT7X",
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);

export default db;
