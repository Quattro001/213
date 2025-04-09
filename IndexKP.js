document.addEventListener('DOMContentLoaded', function() {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartList = document.querySelector('.cart-items');
    const totalElement = document.querySelector('.total span');
    const productDetailsModal = document.getElementById('product-details-modal');
    const cartModal = document.getElementById('cart-modal');
    const closeButtons = document.querySelectorAll('.close');
    const addToCartModalButton = document.getElementById('add-to-cart-modal');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    function saveCartToStorage() {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }

    updateCart();

    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', function() {
            const product = this.closest('.product');
            const productId = product.getAttribute('data-id');
            const productName = product.querySelector('h3').textContent;
            const productDescription = product.querySelector('p').textContent;
            const productPriceText = product.querySelector('.price').textContent;
            const productPrice = parseFloat(productPriceText.replace(/[^0-9.]/g, ''));
            const productImage = product.querySelector('img').src;

            document.getElementById('modal-product-image').src = productImage;
            document.getElementById('modal-product-name').textContent = productName;
            document.getElementById('modal-product-description').textContent = productDescription;
            document.getElementById('modal-product-price').textContent = productPriceText;

            addToCartModalButton.dataset.id = productId;
            productDetailsModal.style.display = 'block';
        });
    });

    addToCartModalButton.addEventListener('click', function() {
        const productId = this.dataset.id;
        const product = document.querySelector(`.product[data-id="${productId}"]`);

        const productData = {
            id: productId,
            name: product.querySelector('h3').textContent,
            price: parseFloat(product.querySelector('.price').textContent.replace(/[^0-9.]/g, ''))
        };
        
        addToCart(productData);
    });

    function addToCart(productData) {
        cartItems.push(productData);
        updateCart();
        saveCartToStorage();

        addToCartModalButton.style.background = '#45a049';
        setTimeout(() => addToCartModalButton.style.background = '#4CAF50', 200);
    }

    document.querySelector('.open-cart').addEventListener('click', function() {
        updateCart();
        cartModal.style.display = 'block';
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            productDetailsModal.style.display = 'none';
            cartModal.style.display = 'none';
        });
    });

    window.addEventListener('click', function(event) {
        if (event.target === productDetailsModal) {
            productDetailsModal.style.display = 'none';
        }
        if (event.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const product = this.closest('.product');
            const productId = product.getAttribute('data-id');
            const productName = product.querySelector('h3').textContent;
            const productPriceText = product.querySelector('.price').textContent;
            const productPrice = parseFloat(productPriceText.replace(/[^0-9.]/g, ''));

            const productData = {
                id: productId,
                name: productName,
                price: productPrice
            };

            addToCart(productData);
        });
    });

    cartList.addEventListener('click', function(event) {
        if (event.target.classList.contains('remove-from-cart')) {
            const productId = event.target.getAttribute('data-id');
            const index = cartItems.findIndex(item => item.id === productId);
            if (index !== -1) {
                cartItems.splice(index, 1);
                updateCart();
                saveCartToStorage();
            }
        }
    });

    function updateCart() {
        cartList.innerHTML = '';
        let total = 0;

        cartItems.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${item.name} - ${item.price} руб.</span>
                <button class="remove-from-cart" data-id="${item.id}">Удалить</button>
            `;
            cartList.appendChild(li);
            total += item.price;
        });
        totalElement.textContent = total.toFixed(2);
    }
});