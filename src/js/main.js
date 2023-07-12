const main_init = function () {
    const ibg = document.querySelectorAll('.ibg');
    const header = document.querySelector('.header');
    const heroSwiper = document.querySelector('.hero-swiper');
    const menuIcons = document.querySelectorAll('.menu-icons');
    const toolbar = document.querySelector('.toolbar');

    if (ibg.length > 0) {
        for (let i = 0; i < ibg.length; i++) {
            if (ibg[i].querySelector('img')) {
                ibg[i].style.backgroundImage = 'url(' + ibg[i].querySelector('img').getAttribute('src') + ')';
            }
        }
    }

    if (header) {
        const headerScroll = () => {
            (scrollY > 80) ?
                header.classList.add('_scroll-active') :
                header.classList.remove('_scroll-active')
        }
        document.addEventListener('scroll', headerScroll);
        headerScroll();
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

    if (menuIcons.length > 0 && toolbar) {
        const toolbarSections = toolbar.querySelectorAll('.toolbar-section');
        const openToolbar = (e) => {
            e.preventDefault();

            if (!toolbar.classList.contains('_active')) {
                toolbar.classList.add('_active');
                document.body.classList.add('_lock');
            }

            if (toolbarSections.length > 0) {
                const selector = e.target.getAttribute('href');
                for (const section of toolbarSections) {
                    section.classList.remove('_active');
                    
                    const sectionSelector = section.dataset.id;
                    if (sectionSelector === selector) {
                        section.classList.add('_active');
                    }
                }
            }
        }
        const menuItems = [];
        for (const menu of menuIcons) {
            menuItems.push(...menu.querySelectorAll('a'))
        }
        for (const item of menuItems) {
            item.addEventListener('click', openToolbar)
        }

        const closeButtonToolbar = (e) => {
            e.preventDefault();

            if (toolbar.classList.contains('_active')) {
                toolbar.classList.remove('_active');
                document.body.classList.remove('_lock');
            }
        }
        const close = toolbar.querySelector('.toolbar-close');
        close.addEventListener('click', closeButtonToolbar)

        const closeWrapperToolbar = (e) => {
            if (e.target.closest('.toolbar-inner'))
                return;

            if (toolbar.classList.contains('_active')) {
                toolbar.classList.remove('_active');
                document.body.classList.remove('_lock');
            }
        }
        toolbar.addEventListener('click', closeWrapperToolbar)
    }
}();