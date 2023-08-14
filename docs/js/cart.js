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
            updateCountIcon(header);
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
            <div class="toolbar-cart__item-image">
                <img src="${item.image}" alt="${item.heading}">
            </div>
            <div class="toolbar-cart__item-content">
                <h4 class="toolbar-cart__item-heading">
                    ${item.heading}
                </h4>
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
            updateCountIcon(header);
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
                <input type="number" min="1" max="5" value="${item.count}">
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
    if (header && toolbar) updateToolbarCart();
    updateCountIcon();

    if (itemForm && header && toolbar) {
        // -----------------------------
        const switchB = document.querySelector('.switch');
        let toggler = true;

        switchB.addEventListener('click', () => {
            if (toggler) itemForm.querySelector('h1 + input').value = 'Maya sofa three seater', itemForm.querySelector('h1').innerHTML = 'Maya sofa three seater', itemForm.querySelector('.item-view__item img').setAttribute('src', 'img/products/product15.png'), itemForm.querySelector('.item-view__image img').setAttribute('src', 'img/products/product15.png'), itemForm.querySelector('.item-view__image input').value = 'img/products/product15.png', itemForm.querySelector('.item-about__price input').value = '115,000.00', itemForm.querySelector('.item-about__price p').innerHTML = 'Rs. 115,000.00', toggler = !toggler;
            else itemForm.querySelector('h1 + input').value = 'Asgaard sofa', itemForm.querySelector('h1').innerHTML = 'Asgaard sofa', itemForm.querySelector('.item-view__item img').setAttribute('src', 'img/item/item1.png'), itemForm.querySelector('.item-view__image img').setAttribute('src', 'img/item/item1.png'), itemForm.querySelector('.item-view__image input').value = 'img/item/item1.png', itemForm.querySelector('.item-about__price input').value = '250,000.00', itemForm.querySelector('.item-about__price p').innerHTML = 'Rs. 250,000.00', toggler = !toggler;
        })
        // -----------------------------

        const button = itemForm.querySelector('button');

        const formSubmit = (e) => {
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
}();