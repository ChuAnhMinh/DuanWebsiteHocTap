document.addEventListener('DOMContentLoaded', function() {
  const wrapper = document.querySelector('.course-list-wrapper');
  const controlBtns = document.querySelectorAll('.popular-top .controls .control-btn');
  const prevBtn = controlBtns[0];
  const nextBtn = controlBtns[1];

  // Nút phải: cuộn sang phải một trang
  nextBtn.addEventListener('click', () => {
    wrapper.scrollBy({ left: wrapper.offsetWidth, behavior: 'smooth' });
  });

  // Nút trái: cuộn sang trái một trang
  prevBtn.addEventListener('click', () => {
    wrapper.scrollBy({ left: -wrapper.offsetWidth, behavior: 'smooth' });
  });
});
