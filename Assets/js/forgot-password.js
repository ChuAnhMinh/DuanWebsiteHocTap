
const emailField = document.getElementById("email");
const otpField = document.getElementById("otp");
const newPassword = document.getElementById("new-password");
const confirmPassword = document.getElementById("confirm-password");

emailField.addEventListener("blur", () => {
  if (emailField.value.trim() !== "") {
    otpField.disabled = false;
  } else {
    otpField.disabled = true;
    newPassword.disabled = true;
    confirmPassword.disabled = true;
  }
});

otpField.addEventListener("blur", () => {
  if (otpField.value.trim() !== "") {
    newPassword.disabled = false;
    confirmPassword.disabled = false;
  } else {
    newPassword.disabled = true;
    confirmPassword.disabled = true;
  }
});

document.getElementById("forgot-form").addEventListener("submit", function (e) {
  e.preventDefault();
  alert("Submitted!");
});
