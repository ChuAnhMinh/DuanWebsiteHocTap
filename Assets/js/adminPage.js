const btn = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
let courses = [
    {
        course_id: 1,
        title: 'Introduction to Programming Introduction to Programming Introduction to ProgrammingIntroduction to ProgrammingIntroduction to ProgrammingIntroduction to Programming',
        description: 'Learn the basics of programming with Python.',
        teacher: {
            user_id: 1,
            username: 'teacher1',
            email: 'teacher1@example.com',
            role_id: 'R001',
        },
        chapters: [
            {
                chapter_id: 1,
                title: 'Getting Started with Python Getting Started with Python Getting Started with Python Getting Started with Python Getting Started with Python',
                lessons: [
                    {
                        lesson_id: 1,
                        title: 'Installing Python',
                        content: 'Step-by-step guide to install Python.',
                    },
                    {
                        lesson_id: 2,
                        title: 'Hello World in Python',
                        content: 'Your first Python program.',
                    },
                    {
                        lesson_id: 3,
                        title: 'Installing Python',
                        content: 'Step-by-step guide to install Python.',
                    },
                    {
                        lesson_id: 4,
                        title: 'Hello World in Python',
                        content: 'Your first Python program.',
                    },
                    {
                        lesson_id: 5,
                        title: 'Installing Python',
                        content: 'Step-by-step guide to install Python.',
                    },
                    {
                        lesson_id: 6,
                        title: 'Hello World in Python',
                        content: 'Your first Python program.',
                    },
                    {
                        lesson_id: 7,
                        title: 'Installing Python',
                        content: 'Step-by-step guide to install Python.',
                    },
                    {
                        lesson_id: 8,
                        title: 'Hello World in Python',
                        content: 'Your first Python program.',
                    },
                    {
                        lesson_id: 9,
                        title: 'Installing Python',
                        content: 'Step-by-step guide to install Python.',
                    },
                    {
                        lesson_id: 10,
                        title: 'Hello World in Python',
                        content: 'Your first Python program.',
                    },
                ],
            },
            {
                chapter_id: 2,
                title: 'Control Flow in Python',
                lessons: [
                    {
                        lesson_id: 3,
                        title: 'If-Else Statements',
                        content: 'Learn conditional logic in Python.',
                    },
                    {
                        lesson_id: 4,
                        title: 'For and While Loops',
                        content: 'How to use loops in Python.',
                    },
                ],
            },
        ],
    },
    {
        course_id: 2,
        title: 'Advanced Web Development',
        description: 'Build fullstack applications using React and Node.js.',
        teacher: {
            user_id: 1,
            username: 'teacher1',
            email: 'teacher1@example.com',
            role_id: 'R001',
        },
        chapters: [
            {
                chapter_id: 3,
                title: 'Frontend Basics',
                lessons: [
                    {
                        lesson_id: 5,
                        title: 'HTML & CSS Basics',
                        content: 'Build your first webpage.',
                    },
                    {
                        lesson_id: 6,
                        title: 'JavaScript DOM Manipulation',
                        content: 'Interact with the DOM using JS.',
                    },
                ],
            },
            {
                chapter_id: 4,
                title: 'Backend with Node.js',
                lessons: [
                    {
                        lesson_id: 7,
                        title: 'Setting Up Express.js',
                        content: 'Create your first Node.js server.',
                    },
                    {
                        lesson_id: 8,
                        title: 'Routing in Express',
                        content: 'Handle different routes in your app.',
                    },
                ],
            },
        ],
    },
];
let users = [
    {
        user_id: 1,
        username: 'teacher1',
        email: 'teacher1@example.com',
        password: 'hashedpassword1',
        role_id: 'R001', // teacher
    },
    {
        user_id: 2,
        username: 'student1',
        email: 'student1@example.com',
        password: 'hashedpassword2',
        role_id: 'R001', // student
    },
    {
        user_id: 3,
        username: 'student2',
        email: 'student2@example.com',
        password: 'hashedpassword3',
        role_id: 'R002',
    },
];
const editContainer = document.querySelector('#lectures .list-group');
let currentCourse;
let currentChapter;
let currentUser;
let currentLesson = 0;
document.getElementById('newChapterName').addEventListener('input', () => {
    document.getElementById('addChapter').disabled = document.getElementById('newChapterName').value.trim() === '';
});


window.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const view = params.get("view");

    const courseSection = document.getElementById("course-section");
    const userSection = document.getElementById("user-section");

    courseSection.style.display = "none";
    userSection.style.display = "none";

    if (view === "courses") {
        courseSection.style.display = "block";
        courseListInit();
    } else if (view === "users") {
        userSection.style.display = "block";
        userListInit();
    } else {
        window.location.href = "adminPage.html?view=courses";
    }
});

btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    sidebar.classList.toggle('show');
    document.body.classList.toggle('sidebar-open');
});

//Courses
function courseListInit(){
    const tbody = document.querySelector('#course-list tbody');
    tbody.innerHTML = '';
    courses.forEach(course => {
        const tbody = document.querySelector('#course-list tbody');
        const row = document.createElement('tr');
        row.innerHTML = `
      <td data-label="ID">${course.course_id}</td>
      <td data-label="Title">${course.title}</td>
      <td data-label="Teacher">${course.teacher.username}</td>
      <td data-label="Actions">
        <div class="action-buttons">
      <button class="edit-button">Edit</button>
      <button class="delete-button">Delete</button>
    </div>
  </td>
    `;
        const editButton = row.querySelector('.edit-button');
        editButton.addEventListener('click', () => openEditPopup(course));
        const deleteButton = row.querySelector('.delete-button');
        deleteButton.addEventListener('click', () => handleDeleteCourse(course));
        tbody.appendChild(row);
    })
}

function openEditPopup(course) {
    currentCourse = course;
    document.getElementById("popupOverlay").style.display = "flex";
    // course.chapters.forEach(chapter => {
    //     const chapterDiv = document.createElement('div');
    //     chapterDiv.classList.add('chapter');
    //
    //     const chapterHeader = document.createElement('div');
    //     chapterHeader.classList.add('chapter-header');
    //     chapterHeader.value = chapter.title;
    //     chapterHeader.textContent = chapter.title + " ▼";
    //
    //     const lectureList = document.createElement('div');
    //     lectureList.classList.add('lecture-list');
    //     lectureList.style.display = 'none';
    //
    //     chapter.lessons.forEach(lecture => {
    //         const lectureItem = document.createElement('div');
    //         lectureItem.classList.add('list-item');
    //         lectureItem.textContent = lecture.title;
    //         lectureItem.id = lecture.lesson_id;
    //         lectureList.appendChild(lectureItem);
    //     });
    //
    //     chapterHeader.addEventListener('click', () => {
    //         if (lectureList.style.display === 'none') {
    //             lectureList.style.display = 'block';
    //             chapterHeader.textContent = chapter.title + " ▲";
    //         } else {
    //             lectureList.style.display = 'none';
    //             chapterHeader.textContent = chapter.title + " ▼";
    //         }
    //     });
    //
    //     chapterDiv.appendChild(chapterHeader);
    //     chapterDiv.appendChild(lectureList);
    //
    //     editContainer.appendChild(chapterDiv);
    // });
    if (course.chapters.length !== 0) {
        course.chapters.forEach(chapter => {
            const tbody = document.querySelector('#chapter-list tbody');
            const row = document.createElement('tr');
            row.innerHTML = `
          <td data-label="Chapter Name">${chapter.title}</td>
          <td data-label="Actions">
            <div class="action-buttons">
          <button class="edit-button">Edit</button>
          <button class="delete-button">Delete</button>
        </div>
      </td>
    `;
            const editButton = row.querySelector('.edit-button');
            editButton.addEventListener('click', () => openChapterPopup(chapter));
            const deleteButton = row.querySelector('.delete-button');
            deleteButton.addEventListener('click', () => handleDeleteChapter(chapter));
            tbody.appendChild(row);
        });
    }
    document.getElementById('courseName').value = course.title;
    document.getElementById('teacherSelect').innerHTML = '';
    users.forEach(user => {
        if (user.role_id == "R001") {  //Teacher role?
            const option = document.createElement('option');
            option.value = JSON.stringify(user);
            option.textContent = user.username;
            if (user.user_id == course.teacher.user_id) {
                option.selected = true;
            }
            document.getElementById('teacherSelect').appendChild(option);
        }
    })
}

function handleSaveCourse(event) {
    event.preventDefault();
    const courseName = document.getElementById('courseName').value;
    const teacher = document.getElementById('teacherSelect').value;
    courses.find(course => course.course_id == currentCourse.course_id).title = courseName;
    courses.find(course => course.course_id == currentCourse.course_id).teacher = JSON.parse(teacher);
    Swal.fire('Success!', 'The course has been saved!', 'success').then(() => courseListInit());
}

function openChapterPopup(chapter) {
    currentChapter = chapter;
    document.getElementById('chapterPopup').style.display = "block";
    document.getElementById('popupBackdrop').style.display = "block";
    const lectureList = document.createElement('div');
    lectureList.classList.add('lecture-list');
    lectureList.style.display = 'block';
    const lectureItem = document.createElement('div');
    lectureItem.classList.add('list-item');
    lectureItem.textContent = "+ Add lesson";
    lectureItem.id = 0;
    const deleteButton = document.getElementById('deleteLecture');
    lectureItem.addEventListener('click', () => {
        currentLesson = 0;
        deleteButton.style.display = 'none';
        lectureItem.classList.add('active');
        lectureList.querySelectorAll('.list-item').forEach(item => {
            if (item !== lectureItem) {
                item.classList.remove('active');
            }
        });
        document.getElementById('previewLecture').value = "";
        document.getElementById('previewLecture').dispatchEvent(new Event('input'));
        document.getElementById('content').value = "";
        document.querySelector('label[for="previewLecture"]').text = "New Lecture";
        //Video preview changer
    })
    lectureList.appendChild(lectureItem);
    chapter.lessons.forEach(lecture => {
        const lectureItem = document.createElement('div');
        lectureItem.classList.add('list-item');
        lectureItem.textContent = lecture.title;
        lectureItem.id = lecture.lesson_id;
        lectureItem.addEventListener('click', () => {
            currentLesson = lecture.lesson_id;
            deleteButton.style.display = 'flex';
            lectureItem.classList.add('active');
            lectureList.querySelectorAll('.list-item').forEach(item => {
                if (item !== lectureItem) {
                    item.classList.remove('active');
                }
            });
            document.getElementById('previewLecture').value = lecture.title;
            document.getElementById('content').value = lecture.content;
            document.querySelector('label[for="previewLecture"]').text = "Lecture Name";
            //Video preview changer
        })
        lectureList.appendChild(lectureItem);
    })
    lectureList.firstChild.click();
    editContainer.appendChild(lectureList);
    document.getElementById('chapterName').value = chapter.title;
}

function handleSaveChapter(event){
    event.preventDefault();
    const chapterName = document.getElementById('chapterName').value;
    courses.find(course => course.course_id == currentCourse.course_id).chapters.find(chapter => chapter.chapter_id == currentChapter.chapter_id).title = chapterName;
    Swal.fire('Success!', 'The chapter has been updated!', 'success').then(() => {
        const tmp = courses.find(course => course.course_id == currentCourse.course_id);
        closeEditPopup();
        openEditPopup(tmp);
    });
}

function handleSaveLesson(event){
    event.preventDefault();
    const lessonItem = document.querySelector('.list-item.active');
    const lessonId = lessonItem.id;
    const lessonName = document.getElementById('previewLecture').value;
    const content = document.getElementById('content').value;
    const newVideo = document.getElementById('newVideo').files[0];
    if (lessonId == 0) {  //New lesson
        // Need upload to server to get id
        courses.find(course => course.course_id == currentCourse.course_id).chapters.find(chapter => chapter.chapter_id == currentChapter.chapter_id).lessons.push({lesson_id: 0, title: lessonName, content: content});
        Swal.fire('Success!', 'The lesson has been added!', 'success').then(() => {
            const tmp = courses.find(course => course.course_id == currentCourse.course_id).chapters.find(chapter => chapter.chapter_id == currentChapter.chapter_id);
            closeChapterPopup();
            openChapterPopup(tmp);
        });
    }
    else {
        courses.find(course => course.course_id == currentCourse.course_id).chapters.find(chapter => chapter.chapter_id == currentChapter.chapter_id).lessons.find(lesson => lesson.lesson_id == lessonId).title = lessonName;
        courses.find(course => course.course_id == currentCourse.course_id).chapters.find(chapter => chapter.chapter_id == currentChapter.chapter_id).lessons.find(lesson => lesson.lesson_id == lessonId).content = content;
        Swal.fire('Success!', 'The lesson has been updated!', 'success').then(() => {
            const tmp = courses.find(course => course.course_id == currentCourse.course_id).chapters.find(chapter => chapter.chapter_id == currentChapter.chapter_id);
            closeChapterPopup();
            openChapterPopup(tmp);
        });
    }
}

function closeChapterPopup() {
    document.getElementById('chapterPopup').style.display = "none";
    document.getElementById('popupBackdrop').style.display = "none";
    editContainer.innerHTML = "";
    document.getElementById('previewLecture').value = "";
}

function closeEditPopup() {
    document.getElementById("popupOverlay").style.display = "none";
    // editContainer.innerHTML = "";
    document.querySelector('#chapter-list tbody').innerHTML = "";
}

function openAddCoursePopup(){
    document.getElementById('addCourseOverlay').style.display = "flex";
    document.getElementById('newTeacherSelect').innerHTML = "";
    users.forEach(user => {
        if (user.role_id == "R001") {  //Teacher role?
            const option = document.createElement('option');
            option.value = JSON.stringify(user);
            option.textContent = user.username;
            document.getElementById('newTeacherSelect').appendChild(option);
        }
    })
}

function handleAddCourse(event){
    event.preventDefault();
    const courseName = document.getElementById('newCourseName').value;
    const teacher = JSON.parse(document.getElementById('newTeacherSelect').value);
    const newCourse = {course_id: 0, title: courseName, teacher: teacher, chapters: []}; // Need upload to server to get id
    courses.push(newCourse);
    Swal.fire('Success!', 'The course has been added!', 'success').then(() => {
        closeAddCoursePopup();
        courseListInit();
    });
}

function closeAddCoursePopup(){
    document.getElementById('addCourseOverlay').style.display = "none";
    document.getElementById('newCourseName').value = "";
    document.getElementById('newTeacherSelect').value = "";
}

function handleAddChapter(){
    const chapterName = document.getElementById('newChapterName').value;
    const newChapter = {chapter_id: 0, title: chapterName, lessons: []}; // Need upload to server to get id
    courses.find(course => course.course_id == currentCourse.course_id).chapters.push(newChapter);
    Swal.fire('Success!', 'The chapter has been added!', 'success').then(() => {
        document.getElementById('newChapterName').value = "";
        document.getElementById('newChapterName').dispatchEvent(new Event('input'));
        const tmp = courses.find(course => course.course_id == currentCourse.course_id);
        closeEditPopup();
        openEditPopup(tmp);
    });
}

function handleDeleteCourse(course){
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            courses = courses.filter(c => c.course_id !== course.course_id);
            Swal.fire('Success!', 'The course has been deleted!', 'success').then(() => courseListInit());
        }
    });
}

function handleDeleteChapter(chapter){
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            const course = courses.find(c => c.chapters.find(ch => ch.chapter_id == chapter.chapter_id));
            course.chapters = course.chapters.filter(ch => ch.chapter_id !== chapter.chapter_id);
            Swal.fire('Success!', 'The chapter has been deleted!', 'success').then(() => {
                const tmp = courses.find(c => c.course_id == course.course_id);
                closeEditPopup();
                openEditPopup(tmp);
            });
        }
    });
}

function handleDeleteLesson(){
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            const chapter = currentChapter;
            chapter.lessons = chapter.lessons.filter(l => l.lesson_id !== currentLesson);
            courses.find(c => c.chapters.find(ch => ch.chapter_id == chapter.chapter_id)).chapters.find(ch => ch.chapter_id == chapter.chapter_id).lessons = chapter.lessons;
            console.log(courses);
            Swal.fire('Success!', 'The lesson has been deleted!', 'success').then(() => {
                closeChapterPopup();
                openChapterPopup(chapter);
            });
        }
    });
}

//Users
function userListInit(){
    const tbody = document.querySelector('#user-list tbody');
    tbody.innerHTML = '';
    users.forEach(user => {
        const tbody = document.querySelector('#user-list tbody');
        const row = document.createElement('tr');
        row.innerHTML = `
      <td data-label="ID">${user.user_id}</td>
      <td data-label="Username">${user.username}</td>
      <td data-label="Name">Dummy Name</td>
      <td data-label="Role">${user.role_id == "R000" ? "Admin" : user.role_id == "R001" ? "Teacher" : "Student"}</td>
      <td data-label="Actions">
        <div class="action-buttons">
      <button class="edit-button">Edit</button>
      <button class="delete-button">Delete</button>
    </div>
  </td>
    `;
        const editButton = row.querySelector('.edit-button');
        editButton.addEventListener('click', () => openEditUserPopup(user));
        const deleteButton = row.querySelector('.delete-button');
        deleteButton.addEventListener('click', () => handleDeleteUser(user));
        tbody.appendChild(row);
    })
}

function openAddUserPopup(){
    document.getElementById('addUserOverlay').style.display = "flex";
    document.getElementById('newUsername').value = "";
    document.getElementById('newPassword').value = "";
    document.getElementById('newEmail').value = "";
    document.getElementById('newName').value = "";
}

function handleNewUser(event){
    event.preventDefault();
    const username = document.getElementById('newUsername').value;
    const password = document.getElementById('newPassword').value;
    const email = document.getElementById('newEmail').value;
    const name = document.getElementById('newName').value;
    const role = document.getElementById('newRoleSelect').value;
    const newUser = {user_id: 0, username: username, password: password, email: email, name: name, role_id: role}; // Need upload to server to get id
    users.push(newUser);
    Swal.fire('Success!', 'The user has been added!', 'success').then(() => {
        closeAddUserPopup();
        userListInit();
    });
}

function closeAddUserPopup(){
    document.getElementById('addUserOverlay').style.display = "none";
}

function openEditUserPopup(user){
    currentUser = user;
    document.getElementById('editUserOverlay').style.display = "flex";
    document.getElementById('editUsername').value = user.username;
    document.getElementById('editEmail').value = user.email;
    document.getElementById('editName').value = user.name;
    document.getElementById('editRoleSelect').value = user.role_id;
}

function closeEditUserPopup(){
    document.getElementById('editUserOverlay').style.display = "none";
    document.getElementById('editUsername').value = "";
    document.getElementById('editPassword').value = "";
    document.getElementById('editEmail').value = "";
    document.getElementById('editName').value = "";
    document.getElementById('editRoleSelect').value = "";
}

function handleSaveUser(event){
    event.preventDefault();
    const username = document.getElementById('editUsername').value;
    const email = document.getElementById('editEmail').value;
    const name = document.getElementById('editName').value;
    const role = document.getElementById('editRoleSelect').value;
    users.find(user => user.user_id == currentUser.user_id).username = username;
    users.find(user => user.user_id == currentUser.user_id).email = email;
    users.find(user => user.user_id == currentUser.user_id).name = name;
    users.find(user => user.user_id == currentUser.user_id).role_id = role;
    if (document.getElementById('editPassword').value != "") {
        //Upload to server to encrypt if needed
        users.find(user => user.user_id == currentUser.user_id).password = document.getElementById('editPassword').value;
    }
    Swal.fire('Success!', 'The user has been updated!', 'success').then(() => {
        closeEditUserPopup();
        userListInit();
    });
}

function handleDeleteUser(user) {
    Swal.fire({
        title: 'Are you sure?',
        text: 'Are you sure you want to delete this user? This can\'t be undone',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
    }).then((result) => {
        if (result.isConfirmed) {
            users = users.filter(u => u.user_id !== user.user_id);
            Swal.fire('Success!', 'The user has been deleted!', 'success').then(() => userListInit());
        }
    });
}
