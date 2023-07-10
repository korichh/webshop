const main_init = function () {
    const ibg = document.querySelectorAll('.ibg');
    const header = document.querySelector('.header');
    const heroSwiper = document.querySelector('.hero-swiper');

    if (ibg.length > 0) {
        for (let i = 0; i < ibg.length; i++) {
            if (ibg[i].querySelector('img')) {
                ibg[i].style.backgroundImage = 'url(' + ibg[i].querySelector('img').getAttribute('src') + ')';
            }
        }
    }

    if (header) {
        const burger = header.querySelector('.header-burger');
        if (burger) {
            const toggleBurger = () => {
                document.body.classList.toggle('_lock');
                header.classList.toggle('_burger-active')
            }
            burger.addEventListener('click', toggleBurger)
        }

        const checkHeader = () => {
            (scrollY > 80) ?
                header.classList.add('_scroll-active') :
                header.classList.remove('_scroll-active')
        }
        checkHeader();
        document.addEventListener('scroll', checkHeader);
    }

    if (heroSwiper) {
        const scrollbar = heroSwiper.querySelector('.swiper-scrollbar');
        new Swiper(heroSwiper, {
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            },
            speed: 500,

            scrollbar: {
                el: scrollbar,
                draggable: true,
            },
        });
    }
}();