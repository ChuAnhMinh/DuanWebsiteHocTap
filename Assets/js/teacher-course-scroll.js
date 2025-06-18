async function fetchCourses() {
    const wrapper = document.querySelector('.course-list-wrapper');
    const courseList = document.getElementById('course-list');

    const teacher_id = localStorage.getItem("user_id");

    // ======= KHI có API chỉ cần bỏ đoạn const courses trên và uncomment đoạn fetch dưới =======
    const response = await fetch(`http://localhost:3000/course?teacher_id=${teacher_id}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    });
    const courses = await response.json();
    console.log(courses);

    
    renderCourses(courses.data);

    function renderCourses(courses) {
        console.log(courses)
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
                    <img src="${course.imgSrc}" alt="${course.title}" class="thumb">
                    <div class="info">
                        <div class="head">
                            <h3 class="title"><span class="line-clamp break-all">${course.title}</span></h3>
                        </div>
                        <p class="desc line-clamp line-2 break-all">${course.description}</p>
                        <div class="foot">
                            <button class="btn book-btn">Edit Course</button>
                            <button class="btn delete-btn">Delete</button>
                        </div>
                    </div>
                `;

                // CLICK mở modal Edit Course
                courseItem.querySelector('.book-btn').addEventListener('click', function(e) {
                    e.stopPropagation();
                    localStorage.setItem("editCourseId", course.course_id);
                    window.location.href = "lecturePage.html";
                });

                // CLICK vào khối course để mở modal edit course (giữ nguyên nếu muốn)
                courseItem.addEventListener('click', (event) => {
                if (event.target.closest('.book-btn')) return;

                    document.getElementById('editCourseName').value = course.title;
                    document.getElementById('editCourseDescription').value = course.description || '';
                    document.getElementById('editPreview').src = course.imgSrc || '';

                    // Optional: Lưu ID khóa học vào data attribute nếu sau này cần API
                    document.getElementById('editCourseForm').dataset.courseId = course.course_id;

                    document.getElementById('editCourseModal').classList.remove('hidden');
                });

                courseList.appendChild(courseItem);
                courseItem.querySelector('.delete-btn').addEventListener('click', async (e) => {
                    e.stopPropagation(); // Không mở modal Edit khi bấm Delete

                    if (confirm('Ban co chac muon xoa khoa hoc nay?')) {
                        try {
                            const response = await fetch(`http://localhost:3000/course/${course.course_id}`, {
                            method: 'DELETE',
                            headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                        },
                    });

                    const data = await response.json();
                    console.log('Course deleted:', data);
                    await fetchCourses(); // Reload list sau khi xóa

                        } catch (error) {
                            console.error('Error deleting course:', error);
                        }
                    }
                });

            });

            // Scroll buttons logic
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

    // Xử lý hiển thị email
    const email = localStorage.getItem("userEmail");
    if (email) {
        document.getElementById("userEmail").textContent = email;
    }

    // Xử lý submit form tạo khóa học
    const form = document.getElementById('createCourseForm');
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const formData = new FormData();
        formData.append('courseName', document.getElementById('courseName').value);
        formData.append('courseAvatar', document.getElementById('courseAvatar').files[0]);
        formData.append('courseDescription', document.getElementById('courseDescription').value);

        fetch('http://localhost:3000/course', {
            method: 'POST',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: document.getElementById('courseName').value,
                description: document.getElementById('courseDescription').value,
                teacher_id: localStorage.getItem("user_id"),
            }), // can lay du lieu that
        })
        .then(response => response.json())
        .then(data => {
            console.log('Course created:', data);
            fetchCourses();
            modalOverlay.classList.add('hidden');
            form.reset();
        })
        .catch(error => {
            console.error('Error creating course:', error);
        });
    });

    // Xử lý Cancel Edit
    document.getElementById('cancelEditBtn').addEventListener('click', () => {
        document.getElementById('editCourseModal').classList.add('hidden');
    });

    // Xử lý Submit Edit
    document.getElementById('editCourseForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const newTitle = document.getElementById('editCourseName').value;
        const newDescription = document.getElementById('editCourseDescription').value;
        const courseId = document.getElementById('editCourseForm').dataset.courseId;

        try {
            const response = await fetch(`http://localhost:3000/course/${courseId}`, {
                method: 'PATCH',
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: newTitle,
                    description: newDescription,
                }),
            });

            const data = await response.json();
            console.log('Course updated:', data);

            await fetchCourses(); // Reload danh sách sau khi cập nhật
            document.getElementById('editCourseModal').classList.add('hidden');

        } catch (error) {
            console.error('Error updating course:', error);
        }
    });


    // Xử lý Preview avatar khi chọn ảnh mới
    const editAvatarInput = document.getElementById('editCourseAvatar');
    const editPreview = document.getElementById('editPreview');

    editAvatarInput.addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
            editPreview.src = URL.createObjectURL(file);
        }
    });
});
