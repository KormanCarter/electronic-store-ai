// Shopping Cart Class
class ShoppingCart {
    constructor() {
        this.items = [];
        this.loadCart();
    }

    // Security: HTML escaping function
    escapeHtml(unsafe) {
        if (typeof unsafe !== 'string') return unsafe;
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Add product to cart
    addProduct(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += product.quantity || 1;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: parseFloat(product.price),
                quantity: product.quantity || 1,
                image: product.image || ''
            });
        }
        
        this.saveCart();
        this.updateCartDisplay();
        return this.items;
    }

    // Remove product from cart
    removeProduct(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartDisplay();
        return this.items;
    }

    // Update product quantity
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        
        if (item) {
            if (quantity <= 0) {
                this.removeProduct(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
                this.updateCartDisplay();
            }
        }
        
        return this.items;
    }

    // Calculate subtotal for a single item
    getItemSubtotal(item) {
        return item.price * item.quantity;
    }

    // Calculate total price
    calculateTotal() {
        return this.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }

    // Calculate tax (assuming 8% tax rate)
    calculateTax(taxRate = 0.08) {
        return this.calculateTotal() * taxRate;
    }

    // Calculate grand total (subtotal + tax)
    calculateGrandTotal(taxRate = 0.08) {
        return this.calculateTotal() + this.calculateTax(taxRate);
    }

    // Get total number of items
    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    // Clear cart
    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartDisplay();
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('shoppingCart', JSON.stringify(this.items));
    }

    // Load cart from localStorage
    loadCart() {
        const savedCart = localStorage.getItem('shoppingCart');
        if (savedCart) {
            this.items = JSON.parse(savedCart);
        }
    }

    // Update cart display on page
    updateCartDisplay() {
        const cartContainer = document.getElementById('cart-items');
        const cartCount = document.getElementById('cart-count');
        const subtotalElement = document.getElementById('subtotal');
        const taxElement = document.getElementById('tax');
        const totalElement = document.getElementById('total');

        // Update cart count badge
        if (cartCount) {
            cartCount.textContent = this.getTotalItems();
        }

        // Update cart items display
        if (cartContainer) {
            if (this.items.length === 0) {
                const emptyP = document.createElement('p');
                emptyP.className = 'empty-cart';
                emptyP.textContent = 'Your cart is empty';
                cartContainer.innerHTML = '';
                cartContainer.appendChild(emptyP);
            } else {
                cartContainer.innerHTML = this.items.map(item => `
                    <div class="cart-item" data-id="${this.escapeHtml(item.id)}">
                        <div class="item-info">
                            ${item.image ? `<img src="${this.escapeHtml(item.image)}" alt="${this.escapeHtml(item.name)}" class="item-image">` : ''}
                            <div class="item-details">
                                <h3>${this.escapeHtml(item.name)}</h3>
                                <p class="item-price">$${item.price.toFixed(2)}</p>
                            </div>
                        </div>
                        <div class="item-controls">
                            <div class="quantity-controls">
                                <button class="qty-btn minus" data-item-id="${item.id}" data-action="decrease">-</button>
                                <input type="number" class="qty-input" value="${item.quantity}" min="1" data-item-id="${item.id}">
                                <button class="qty-btn plus" data-item-id="${item.id}" data-action="increase">+</button>
                            </div>
                            <p class="item-subtotal">$${this.getItemSubtotal(item).toFixed(2)}</p>
                            <button class="remove-btn" data-item-id="${item.id}">Remove</button>
                        </div>
                    </div>
                `).join('');
            }
        }

        // Update price summary
        if (subtotalElement) {
            subtotalElement.textContent = `$${this.calculateTotal().toFixed(2)}`;
        }
        if (taxElement) {
            taxElement.textContent = `$${this.calculateTax().toFixed(2)}`;
        }
        if (totalElement) {
            totalElement.textContent = `$${this.calculateGrandTotal().toFixed(2)}`;
        }
    }
}

// Payment Processing Class
class PaymentProcessor {
    constructor() {
        this.paymentInfo = {
            cardNumber: '',
            cardHolder: '',
            expiryDate: '',
            cvv: '',
            billingAddress: {
                street: '',
                city: '',
                state: '',
                zipCode: '',
                country: ''
            }
        };
    }

    // Validate credit card number (Luhn algorithm)
    validateCardNumber(cardNumber) {
        const cleaned = cardNumber.replace(/\s/g, '');
        
        if (!/^\d{13,19}$/.test(cleaned)) {
            return false;
        }

        let sum = 0;
        let isEven = false;

        for (let i = cleaned.length - 1; i >= 0; i--) {
            let digit = parseInt(cleaned[i]);

            if (isEven) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }

            sum += digit;
            isEven = !isEven;
        }

        return sum % 10 === 0;
    }

    // Validate expiry date
    validateExpiryDate(expiryDate) {
        const [month, year] = expiryDate.split('/');
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100;
        const currentMonth = currentDate.getMonth() + 1;

        const expMonth = parseInt(month);
        const expYear = parseInt(year);

        if (expMonth < 1 || expMonth > 12) {
            return false;
        }

        if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
            return false;
        }

        return true;
    }

    // Validate CVV
    validateCVV(cvv) {
        return /^\d{3,4}$/.test(cvv);
    }

    // Validate email
    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Get card type
    getCardType(cardNumber) {
        const cleaned = cardNumber.replace(/\s/g, '');
        
        if (/^4/.test(cleaned)) return 'Visa';
        if (/^5[1-5]/.test(cleaned)) return 'Mastercard';
        if (/^3[47]/.test(cleaned)) return 'American Express';
        if (/^6(?:011|5)/.test(cleaned)) return 'Discover';
        
        return 'Unknown';
    }

    // Set payment information
    setPaymentInfo(info) {
        this.paymentInfo = { ...this.paymentInfo, ...info };
        return this.paymentInfo;
    }

    // Process payment
    processPayment(amount) {
        return new Promise((resolve, reject) => {
            // Validate all fields
            const errors = [];

            if (!this.validateCardNumber(this.paymentInfo.cardNumber)) {
                errors.push('Invalid card number');
            }

            if (!this.paymentInfo.cardHolder || this.paymentInfo.cardHolder.trim().length < 3) {
                errors.push('Invalid cardholder name');
            }

            if (!this.validateExpiryDate(this.paymentInfo.expiryDate)) {
                errors.push('Invalid or expired card');
            }

            if (!this.validateCVV(this.paymentInfo.cvv)) {
                errors.push('Invalid CVV');
            }

            if (errors.length > 0) {
                reject({ success: false, errors });
                return;
            }

            // Simulate payment processing
            setTimeout(() => {
                const success = Math.random() > 0.1; // 90% success rate for demo
                
                if (success) {
                    resolve({
                        success: true,
                        transactionId: 'TXN' + Date.now(),
                        amount: amount,
                        cardType: this.getCardType(this.paymentInfo.cardNumber),
                        lastFourDigits: this.paymentInfo.cardNumber.slice(-4),
                        timestamp: new Date().toISOString()
                    });
                } else {
                    reject({
                        success: false,
                        errors: ['Payment declined. Please try another card.']
                    });
                }
            }, 2000);
        });
    }
}

// Initialize cart
const cart = new ShoppingCart();
const paymentProcessor = new PaymentProcessor();

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart display
    cart.updateCartDisplay();

    // Payment form handling
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckout);
    }

    // Card number formatting
    const cardNumberInput = document.getElementById('card-number');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }

    // Expiry date formatting
    const expiryInput = document.getElementById('expiry-date');
    if (expiryInput) {
        expiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
        });
    }
});

// Handle checkout form submission
async function handleCheckout(event) {
    event.preventDefault();

    const submitButton = event.target.querySelector('button[type="submit"]');
    const errorContainer = document.getElementById('payment-errors');
    
    // Disable submit button
    submitButton.disabled = true;
    submitButton.textContent = 'Processing...';
    
    // Clear previous errors
    if (errorContainer) {
        errorContainer.innerHTML = '';
    }

    // Collect payment information
    const paymentInfo = {
        cardNumber: document.getElementById('card-number')?.value || '',
        cardHolder: document.getElementById('card-holder')?.value || '',
        expiryDate: document.getElementById('expiry-date')?.value || '',
        cvv: document.getElementById('cvv')?.value || '',
        billingAddress: {
            street: document.getElementById('street')?.value || '',
            city: document.getElementById('city')?.value || '',
            state: document.getElementById('state')?.value || '',
            zipCode: document.getElementById('zip-code')?.value || '',
            country: document.getElementById('country')?.value || ''
        }
    };

    paymentProcessor.setPaymentInfo(paymentInfo);

    try {
        const result = await paymentProcessor.processPayment(cart.calculateGrandTotal());
        
        // Payment successful
        showPaymentSuccess(result);
        cart.clearCart();
        
    } catch (error) {
        // Payment failed
        showPaymentError(error.errors);
        
    } finally {
        // Re-enable submit button
        submitButton.disabled = false;
        submitButton.textContent = 'Complete Purchase';
    }
}

// Show payment success message
function showPaymentSuccess(result) {
    const successDiv = document.createElement('div');
    successDiv.className = 'payment-success';
    successDiv.innerHTML = `
        <h2>✓ Payment Successful!</h2>
        <p>Transaction ID: ${cart.escapeHtml(result.transactionId)}</p>
        <p>Amount: $${result.amount.toFixed(2)}</p>
        <p>Card: ${cart.escapeHtml(result.cardType)} ending in ${cart.escapeHtml(result.lastFourDigits)}</p>
        <p>Thank you for your purchase!</p>
    `;
    
    const container = document.getElementById('payment-result');
    if (container) {
        container.innerHTML = '';
        container.appendChild(successDiv);
    } else {
        alert('Payment Successful! Transaction ID: ' + result.transactionId);
    }
}

// Show payment error message
function showPaymentError(errors) {
    const errorContainer = document.getElementById('payment-errors');
    if (errorContainer) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'payment-errors';
        errorDiv.innerHTML = errors.map(error => `<p class="error">⚠ ${cart.escapeHtml(error)}</p>`).join('');
        errorContainer.innerHTML = '';
        errorContainer.appendChild(errorDiv);
    } else {
        alert('Payment Error: ' + errors.join(', '));
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ShoppingCart, PaymentProcessor, cart, paymentProcessor };
}

// Event delegation for cart actions
document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.getElementById('cart-items');
    
    if (cartContainer) {
        cartContainer.addEventListener('click', (e) => {
            const target = e.target;
            
            // Handle quantity decrease
            if (target.classList.contains('minus') && target.dataset.itemId) {
                const itemId = target.dataset.itemId;
                const currentQty = parseInt(target.closest('.quantity-controls').querySelector('.qty-input').value);
                cart.updateQuantity(itemId, currentQty - 1);
            }
            
            // Handle quantity increase
            else if (target.classList.contains('plus') && target.dataset.itemId) {
                const itemId = target.dataset.itemId;
                const currentQty = parseInt(target.closest('.quantity-controls').querySelector('.qty-input').value);
                cart.updateQuantity(itemId, currentQty + 1);
            }
            
            // Handle remove button
            else if (target.classList.contains('remove-btn') && target.dataset.itemId) {
                cart.removeProduct(target.dataset.itemId);
            }
        });
        
        // Handle quantity input change
        cartContainer.addEventListener('change', (e) => {
            if (e.target.classList.contains('qty-input') && e.target.dataset.itemId) {
                const newQty = parseInt(e.target.value);
                if (newQty > 0) {
                    cart.updateQuantity(e.target.dataset.itemId, newQty);
                }
            }
        });
    }
});
