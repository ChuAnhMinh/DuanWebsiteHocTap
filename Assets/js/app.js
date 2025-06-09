const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener("click", () => {
    container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
    container.classList.remove("sign-up-mode");
});
//Login
document
    .querySelector(".sign-in-form")
    .addEventListener("submit", async function (e) {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        const formDataObj = Object.fromEntries(formData.entries());
        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formDataObj), // can lay du lieu that
        });
        const data = await response.json();
        console.log(data);

        // neu success bang true, thif dieu huong sang man login thanh cong
        if (data.success) {
            localStorage.setItem("jwt", data.token);
            localStorage.setItem("role", data.data.role_id);
            localStorage.setItem("user_id", data.data.user_id);
            localStorage.setItem("userEmail", data.data.email);
            if (data.data.role_id == "R000") {
                window.location.href = "adminPage.html";
            } else if (data.data.role_id == "R001") {
                window.location.href = "teacherPage.html";
            } else {
                window.location.href = "studentPage.html";
            }
            //   window.location.href = "studentPage.html";
        } else {
            alert(data.message);
        }
    });

//Sign up
document
    .querySelector(".sign-up-form")
    .addEventListener("submit", async function (e) {
        e.preventDefault();

        const signUpForm = e.target;
        const formData = new FormData(signUpForm);
        const formDataObj = Object.fromEntries(formData.entries());
        const response = await fetch("http://localhost:3000/signup", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formDataObj), // can lay du lieu that
        });
        const signUpData = await response.json();
        console.log(signUpData);

        if (signUpData.success) {
            document
                .querySelector(".container")
                .classList.remove("sign-up-mode");
        } else {
            alert(signUpData.message);
        }
    });
