showSlides(slideIndex = 1);
document.querySelector('.next').addEventListener('click', function nextSlide() {
    showSlides(slideIndex += 1);
});

document.querySelector('.prev').addEventListener('click', function previousSlide() {
    showSlides(slideIndex -= 1);
});

function showSlides(n) {
    let slides = document.getElementsByClassName("item");
    
    if (n > slides.length) slideIndex = 1;
    if (n < 1) slideIndex = slides.length;
 
    for (let slide of slides) slide.style.display = "none";   
    slides[slideIndex - 1].style.display = "block"; 
}