document.addEventListener('DOMContentLoaded', function() {
  const wrapper = document.querySelector('.course-list-wrapper');
  const courseList = document.querySelector('.course-list');
  const popularSection = document.querySelector('.popular');
  
  const courses = [];
  // Nếu không có khóa học nào, ẩn toàn bộ phần .popular
  if (courses.length === 0) {
    document.querySelector('.popular-top .controls').style.display = 'none';
    document.querySelector('.course-list-wrapper').style.display = 'none';
  } else {
      // Có khóa học → render từng item
      courses.forEach(course => {
          const courseItem = document.createElement('div');
          courseItem.className = 'course-item';

          courseItem.innerHTML = `
              <a href="${course.link}"><img src="${course.imgSrc}" alt="${course.title}" class="thumb"></a>
              <div class="info">
                  <div class="head">
                      <h3 class="title"><a href="${course.link}" class="line-clamp break-all">${course.title}</a></h3>
                      <div class="rating">
                          <img src="./assets/img/Star 6.svg" alt="Star" class="star">
                          <span class="value">${course.rating}</span>
                      </div>
                  </div>
                  <p class="desc line-clamp line-2 break-all">${course.desc}</p>
                  <div class="foot">
                      <a href="${course.link}"><button class="btn book-btn">Book now</button></a>
                  </div>
              </div>
          `;

          courseList.appendChild(courseItem);
      });

      // Scroll buttons logic giữ nguyên
      const controlBtns = document.querySelectorAll('.popular-top .controls .control-btn');
      const prevBtn = controlBtns[0];
      const nextBtn = controlBtns[1];

      nextBtn.addEventListener('click', () => {
          wrapper.scrollBy({ left: wrapper.offsetWidth, behavior: 'smooth' });
      });

      prevBtn.addEventListener('click', () => {
          wrapper.scrollBy({ left: -wrapper.offsetWidth, behavior: 'smooth' });
      });
  }

  // Xử lý hiển thị email (phần của bạn đã có sẵn)
  const email = localStorage.getItem("userEmail");
  if (email) {
      document.getElementById("userEmail").textContent = email;
  }
});
