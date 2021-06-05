const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.blogNav_navLinks_responsive');

hamburger.addEventListener('click',()=>{
    navLinks.classList.toggle('open')
})