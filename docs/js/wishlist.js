const wishlist_init = function() {
    const form = document.querySelector('.item-product__inner')
    const toolbar = document.querySelector('.toolbar')
    const productForms = document.querySelectorAll('.products-item__wrapper')

    let wishlist = []
    if (localStorage.getItem('wishlist')) wishlist = JSON.parse(localStorage.getItem('wishlist'))
    window.addEventListener('beforeunload', () => localStorage.setItem('wishlist', JSON.stringify(wishlist)))

    if (form) {
        const addToWishlistEvent = new CustomEvent('add_to_wishlist', {
            "detail": {
                target: form
            }
        })
        const submit = form.querySelector('button[data-role="wishlist"]')

        form.addEventListener('submit', (e) => {
            if (e.submitter !== submit) return
            e.preventDefault()
            dispatchEvent(addToWishlistEvent)
        })
    }

    if (productForms.length > 0) {
        for (const form of productForms) {
            const addToWishlistEvent = new CustomEvent('add_to_wishlist', {
                "detail": {
                    target: form
                }
            })
            const submit = form.querySelector('button[data-role="wishlist"]')

            form.addEventListener('submit', (e) => {
                if (e.submitter !== submit) return
                e.preventDefault()
                dispatchEvent(addToWishlistEvent)
            })
        }
    }

    const getFormItem = (item, detail) => {
        const form = detail.target
        const data = new FormData(form)

        for (const [key, value] of data.entries()) {
            if (key === 'price' || key === 'count') item[key] = parseInt(value.replace(',', ''))
            else item[key] = value
        }
        item.subtotal = item.price * item.count

        return item
    }

    const getProductsItem = (item, detail) => {
        const form = detail.target
        const data = new FormData(form)

        for (const [key, value] of data.entries()) {
            if (key === 'price') item[key] = parseInt(value.replace(',', ''))
            else item[key] = value
        }
        item.size = null
        item.color = null
        item.count = 1
        item.subtotal = item.price * item.count

        return item
    }

    const addItemToWishlist = (item, index) => {
        for (const i of wishlist.keys()) {
            if (wishlist[i].heading === item.heading) {
                index = i
                break
            }
        }

        if (index === null) wishlist.push(item)
        else wishlist = wishlist.filter(wishItem => wishItem.heading !== item.heading)
    }

    const formatPrice = (price) => `Rs. ${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(price)}`

    const updateWishlistIcon = () => {
        const wishlistIcons = document.querySelectorAll('.header a[href="#favorite"] .wish')

        for (const icon of wishlistIcons) {
            if (wishlist.length > 0) {
                icon.innerHTML = wishlist.length
                if (!icon.classList.contains('_active')) icon.classList.add('_active')
            } else {
                if (icon.classList.contains('_active')) icon.classList.remove('_active')
            }
        }
    }

    const updateWishlistButton = (form) => {
        const button = form.querySelector('button[data-role="wishlist"]')
        const heading = form.querySelector('input[name="heading"]').value

        button.classList.remove('_active')
        for (const item of wishlist) {
            if (item.heading === heading) {
                button.classList.add('_active')
                break
            }
        }
    }

    const getItemHTML = (selector, item) => {
        switch (selector) {
            case 'toolbarWishlist':
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
                            <button class="toolbar-wishlist__item-delete" data-role="remove_wishlist">
                                <img src="img/delete.svg" alt="delete icon">
                            </button>
                        </div>
                        <button class="toolbar-wishlist__item-button" data-role="add_cart">
                            Add To Cart
                        </button>
                    </li>`
        }
    }

    const emptyList = (list) => {
        const heading = `<h2 class="toolbar-wishlist__empty toolbar-empty">${list.dataset.empty}</h2>`
        list.innerHTML = heading
    }

    const updateList = (list, itemHTML) => {
        list.innerHTML = ''
        for (const item of wishlist) list.innerHTML += getItemHTML(itemHTML, item)
    }

    const removeItemFromWishlist = (item, heading) => {
        wishlist = wishlist.filter(item => item.heading != heading)
        item.remove()
    }

    const updateToolbarWishlist = () => {
        const list = toolbar.querySelector('.toolbar-wishlist__list')

        updateList(list, 'toolbarWishlist')
        if (wishlist.length < 1) emptyList(list)

        const removeToolbarWishlistItem = (e) => {
            e.stopPropagation()
            const list = e.target.closest('.toolbar-wishlist__list')
            const item = e.target.closest('.toolbar-wishlist__item')
            const heading = item.querySelector('.toolbar-wishlist__item-heading').innerHTML.trim()

            removeItemFromWishlist(item, heading)
            updateWishlistIcon()
            if (wishlist.length < 1) emptyList(list)
            if (form) updateWishlistButton(form)
            if (productForms.length > 0) {
                for (const form of productForms) updateWishlistButton(form)
            }
        }
        const removeButtons = list.querySelectorAll('button[data-role="remove_wishlist"]')
        for (const button of removeButtons) button.addEventListener('click', removeToolbarWishlistItem)

        const cartButtons = list.querySelectorAll('button[data-role="add_cart"]')
        for (const button of cartButtons) {
            const addToCartEvent = new CustomEvent('add_to_cart', {
                "detail": {
                    target: button,
                    wishlist: wishlist
                }
            })
            button.addEventListener('click', () => dispatchEvent(addToCartEvent))
        }
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

    if (form) updateWishlistButton(form)
    if (productForms.length > 0) {
        for (const form of productForms) updateWishlistButton(form)
    }
    updateWishlistIcon()
    updateToolbarWishlist()

    const addToWishlist = (e) => {
        const target = e.detail.target
        let item = {}
        let index = null

        if (target.classList.contains('item-product__inner')) {
            item = getFormItem(item, e.detail)
        } else if (target.classList.contains('products-item__wrapper')) {
            item = getProductsItem(item, e.detail)
        }

        addItemToWishlist(item, index)
        updateWishlistIcon()
        updateWishlistButton(target)
        updateToolbarWishlist()
        if (target.querySelector('button[data-role="wishlist"]').classList.contains('_active')) openToolbar('.toolbar-wishlist')
    }
    window.addEventListener('add_to_wishlist', addToWishlist)
}()