// Product Data
const products = [
    {
        id: 1,
        name: "MacBook Pro 16\"",
        category: "Laptops",
        price: 2499,
        rating: 4.8,
        reviews: 342,
        icon: "💻",
        description: "Powerful laptop with M2 chip"
    },
    {
        id: 2,
        name: "Dell XPS 15",
        category: "Laptops",
        price: 1899,
        rating: 4.6,
        reviews: 256,
        icon: "💻",
        description: "Premium Windows laptop"
    },
    {
        id: 3,
        name: "iPhone 15 Pro",
        category: "Smartphones",
        price: 999,
        rating: 4.9,
        reviews: 523,
        icon: "📱",
        description: "Latest flagship iPhone"
    },
    {
        id: 4,
        name: "Samsung Galaxy S24",
        category: "Smartphones",
        price: 899,
        rating: 4.7,
        reviews: 412,
        icon: "📱",
        description: "Premium Android smartphone"
    },
    {
        id: 5,
        name: "Sony WH-1000XM5",
        category: "Headphones",
        price: 399,
        rating: 4.9,
        reviews: 678,
        icon: "🎧",
        description: "Best noise-canceling headphones"
    },
    {
        id: 6,
        name: "AirPods Pro",
        category: "Headphones",
        price: 249,
        rating: 4.8,
        reviews: 892,
        icon: "🎧",
        description: "Premium wireless earbuds"
    },
    {
        id: 7,
        name: "iPad Pro 12.9\"",
        category: "Tablets",
        price: 1199,
        rating: 4.8,
        reviews: 445,
        icon: "📱",
        description: "Professional tablet with M2"
    },
    {
        id: 8,
        name: "Samsung Galaxy Tab S9",
        category: "Tablets",
        price: 899,
        rating: 4.6,
        reviews: 287,
        icon: "📱",
        description: "Premium Android tablet"
    },
    {
        id: 9,
        name: "Canon EOS R6",
        category: "Cameras",
        price: 2499,
        rating: 4.9,
        reviews: 234,
        icon: "📷",
        description: "Professional mirrorless camera"
    },
    {
        id: 10,
        name: "Sony A7 IV",
        category: "Cameras",
        price: 2799,
        rating: 4.9,
        reviews: 189,
        icon: "📷",
        description: "Full-frame mirrorless camera"
    },
    {
        id: 11,
        name: "Apple Watch Ultra",
        category: "Smartwatches",
        price: 799,
        rating: 4.7,
        reviews: 456,
        icon: "⌚",
        description: "Premium smartwatch"
    },
    {
        id: 12,
        name: "Samsung Galaxy Watch 6",
        category: "Smartwatches",
        price: 349,
        rating: 4.6,
        reviews: 378,
        icon: "⌚",
        description: "Advanced fitness tracking"
    },
    {
        id: 13,
        name: "HP Spectre x360",
        category: "Laptops",
        price: 1599,
        rating: 4.5,
        reviews: 198,
        icon: "💻",
        description: "2-in-1 convertible laptop"
    },
    {
        id: 14,
        name: "Google Pixel 8 Pro",
        category: "Smartphones",
        price: 899,
        rating: 4.7,
        reviews: 321,
        icon: "📱",
        description: "AI-powered smartphone"
    },
    {
        id: 15,
        name: "Bose QuietComfort 45",
        category: "Headphones",
        price: 329,
        rating: 4.7,
        reviews: 567,
        icon: "🎧",
        description: "Premium comfort headphones"
    }
];

// State Management
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wallet = JSON.parse(localStorage.getItem('wallet')) || { balance: 0, transactions: [] };
let currentFilter = 'All';
let currentSort = 'default';
let searchQuery = '';

// Authentication check
const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
if (!currentUser) {
    window.location.href = 'index.html';
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Display user info in header
    if (currentUser) {
        const userGreeting = document.querySelector('.user-greeting');
        if (userGreeting) {
            userGreeting.textContent = `${currentUser.name}`;
        }
    }
    
    renderProducts();
    updateCartCount();
    updateWalletDisplay();
    
    // Search Button
    document.getElementById('searchBtn')?.addEventListener('click', searchProducts);
    document.getElementById('searchInput')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchProducts();
    });
    
    // Navigation Buttons
    document.getElementById('toggleAIChatBtn')?.addEventListener('click', toggleAIChat);
    document.getElementById('toggleWalletBtn')?.addEventListener('click', toggleWallet);
    document.getElementById('toggleCartBtn')?.addEventListener('click', toggleCart);
    document.getElementById('floatingAIBtn')?.addEventListener('click', toggleAIChat);
    
    // Hero Button
    document.getElementById('shopNowBtn')?.addEventListener('click', scrollToProducts);
    
    // Category Cards
    document.querySelectorAll('.category-grid .category-card').forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            filterByCategory(category);
            document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    // Filter Buttons
    document.querySelectorAll('.filters .filter-btn').forEach(btn => {
        const category = btn.dataset.category;
        if (category) {
            btn.addEventListener('click', () => filterByCategory(category));
        }
    });
    
    // Sort Select
    document.getElementById('sortSelect')?.addEventListener('change', sortProducts);
    
    // Modal Close Buttons
    document.getElementById('closeCartBtn')?.addEventListener('click', toggleCart);
    document.getElementById('closeWalletBtn')?.addEventListener('click', toggleWallet);
    document.getElementById('closeAIPopupBtn')?.addEventListener('click', toggleAIChat);
    
    // AI Chat
    document.getElementById('aiSendBtn')?.addEventListener('click', sendAIMessage);
    document.getElementById('aiInput')?.addEventListener('keypress', handleAIKeyPress);
    document.querySelectorAll('.suggestion-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const message = chip.dataset.ask;
            askAI(message);
        });
    });
    
    // Wallet Buttons
    document.getElementById('addFundsBtn')?.addEventListener('click', showAddFunds);
    document.getElementById('withdrawBtn')?.addEventListener('click', showWithdraw);
    document.getElementById('addToWalletBtn')?.addEventListener('click', addFunds);
    document.getElementById('cancelAddFundsBtn')?.addEventListener('click', hideAddFunds);
    
    // Logout Button
    document.getElementById('logoutBtn')?.addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('LS_SESSION_KEY');
        window.location.href = 'index.html';
    });
    
    // Quick Amount Buttons
    document.querySelectorAll('.quick-amount-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const amount = parseFloat(btn.dataset.amount);
            setAmount(amount);
        });
    });
});

// Render Products
function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    let filteredProducts = [...products];

    // Apply category filter
    if (currentFilter !== 'All') {
        filteredProducts = filteredProducts.filter(p => p.category === currentFilter);
    }

    // Apply search filter
    if (searchQuery) {
        filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    // Apply sorting
    switch (currentSort) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
    }

    // Render products
    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <div class="product-image">${product.icon}</div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-rating">
                    <span class="stars">${getStarRating(product.rating)}</span>
                    <span class="rating-text">${product.rating} (${product.reviews})</span>
                </div>
                <div class="product-price">$${product.price.toLocaleString()}</div>
                <div class="product-actions">
                    <button class="btn-add-cart" data-product-id="${product.id}">Add to Cart</button>
                    <button class="btn-buy-now" data-product-id="${product.id}">Buy Now</button>
                </div>
            </div>
        </div>
    `).join('');

    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">
                <div style="font-size: 4rem; margin-bottom: 1rem;">🔍</div>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search terms</p>
            </div>
        `;
    }
}

// Get Star Rating
function getStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '⭐'.repeat(fullStars);
    if (hasHalfStar) stars += '⭐';
    return stars;
}

// Filter by Category
function filterByCategory(category) {
    currentFilter = category;
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent === category) {
            btn.classList.add('active');
        }
    });
    
    renderProducts();
}

// Sort Products
function sortProducts() {
    const sortSelect = document.getElementById('sortSelect');
    currentSort = sortSelect.value;
    renderProducts();
}

// Search Products
function searchProducts() {
    const searchInput = document.getElementById('searchInput');
    searchQuery = searchInput.value;
    renderProducts();
}

// Add event listener for Enter key in search
document.getElementById('searchInput')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchProducts();
    }
});

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    saveCart();
    updateCartCount();
    showToast(`${product.name} added to cart!`);
}

// Buy Now
function buyNow(productId) {
    addToCart(productId);
    setTimeout(() => {
        toggleCart();
    }, 500);
}

// Update Cart Count
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

// Toggle Cart Modal
function toggleCart() {
    const modal = document.getElementById('cartModal');
    const isActive = modal.classList.contains('active');
    
    if (isActive) {
        modal.classList.remove('active');
    } else {
        modal.classList.add('active');
        renderCart();
    }
}

// Close modals when clicking outside
document.getElementById('cartModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'cartModal') {
        toggleCart();
    }
});

document.getElementById('walletModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'walletModal') {
        toggleWallet();
    }
});

// Render Cart
function renderCart() {
    const cartContent = document.getElementById('cartContent');
    
    if (cart.length === 0) {
        cartContent.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <h3>Your cart is empty</h3>
                <p>Add some products to get started!</p>
            </div>
        `;
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartContent.innerHTML = `
        <div class="cart-items">
            ${cart.map(item => `
                <div class="cart-item" data-item-id="${item.id}">
                    <div class="cart-item-image">${item.icon}</div>
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">$${item.price.toLocaleString()}</div>
                        <div class="cart-item-controls">
                            <button class="qty-btn qty-decrease" data-item-id="${item.id}">−</button>
                            <span class="qty-display">${item.quantity}</span>
                            <button class="qty-btn qty-increase" data-item-id="${item.id}">+</button>
                        </div>
                    </div>
                    <button class="remove-btn" data-item-id="${item.id}">Remove</button>
                </div>
            `).join('')}
        </div>
        <div class="cart-total">
            <div class="total-row">
                <span>Total:</span>
                <span class="total-amount">$${total.toLocaleString()}</span>
            </div>
            <button class="checkout-btn">Proceed to Checkout</button>
        </div>
    `;
}

// Update Quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    saveCart();
    updateCartCount();
    renderCart();
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    renderCart();
    showToast('Item removed from cart', '#ef4444');
}

// Save Cart to LocalStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Checkout
function checkout() {
    if (cart.length === 0) return;
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Check if user wants to use wallet
    if (wallet.balance >= total) {
        const useWallet = confirm(`Use wallet balance?\n\nTotal: $${total.toFixed(2)}\nWallet Balance: $${wallet.balance.toFixed(2)}\n\nClick OK to pay with wallet, or Cancel to pay another way.`);
        
        if (useWallet) {
            wallet.balance -= total;
            wallet.transactions.unshift({
                type: 'debit',
                amount: total,
                description: `Purchase (${cart.length} items)`,
                date: new Date().toISOString()
            });
            saveWallet();
            updateWalletDisplay();
            
            // Clear cart
            cart = [];
            saveCart();
            updateCartCount();
            toggleCart();
            
            showToast('Order placed successfully with wallet! 🎉', '#10b981');
            return;
        }
    }
    
    alert(`🎉 Order Placed Successfully!\n\nTotal: $${total.toLocaleString()}\nItems: ${cart.length}\n\nThank you for shopping with TechHub!`);
    
    // Clear cart
    cart = [];
    saveCart();
    updateCartCount();
    toggleCart();
    
    showToast('Order placed successfully! 🎉', '#10b981');
}

// Show Toast Notification
function showToast(message, color = '#10b981') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.textContent = message;
    toast.style.background = color;
    toast.classList.add('active');
    
    setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}

// Scroll to Products
function scrollToProducts() {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

// Toggle AI Chat Popup
function toggleAIChat() {
    const aiPopup = document.getElementById('aiPopup');
    const isActive = aiPopup.classList.contains('active');
    
    if (isActive) {
        aiPopup.classList.remove('active');
    } else {
        aiPopup.classList.add('active');
        // Focus on input when opened
        setTimeout(() => {
            document.getElementById('aiInput')?.focus();
        }, 100);
    }
}

// AI Chat Functionality
function sendAIMessage() {
    const input = document.getElementById('aiInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    addAIMessage(message, 'user');
    input.value = '';
    
    // Simulate AI response
    setTimeout(() => {
        const response = getAIResponse(message);
        addAIMessage(response, 'bot');
    }, 500);
}

function addAIMessage(text, sender) {
    const messagesContainer = document.getElementById('aiMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-message ${sender}`;
    messageDiv.textContent = text;
    
    // Remove suggestions after first message
    const suggestions = messagesContainer.querySelector('.ai-suggestions');
    if (suggestions && sender === 'user') {
        suggestions.remove();
    }
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function askAI(question) {
    document.getElementById('aiInput').value = question;
    sendAIMessage();
}

function handleAIKeyPress(event) {
    if (event.key === 'Enter') {
        sendAIMessage();
    }
}

function getAIResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Product recommendations
    if (lowerMessage.includes('laptop') || lowerMessage.includes('programming') || lowerMessage.includes('coding')) {
        return "For programming, I'd recommend the **MacBook Pro 16\"** ($2,499) with its powerful M2 chip, or the **Dell XPS 15** ($1,899) for a great Windows option. Both offer excellent performance for development work!";
    }
    
    if (lowerMessage.includes('phone') || lowerMessage.includes('smartphone')) {
        if (lowerMessage.includes('compare') || lowerMessage.includes('vs')) {
            return "**iPhone 15 Pro** ($999) offers superior camera quality and iOS ecosystem integration with a 4.9 rating. **Samsung Galaxy S24** ($899) provides more customization, better multitasking, and costs $100 less with a 4.7 rating. Both are excellent choices!";
        }
        return "Our top smartphones are the **iPhone 15 Pro** ($999, rated 4.9⭐) and **Samsung Galaxy S24** ($899, rated 4.7⭐). The iPhone excels in camera and ecosystem, while Samsung offers more customization!";
    }
    
    if (lowerMessage.includes('headphone') || lowerMessage.includes('audio')) {
        if (lowerMessage.includes('noise') || lowerMessage.includes('canceling')) {
            return "For noise-canceling, the **Sony WH-1000XM5** ($399, rated 4.9⭐) is the best choice with industry-leading ANC. **AirPods Pro** ($249, rated 4.8⭐) are great for Apple users and more portable!";
        }
        return "Our top headphones: **Sony WH-1000XM5** ($399) - best noise-canceling, **AirPods Pro** ($249) - best for Apple users, and **Bose QuietComfort 45** ($329) - most comfortable!";
    }
    
    if (lowerMessage.includes('camera') || lowerMessage.includes('photo')) {
        if (lowerMessage.includes('beginner')) {
            return "For beginners, I'd suggest starting with the **Canon EOS R6** ($2,499) - it's user-friendly yet professional. Great autofocus and 4.9⭐ rating. Perfect for learning photography!";
        }
        return "Our cameras: **Canon EOS R6** ($2,499, 4.9⭐) and **Sony A7 IV** ($2,799, 4.9⭐). Both are professional-grade mirrorless cameras with excellent image quality!";
    }
    
    if (lowerMessage.includes('tablet')) {
        return "Top tablets: **iPad Pro 12.9\"** ($1,199, 4.8⭐) - best for creative work with M2 chip, and **Samsung Galaxy Tab S9** ($899, 4.6⭐) - great Android alternative with S Pen!";
    }
    
    if (lowerMessage.includes('watch') || lowerMessage.includes('smartwatch')) {
        return "For smartwatches: **Apple Watch Ultra** ($799, 4.7⭐) - best for iPhone users with advanced fitness features, **Samsung Galaxy Watch 6** ($349, 4.6⭐) - great for Android users!";
    }
    
    if (lowerMessage.includes('budget') || lowerMessage.includes('cheap') || lowerMessage.includes('affordable')) {
        return "Great budget options: **AirPods Pro** ($249), **Samsung Galaxy Watch 6** ($349), and **Bose QuietComfort 45** ($329). All offer premium features at reasonable prices!";
    }
    
    if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
        return "Our prices range from $249 (AirPods Pro) to $2,799 (Sony A7 IV). Use the sort filters to view products by price. Free shipping on orders over $500!";
    }
    
    if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery')) {
        return "We offer **free standard shipping** (5-7 days) on orders over $500. Express shipping (2-3 days) is $29.99. All items ship within 24 hours!";
    }
    
    if (lowerMessage.includes('return') || lowerMessage.includes('warranty')) {
        return "We offer a **30-day return policy** and **1-year warranty** on all electronics. Extended warranties available at checkout. Returns are free and easy!";
    }
    
    if (lowerMessage.includes('payment') || lowerMessage.includes('pay')) {
        return "We accept all major credit cards, PayPal, Apple Pay, and Google Pay. You can also use your wallet balance for quick checkout!";
    }
    
    if (lowerMessage.includes('best') || lowerMessage.includes('recommend')) {
        return "Our top-rated products: **Sony WH-1000XM5** headphones (4.9⭐), **iPhone 15 Pro** (4.9⭐), and **Canon EOS R6** (4.9⭐). What type of device are you looking for?";
    }
    
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
        return "You're welcome! Happy to help you find the perfect electronics. Let me know if you have any other questions! 😊";
    }
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        return "Hello! 👋 How can I assist you today? I can help with product recommendations, comparisons, pricing, and more!";
    }
    
    // Default response
    return "I can help you find the perfect electronics! Try asking about specific products like laptops, phones, headphones, cameras, tablets, or smartwatches. I can also help with comparisons, prices, shipping, and returns!";
}

// Wallet Functions
function toggleWallet() {
    const modal = document.getElementById('walletModal');
    const isActive = modal.classList.contains('active');
    
    if (isActive) {
        modal.classList.remove('active');
        hideAddFunds();
    } else {
        modal.classList.add('active');
        updateWalletDisplay();
        renderTransactionHistory();
    }
}

function updateWalletDisplay() {
    const balanceElements = [
        document.getElementById('walletBalance'),
        document.getElementById('walletBalanceDisplay')
    ];
    
    balanceElements.forEach(el => {
        if (el) {
            el.textContent = `$${wallet.balance.toFixed(2)}`;
        }
    });
}

function showAddFunds() {
    document.getElementById('addFundsSection').style.display = 'block';
    document.getElementById('addFundsAmount').focus();
}

function hideAddFunds() {
    document.getElementById('addFundsSection').style.display = 'none';
    document.getElementById('addFundsAmount').value = '';
}

function setAmount(amount) {
    document.getElementById('addFundsAmount').value = amount;
}

function addFunds() {
    const amountInput = document.getElementById('addFundsAmount');
    const amount = parseFloat(amountInput.value);
    
    if (!amount || amount <= 0) {
        showToast('Please enter a valid amount', '#ef4444');
        return;
    }
    
    wallet.balance += amount;
    wallet.transactions.unshift({
        type: 'credit',
        amount: amount,
        description: 'Funds Added',
        date: new Date().toISOString()
    });
    
    saveWallet();
    updateWalletDisplay();
    renderTransactionHistory();
    hideAddFunds();
    
    showToast(`$${amount.toFixed(2)} added to wallet!`, '#10b981');
}

function showWithdraw() {
    if (wallet.balance <= 0) {
        showToast('Insufficient balance', '#ef4444');
        return;
    }
    
    const amount = prompt(`Enter amount to withdraw (Max: $${wallet.balance.toFixed(2)}):`);
    
    if (amount === null) return;
    
    const withdrawAmount = parseFloat(amount);
    
    if (!withdrawAmount || withdrawAmount <= 0) {
        showToast('Invalid amount', '#ef4444');
        return;
    }
    
    if (withdrawAmount > wallet.balance) {
        showToast('Insufficient balance', '#ef4444');
        return;
    }
    
    wallet.balance -= withdrawAmount;
    wallet.transactions.unshift({
        type: 'debit',
        amount: withdrawAmount,
        description: 'Withdrawal',
        date: new Date().toISOString()
    });
    
    saveWallet();
    updateWalletDisplay();
    renderTransactionHistory();
    
    showToast(`$${withdrawAmount.toFixed(2)} withdrawn successfully!`, '#10b981');
}

function renderTransactionHistory() {
    const container = document.getElementById('transactionHistory');
    
    if (wallet.transactions.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
                No transactions yet
            </div>
        `;
        return;
    }
    
    container.innerHTML = wallet.transactions.map(transaction => {
        const date = new Date(transaction.date);
        const isCredit = transaction.type === 'credit';
        const icon = isCredit ? '💰' : '🏦';
        const sign = isCredit ? '+' : '-';
        const className = isCredit ? 'positive' : 'negative';
        
        return `
            <div class="transaction-item">
                <div class="transaction-type">
                    <span>${icon}</span>
                    <div>
                        <div style="font-weight: 600;">${transaction.description}</div>
                        <div style="font-size: 0.85rem; color: var(--text-muted);">
                            ${date.toLocaleDateString()} ${date.toLocaleTimeString()}
                        </div>
                    </div>
                </div>
                <div class="transaction-amount ${className}">
                    ${sign}$${transaction.amount.toFixed(2)}
                </div>
            </div>
        `;
    }).join('');
}

function saveWallet() {
    localStorage.setItem('wallet', JSON.stringify(wallet));
}



// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Escape to close modals
    if (e.key === 'Escape') {
        const cartModal = document.getElementById('cartModal');
        const walletModal = document.getElementById('walletModal');
        const aiPopup = document.getElementById('aiPopup');
        
        if (cartModal.classList.contains('active')) {
            toggleCart();
        } else if (walletModal.classList.contains('active')) {
            toggleWallet();
        } else if (aiPopup.classList.contains('active')) {
            toggleAIChat();
        }
    }
    
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('searchInput')?.focus();
    }
    
    // Ctrl/Cmd + / to toggle AI chat
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        toggleAIChat();
    }
});

// Event Delegation for Product Grid Actions
document.getElementById('productsGrid')?.addEventListener('click', (e) => {
    const addCartBtn = e.target.closest('.btn-add-cart');
    const buyNowBtn = e.target.closest('.btn-buy-now');
    
    if (addCartBtn) {
        const productId = parseInt(addCartBtn.dataset.productId);
        addToCart(productId);
    }
    
    if (buyNowBtn) {
        const productId = parseInt(buyNowBtn.dataset.productId);
        buyNow(productId);
    }
});

// Event Delegation for Cart Actions
document.getElementById('cartContent')?.addEventListener('click', (e) => {
    const decreaseBtn = e.target.closest('.qty-decrease');
    const increaseBtn = e.target.closest('.qty-increase');
    const removeBtn = e.target.closest('.remove-btn');
    const checkoutBtn = e.target.closest('.checkout-btn');
    
    if (decreaseBtn) {
        const itemId = parseInt(decreaseBtn.dataset.itemId);
        updateQuantity(itemId, -1);
    }
    
    if (increaseBtn) {
        const itemId = parseInt(increaseBtn.dataset.itemId);
        updateQuantity(itemId, 1);
    }
    
    if (removeBtn) {
        const itemId = parseInt(removeBtn.dataset.itemId);
        removeFromCart(itemId);
    }
    
    if (checkoutBtn) {
        checkout();
    }
});