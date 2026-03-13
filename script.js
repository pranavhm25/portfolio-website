document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

var typed = new Typed("#typing", {
    strings: [
        "Python Developer",
        "Problem Solver",
        "Tech Enthusiast",
        "Building Useful Tools"
    ],
    typeSpeed: 50,
    backSpeed: 30,
    loop: true
});