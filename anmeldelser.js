//Henter hvilken skøytehall det gjelder
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const hall = urlParams.get('hall');

let anmeldelse = []
if (!hall) {
  console.error('Invalid hall parameter:', hall);
}

// Henter div-elementet siden skal jobbe med
let content = document.getElementById("content");


// Firebase konfigurasjonen
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
const db = firebase.firestore();


// Henter data fra databasen
async function getDataDB() {
  try {
    const snapshot = await db.collection('Reviews').doc(hall).get();
    if (!snapshot.exists) {
      console.warn('No review document found for hall:', hall);
      return null;
    }
    return snapshot.data();
  } catch (error) {
    console.error('Error fetching review document:', error);
    throw error;
  }
}


// Hovedfunkjsonen som starter subfunksjoner som skaper siden
async function createPage() {
  try {
    reviewData = await getDataDB();
    console.log(reviewData);
    title(reviewData);
    reviewInput();
    displayReviews(reviewData);
  } catch (error) {
    console.error('Error creating page:', error);
  }
}


// Skaper en tittel
function title(){
    let h2 = document.createElement("h2");
    h2.innerHTML = hall;
    content.appendChild(h2);
    let starBox = document.createElement("div");
    starBox.setAttribute("class", "starbox");
    starBox.appendChild(reviewsStars(reviewData));
    content.appendChild(starBox);
}


// Der brukeren kan skrive inn en anmeldelse
function reviewInput(){
    let reviewInputBox = document.createElement("div");
    reviewInputBox.setAttribute("id", "reviewInputBox");

    let form = document.createElement("form");
    form.setAttribute("onsubmit", "return false");

    let fieldset = document.createElement("fieldset");
    fieldset.setAttribute("id", "reviewFieldset")

    let legend = document.createElement("legend");
    legend.innerHTML = "Anmeldelse";
    fieldset.appendChild(legend);

    // Tittel
    let reviewTitleLabel = document.createElement("label");
    reviewTitleLabel.setAttribute("for", "title");
    reviewTitleLabel.innerHTML = "Tittel:";
    fieldset.appendChild(reviewTitleLabel);
    fieldset.appendChild(document.createElement("br"));

    let reviewTitleInput = document.createElement("input");
    reviewTitleInput.setAttribute("type", "text");
    reviewTitleInput.setAttribute("id", "reviewTitle");
    reviewTitleInput.setAttribute("name", "reviewTitle");
    reviewTitleInput.setAttribute("maxlength", 32);
    fieldset.appendChild(reviewTitleInput);
    fieldset.appendChild(document.createElement("br"));

    //Stjerner
    let reviewStarsLabel = document.createElement("label");
    reviewStarsLabel.setAttribute("for", "reviewStars");
    reviewStarsLabel.innerHTML = "Stjerner:";
    fieldset.appendChild(reviewStarsLabel);
    fieldset.appendChild(document.createElement("br"));

    let reviewStarsInput = document.createElement("input");
    reviewStarsInput.setAttribute("type", "number");
    reviewStarsInput.setAttribute("id", "reviewStars");
    reviewStarsInput.setAttribute("name", "reviewStars");
    reviewStarsInput.setAttribute("min", 1);
    reviewStarsInput.setAttribute("max", 5);
    fieldset.appendChild(reviewStarsInput);
    fieldset.appendChild(document.createElement("br"));

    // Anmeldelse
    let reviewContentLabel = document.createElement("label");
    reviewContentLabel.setAttribute("for", "review");
    reviewContentLabel.innerHTML = "Tekst:";
    fieldset.appendChild(reviewContentLabel);
    fieldset.appendChild(document.createElement("br"));

    let reviewContentInput = document.createElement("textarea");
    reviewContentInput.setAttribute("type", "text");
    reviewContentInput.setAttribute("id", "reviewTxt");
    reviewContentInput.setAttribute("name", "reviewTxt");
    reviewContentInput.setAttribute("maxlength", 1024);
    reviewContentInput.style.width = "30vw";
    reviewContentInput.style.height = "20vh";   
    fieldset.appendChild(reviewContentInput);
    fieldset.appendChild(document.createElement("br"));

    // Knapp
    let reviewSubmit = document.createElement("button");
    reviewSubmit.setAttribute("id", "reviewSubmitBtn");  

    reviewed = hasReviewed();
    if(reviewed=="true"){
        reviewSubmit.innerHTML = "Send inn på nytt";  
    }else{
        reviewSubmit.innerHTML = "Send inn";  
    }
    reviewSubmit.addEventListener("click", sendReview);
    fieldset.appendChild(reviewSubmit);

    form.appendChild(fieldset);
    reviewInputBox.appendChild(form);

    content.appendChild(reviewInputBox);
}


// Sender anmeldelsen til databasen
function sendReview(){

    let title = document.getElementById("reviewTitle").value;
    let review = document.getElementById("reviewTxt").value;
    let stars = document.getElementById("reviewStars").value;
    let userID = UUID();

    if(title == "" || review == "" || stars < 1 || stars > 5){
        if(title == "") alert("Du må ha en tittel!");
        if(review == "") alert("Du må ha tekst i anmeldelsen!");
        if(stars < 1) alert("Du kan ikke ha færre enn 1 stjerne!");
        if(stars > 5) alert("Du kan ikke ha flere enn 5 stjerner!");

    }else{
        
        if(hasReviewed()){
            let newApproved = reviewData.approved;
            let newTitle = reviewData.title;
            let newContent = reviewData.content;
            let newStars = reviewData.stars;

        }else{
            let index = null;
            for(let i=0; i<reviewData.user.length; i++){
                if(reviewData.user[i] == userID){
                    index = i;
                    break;
                }
            }
            if(index == null){
                alert("An error has occured.");
            }else{
                
            }
        }

    }
    clearForm();
}

function sendDataDB(){
    let d = new Date();
    d.setDate(d.getDate() + 365242);
    let expires = "expires="+ d.toUTCString();
    document.cookie = "sentReview"+hall+"=true; "+expires+"; SameSite=lax; path=/";
    
    let docRef = firebase.firestore().collection("Reviews").doc(hall);
    newApproved.push(false);
    newTitle.push(title);
    newContent.push(review);
    newStars.push(parseInt(stars));
    docRef.update({
        approved: newApproved,
        title: newTitle,
        content: newContent,
        stars: newStars
    })
    .then(function() {
        console.log("Document successfully updated!");
    })
    .catch(function(error) {
        console.error("Error updating document:", error);
    })
}


function clearForm(){
    let title = document.getElementById("reviewTitle");
    let review = document.getElementById("reviewTxt");
    let stars = document.getElementById("reviewStars");

    title.value = null;
    review.value = null;
    stars.value = null;
    document.getElementById("reviewSubmitBtn").innerHTML = "Send inn på nytt";
}


function hasReviewed(){
    let reviewed; 
    if(document.cookie.indexOf('sentReview'+hall+'=') == -1){
        reviewed = "false";
    }else{
        reviewed = "true";
    }
    return reviewed;
}


function reviewsStars(review){
    // Regner ut hvor mange stjerner hallen har og bygger de
    let stars = review.stars;
    let len = stars.length;
    let sum = stars.reduce((partialSum, a) => partialSum + a, 0);
    let average = (Math.round(sum/len*10)/10).toFixed(1);
    let averageInt = Math.round(average);
    
    let starsEl = document.createElement("p");
    starsEl.setAttribute("class", "stars");
    let starsColored = document.createElement("span");
    starsColored.setAttribute("class", "starsColored");
    
    let tmp = average.toString()+" ";
    for(let i=0; i<averageInt; i++){
        tmp = tmp+"★";
    }
    starsColored.innerHTML = tmp;
    starsEl.appendChild(starsColored);
    
    tmp = ""
    if(5-averageInt > 0){
        for(let i=0; i<5-averageInt; i++){
            tmp +="★";
        }
        starsEl.innerHTML += tmp;
    }
    return starsEl;
}

function displayReviews(reviewData){
    docs = reviewData.approved.length;
    
    let h2 = document.createElement("h2");
    h2.innerHTML = "Anmeldelser";
    
    content.appendChild(document.createElement("br"));
    content.appendChild(h2);

    for(let i=0; i<docs; i++){

        if(reviewData.approved[i] === true){

            let reviewDiv = document.createElement("div");
            reviewDiv.setAttribute("class", "review");

            let title = reviewData.title[i];
            let stars = reviewData.stars[i];
            let review = reviewData.content[i];

            let reviewTitle = document.createElement("h3");
            reviewTitle.innerHTML = title;

            let reviewTxt = document.createElement("p");
            reviewTxt.innerHTML = review;

            let starsEl = document.createElement("p");
            starsEl.setAttribute("class", "starsMedium");
            let starsColored = document.createElement("span");
            starsColored.setAttribute("class", "starsColored");
            
            let tmp = stars.toString()+" ";
            for(let i=0; i<stars; i++){
                tmp = tmp+"★";
            }
            starsColored.innerHTML = tmp;
            starsEl.appendChild(starsColored);
            
            tmp = ""
            if(5-stars > 0){
                for(let i=0; i<5-stars; i++){
                    tmp +="★";
                }
                starsEl.innerHTML += tmp;
            }

            reviewDiv.appendChild(reviewTitle);
            reviewDiv.appendChild(starsEl);
            reviewDiv.appendChild(reviewTxt);

            content.appendChild(reviewDiv);
        }
    }
}

function UUID(){
    let userID = getCookieValue("UUID");
    if(userID == null){
        userID = "";
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const charslen = chars.length;
        for(let i=0; i<16; i++){
            userID += chars.charAt(Math.floor(Math.random() * charslen));
        }

        let d = new Date();
        d.setDate(d.getDate() + 365242);
        let expires = "expires="+ d.toUTCString();
        document.cookie = "UUID="+userID+"; exipres="+expires+"; SameSite=lax; path=/"
    }   
    return userID;
}

function getCookieValue(cookieName) {
    // Split the cookies into an array
    const cookies = document.cookie.split(';');
  
    // Loop through the array to find the cookie with the matching name
    for(let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
    
        // Check if the cookie name matches the desired name
        if(cookie.startsWith(`${cookieName}=`)) {
            // Return the cookie value
            return cookie.substring(`${cookieName}=`.length, cookie.length);
        }
    }
  
    // If the cookie isn't found, return null
    return null;
}
  

var reviewData;
createPage();



