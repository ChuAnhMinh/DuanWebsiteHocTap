let courseName = "Course Demo Super super super super super long"
let teacherName = "Teacher Demo Super super super super super super super super long"
const urlParams = new URLSearchParams(window.location.search);
const courseId = urlParams.get('courseId');
const lectureId = urlParams.get('lectureId');
let lectures = [
    {
        id: 1,
        name: "Chuong 1 Super super super super super super super super long",
        lectures: [
            {
                id: 1,
                title: "Lecture 1 Super super super super super super super super long",
            },
            {
                id: 2,
                title: "Lecture 2",
            },
            {
                id: 3,
                title: "Lecture 3",
            }
        ]
    },
    {
        id: 2,
        name: "Chuong 2",
        lectures: [
            {
                id: 4,
                title: "Lecture 4",
            },
            {
                id: 5,
                title: "Lecture 5",
            },
            {
                id: 6,
                title: "Lecture 6",
            }
        ]
    }
]

document.title = courseName;
document.getElementById("courseName").innerHTML = courseName;
document.getElementById("teacherName").innerHTML = teacherName;
const container = document.querySelector('#lectures .list-group');

lectures.forEach(chapter => {
    const chapterDiv = document.createElement('div');
    chapterDiv.classList.add('chapter');
    
    const chapterHeader = document.createElement('div');
    chapterHeader.classList.add('chapter-header');
    chapterHeader.textContent = chapter.name + " ▼";
    
    const lectureList = document.createElement('div');
    lectureList.classList.add('lecture-list');
    lectureList.style.display = 'none';
    
    chapter.lectures.forEach(lecture => {
        const lectureItem = document.createElement('div');
        lectureItem.classList.add('list-item');
        lectureItem.textContent = lecture.title;
        lectureItem.id = lecture.id;
        lectureList.appendChild(lectureItem);
    });
    
    chapterHeader.addEventListener('click', () => {
        if (lectureList.style.display === 'none') {
            lectureList.style.display = 'block';
            chapterHeader.textContent = chapter.name + " ▲";
        } else {
            lectureList.style.display = 'none';
            chapterHeader.textContent = chapter.name + " ▼";
        }
    });

    chapterDiv.appendChild(chapterHeader);
    chapterDiv.appendChild(lectureList);
    
    container.appendChild(chapterDiv);
});

document.getElementById(lectureId).classList.add("active");
const lecture = lectures.find(chapter => chapter.lectures.find(lecture => lecture.id == lectureId))?.lectures.find(lecture => lecture.id == lectureId);
document.getElementById("lectureName").innerHTML = lecture?.title ?? '';
const chapter = lectures.find(c => c.lectures.find(lecture => lecture.id == lectureId));
document.getElementById("chapterName").innerHTML = chapter?.name ?? '';

function setTinyCircleProgress(percent) {
    const radius = 13;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;

    const circle = document.querySelector('.progress-ring-circle');
    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = offset;
    document.querySelector('.progress-text').textContent = `${percent}%`;
}

// Example: set to 60%
setTinyCircleProgress(60);
