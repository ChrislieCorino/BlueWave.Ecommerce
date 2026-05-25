(function() {
            // ---------- DATA (products) ----------
            const products = [
                { id: 'p1', name: 'Wireless Headphones', price: 79.99, icon: 'fa-headphones' },
                { id: 'p2', name: 'Smart Watch Series', price: 199.99, icon: 'fa-clock' },
                { id: 'p3', name: 'Bluetooth Speaker', price: 45.50, icon: 'fa-music' },
                { id: 'p4', name: 'Laptop Backpack', price: 32.90, icon: 'fa-bag' },
                { id: 'p5', name: '4K Action Camera', price: 210.00, icon: 'fa-camera' },
                { id: 'p6', name: 'Tablet Pro', price: 329.99, icon: 'fa-tablet-alt' },
                { id: 'p7', name: 'Tablet Pro', price: 329.99, icon: 'fa-tablet-alt' },
                { id: 'p8', name: 'Tablet Pro', price: 329.99, icon: 'fa-tablet-alt' },
                { id: 'p9', name: 'Tablet Pro', price: 329.99, icon: 'fa-tablet-alt' },
                { id: 'p10', name: 'Tablet Pro', price: 329.99, icon: 'fa-tablet-alt' },
                { id: 'p11', name: 'Tablet Pro', price: 329.99, icon: 'fa-tablet-alt' },
                { id: 'p12', name: 'Tablet Pro', price: 329.99, icon: 'fa-tablet-alt' }
            ];

            // ---------- Global state ----------
            let currentUser = null; // { name, email }
            let cart = [];          // { id, name, price, quantity }
            let wishlist = [];       // product ids (strings)

            // UI elements
            const productGrid = document.getElementById('productGrid');
            const cartCountSpan = document.getElementById('cartCount');
            const wishlistCountSpan = document.getElementById('wishlistCount');
            const cartPanel = document.getElementById('cartPanel');
            const wishlistPanel = document.getElementById('wishlistPanel');
            const cartItemsDiv = document.getElementById('cartItemsList');
            const wishlistItemsDiv = document.getElementById('wishlistItemsList');
            const cartTotalSpan = document.getElementById('cartTotal');
            const welcomeBanner = document.getElementById('welcomeBanner');
            const userDisplaySpan = document.getElementById('userDisplayName');
            const signInModal = document.getElementById('signInModal');
            const signUpModal = document.getElementById('signUpModal');
            const proofContainer = document.getElementById('proofContainer');
            const proofText = document.getElementById('proofText');

            // ---------- render product grid ----------
            function renderProducts() {
                productGrid.innerHTML = '';
                products.forEach(prod => {
                    const card = document.createElement('div');
                    card.className = 'product-card';
                    card.innerHTML = `
                        <div class="product-img"><i class="fas ${prod.icon}"></i></div>
                        <div class="product-title">${prod.name}</div>
                        <div class="product-price">R${prod.price.toFixed(2)}</div>
                        <div class="card-actions">
                            <button class="btn-blue add-to-cart" data-id="${prod.id}"><i class="fas fa-cart-plus"></i> Cart</button>
                            <button class="btn-yellow-sm add-to-wishlist" data-id="${prod.id}"><i class="fas fa-heart"></i></button>
                        </div>
                    `;
                    productGrid.appendChild(card);
                });

                // attach events
                document.querySelectorAll('.add-to-cart').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const pid = e.currentTarget.dataset.id;
                        addToCart(pid);
                    });
                });
                document.querySelectorAll('.add-to-wishlist').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const pid = e.currentTarget.dataset.id;
                        addToWishlist(pid);
                    });
                });
            }

            //find product by id
            function getProduct(pid){
                return products.find(p => p.id === pid);
            }

            //----------------cart-----------------
            function addToCart(pid){
                const prod = getProduct(pid);
                if (!prod) return;
                const existing = cart.find(item => item.id === pid);
                if (existing){
                    existing.quantity += 1;
                }
                else{
                    cart.push({id: prod.id, name: prod.name, price: prod.price, quantity: 1});
                }
                updateCounters();
                renderCartPanel();
            }

            function removeFromCart(pid){
                cart = cart.filter(item => item.id !== pid);
                updateCounters();
                renderCartPanel();
            }

            function updateCounters(){
                const cartQty = cart.reduce((acc, i) => acc + i.quantity, 0);
                cartCountSpan.innerText = cartQty;
                wishlistCountSpan.innerText = wishlist.length;
            }

            function renderCartPanel(){
                if(!cartItemsDiv) return;
                if(cart.length === 0){
                    cartItemsDiv.innerHTML = '<p style = "color:gray; padding: 1rem;"> Your cart is empty!!</p>';
                    cartTotalSpan,innerText = '0.00';
                    return;
                }
                let html = '';
                let total = 0;
                cart.forEach(item => {
                    total += item.price * item.quantity;
                    html += `
                        <div class = "panel-item">
                            <i class = "fas fa-box"></i>
                            <div class = "panel-item-info">
                                <p>${item.name}</p>
                                <small>R${item.price.toFixed(2)} x ${item.quantity}</small>
                            </div>
                            <button class = "remove-item" data-id = "${item.id}"><i class = "fas fa-trash-alt"></i></button>
                        </div>
                    `;
                });
                cartItemsDiv.innerHTML = html;
                cartTotalSpan.innerText = total.toFixed(2);
                //remove buttons
                document.querySelectorAll('#cartItemsList .remove-item').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const pid = e.currentTarget.dataset.id;
                        removeFromCart(pid);
                    });
                });
            }

            //----------------wishlist---------------------------
            function addToWishlist(pid){
                if (!wishlist.includes(pid)){
                    wishlist.push(pid);
                }
                else{
                    wishlist = wishlist.filter(id => id !== pid);//toggle/remove
                }
                updateCounters();
                renderWishlistPanel();
            }

            function renderWishlistPanel(){
                if (!wishlistItemsDiv) return;
                if (wishlist.length === 0){
                    wishlistItemsDiv.innerHTML = '<p style = "color:gray; padding: 1rem;">Wishlist is empty!!</p>';
                    return;
                }
                let html = '';
                wishlist.forEach(pid => {
                    const prod = getProduct(pid);
                    if (!prod) return;
                    html += `
                    <div class = "panel-item">
                        <i classs = "fas ${prod.icon}"></i>
                        <div class = panel-item-info">
                            <p>${prod.name}</p>
                            <small>R${prod.price.toFixed(2)}</small>
                        </div>
                    <button class = "remove-item wishlist-remove" data-id ="${prod.id}><i class"fas fa-times"></i></button>
                    </div>
                    `;
                });
                wishlistItemsDiv.innerHTML = html;
                document.querySelectorAll('#wishlistItemsList .wishlist-remove').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const pid = e.currentTarget.dataset.id;
                        wishlist = wishlist.filter(id => id !== pid);
                        updateCounters();
                        renderWishlistPanel();
                    });
                });
            }

            //-------------------payment & proof------------------------
            document.getElementById('payButton').addEventListener('click', function(){
                const cardNum = document.getElementById('cardNumber').value.trim();
                const cardName = document.getElementById('cardName').value.trim();
                const expiry = document.getElementById('cardExpiry').value.trim();
                if (!cardNum || !cardName || !expiry){
                    alert('Your cart is empty - add items before payment.');
                    return;
                }

                //calculate total
                const total = cart.reduce((acc, i) => acc + i.price * i.quantity, 0).toFixed(2);
                const ref = 'POF-' + Math.random().toString(36).substring(2, 12).toUpperCase();
                const date = new Date().toLocaleString();

                //proof of payment linked to bank acc
                proofText.innerText = `[${date}] REF: ${ref} | Amount: R${total} paid by card ****${cardNum.slice(-4)} | Beneficiary Business (Investec Banking ****1234) | Status: SETTLED`;
                proofContainer.style.display = 'block';

                //an option i could use to clear cart after payment
                 cart = []; updateCounters(); renderCartPanel(); 
            });

            //--------------------------user authentication modals & switching ---------------------------
            const openSignIn = document.getElementById('showSignInModalBtn');
            const closeSignIn = document.getElementById('closeSignIn');
            const closeSignUp = document.getElementById('closeSignUp');
            const switchToSignUp = document.getElementById('switchToSignUp');
            const switchToSignIn = document.getElementById('switchToSignIn');

            openSignIn.addEventListener('click', () => signInModal.style.display = 'flex');
            closeSignIn.addEventListener('click', () => signInModal.style.display = 'none');
            closeSignUp.addEventListener('click', () => signUpModal.style.display = 'none');
            switchToSignUp.addEventListener('click', (e) => {
                e.preventDefault();
                signInModal.style.display = 'none';
                signUpModal.style.display = 'flex';
            });

            //sign up
            document.getElementById('signUpBtn').addEventListener('click', () => {
                const name = document.getElementById('signUpName').value.trim();
                const email = document.getElementById('signUpEmail').value.trim();
                const pass = document.getElementById('signUpPassword').value;
                if(name && email && pass){
                    currentUser = {name, email};
                    updateUIForUser();
                    signUpModal.style.display = 'none';
                }
                else{
                    alert('Please fill all fields');
                }
            });

            //sign in 
            document.getElementById('signInBtn').addEventListener('click', () => {
                const email = document.getElementById('signInEmail').value.trim();
                const pass = document.getElementById('signInPassword').value;
                if (email && pass){
                    currentUser = {name: email.split('@')[0], email};
                    updateUIForUser();
                    signInModal.style.display = 'none';
                }
                else{
                    alert('Enter credentials');
                }
            });

            document.getElementById('logoutBtn').addEventListener('click', () => {
                currentUser = null;
                updateUIForUser();
            });

            function updateUIForUser(){
                if(currentUser){
                    welcomeBanner.style.display = 'flex';
                    userDisplaySpan.innerText = currentUser.name;
                }
                else{
                    welcomeBanner.style.display = 'none';
                }
            }

            //close modals if click outside
            document.getElementById('openCartBtn').addEventListener('click', () => cartPanel.classList.add('open'));
            document.getElementById('openWishlistBtn').addEventListener('click', () => wishlistPanel.classList.add('open'));
            document.getElementById('closeCart').addEventListener('click', () => cartPanel.classList.remove('open'));
            document.getElementById('closeWishlist').addEventListener('click', () => wishlistPanel.classList.remove('open'));

            //-------------------------------search option--------------------------
            function searchProducts(){
            let term=document.getElementById("searchInput").value.toLowerCase()
            let filtered=products.filter(prod=>prod.name.toLowerCase().includes(term))
            renderProducts(filtered)
            }

            //initial render
            renderProducts();
            searchProducts();
            updateCounters();
            renderCartPanel();
            renderWishlistPanel();

        })();
