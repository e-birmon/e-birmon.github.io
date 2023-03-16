//import { doc, getDoc } from firebase;

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
let dokumenter;

db.collection("Skatinghalls").get().then((snapshot) => {
    // Henter ut dokumentene.
    dokumenter = snapshot.docs;

    // Skaper drop-down listen av skøytehaller.
    let dropdown = document.getElementById("droplist");
    for(let i=0; i<dokumenter.length;i++){
        let dropEl = document.createElement("a");
        dropEl.innerHTML = dokumenter[i].data().name;
        dropEl.setAttribute("href", "JavaScript:displayPage("+i+")");
        dropdown.appendChild(dropEl);
    }
});

// Hovedfunksjoner
const reviewDoc = [];
async function getReviewDocument(object){
    db.collection("Reviews").where(firebase.firestore.FieldPath.documentId(), '==', object.name).get().then((snapshot) => {
        reviewDoc.push(snapshot.docs);
    });
    console.log(reviewDoc);

}

function displayPage(i){
    // Setter opp div elementet som inneholder det dynamiske innholdet.
    let page = document.getElementById("page");
    page.innerHTML = "";

    let object = dokumenter[i].data(); // Dataene som skal vises på nettsiden.
    if(reviewDoc.length > 0){reviewDoc.pop()}
    console.log(reviewDoc);
    //myObj = reviewDoc.data[0];
    //console.log(myObj);
    getReviewDocument(object)

    buildContent0(page, object, reviewDoc); // Header
    buildContent1(page, object); // Bilde og beskrivelse
    buildContent2(page, object); // Billetter, kart, kontaktinfo og åpningstider
}

function buildContent0(page, object, reviewDoc){
    // Skaper tittelen for siden.
    let header = document.createElement("h1");
    header.innerHTML = object.name;
    header.setAttribute("id", "name");
    page.appendChild(header);
    getReviewDocument(object);
    console.log("Data:", reviewDoc[1]);
}


function buildContent1(page, object){
     // Skaper en container for bildet og beskrivelsen av skøytehallen.
     let container = document.createElement("div");
     container.setAttribute("class", "container")
 
 
     let imgbox = document.createElement("div"); // Container for bildet.
 
     // Skaper bildet og bildeteksten.
     let img = document.createElement("img");
     let imgtxt = document.createElement("p");
     img.setAttribute("src", object.img[0]);
     imgtxt.innerHTML = "Bilde: "+object.img[1];
     imgtxt.style.fontSize = "small";
     imgbox.appendChild(img);
     imgbox.appendChild(imgtxt);
     imgbox.setAttribute("class", "imgbox");
     container.appendChild(imgbox);
 
     // En container for beskrivelsen av skøytehallen.
     let txt = document.createElement("p");
     let txtbox = document.createElement("div");
     txt.innerHTML = object.desc;
     txtbox.appendChild(txt);
     txtbox.setAttribute("class", "txtbox");
     container.appendChild(txtbox);
     page.appendChild(container);
}


function buildContent2(page, object){
    // Oppretter en container for billettene, kartet og kontaktinfo.
    let container = document.createElement("div");
    container.setAttribute("class", "container");
    let containerLeft = document.createElement("div");
    containerLeft.setAttribute("id", "containerLeft");

    containerLeft.appendChild(tickets(object));
    containerLeft.appendChild(document.createElement("br"))
    containerLeft.appendChild(contactInfo(object));
    containerLeft.appendChild(document.createElement("br"))
    containerLeft.appendChild(openingHours(object));
    container.append(containerLeft);
    container.append(map(object));

    
    page.appendChild(container);
}


// Subfunksjoner

function tickets(object){
    // Finner antall billettyper.
    let ticketlen = Object.keys(object.tickets[0]).length;

    // Billett container og header.
    let ticketcontainer = document.createElement("div");
    let ticketHeader = document.createElement("h2");
    ticketHeader.innerHTML = "Billetter";
    ticketcontainer.appendChild(ticketHeader);

    let ticketbox = document.createElement("div"); // En sub-container for billettlisten.
    let ticketlist = document.createElement("ul"); // Selve billettlisten

    // Skaper listen med billetter
    for(let i=0; i<ticketlen; i++){
        let listElement = document.createElement("li");
        listElement.innerHTML = object.tickets[0][i][0]+": "+object.tickets[0][i][1];
        ticketlist.appendChild(listElement);
    }
    ticketbox.append(ticketlist);
    ticketbox.setAttribute("class", "ticketbox");
    ticketcontainer.appendChild(ticketbox);
    return ticketcontainer;
}


function contactInfo(object){
    // Kontaktinfoens container
    let contactinfocontainer = document.createElement("div");

    let contactinfoHeader = document.createElement("h2");
    contactinfoHeader.innerHTML = "Kontaktinfo";
    contactinfocontainer.appendChild(contactinfoHeader);

    let contactinfobox = document.createElement("div");
    contactinfobox.setAttribute("class", "contactinfobox");

    infoCategoryPrefix = ["Addresse: ", "Tlf: "];
    infoCategory = [object.address, object.phone];

    // Skaper li elemeneter for kontaktinfoen
    let contactList = document.createElement("ul");
    for(let i=0; i<2; i++){
        let listElement = document.createElement("li");
        listElement.innerHTML = infoCategoryPrefix[i]+infoCategory[i];
        contactList.appendChild(listElement);
    }

    // li elementet for nettsiden
    let site = document.createElement("a");
    site.innerHTML = "Trykk her!";
    site.setAttribute("href", object.site);
    let listElement = document.createElement("li")
    listElement.innerHTML = "Nettsted: ";
    listElement.appendChild(site);

    contactList.appendChild(listElement);
    contactinfobox.appendChild(contactList);

    contactinfocontainer.appendChild(contactinfobox);
    return contactinfocontainer;
}


function openingHours(object){
    // Her blir åpningstidenes elemer skapt
    let hoursContainer = document.createElement("div");
    let header = document.createElement("h2");
    header.innerHTML = "Åpningstider";
    hoursContainer.appendChild(header);
    
    let hoursbox = document.createElement("div");
    hoursbox.setAttribute("class", "hoursbox");

    let days = ["Man: ", "Tir: ", "Ons: ", "Tor: ", "Fre: ", "Lør: ", "Søn: "];
    let hourList = document.createElement("ul");
    // **Tabell i stedet.
    for(let i=0; i<7; i++){
        let listElement = document.createElement("li");
        listElement.innerHTML = days[i]+object.open[i];
        listElement.setAttribute("class", "monospaced");
        hourList.appendChild(listElement);
    }
    hoursbox.appendChild(hourList);
    hoursContainer.appendChild(hoursbox);
    return hoursContainer;
}


function map(object){
    // Her blir kartet og div elementet dets skapt.
    let mapbox = document.createElement("div");
    let map = document.createElement("iframe");

    map.setAttribute("src", object.map);
    map.setAttribute("width", "100%")
    map.setAttribute("height", "100%")
    mapbox.setAttribute("class", "mapbox")
    mapbox.appendChild(map);
    return mapbox;
}

function reviewsStars(object){
    // Regner ut hvor mange stjerner hallen har og bygger de
    let stars = object.stars;
    let len = stars.length;
    let sum = stars.reduce((partialSum, a) => partialSum + a, 0);
    let average = Math.round(sum/len*10)/10;
    let averageInt = Math.round(average);
    
    let starsEl = document.createElement("h2");
    starsEl.setAttribute("class", "stars");
    let starsColored = document.createElement("span");
    starsColored.setAttribute("class", "starsColored");

    let tmp = "";
    for(let i=0; i<averageInt; i++){
        tmp = tmp+"★";
    }
    starsColored.innerHTML = tmp;
    starsEl.appendChild(starsColored);
    tmp = ""
    for(let i=0; i<5-averageInt; i++){
        tmp = tmp+"★";
    }
    starsEl.appendChild(tmp);

    return starsEl;
}