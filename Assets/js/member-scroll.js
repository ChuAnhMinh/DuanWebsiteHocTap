
document.addEventListener('DOMContentLoaded', function () {
    const memberWrapper = document.querySelector('.member__list-wrapper');
    const prevBtn = document.querySelectorAll('.member__control .control__btn')[0];
    const nextBtn = document.querySelectorAll('.member__control .control__btn')[1];

    nextBtn.addEventListener('click', () => {
        memberWrapper.scrollBy({ left: memberWrapper.offsetWidth, behavior: 'smooth' });
    });

    prevBtn.addEventListener('click', () => {
        memberWrapper.scrollBy({ left: -memberWrapper.offsetWidth, behavior: 'smooth' });
    });
});
