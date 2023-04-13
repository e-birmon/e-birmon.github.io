const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const hall = urlParams.get('hall');

const firebaseConfig = {
    apiKey: "AIzaSyAL9W1cB5FcHTyNEtYz71vYFcCZymYciAE",
    authDomain: "skating-effad.firebaseapp.com",
    projectId: "skating-effad",
    storageBucket: "skating-effad.appspot.com",
    messagingSenderId: "194695179343",
    appId: "1:194695179343:web:75a122e677c617dcd50e3a",
    measurementId: "G-0RFSSD3FM2"
};

firebase.initializeApp(firebaseConfig);
let db = firebase.firestore();
let documents;

db.collection("reviews").where(firebase.firestore.FieldPath.documentId(), '=='. hall).get().then((snapshot) => {
    documents = snapshot.docs;
});

