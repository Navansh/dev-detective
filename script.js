//Initial Variable Declaration
const searchBar = document.querySelector(".input-container");
const profileContainer = document.querySelector(".profile-container");
const root = document.documentElement.style;
const get = (param) => document.getElementById(`${param}`);
const url = "https://api.github.com/users/";
const noResults = get("no-results");
const btnMode = get("btn-mode");
const btnsubmit = get("submit");
const input = get("input");
const avatar = get("avatar");
const userName = get("name");
const user = get("user");
const date = get("date");
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov","Dec"];
const bio = get("bio");
const repos = get("repos");
const followers = get("followers");
const following = get("following");
const userLocation = get("location");
const page = get("page");
const twitter = get("twitter");
const company = get("company");
const notFoundMsg = document.querySelector("[data-not-found-message]");
let darkMode = false;

function init(){
    darkMode = false;
    //initialise dark-mode variable to false;
    //darkMode = true -> dark mode enable karna h 
    //darkMode = false -> light mode enable karna h

    const prefersDarkMode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)");

    const value = localStorage.getItem("darkMode");
    // console.log(value);
    if(value === "true"){
        btnMode.checked = true;
        // console.log(darkMode);
        darkModeProperties();

    } else if(value === undefined){
        localStorage.setItem("dark-mode", darkMode);
        lightModeProperties();
        btnMode.checked = false;
    } 
    else{
        localStorage.setItem("dark-mode",prefersDarkMode);
        darkMode = prefersDarkMode;
        lightModeProperties();
        btnMode.checked = false;
    }

    // const value = localStorage.getItem("dark-mode");
    // console.log(value);

    // if(value === null) {
    //     console.log("null k andar");
    //     localStorage.setItem("dark-mode", darkMode);
    //     lightModeProperties();
    // }
    // else if(value == "true") {
    //     console.log("truer k andar");
    //     darkModeProperties();
    // }
    // else if(value == "false") {
    //     console.log("false k andar");
    //     lightModeProperties();
    // }
    // console.log(value);

    getUserData(url + "navansh");
}

init();

//Event Listeners
btnsubmit.addEventListener("click", function () {
    if (input.value !== "") {
        getUserData(url + input.value);
    }
});

btnMode.addEventListener("click", function () {
    // console.log("btnmode clicked");
    if (darkMode === false) {
        //why we did'nt we use === here?
        
        darkModeProperties();
    } else {
        lightModeProperties();
    }
});

input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        if (input.value !== "") {
            getUserData(url + input.value);
        }
    }
}   , false);
//false here denotes that we are not using event bubbling
//3 phases hote hai event ke
//1. Capturing phase
//2. Target phase
//3. Bubbling phase
//event bubbling is default behaviour of event propagation
//event bubbling is when an event happens on an element, it first runs the handlers on it, then on its parent, then all the way up on other ancestors.
//event bubbling is the default behaviour of event propagation
//event bubbling is used to handle events in the bubbling phase
//and by doing false we are saying that we are not using event bubbling
//instead we are using event capturing
//event capturing is when an event happens on an element, it first runs the handlers on it, then on its parent, then all the way up on other ancestors.
//event capturing is used to handle events in the capturing phase

input.addEventListener("input", function () {
    //agar value change kardi toh noresults ko hide kardo
    noResults.style.display = "none";
});

function getUserData(gitUrl){
    fetch(gitUrl)
    .then(response => response.json())
    .then((data) => {
        console.log(data);
        updateProfile(data);
    })
    .catch((error) => {
        console.log(error);
        throw error;
        //we will handle the updation of NoResults in the 
        //Update profile function
    }
    );  
}

function updateProfile(data){
    if(data.message !== "Not Found"){
        // noResults.style.display = "none";

        function checkNull(param1,param2){
            if(param1===""||param1===null){
                param2.style.display = 0.5;
                param2.previousElementSibling.style.display = 0.5;
                return false;
            } else {
                return true;
            }
        }

        //now we start updating all the UI elements of the page
        avatar.src = `${data.avatar_url}`;
        userName.innerText = data.name===null?data.login:data.name;
        user.innerText = `@${data.login}`;
        user.href = `${data.html_url}`;
        dateSegments = data.created_at.split("T").shift().split("-");
        date.innerText = `Joined ${dateSegments[2]} ${months[dateSegments[1]-1]} ${dateSegments[0]}`;
        bio.innerText = data.bio;
        repos.innerText = data.public_repos;
        followers.innerText = data.followers;
        following.innerText = data.following;
        userLocation.innerText = checkNull(data.location,userLocation)?data.location:"Not Available";
        page.innerText = checkNull(data.blog,page)?data.blog:"Not Available";
        page.href = checkNull(data.blog,page)?data.blog:"Not Available";
        twitter.innerText = checkNull(data.twitter_username,twitter)?data.twitter_username:"Not Available";
        twitter.href = checkNull(data.twitter_username,twitter)?`https://twitter.com/${data.twitter_username}`:"Not Available";
        company.innerText = checkNull(data.company,company)?data.company:"Not Available";
        searchBar.classList.toggle("active");
        profileContainer.classList.toggle("active");
    } else {
        // noResults.style.display = "flex";
        profileNotFound();
    }
}

function profileNotFound(){
    notFoundMsg.innerText = "Profile Not Found";
    notFoundMsg.classList.add("active");
    setTimeout(function(){
        notFoundMsg.classList.remove("active");
    },2000);
}

function darkModeProperties(){
    root.setProperty("--lm-bg", "#141D2F");
    root.setProperty("--lm-bg-content", "#1E2A47");
    root.setProperty("--lm-text", "white");
    root.setProperty("--lm-text-alt", "white");
    root.setProperty("--lm-shadow-xl", "rgba(70,88,109,0.15)");
    root.setProperty("--lm-icon-bg", "brightness(1000%)");
    darkMode = true;
    console.log("Dark Mode");
    localStorage.setItem("darkMode", "true");
    console.log("Setting Dark Mode to true")
}

//function to set light mode properties
function lightModeProperties(){
    root.setProperty("--lm-bg", "#F6F8FF");
    root.setProperty("--lm-bg-content", "#FEFEFE");
    root.setProperty("--lm-text", "#4B6A9B");
    root.setProperty("--lm-text-alt", "#2B3442");
    root.setProperty("--lm-shadow-xl", "rgba(70, 88, 109, 0.25)");
    root.setProperty("--lm-icon-bg", "brightness(100%)");
    darkMode = false;
    console.log("Light Mode");
    localStorage.setItem("darkMode", "false");
    console.log("Setting Dark Mode to false")
}





