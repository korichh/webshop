const wishlist_init = function () {
    const header = document.querySelector('.header');
    const itemForm = document.querySelector('.item-product__inner');
    const toolbar = document.querySelector('.toolbar');
    const toolbarWishlist = toolbar.querySelector('.toolbar-wishlist');
    const productForms = document.querySelectorAll('.products-item__wrapper');

    let wishlist = [];
    if (localStorage.getItem('wishlist')) wishlist = JSON.parse(localStorage.getItem('wishlist'));
    window.addEventListener('beforeunload', () => localStorage.setItem('wishlist', JSON.stringify(wishlist)))

    const formatPrice = (price) => {
        return `Rs. ${new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2
        }).format(price)}`
    }

    const updateWishButton = () => {
        const wishButton = itemForm.querySelector('.favorite-button');
        wishButton.classList.toggle('_active');
    }

    const updateProductWishButton = (button) => {
        button.classList.toggle('_active');
    }

    const updateWishIcon = () => {
        const wishIcons = header.querySelectorAll('a[href="#favorite"] .wish')

        for (const icon of wishIcons) {
            if (wishlist.length > 0) {
                icon.innerHTML = wishlist.length;
                if (!icon.classList.contains('_active')) {
                    icon.classList.add('_active')
                }
            } else {
                if (icon.classList.contains('_active')) {
                    icon.classList.remove('_active')
                }
            }
        }
    }

    const updateToolbarWishlist = () => {
        const list = toolbarWishlist.querySelector('.toolbar-wishlist__list');

        list.innerHTML = '';
        for (const item of wishlist) {
            list.innerHTML += toolbarWishlistItemHTML(item);
        }

        const removeToolbarWishlistItem = (e) => {
            e.stopPropagation();
            const item = e.target.closest('.toolbar-wishlist__item');
            const heading = item.querySelector('.toolbar-wishlist__item-heading').innerHTML.trim();

            wishlist = wishlist.filter(item => item.heading != heading);

            item.remove();
            updateWishIcon();
            if (itemForm) {
                const itemHeading = itemForm.querySelector('.item-about__heading h1').innerHTML.trim();
                if (itemHeading === heading) updateWishButton();
            }
            if (productForms.length > 0) {
                for (const form of productForms) {
                    const productHeading = form.querySelector('.products-item__heading a').textContent.trim();
                    if (productHeading === heading) updateProductWishButton(form.querySelector('.products-item__favorite'));
                }
            }
        }
        const removeButtons = list.querySelectorAll('.toolbar-wishlist__item-delete');
        for (const button of removeButtons) {
            button.addEventListener('click', removeToolbarWishlistItem)
        }

        const cartButtons = list.querySelectorAll('.toolbar-wishlist__item-button');
        for (const button of cartButtons) {
            const event = new CustomEvent('add_to_cart', { "detail": { target: button, wishlist: wishlist } });
            button.addEventListener('click', () => dispatchEvent(event))
        }
    }

    const toolbarWishlistItemHTML = (item) => {
        return `
        <li class="toolbar-wishlist__item">
            <div class="toolbar-wishlist__item-inner">
                <a href="product.html" class="toolbar-wishlist__item-image">
                    <img src="${item.image}" alt="${item.heading}">
                </a>
                <div class="toolbar-wishlist__item-content">
                    <a href="product.html" class="toolbar-wishlist__item-heading">
                        ${item.heading}
                    </a>
                    <div class="toolbar-wishlist__item-count">
                        <span class="price">${formatPrice(item.price)}</span>
                    </div>
                </div>
                <button class="toolbar-wishlist__item-delete">
                    <img src="img/delete.svg" alt="delete icon">
                </button>
            </div>
            <button class="toolbar-wishlist__item-button">
                Add To Cart
            </button>
        </li>`;
    }

    const openToolbarWishlist = () => {
        const sections = toolbar.querySelectorAll('.toolbar-section');
        const wishlistSection = toolbarWishlist.closest('.toolbar-section');
        setTimeout(() => {
            for (const section of sections) {
                if (section.classList.contains('_active')) {
                    section.classList.remove('_active');
                }
            }
            wishlistSection.classList.add('_active');

            if (!toolbar.classList.contains('_active')) {
                toolbar.classList.add('_active');
                document.body.classList.add('_lock');
            }
        }, 300);
    }

    if (toolbar) updateToolbarWishlist();
    if (productForms.length > 0) {
        for (const form of productForms) {
            const productHeading = form.querySelector('.products-item__heading a').textContent.trim();

            if (wishlist.find(item => item.heading === productHeading)) {
                updateProductWishButton(form.querySelector('.products-item__favorite'));
            }
        }
    }
    updateWishIcon();

    if (itemForm) {
        const itemHeading = itemForm.querySelector('.item-about__heading h1').innerHTML.trim();
        for (const wishItem of wishlist) {
            if (wishItem.heading === itemHeading) {
                updateWishButton();
                break;
            }
        }

        const formSubmit = (e) => {
            if (!e.submitter.classList.contains('favorite-button')) return;

            e.preventDefault();

            const data = new FormData(itemForm);
            const item = {};
            let same = null;

            for (const [key, value] of data.entries()) {
                if (key === 'image' || key === 'heading') item[key] = value;
                else if (key === 'price') item[key] = parseInt(value.replace(',', ''));
            }

            for (const wishItem of wishlist) {
                if (wishItem.heading === item.heading) {
                    same = true;
                    break;
                }
            }
            if (!same) {
                wishlist.push(item);
                openToolbarWishlist();
            } else {
                wishlist = wishlist.filter(wishItem => wishItem.heading !== item.heading)
            }

            updateWishIcon();
            updateWishButton();
            updateToolbarWishlist();
        }
        itemForm.addEventListener('submit', formSubmit)
    }

    if (productForms.length > 0) {
        const formSubmit = (e) => {
            if (!e.submitter.classList.contains('products-item__favorite')) return;

            e.preventDefault();

            const data = new FormData(e.target);
            const item = {};
            let same = null;

            for (const [key, value] of data.entries()) {
                if (key === 'price') item[key] = parseInt(value.replace(',', ''));
                else item[key] = value;
            }

            for (const wishItem of wishlist) {
                if (wishItem.heading === item.heading) {
                    same = true;
                    break;
                }
            }
            if (!same) {
                wishlist.push(item);
                openToolbarWishlist();
            } else {
                wishlist = wishlist.filter(wishItem => wishItem.heading !== item.heading)
            }

            updateWishIcon();
            updateProductWishButton(e.submitter);
            updateToolbarWishlist();
        }
        for (const form of productForms) {
            form.addEventListener('submit', formSubmit);
        }
    }
}();