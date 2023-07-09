const main = function() {
    const ibg = document.querySelectorAll('.ibg');
    const burger = document.querySelector('.header-burger');
    const nav = document.querySelector('.header-nav');

    if (ibg.length > 0) {
        for (let i = 0; i < ibg.length; i++) {
            if (ibg[i].querySelector('img')) {
                ibg[i].style.backgroundImage = 'url(' + ibg[i].querySelector('img').getAttribute('src') + ')';
            }
        }
    }

    if (burger && nav) {
        const toggleBurger = (e) => {
            document.body.classList.toggle('_lock');
            burger.classList.toggle('_active');
            nav.classList.toggle('_active');
        }
        burger.addEventListener('click', toggleBurger)
    }
}();