import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth"; // Dùng để xác thực
import "firebase/firestore"; // real-time-database
import "firebase/storage";

var firebaseConfig = {
  apiKey: "AIzaSyBul4NM7TDw03X9vcpXjmaOM8UZpJVjeUg",
  authDomain: "messenger-facebook-12227.firebaseapp.com",
  projectId: "messenger-facebook-12227",
  storageBucket: "messenger-facebook-12227.appspot.com",
  messagingSenderId: "350694774924",
  appId: "1:350694774924:web:50d1c6ed9944f01279c3a9",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

/**
 * Firebase là tập hợp nhiều Collection (tương tự Table trong SQL)
 */
const auth = firebase.auth(); // Lưu trữ auth
const db = firebase.firestore(); // Lưu trữ firestore
const storage = firebase.storage();
/**
 * Trỏ firebase (auth, db) vào local
 */
// if (window.location.hostname === "localhost") {
//   auth.useEmulator("http://localhost:9099");
//   db.useEmulator("localhost", "8080");
//   storage.useEmulator("localhost", "9199");
// }

// Initialize WebRTC
const servers = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

const pc = new RTCPeerConnection(servers);

export { db, auth, storage, servers, pc };
export default firebase;
