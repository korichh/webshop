const main_init = function() {
    const ibg = document.querySelectorAll('.ibg');
    const header = document.querySelector('.header');
    const heroSwiper = document.querySelector('.hero-swiper');
    const menuIcons = document.querySelectorAll('.menu-icons');
    const toolbar = document.querySelector('.toolbar');
    const productsToolbar = document.querySelector('.products-toolbar');
    const productsList = document.querySelector('.products-list');

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
            header.classList.add('_scroll-active'):
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

    if (productsToolbar) {
        const openToolbar = (e) => {
            e.preventDefault();

            if (!productsToolbar.classList.contains('_active')) {
                productsToolbar.classList.add('_active');
                document.body.classList.add('_lock');
            }
        }
        const filterButton = document.querySelector('.products-tools__filter button');
        filterButton.addEventListener('click', openToolbar);

        const closeButtonToolbar = (e) => {
            e.preventDefault();

            if (productsToolbar.classList.contains('_active')) {
                productsToolbar.classList.remove('_active');
                document.body.classList.remove('_lock');
            }
        }
        const close = productsToolbar.querySelector('.products-toolbar__close');
        close.addEventListener('click', closeButtonToolbar)

        const closeWrapperToolbar = (e) => {
            if (e.target.closest('.products-toolbar__inner'))
                return;

            if (productsToolbar.classList.contains('_active')) {
                productsToolbar.classList.remove('_active');
                document.body.classList.remove('_lock');
            }
        }
        productsToolbar.addEventListener('click', closeWrapperToolbar)

        const rangeInput = document.querySelectorAll(".range-input input"),
            priceInput = document.querySelectorAll(".price-input input"),
            range = document.querySelector(".slider .progress");
        let priceGap = 100;

        let minPrice = parseInt(priceInput[0].value),
            maxPrice = parseInt(priceInput[1].value);
        range.style.left = ((minPrice / rangeInput[0].max) * 100) + "%";
        range.style.right = 100 - (maxPrice / rangeInput[1].max) * 100 + "%";


        priceInput.forEach(input => {
            input.addEventListener("input", e => {
                let minPrice = parseInt(priceInput[0].value),
                    maxPrice = parseInt(priceInput[1].value);

                if ((maxPrice - minPrice >= priceGap) && maxPrice <= rangeInput[1].max) {
                    if (e.target.className === "input-min") {
                        rangeInput[0].value = minPrice;
                        range.style.left = ((minPrice / rangeInput[0].max) * 100) + "%";
                    } else {
                        rangeInput[1].value = maxPrice;
                        range.style.right = 100 - (maxPrice / rangeInput[1].max) * 100 + "%";
                    }
                }
            });
        });

        rangeInput.forEach(input => {
            input.addEventListener("input", e => {
                let minVal = parseInt(rangeInput[0].value),
                    maxVal = parseInt(rangeInput[1].value);

                if ((maxVal - minVal) < priceGap) {
                    if (e.target.className === "range-min") {
                        rangeInput[0].value = maxVal - priceGap
                    } else {
                        rangeInput[1].value = minVal + priceGap;
                    }
                } else {
                    priceInput[0].value = minVal;
                    priceInput[1].value = maxVal;
                    range.style.left = ((minVal / rangeInput[0].max) * 100) + "%";
                    range.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
                }
            });
        });
    }

    if (productsList) {
        const grid = localStorage.getItem('productsList_grid');
        if (grid) {
            productsList.classList.add(grid);
        }
        const buttons = document.querySelectorAll('.products-tools__grid button');
        const toggleGrid = (e) => {
            if (e.target.classList.contains('grid')) {
                if (productsList.classList.contains('_list')) {
                    productsList.classList.remove('_list')
                    localStorage.removeItem('productsList_grid');
                }
            } else {
                if (!productsList.classList.contains('_list')) {
                    productsList.classList.add('_list')
                    localStorage.setItem('productsList_grid', '_list');
                }
            }
        }

        for (const button of buttons) {
            button.addEventListener('click', toggleGrid);
        }
    }
}();