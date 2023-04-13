// Skaper cookiebanner
function displayCookieBanner(){
    let title = "Vi bruker cookies"
    let text = "Denne nettsiden bruker cookies for nettsidens funksjonalitet. Du kan samtykke til dette nedenfor."

    let cookieDiv = document.createElement("div");
    cookieDiv.setAttribute("id", "cookiebanner");
    cookieTitle = document.createElement("h2");
    cookieTitle.innerHTML = title;
    cookieTitle.style.textAlign = "center";

    cookieText = document.createElement("p");
    cookieText.innerHTML = text;
    cookieText.style.textAlign = "center";

    cookieDiv.appendChild(cookieTitle);
    cookieDiv.appendChild(cookieText);


    let cookieButtons = document.createElement("div");
    cookieButtons.appendChild(createCookieBtnYes());
    cookieButtons.appendChild(createCookieBtnNo());
    cookieButtons.style.width = "fit-content"
    cookieButtons.style.margin = "auto";
    cookieDiv.appendChild(cookieButtons);

    document.body.appendChild(cookieDiv);
}


// Samtykker knapp
function createCookieBtnYes(){
    let cookieYes = document.createElement("button");
    cookieYes.innerHTML = "Jeg samtykker";
    cookieYes.setAttribute("id", "cookieYes");
    cookieYes.addEventListener("click", consent);
    return cookieYes;
}


// Samtykker ikke knapp
function createCookieBtnNo(){
    let cookieNo = document.createElement("button");
    cookieNo.innerHTML = "Jeg samtykker ikke";
    cookieNo.setAttribute("id", "cookieNo");
    cookieNo.addEventListener("click", noconsent);
    return cookieNo;
}


// Gitt samtykke
function consent(){
    let d = new Date();
    d.setDate(d.getDate() + 30);
    let expires = "expires="+ d.toUTCString();
    document.cookie = "consent=true; "+expires+"; SameSite=lax; path=/";
    removeBanner()
}


// Ikke gitt samtykke
function noconsent(){
    let d = new Date();
    d.setDate(d.getDate() + 7);
    let expires = "expires="+ d.toUTCString();
    document.cookie = "consent=false; "+expires+"; SameSite=lax; path=/";
    removeBanner()
}


// Fjerner banneret
function removeBanner(){
    let div = document.getElementById("cookiebanner");
    div.remove();
}


// Sjekker om cookie eksisterer
if(document.cookie.indexOf('consent=') == -1){
    displayCookieBanner();
}
console.log(document.cookie)