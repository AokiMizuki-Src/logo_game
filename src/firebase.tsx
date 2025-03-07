import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyDIk3zgX22IKmKROucbU82jmb6INd90Ry8",
	authDomain: "logo-game-e883a.firebaseapp.com",
	projectId: "logo-game-e883a",
	storageBucket: "logo-game-e883a.firebasestorage.app",
	messagingSenderId: "193599342855",
	appId: "1:193599342855:web:1abcc70f472e4104e25da2",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
export default db;
