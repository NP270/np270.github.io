const navLinks = document.querySelectorAll('.navbar a');
const currentPage = window.location.pathname;
navLinks.forEach(link => {
  if (link.href.includes(currentPage)) {
    link.classList.add('active');
  }
});
