const cart_init = function() {
    const form = document.querySelector('.item-product__inner')
    const toolbar = document.querySelector('.toolbar')
    const pageCart = document.querySelector('.cart')
    const checkout = document.querySelector('.billing')

    let cart = {
        items: [],
        total: 0
    }
    if (localStorage.getItem('cart')) cart = JSON.parse(localStorage.getItem('cart'))
    window.addEventListener('beforeunload', () => localStorage.setItem('cart', JSON.stringify(cart)))

    if (form) {
        const addToCartEvent = new CustomEvent('add_to_cart', {
            "detail": {
                target: form
            }
        })
        const submit = form.querySelector('button[data-role="add_cart"]')

        form.addEventListener('submit', (e) => {
            if (e.submitter !== submit) return
            e.preventDefault()
            dispatchEvent(addToCartEvent)
        })

        form.addEventListener('change', () => {
            if (submit.disabled) submit.disabled = false
        })
    }

    const getFormItem = (item, detail) => {
        const form = detail.target
        const submit = form.querySelector('button[data-role="add_cart"]')

        submit.disabled = true

        const data = new FormData(form)

        for (const [key, value] of data.entries()) {
            if (key === 'price' || key === 'count') item[key] = parseInt(value.replace(',', ''))
            else item[key] = value
        }
        item.subtotal = item.price * item.count

        return item
    }

    const getWishItem = (item, detail) => {
        const submit = detail.target
        const wishlist = detail.wishlist
        const product = submit.closest('.toolbar-wishlist__item')
        const heading = product.querySelector('.toolbar-wishlist__item-heading').innerHTML.trim()

        for (const wishItem of wishlist) {
            if (wishItem.heading === heading) {
                item = wishItem
                break
            }
        }
        item.size = null
        item.color = null
        item.count = 1
        item.subtotal = item.price * item.count

        return item
    }

    const addItemToCart = (item, index) => {
        for (const i of cart.items.keys()) {
            if (cart.items[i].heading === item.heading) {
                index = i
                break
            }
        }

        if (index !== null) cart.items[index] = item
        else cart.items.push(item)
    }

    const formatPrice = (price) => `Rs. ${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(price)}`

    const updateTotal = (total) => total.innerHTML = formatPrice(cart.total)

    const updateCartTotal = () => {
        cart.total = 0
        for (const cartItem of cart.items) cart.total += cartItem.subtotal
    }

    const updateCountIcon = () => {
        const countIcons = document.querySelectorAll('.header a[href="#cart"] .count')

        for (const icon of countIcons) {
            if (cart.items.length > 0) {
                icon.innerHTML = cart.items.length
                if (!icon.classList.contains('_active')) icon.classList.add('_active')
            } else {
                if (icon.classList.contains('_active')) icon.classList.remove('_active')
            }
        }
    }

    const getItemHTML = (selector, item) => {
        switch (selector) {
            case 'toolbarCart':
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
                        <button class="toolbar-cart__item-delete" data-role="remove_cart">
                            <img src="img/delete.svg" alt="delete icon">
                        </button>
                    </li>`
            case 'pageCart':
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
                            <button data-role="remove_cart"><img src="img/clear.svg" alt=""></button>
                        </td>
                    </tr>`
            case 'checkout':
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
                    </li>`
        }
    }

    const emptyList = (list) => {
        const heading = `<h2 class="toolbar-cart__empty toolbar-empty">${list.dataset.empty}</h2>`
        list.innerHTML = heading
    }

    const updateList = (list, itemHTML, totals) => {
        list.innerHTML = ''
        for (const item of cart.items) list.innerHTML += getItemHTML(itemHTML, item)
        for (const total of totals) updateTotal(total)
    }

    const removeItemFromCart = (item, heading) => {
        cart.items = cart.items.filter(item => item.heading != heading)
        item.remove()
    }

    const updateToolbarCart = () => {
        const list = toolbar.querySelector('.toolbar-cart__list')
        const total = toolbar.querySelector('.toolbar-cart .total')

        updateList(list, 'toolbarCart', [total])
        if (cart.items.length < 1) emptyList(list)

        const removeToolbarCartItem = (e) => {
            e.stopPropagation()
            const list = e.target.closest('.toolbar-cart__list')
            const item = e.target.closest('.toolbar-cart__item')
            const heading = item.querySelector('.toolbar-cart__item-heading').innerHTML.trim()

            removeItemFromCart(item, heading)
            updateCartTotal()
            updateTotal(total)
            updateCountIcon()
            if (cart.items.length < 1) emptyList(list)
            if (pageCart) updatePageCart()
            if (checkout) updateCheckoutCart()
        }
        const buttons = list.querySelectorAll('button[data-role="remove_cart"]')
        for (const button of buttons) button.addEventListener('click', removeToolbarCartItem)
    }

    const updatePageCart = () => {
        const list = pageCart.querySelector('.cart-table tbody')
        const subtotal = pageCart.querySelector('.subtotal')
        const total = pageCart.querySelector('.total')

        updateList(list, 'pageCart', [subtotal, total])

        const removePageCartItem = (e) => {
            const item = e.target.closest('.cart-item')
            const heading = item.querySelector('.cart-item__name').innerHTML.trim()

            removeItemFromCart(item, heading)
            updateCartTotal()
            updateTotal(subtotal)
            updateTotal(total)
            updateCountIcon()
            updateToolbarCart()
        }
        const buttons = list.querySelectorAll('button[data-role="remove_cart"]')
        for (const button of buttons) button.addEventListener('click', removePageCartItem)
    }

    const updateCheckoutCart = () => {
        const list = checkout.querySelector('.billing-table__list')
        const total = checkout.querySelector('.total')

        updateList(list, 'checkout', [total])
    }

    const openToolbar = (selector) => {
        const sections = toolbar.querySelectorAll('.toolbar-section')
        const targetSection = toolbar.querySelector(selector).closest('.toolbar-section')
        setTimeout(() => {
            for (const section of sections)
                if (section.classList.contains('_active')) section.classList.remove('_active')
            targetSection.classList.add('_active')

            if (!toolbar.classList.contains('_active')) {
                toolbar.classList.add('_active')
                document.body.classList.add('_lock')
            }
        }, 300)
    }

    const closeToolbar = (selector) => {
        const targetSection = toolbar.querySelector(selector).closest('.toolbar-section')
        if (targetSection.classList.contains('_active')) {
            targetSection.classList.remove('_active')
            toolbar.classList.remove('_active')
        }
    }

    if (pageCart) updatePageCart()
    if (checkout) updateCheckoutCart()
    updateCountIcon()
    updateToolbarCart()

    const addToCart = (e) => {
        const target = e.detail.target
        let item = {}
        let index = null

        if (target.classList.contains('item-product__inner')) {
            item = getFormItem(item, e.detail)
        } else if (target.classList.contains('toolbar-wishlist__item-button')) {
            item = getWishItem(item, e.detail)
        }

        addItemToCart(item, index)
        updateCartTotal()
        updateCountIcon()
        updateToolbarCart()
        closeToolbar('.toolbar-wishlist')
        openToolbar('.toolbar-cart')
        if (pageCart) updatePageCart()
        if (checkout) updateCheckoutCart()
    }
    window.addEventListener('add_to_cart', addToCart)
}()