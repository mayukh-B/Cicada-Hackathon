const hamburger = document.getElementById("hamburger");
const sideDrawer = document.getElementById("sideDrawer");
const close = document.getElementById("close")



hamburger.addEventListener('click', ()=>{
    sideDrawer.classList.toggle('addTranslate')
})

// close.addEventListener('click', ()=>{
//     sideDrawer.classList.toggle('removeTranslate')
// })

