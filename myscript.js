// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
import { getDatabase, ref, set, update } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-database.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDQK0OXmubh-3_w4PkMhIYJWEfJk9dsz6Q",
    authDomain: "authantication-app-129e9.firebaseapp.com",
    databaseURL: "https://authantication-app-129e9-default-rtdb.firebaseio.com",
    projectId: "authantication-app-129e9",
    storageBucket: "authantication-app-129e9.appspot.com",
    messagingSenderId: "551935752864",
    appId: "1:551935752864:web:0b7787bb2b5205de1ce7c5",
    measurementId: "G-3GZKF8JKXK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

const buttonSignup = document.getElementById('button_signup');
const buttonSignin = document.getElementById('button_signin');

buttonSignup.addEventListener('click', (e) => {
    let name = document.getElementById('name').value;
    let nohp = document.getElementById('nohp').value;
    let emailSignup = document.getElementById('email_signup').value;
    let passwordSignup = document.getElementById('psw_signup').value;

    createUserWithEmailAndPassword(auth, emailSignup, passwordSignup)
        .then((userCredential) => {
            // Signed up
            const user = userCredential.user;
            set(ref(database, "user/" + user.uid), {
                name: name,
                nohp: nohp,
                email: emailSignup,
                password: passwordSignup,

            })
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Your work has been saved",
                showConfirmButton: false,
                timer: 1500
              });
        })
        .catch((error) => {
            Swal.fire({
                title: "Submit your Github username",
                input: "text",
                inputAttributes: {
                  autocapitalize: "off"
                },
                showCancelButton: true,
                confirmButtonText: "Look up",
                showLoaderOnConfirm: true,
                preConfirm: async (login) => {
                  try {
                    const githubUrl = `
                      https://api.github.com/users/${login}
                    `;
                    const response = await fetch(githubUrl);
                    if (!response.ok) {
                      return Swal.showValidationMessage(`
                        ${JSON.stringify(await response.json())}
                      `);
                    }
                    return response.json();
                  } catch (error) {
                    Swal.showValidationMessage(`
                      Request failed: ${error}
                    `);
                  }
                },
                allowOutsideClick: () => !Swal.isLoading()
              }).then((result) => {
                if (result.isConfirmed) {
                  Swal.fire({
                    title: `${result.value.login}'s avatar`,
                    imageUrl: result.value.avatar_url
                  });
                }
              });
        });
});

buttonSignin.addEventListener('click', (e) => {
    let emailSignin = document.getElementById('email_signin').value;
    let passwordSignin = document.getElementById('psw_signin').value;
    signInWithEmailAndPassword(auth, emailSignin, passwordSignin)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            window.location = "./Todo-app"
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(error.message);
        });
})