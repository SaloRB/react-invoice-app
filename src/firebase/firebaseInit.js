import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyA3d-QFpJwMf6Had12q6e0AR8uwUrgE1lQ",
  authDomain: "invoice-app-e0930.firebaseapp.com",
  projectId: "invoice-app-e0930",
  storageBucket: "invoice-app-e0930.appspot.com",
  messagingSenderId: "832157175000",
  appId: "1:832157175000:web:11d8e39b023e669393dbad",
}

const firebaseApp = initializeApp(firebaseConfig)

export default getFirestore(firebaseApp)
