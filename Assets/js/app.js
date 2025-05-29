const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});

  document.querySelector('.sign-in-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    // 🔁 Giả lập database người dùng
    const users = [
      { username: 'student01', password: '123456', role: 'student' },
      { username: 'teacher01', password: '123456', role: 'teacher' },
    ];

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      // ✅ Chuyển trang theo phân quyền
      if (user.role === 'student') {
        window.location.href = 'studentPage.html';
      } else if (user.role === 'teacher') {
        window.location.href = 'teacherPage.html';
      }
    } else {
      alert('Sai tài khoản hoặc mật khẩu!');
    }
  });