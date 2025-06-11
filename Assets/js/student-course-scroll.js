document.addEventListener('DOMContentLoaded', async function() {
    const wrapper = document.querySelector('.popular .course-list-wrapper');
    const courseList = document.getElementById('course-list');
    const myCourseList = document.getElementById('my-course-list');

    const email = localStorage.getItem("userEmail");
    if (email) {
        document.getElementById("userEmail").textContent = email;
    }

    let courses = [];
    let bookedCourses = [];

    async function fetchCourses() {
        try {
            const response = await fetch(`http://localhost:3000/courses`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            courses = data.data; 
            console.log('Fetched courses:', courses);
            renderCourses();
        } catch (err) {
            console.error('Error fetching courses:', err);
        }
    }

    async function fetchMyCourses() {
        try {
            const response = await fetch(`http://localhost:3000/my-courses?email=${email}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            bookedCourses = data.data; 
            console.log('Fetched my courses (bookedCourses):', bookedCourses);
            renderMyCourses();
        } catch (err) {
            console.error('Error fetching my courses:', err);
        }
    }

    function renderCourses() {
        courseList.innerHTML = '';

        if (courses.length === 0) {
            document.querySelector('.popular-top .controls').style.display = 'none';
            wrapper.style.display = 'none';
        } else {
            document.querySelector('.popular-top .controls').style.display = 'flex';
            wrapper.style.display = 'block';

            courses.forEach(course => {
                if (bookedCourses.includes(course.id)) return; // đã book thì không hiển thị

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
                        <p class="desc line-clamp line-2 break-all">${course.description}</p>
                        <div class="foot">
                            <button class="btn book-btn">Book now</button>
                        </div>
                    </div>
                `;

                // Xử lý click Book now
                courseItem.querySelector('.book-btn').addEventListener('click', async (e) => {
                    e.stopPropagation();
                    try {
                        const response = await fetch(`http://localhost:3000/book-course`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ email, courseId: course.id }),
                        });

                        if (response.ok) {
                            console.log(`Booked course id: ${course.id} for email: ${email}`);
                            bookedCourses.push(course.id);
                            renderCourses();
                            renderMyCourses();
                        } else {
                            const resJson = await response.json();
                            alert(resJson.message || 'Khong the ghi danh khoa hoc');
                            console.error('Failed to book course');
                        }
                    } catch (err) {
                        console.error('Error booking course:', err);
                    }
                });

                courseList.appendChild(courseItem);
            });

            // Scroll buttons
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

    function renderMyCourses() {
        myCourseList.innerHTML = '';

        if (bookedCourses.length === 0) {
            myCourseList.innerHTML = '<p style="padding: 1rem; color: gray;">You have not enrolled in any courses yet.</p>';
            return;
        }

        bookedCourses.forEach(courseId => {
            const course = courses.find(c => c.id === courseId);
            if (course) {
                const courseItem = document.createElement('div');
                courseItem.className = 'course-item';
                courseItem.innerHTML = `
                    <a href="${course.link}"><img src="${course.imgSrc}" alt="${course.title}" class="thumb"></a>
                    <div class="info">
                        <div class="head">
                            <h3 class="title"><a href="${course.link}" class="line-clamp break-all">${course.title}</a></h3>
                        </div>
                        <p class="desc line-clamp line-2 break-all">${course.description}</p>
                        <div class="foot">
                            <!-- Không có Book now -->
                        </div>
                    </div>
                `;

                myCourseList.appendChild(courseItem);
            }
        });
    }

    // Khởi động ban đầu
    await fetchCourses();
    await fetchMyCourses();
});

