const cart_init = function() {
    const itemForm = document.querySelector('.item-product__inner');
    const header = document.querySelector('.header');
    const toolbar = document.querySelector('.toolbar');
    const toolbarCart = toolbar.querySelector('.toolbar-cart');
    const pageCart = document.querySelector('.cart');
    const checkout = document.querySelector('.billing');

    let cart = {
        items: [],
        total: 0
    };
    if (localStorage.getItem('cart')) cart = JSON.parse(localStorage.getItem('cart'));
    window.addEventListener('beforeunload', () => localStorage.setItem('cart', JSON.stringify(cart)))

    const formatPrice = (price) => {
        return `Rs. ${new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2
        }).format(price)}`
    }

    const updateCartTotal = () => {
        cart.total = 0;
        for (const cartItem of cart.items) {
            cart.total += cartItem.subtotal;
        }
    }

    const updateTotal = (total) => {
        total.innerHTML = formatPrice(cart.total);
    }

    const updateCountIcon = () => {
        const countIcons = header.querySelectorAll('a[href="#cart"] .count')

        for (const icon of countIcons) {
            if (cart.items.length > 0) {
                icon.innerHTML = cart.items.length;
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

    const updateToolbarCart = () => {
        const list = toolbarCart.querySelector('.toolbar-cart__list');
        const total = toolbarCart.querySelector('.total');

        list.innerHTML = '';
        for (const item of cart.items) {
            list.innerHTML += toolbarCartItemHTML(item);
        }
        updateTotal(total);

        const removeToolbarCartItem = (e) => {
            e.stopPropagation();
            const item = e.target.closest('.toolbar-cart__item');
            const heading = item.querySelector('.toolbar-cart__item-heading').innerHTML.trim();

            cart.items = cart.items.filter(item => item.heading != heading);
            updateCartTotal();

            item.remove();
            updateTotal(total);
            updateCountIcon();
            if (pageCart) updatePageCart();
            if (checkout) updateCheckoutCart();
        }
        const buttons = list.querySelectorAll('.toolbar-cart__item-delete');
        for (const button of buttons) {
            button.addEventListener('click', removeToolbarCartItem)
        }
    }

    const toolbarCartItemHTML = (item) => {
        return `
        <li class="toolbar-cart__item">
            <a href="product.html" class="toolbar-cart__item-image">
                <img src="${item.image}" alt="${item.heading}">
            </a>
            <div class="toolbar-cart__item-content">
                <a href="product.html" class="toolbar-cart__item-heading">
                    ${item.heading}
                </a>
                <div class="toolbar-cart__item-count">
                    <span class="count">${item.count}</span>
                    <span>X</span>
                    <span class="price">${formatPrice(item.price)}</span>
                </div>
            </div>
            <button class="toolbar-cart__item-delete">
                <img src="img/delete.svg" alt="delete icon">
            </button>
        </li>`;
    }

    const openToolbarCart = () => {
        const sections = toolbar.querySelectorAll('.toolbar-section');
        const cartSection = toolbarCart.closest('.toolbar-section');
        setTimeout(() => {
            for (const section of sections) {
                if (section.classList.contains('_active')) {
                    section.classList.remove('_active');
                }
            }
            cartSection.classList.add('_active');

            if (!toolbar.classList.contains('_active')) {
                toolbar.classList.add('_active');
                document.body.classList.add('_lock');
            }
        }, 300);
    }

    const closeToolbarWish = () => {
        const wishSection = toolbar.querySelector('.toolbar-wishlist');
        wishSection.classList.remove('_active');
        toolbar.classList.remove('_active');
    }

    const updatePageCart = () => {
        const list = pageCart.querySelector('.cart-table tbody');
        const subtotal = pageCart.querySelector('.subtotal');
        const total = pageCart.querySelector('.total');

        list.innerHTML = '';
        for (const item of cart.items) {
            list.innerHTML += pageCartItemHTML(item);
        }
        updateTotal(subtotal);
        updateTotal(total);

        const removePageCartItem = (e) => {
            const item = e.target.closest('.cart-item');
            const heading = item.querySelector('.cart-item__name').innerHTML.trim();

            cart.items = cart.items.filter(item => item.heading != heading);
            updateCartTotal();

            item.remove();
            updateTotal(subtotal);
            updateTotal(total);
            updateCountIcon();
            updateToolbarCart();
        }
        const buttons = list.querySelectorAll('.cart-item__remove button');
        for (const button of buttons) {
            button.addEventListener('click', removePageCartItem)
        }
    }

    const pageCartItemHTML = (item) => {
        return `
        <tr class="cart-item">
            <td class="cart-item__image">
                <img src="${item.image}" alt="${item.heading}">
            </td>
            <td class="cart-item__name">
                ${item.heading}
            </td>
            <td class="cart-item__price">
                ${formatPrice(item.price)}
            </td>
            <td class="cart-item__quantity">
                ${item.count}
            </td>
            <td class="cart-item__subtotal">
                ${formatPrice(item.subtotal)}
            </td>
            <td class="cart-item__remove">
                <button><img src="img/clear.svg" alt=""></button>
            </td>
        </tr>`;
    }

    const updateCheckoutCart = () => {
        const list = checkout.querySelector('.billing-table__list');
        const total = checkout.querySelector('.total');

        list.innerHTML = '';
        for (const item of cart.items) {
            list.innerHTML += checkoutCartItemHTML(item);
        }
        updateTotal(total);
    }

    const checkoutCartItemHTML = (item) => {
        return `
        <li class="billing-table__item">
            <div class="billing-table__heading row">
                <div><span>${item.heading}</span> x ${item.count}</div>
                <div>${formatPrice(item.price)}</div>
            </div>
            <div class="billing-table__subtotal row">
                <div>Subtotal</div>
                <div>${formatPrice(item.subtotal)}</div>
            </div>
        </li>`;
    }

    if (pageCart) updatePageCart();
    if (checkout) updateCheckoutCart();
    if (toolbar) updateToolbarCart();
    updateCountIcon();

    if (itemForm && header && toolbar) {
        const button = itemForm.querySelector('.item-about__button');

        const formSubmit = (e) => {
            if (!e.submitter.classList.contains('item-about__button')) return;

            e.preventDefault();
            button.disabled = true;

            const data = new FormData(itemForm);
            const item = {};
            let index = null;

            for (const [key, value] of data.entries()) {
                if (key === 'price' || key === 'count') item[key] = parseInt(value.replace(',', ''));
                else item[key] = value;
            }
            item.subtotal = item.price * item.count;

            for (const i of cart.items.keys()) {
                if (cart.items[i].heading === item.heading) {
                    index = i;
                    break;
                }
            }

            if (index !== null) cart.items[index] = item;
            else cart.items.push(item)
            updateCartTotal();

            updateCountIcon();
            updateToolbarCart();
            openToolbarCart();
        }
        itemForm.addEventListener('submit', formSubmit)

        const formChange = () => button.disabled = false;
        itemForm.addEventListener('change', formChange)
    }

    if (toolbar) {
        const addWishToCart = (e) => {
            const wishlist = e.detail.wishlist;
            const HTMLitem = e.detail.target.closest('.toolbar-wishlist__item');
            const heading = HTMLitem.querySelector('.toolbar-wishlist__item-heading').innerHTML.trim();
            let item = {};
            let index = null;

            for (const wishItem of wishlist) {
                if (wishItem.heading === heading) {
                    item = wishItem;
                    break;
                }
            }
            item.size = null;
            item.color = null;
            item.count = 1;
            item.subtotal = item.price * item.count;

            for (const i of cart.items.keys()) {
                if (cart.items[i].heading === item.heading) {
                    index = i;
                    break;
                }
            }

            if (index !== null) cart.items[index] = item;
            else cart.items.push(item)
            updateCartTotal();

            updateCountIcon();
            updateToolbarCart();
            closeToolbarWish();
            openToolbarCart();
            if (pageCart) updatePageCart();
            if (checkout) updateCheckoutCart();
        }
        window.addEventListener('add_to_cart', addWishToCart)
    }
}();