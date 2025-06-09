function fetchCourses() {
    const wrapper = document.querySelector('.course-list-wrapper');
    const courseList = document.getElementById('course-list');

    // ======= MOCK DATA khi CHƯA có API =======
    const courses = [];

    // ======= KHI có API chỉ cần bỏ đoạn const courses trên và uncomment đoạn fetch dưới =======
    /*
    fetch('/api/teacher/courses')
        .then(res => res.json())
        .then(courses => {
            renderCourses(courses);
        });
    */
    
    // Render courses (dùng chung 1 function)
    renderCourses(courses);

    function renderCourses(courses) {
        courseList.innerHTML = '';

        if (courses.length === 0) {
            document.querySelector('.popular-top .controls').style.display = 'none';
            document.querySelector('.course-list-wrapper').style.display = 'none';
        } else {
            document.querySelector('.popular-top .controls').style.display = 'flex';
            document.querySelector('.course-list-wrapper').style.display = 'block';

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
    }
}


const createCourseBtn = document.querySelector('.create-course-btn');
const modalOverlay = document.getElementById('createCourseModal');
const closeModalBtn = document.getElementById('closeModalBtn');

createCourseBtn.addEventListener('click', () => {
    modalOverlay.classList.remove('hidden');
});

closeModalBtn.addEventListener('click', () => {
    modalOverlay.classList.add('hidden');
});

modalOverlay.addEventListener('click', (event) => {
    if (event.target === modalOverlay) {
        modalOverlay.classList.add('hidden');
    }
});

document.addEventListener('DOMContentLoaded', function() {
    fetchCourses();

    // Xử lý hiển thị email (phần của bạn đã có sẵn)
    const email = localStorage.getItem("userEmail");
    if (email) {
      document.getElementById("userEmail").textContent = email;
    }
});