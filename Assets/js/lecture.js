let courseName = "Course Demo";
let teacherName = "Teacher Demo";
let chapters = [];
let selectedLecture = {};
let openedChapterIndex = null;
let selectedChapterIndex = null;
let modalState = {
  type: null,
  chapterIdx: null,
  lectureIdx: null
};

// ==== ĐỔI BASE_URL NẾU BACKEND KHÁC CỔNG/DOMAIN ====
const BASE_URL = "http://localhost:3000";

async function fetchLectureData(courseId) {
    // Lấy thông tin khóa học
    const resCourse = await fetch(`${BASE_URL}/course/${courseId}`);
    const courseData = await resCourse.json();
    courseName = courseData.data.title;
    const teacherId = courseData.data.teacher_id || "";
    let teacherUsername = teacherId;
    if (teacherId) {
    // Gọi API để lấy username theo user_id
    try {
        const resUser = await fetch(`${BASE_URL}/user/${teacherId}`);
        const userData = await resUser.json();
        if (userData && userData.data && userData.data.username)
            teacherUsername = userData.data.username;
        } catch(e) { }
    }
    teacherName = "GV: " + teacherUsername;

// Cập nhật teacher name ở header (góc phải)
const teacherNameHeader = document.querySelector(".teacher-name");
if (teacherNameHeader) teacherNameHeader.textContent = teacherUsername;
    // Lấy chương
    const resChapters = await fetch(`${BASE_URL}/chapters/${courseId}`);
    const chaptersData = await resChapters.json();
    const listChapters = chaptersData.data || [];
    // Lấy bài học cho từng chương
    chapters = [];
    for (let ch of listChapters) {
        // Lấy bài học của chương này
        const resLessons = await fetch(`${BASE_URL}/lessons/${ch.chapter_id}`);
        const lessonsData = await resLessons.json();
        chapters.push({
            chapter_id: ch.chapter_id,
            title: ch.title,
            lectures: (lessonsData.data || []).map(l => ({
                lesson_id: l.lesson_id,
                title: l.title,
                videoUrl: l.video_url
            }))
        });
    }
    // Reset index, highlight lại
    openedChapterIndex = chapters.length > 0 ? 0 : null;
    selectedChapterIndex = chapters.length > 0 ? 0 : null;
    selectedLecture = {};
    renderCourseInfo();
    renderLecturePlaylist();
}

function renderCourseInfo() {
    document.getElementById('courseName').textContent = courseName;
    document.getElementById('teacherName').textContent = teacherName;
}

function showToast(message, type = "success") {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast show ' + type;
    setTimeout(() => {
        toast.className = 'toast hidden';
    }, 2000);
}

function renderLecturePlaylist() {
    const lectureContent = document.getElementById('lectureContent');
    const verticalSeperator = document.getElementById('verticalSeperator');
    const chapterContainer = document.querySelector('#lectures .list-group');
    if (!chapterContainer) return;
    chapterContainer.innerHTML = '';

    if (!chapters || chapters.length === 0) {
        if (lectureContent) lectureContent.style.display = 'none';
        if (verticalSeperator) verticalSeperator.style.display = 'none';
        const videoContainer = document.getElementById('video-area');
        if (videoContainer) videoContainer.innerHTML = '';
        document.getElementById('editChapterBtn').disabled = true;
        document.getElementById('deleteChapterBtn').disabled = true;
        return;
    } else {
        if (lectureContent) lectureContent.style.display = 'flex';
        if (verticalSeperator) verticalSeperator.style.display = '';
    }

    chapters.forEach((chapter, chapterIndex) => {
        // Tiêu đề chương
        const chapterHeader = document.createElement("div");
        chapterHeader.className = "chapter-header";
        chapterHeader.innerHTML = `<span>${chapter.title}</span>`;

        // Highlight nếu là chương đang chọn
        if (openedChapterIndex === chapterIndex) {
            chapterHeader.classList.add('active', 'selected-chapter');
        }
        chapterHeader.onclick = () => {
            openedChapterIndex = chapterIndex;
            selectedChapterIndex = chapterIndex;
            renderLecturePlaylist();
        };
        chapterContainer.appendChild(chapterHeader);

        if (openedChapterIndex === chapterIndex) {
            // Hàng nút bài học
            const btnAdd = document.createElement("button");
            btnAdd.textContent = "Thêm";
            btnAdd.onclick = (e) => {
                e.stopPropagation();
                modalState = { type: "add", chapterIdx: chapterIndex, lectureIdx: null };
                renderLecturePlaylist();
            };

            const btnEdit = document.createElement("button");
            btnEdit.textContent = "Sửa";
            btnEdit.disabled = (selectedLecture[chapterIndex] == null);
            btnEdit.onclick = (e) => {
                e.stopPropagation();
                if (selectedLecture[chapterIndex] != null) {
                    modalState = { type: "edit", chapterIdx: chapterIndex, lectureIdx: selectedLecture[chapterIndex] };
                    renderLecturePlaylist();
                }
            };

            const btnDelete = document.createElement("button");
            btnDelete.textContent = "Xoá";
            btnDelete.disabled = (selectedLecture[chapterIndex] == null);
            btnDelete.onclick = async (e) => {
                e.stopPropagation();
                if (selectedLecture[chapterIndex] != null) {
                    if (confirm("Bạn chắc chắn muốn xoá bài học này?")) {
                        // CALL API XOÁ BÀI HỌC
                        const lecture = chapters[chapterIndex].lectures[selectedLecture[chapterIndex]];
                        await fetch(`${BASE_URL}/lesson/${lecture.lesson_id}`, { method: 'DELETE' });
                        showToast("Đã xoá bài học!", "success");
                        await fetchLectureData(localStorage.getItem('editCourseId'));
                    }
                }
            };

            // Nhóm nút action cho bài học
            const actionsRow = document.createElement("div");
            actionsRow.className = "chapter-actions-row square-btn-group";
            btnAdd.className = "btn chapter-action-btn square-btn btn-add-full";
            actionsRow.appendChild(btnAdd);

            const editDeleteRow = document.createElement('div');
            editDeleteRow.className = 'chapter-action-edit-delete-row';
            btnEdit.className = "btn chapter-action-btn square-btn btn-edit";
            btnDelete.className = "btn chapter-action-btn square-btn btn-delete";
            editDeleteRow.appendChild(btnEdit);
            editDeleteRow.appendChild(btnDelete);
            actionsRow.appendChild(editDeleteRow);

            chapterContainer.appendChild(actionsRow);

            // Danh sách bài học
            const lectures = chapter.lectures || [];
            if (lectures.length === 0) {
                const empty = document.createElement('div');
                empty.className = 'lecture-empty';
                empty.innerHTML = '<i>Chưa có bài học nào trong chương này.</i>';
                chapterContainer.appendChild(empty);
            }
            lectures.forEach((lecture, lecIndex) => {
                const lectureItem = document.createElement('div');
                lectureItem.classList.add('list-item');
                if (selectedLecture[chapterIndex] === lecIndex) {
                    lectureItem.classList.add('active');
                }
                lectureItem.innerHTML = `<span>${lecture.title}</span>`;
                lectureItem.onclick = () => {
                    selectedLecture[chapterIndex] = lecIndex;
                    renderLecturePlaylist();
                };
                chapterContainer.appendChild(lectureItem);
            });
        }
    });

    document.getElementById('editChapterBtn').disabled = (selectedChapterIndex === null);
    document.getElementById('deleteChapterBtn').disabled = (selectedChapterIndex === null);

    // Render video
    const videoContainer = document.getElementById('video-area');
    if (videoContainer) {
        videoContainer.innerHTML = '';
        if (
            openedChapterIndex !== null &&
            chapters[openedChapterIndex] &&
            chapters[openedChapterIndex].lectures &&
            chapters[openedChapterIndex].lectures.length > 0
        ) {
            const selectedIdx = selectedLecture[openedChapterIndex] ?? 0;
            const curLecture = chapters[openedChapterIndex].lectures[selectedIdx];

            const videoWrapper = document.createElement('div');
            videoWrapper.style.position = "relative";
            videoWrapper.style.width = "100%";
            videoWrapper.style.paddingTop = "56.25%";
            videoWrapper.style.background = "#181818";
            videoWrapper.style.borderRadius = "12px";

            const video = document.createElement('video');
            video.src = curLecture.videoUrl;
            video.controls = true;
            video.style.position = "absolute";
            video.style.top = "0";
            video.style.left = "0";
            video.style.width = "100%";
            video.style.height = "100%";
            video.style.objectFit = "cover";
            video.style.borderRadius = "12px";

            videoWrapper.appendChild(video);
            videoContainer.appendChild(videoWrapper);
        }
    }

    // Render modal popup nếu có
    const existingModal = document.querySelector('.lesson-modal-overlay');
    if (existingModal) existingModal.remove();

    if (modalState.type) {
        const { type, chapterIdx, lectureIdx } = modalState;
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'lesson-modal-overlay';

        const modalForm = document.createElement('form');
        modalForm.className = 'lesson-modal-form';

        const title = document.createElement('h3');
        title.innerText = type === "add"
            ? `Thêm bài học cho ${chapters[chapterIdx].title}`
            : `Sửa bài học "${chapters[chapterIdx].lectures[lectureIdx].title}"`;
        title.className = 'modal-title';

        const inputTitle = document.createElement('textarea');
        inputTitle.placeholder = "Tiêu đề bài học";
        inputTitle.className = "input-lecture-title";
        inputTitle.rows = 2;
        inputTitle.required = true;
        if (type === "edit") inputTitle.value = chapters[chapterIdx].lectures[lectureIdx].title;

        const inputUrl = document.createElement('textarea');
        inputUrl.placeholder = "URL video bài học";
        inputUrl.className = "input-lecture-url";
        inputUrl.rows = 2;
        inputUrl.required = true;
        if (type === "edit") inputUrl.value = chapters[chapterIdx].lectures[lectureIdx].videoUrl;

        [inputTitle, inputUrl].forEach(textarea => {
            textarea.addEventListener('input', function () {
                this.style.height = 'auto';
                this.style.height = this.scrollHeight + 'px';
            });
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        });

        const submitBtn = document.createElement('button');
        submitBtn.type = "submit";
        submitBtn.textContent = (type === "add" ? "Xác nhận" : "Lưu");
        submitBtn.className = "btn modal-submit-btn";

        // Nút đóng (X)
        const closeBtn = document.createElement('span');
        closeBtn.innerHTML = "&times;";
        closeBtn.className = 'modal-close-btn';
        closeBtn.onclick = (e) => {
            e.preventDefault();
            modalState = { type: null, chapterIdx: null, lectureIdx: null };
            renderLecturePlaylist();
        };

        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalState = { type: null, chapterIdx: null, lectureIdx: null };
                renderLecturePlaylist();
            }
        });

        // Xử lý submit modal thêm/sửa bài học
        modalForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const lessonTitle = inputTitle.value.trim();
            const lessonUrl = inputUrl.value.trim();
            const chapter = chapters[chapterIdx];
            if (!lessonTitle || !lessonUrl) return;

            if (type === "add") {
                // Thêm bài học mới (POST /lesson)
                await fetch(`${BASE_URL}/lesson`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        title: lessonTitle,
                        chapter_id: chapter.chapter_id,
                        video_url: lessonUrl
                    })
                });
                showToast("Thêm bài học thành công!", "success");
            } else {
                // Sửa bài học (PATCH /lesson/:id)
                const lec = chapter.lectures[lectureIdx];
                await fetch(`${BASE_URL}/lesson/${lec.lesson_id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        title: lessonTitle,
                        content: "",
                        video_url: lessonUrl
                    })
                });
                showToast("Đã sửa bài học!", "success");
            }
            modalState = { type: null, chapterIdx: null, lectureIdx: null };
            await fetchLectureData(localStorage.getItem('editCourseId'));
        });

        modalForm.appendChild(closeBtn);
        modalForm.appendChild(title);
        modalForm.appendChild(inputTitle);
        modalForm.appendChild(inputUrl);
        modalForm.appendChild(submitBtn);
        modalOverlay.appendChild(modalForm);
        document.body.appendChild(modalOverlay);
    }
}

// ==== INIT LẦN ĐẦU ==== 
window.addEventListener('DOMContentLoaded', () => {
    const courseId = localStorage.getItem('editCourseId');
    if (courseId) {
        fetchLectureData(courseId);
    } else {
        renderCourseInfo();
        renderLecturePlaylist();
    }
});

// ==== SỰ KIỆN ACTION BAR (CHƯƠNG) ====
// THÊM CHƯƠNG
document.getElementById('addChapterBtn').onclick = async function () {
    const courseId = localStorage.getItem('editCourseId');
    const chapterNumber = chapters.length + 1;
    const title = "Chương " + chapterNumber;
    await fetch(`${BASE_URL}/chapter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, course_id: courseId })
    });
    await fetchLectureData(courseId);
};

// SỬA CHƯƠNG
document.getElementById('editChapterBtn').onclick = function () {
    if (selectedChapterIndex == null) return;

    const modal = document.createElement('div');
    modal.className = "lesson-modal-overlay";
    const form = document.createElement('form');
    form.className = "lesson-modal-form";

    const title = document.createElement('h3');
    title.textContent = "Sửa tiêu đề chương";

    const textarea = document.createElement('textarea');
    textarea.value = chapters[selectedChapterIndex].title;
    textarea.className = "input-lecture-title";
    textarea.rows = 2;
    textarea.required = true;

    const btn = document.createElement('button');
    btn.type = "submit";
    btn.textContent = "Lưu";
    btn.className = "btn modal-submit-btn";

    // Nút đóng (X)
    const closeBtn = document.createElement('span');
    closeBtn.innerHTML = "&times;";
    closeBtn.className = 'modal-close-btn';
    closeBtn.onclick = (e) => {
        e.preventDefault();
        document.body.removeChild(modal);
    };

    form.appendChild(closeBtn);
    form.appendChild(title);
    form.appendChild(textarea);
    form.appendChild(btn);

    form.onsubmit = async (e) => {
        e.preventDefault();
        await fetch(`${BASE_URL}/chapter/${chapters[selectedChapterIndex].chapter_id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: textarea.value.trim() })
        });
        document.body.removeChild(modal);
        showToast("Đã cập nhật tên chương!", "success");
        await fetchLectureData(localStorage.getItem('editCourseId'));
    };

    modal.appendChild(form);
    document.body.appendChild(modal);
};

// XOÁ CHƯƠNG
document.getElementById('deleteChapterBtn').onclick = async function () {
    if (selectedChapterIndex == null) return;
    if (confirm("Bạn chắc chắn muốn xóa chương này?")) {
        await fetch(`${BASE_URL}/chapter/${chapters[selectedChapterIndex].chapter_id}`, {
            method: "DELETE"
        });
        showToast("Đã xóa chương!", "success");
        await fetchLectureData(localStorage.getItem('editCourseId'));
    }
};

// ==== GỬI DUYỆT ====
document.getElementById('submitCourseBtn').onclick = async function () {
    const courseId = localStorage.getItem('editCourseId');
    // Ví dụ: PATCH /course/:id với trường is_approved
    await fetch(`${BASE_URL}/course/${courseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_approved: true })
    });
    showToast("Gửi duyệt thành công!", "success");
};

// Nút Back: Quay về trang teacherPage
document.querySelector(".back-button").onclick = function () {
    window.location.href = "teacherPage.html";
};
