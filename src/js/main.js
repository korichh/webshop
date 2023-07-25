const main_init = function () {
    const ibg = document.querySelectorAll('.ibg');
    const header = document.querySelector('.header');
    const heroSwiper = document.querySelector('.hero-swiper');
    const menuIcons = document.querySelectorAll('.menu-icons');
    const toolbar = document.querySelector('.toolbar');
    const productsToolbar = document.querySelector('.products-toolbar');
    const productsList = document.querySelector('.products-list');
    const itemView = document.querySelector('.item-view');
    const itemAbout = document.querySelector('.item-about');
    const itemFeature = document.querySelector('.item-feature');

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

    if (itemView) {
        const items = itemView.querySelectorAll('.item-view__item');
        const image = itemView.querySelector('.item-view__image');
        const mainImg = image.querySelector('img');
        const delay = parseFloat(getComputedStyle(mainImg).transitionDuration) * 1000;

        const changeSrc = (e) => {
            const buttonImg = e.target.querySelector('img');

            buttonImg.classList.add('_active');
            mainImg.classList.add('_active');
            itemView.classList.add('_active');

            setTimeout(() => {
                let tempSrc = mainImg.getAttribute('src');
                mainImg.setAttribute('src', buttonImg.getAttribute('src'));
                buttonImg.setAttribute('src', tempSrc);

                buttonImg.classList.remove('_active');
                mainImg.classList.remove('_active');
                itemView.classList.remove('_active');
            }, delay)
        }

        for (const item of items) {
            const button = item.querySelector('button');
            button.addEventListener('click', changeSrc)
        }
    }

    if (itemAbout) {
        const favorite = itemAbout.querySelector('.item-about__heading button');
        const sizeItems = itemAbout.querySelectorAll('.item-size__item');
        const colorItems = itemAbout.querySelectorAll('.item-color__item');
        const itemCount = itemAbout.querySelector('.item-count');

        const addFavorite = () => {
            favorite.classList.toggle('_active');
        }
        favorite.addEventListener('click', addFavorite);

        const changeSize = (e) => {
            for (const sizeItem of sizeItems) {
                if (sizeItem.classList.contains('_active')) {
                    sizeItem.classList.remove('_active')
                }
            }
            e.target.closest('.item-size__item').classList.add('_active');
        }
        for (const sizeItem of sizeItems) {
            sizeItem.addEventListener('click', changeSize);
        }

        const changeColor = (e) => {
            for (const colorItem of colorItems) {
                if (colorItem.classList.contains('_active')) {
                    colorItem.classList.remove('_active')
                }
            }
            e.target.closest('.item-color__item').classList.add('_active');
        }
        for (const colorItem of colorItems) {
            const button = colorItem.querySelector('button');
            const color = button.dataset.color;
            button.style.backgroundColor = color;

            colorItem.addEventListener('click', changeColor);
        }

        const counter = (e) => {
            const decr = itemCount.querySelector('.decr');
            const out = itemCount.querySelector('.out');
            const incr = itemCount.querySelector('.incr');

            if (e.target == decr) {
                if (Number(out.innerHTML) > 1) {
                    out.innerHTML = Number(out.innerHTML) - 1;
                }
            }

            if (e.target == incr) {
                if (Number(out.innerHTML) < 100) {
                    out.innerHTML = Number(out.innerHTML) + 1;
                }
            }
        }
        itemCount.addEventListener('click', counter);
    }

    if (itemFeature) {
        const links = itemFeature.querySelectorAll('.item-feature__link a');
        const sections = itemFeature.querySelectorAll('.item-feature__section');

        const changeSection = (e) => {
            e.preventDefault();

            const target = e.target.closest('.item-feature__link');

            for (const link of links) {
                const target = link.closest('.item-feature__link');
                if (target.classList.contains('_active')) {
                    target.classList.remove('_active');
                }
            }
            target.classList.add('_active');

            const selector = e.target.getAttribute('href');
            for (const section of sections) {
                section.classList.remove('_active');

                const sectionSelector = section.dataset.id;
                if (sectionSelector === selector) {
                    section.classList.add('_active');
                }
            }
        }
        for (const link of links) {
            link.addEventListener('click', changeSection)
        }
    }
}();