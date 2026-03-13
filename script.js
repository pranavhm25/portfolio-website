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
        "PYTHON DEVELOPER",
        "PROBLEM SOLVER",
        "TECH ENTHUSIAST",
        "BUIDING USEFUL TOOLS"
    ],
    typeSpeed: 50,
    backSpeed: 30,
    loop: true
});

particlesJS("particles-js", {
  particles: {
    number: {
      value: 80
    },
    size: {
      value: 3
    },
    color: {
      value: "#38bdf8"
    },
    line_linked: {
      enable: true,
      distance: 150,
      color: "#38bdf8",
      opacity: 0.4
    },
    move: {
      speed: 2
    }
  }
});

ScrollReveal().reveal('.hero-content', {
distance: '50px',
duration: 1200,
origin: 'bottom'
});

ScrollReveal().reveal('#about', {
distance: '50px',
duration: 1200,
origin: 'left'
});

ScrollReveal().reveal('#projects', {
distance: '50px',
duration: 1200,
origin: 'right'
});

ScrollReveal().reveal('#skills', {
distance: '50px',
duration: 1200,
origin: 'bottom'
});

ScrollReveal().reveal('#contact', {
distance: '50px',
duration: 1200,
origin: 'bottom'
});

VanillaTilt.init(document.querySelectorAll(".project-card"), {
max: 12,
speed: 400,
glare: true,
"max-glare": 0.2
});