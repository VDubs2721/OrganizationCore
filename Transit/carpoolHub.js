import {initializeApp} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {getDatabase, ref, set, child, get, remove, update} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";
import {getStorage, ref as sref, getDownloadURL, uploadBytes} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-storage.js";
// == Final ==
// Header Package=============================================================================================================
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDF5_FiAIvFJ4DAgRgXirWqzlsMzSBR5oA",
  authDomain: "organization-manager-7fcb2.firebaseapp.com",
  databaseURL: "https://organization-manager-7fcb2-default-rtdb.firebaseio.com",
  projectId: "organization-manager-7fcb2",
  storageBucket: "organization-manager-7fcb2.appspot.com",
  messagingSenderId: "865663758325",
  appId: "1:865663758325:web:8d02b101660f9d50a6babc"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);

document.getElementById("sign-out").addEventListener('click', signOut);

function signOut() {
  sessionStorage.setItem("currentUser", "");
}
getDownloadURL(sref(storage, 'users/' + sessionStorage.getItem("currentUser")))
.then((url) => {

  // Or inserted into an <img> element
  const img = document.getElementById('profile-pic');
  img.setAttribute('src', url);
});
get(child(ref(db), 'users/' + sessionStorage.getItem("currentUser"))).then((snapshot) => {
  if (!snapshot.val().creator)
    document.getElementById("createClub").style.display = "none";

});
// End of Header Package================================================================================================
var events;
await get(child(ref(db), 'users/' + sessionStorage.getItem("currentUser"))).then((snapshot) => {
  events = snapshot.val().events || [];
});
if (events.length == 0) {
  document.getElementById("noEventsMessage").innerHTML = "You are currently not signed up to carpool for any events.";
}
else {
  for (let i = 0; i < events.length; i++) {
    const span = document.createElement("div");
    span.id = events[i];
    span.classList.add("packages");
    await get(child(ref(db), 'events/' + events[i])).then((snapshot) => {
      if (snapshot.exists()) {
        const name = document.createElement("h1");
        name.innerHTML = snapshot.val().name;
        span.appendChild(name);
        const club = document.createElement("a");
        const hostClub = document.createElement("h2");
        hostClub.classList.add("text1");
        hostClub.innerHTML = "Host Club";
        club.appendChild(hostClub);
        club.setAttribute("href", "../Organizations/organizationProfile.html");
        club.id = events[i] + "club" + snapshot.val().club;
        span.appendChild(club);
        const list = document.createElement("ul");
        list.classList.add("list");
        const date = document.createElement("li");
        date.classList.add("first");
        date.innerHTML = snapshot.val().date;
        list.appendChild(date);
        const location = document.createElement("li");
        location.innerHTML = snapshot.val().location;
        list.appendChild(location);
        const numCarpoolers = document.createElement("li");
        //Assuming only one driver, # carpoolers is 1 + riders
        numCarpoolers.innerHTML = (snapshot.val().carpoolers.length + 1) + " Carpoolers";
        list.appendChild(numCarpoolers);
        span.appendChild(list);
        const button = document.createElement("a");
        button.classList.add("button");
        button.classList.add("button1");
        button.href = "./eventReceipt.html";
        button.innerHTML = "View";
        button.id = "event" + events[i];
        span.appendChild(button);
      }
    });
    document.getElementById("container").appendChild(span);
    document.getElementById(events[i]).addEventListener("click", function(event) {
      // Access the id attribute of the target element
      const id = event.target.id.charAt(event.target.id.length - 1).toString();
      if (event.target.id.includes("club")) {
        sessionStorage.setItem("currentClub", id);
        return;
      }
      else if (event.target.id.includes("event")) {
        sessionStorage.setItem("currentEvent", id);
        return;
      }
    });
  }
}