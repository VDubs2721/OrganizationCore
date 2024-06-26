import {initializeApp} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {getDatabase, ref, set, child, get, remove, update} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";
import {getStorage, ref as sref, uploadBytes} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-storage.js";
// === Final ===
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
// Initialize Realtime Database and get a reference to the service
const db = getDatabase(app);
const storage = getStorage(app);



const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener('click', () =>{
    container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener('click', () =>{
    container.classList.remove("sign-up-mode");
});

const creatorSubmit = document.getElementById('asCreator');

// Flags to track which button was clicked
let asCreator = false;

// Add click event listeners to the submit buttons
creatorSubmit.addEventListener('click', () => {
  asCreator = true;
});

/*const sn = get(child(ref(db), "users/1")).then((snapshot) => {
    if (snapshot.exists()) {
      console.log(!snapshot.val().creator);
    }
});*/

// the below is not used but for reference
document.getElementById("signupform").addEventListener("submit", async function(event) {
  event.preventDefault();

  const username = document.getElementById("signupusername").value.trim();
  const name = document.getElementById("signupname").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("signuppassword").value.trim();
  const address = document.getElementById("address").value.trim();
  const phone = document.getElementById("phonenumber").value.trim();
  const imageUploadInput = document.getElementById('imageUpload');


  let usernameAlreadyExists = false;
  var snapshot = await get(child(ref(db), 'users/'));
  snapshot.forEach((childSnapshot) => {
    if (childSnapshot.child('username').val() == username)
      usernameAlreadyExists = true;
  });
  if (usernameAlreadyExists) {
    alert("Username already exists");
    return;
  }
  let i = 1;
  let done = false;
  while (!done) {
    snapshot = await get(child(ref(db), 'users/' + i));
    if (snapshot.exists()) {
      i++;
    } else {
      await set(ref(db, 'users/' + i), {
        name: name,
        username: username,
        email: email,
        password: password,
        address: address,
        phone: phone,
        creator: asCreator
      });
      done = true;
    }
  }
  const storageRef = sref(storage, 'users/' + i);
  const file = imageUploadInput.files[0];
  // 'file' comes from the Blob or File API
  await uploadBytes(storageRef, file);
  //uploadBytes(storageRef, imageUploadInput.files[0]);
  sessionStorage.setItem("currentUser", i);
  // while (localStorage.getItem("user" + i) !== null) {
  //   i++;
  // }

  //document.getElementById("result").innerHTML = localStorage.getItem("user1");

  //localStorage.clear();
  // Assume AJAX call to send login info to server and save in database
  const urlParams = new URLSearchParams(window.location.search);
  //Redirect to page that brought user to login page
  window.location.href = urlParams.get('redirect') ? urlParams.get('redirect') : 'organizationCore.html';
});

document.getElementById("signinform").addEventListener("submit", async function(event) {
  event.preventDefault(); 

  const username = document.getElementById("signinusername").value.trim();
  const password = document.getElementById("signinpassword").value.trim();

  var passwordCorrect = false;
  var i = "";
  var snapshot = await get(child(ref(db), 'users/'));
  snapshot.forEach((childSnapshot) => {
    if (childSnapshot.child('username').val() == username && childSnapshot.child('password').val() == password) {
      passwordCorrect = true;
      i = childSnapshot.key;
    }
  });

  if (!passwordCorrect) {
    alert("Invalid username or password");
    return;
  }
  else {
    sessionStorage.setItem("currentUser", i);
    const urlParams = new URLSearchParams(window.location.search);
    window.location.href = urlParams.get('redirect') ? urlParams.get('redirect') : 'organizationCore.html';

    //document.getElementById("result").innerHTML = localStorage.getItem("user1");

    //localStorage.clear();
    // Assume AJAX call to send login info to server and save in database
    // Redirect to another page after successful login
    //window.location.href = "/result.html?driver=" + name; // Redirect to event selection page
  }

});