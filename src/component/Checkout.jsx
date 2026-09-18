import React, { useState, useContext, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheck, 
  faShoppingBag, 
  faTruck, 
  faCreditCard,
  faCheckCircle,
  faSpinner,
  faArrowLeft,
  faArrowRight,
  faReceipt,
  faLock
} from '@fortawesome/free-solid-svg-icons';
import { CartWishlistContext } from './CartWishlistContext';
import './Checkout.css';

const Checkout = ({ onContinueShopping, onViewOrder, onNavigateHome }) => {
  const { cart, updateCartQuantity, removeFromCart, clearCart } = useContext(CartWishlistContext);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  
  // Form states
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  });
  
  const [billingInfo, setBillingInfo] = useState({
    sameAsShipping: true,
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  });
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });
  
  const [upiId, setUpiId] = useState('');

  // Enhanced price helper functions
  const getItemPrice = (item) => {
    const price = item.originalPrice || item.finalPrice || item.price || 0;
    const numericPrice = Number(price);
    
    if (isNaN(numericPrice)) {
      console.warn('Invalid price found for item:', item);
      
      if (typeof price === 'string') {
        const extractedPrice = price.replace(/[^\d.]/g, '');
        const parsedPrice = parseFloat(extractedPrice);
        return isNaN(parsedPrice) ? 0 : parsedPrice;
      }
      
      return 0;
    }
    
    return numericPrice;
  };

  const getItemTotal = (item) => {
    const price = getItemPrice(item);
    const quantity = item.quantity || 1;
    return price * quantity;
  };

  // Enhanced cart calculations
  const subtotal = cart.reduce((total, item) => {
    return total + getItemTotal(item);
  }, 0);
  
  const shipping = subtotal > 5000 ? 0 : 100;
  const tax = subtotal * 0.03;
  const total = subtotal + shipping + tax;

  // Enhanced price formatting
  const formatPrice = (price) => {
    const validPrice = Number(price);
    if (isNaN(validPrice)) {
      console.warn('Invalid price in formatPrice:', price);
      return '₹0';
    }
    return `₹${validPrice.toLocaleString('en-IN')}`;
  };

  // Handle quantity changes
  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateCartQuantity(productId, newQuantity);
    }
  };

  // Handle form input changes
  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (billingInfo.sameAsShipping) {
      setBillingInfo(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBillingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSameAsShippingChange = (e) => {
    const isChecked = e.target.checked;
    setBillingInfo(prev => ({
      ...prev,
      sameAsShipping: isChecked,
      ...(isChecked ? shippingInfo : {})
    }));
  };

  const handleCardInfoChange = (e) => {
    const { name, value } = e.target;
    setCardInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validate current step
  const validateStep = (step) => {
    switch (step) {
      case 1:
        const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'pincode'];
        for (let field of requiredFields) {
          if (!shippingInfo[field]?.trim()) {
            return false;
          }
        }
        if (!billingInfo.sameAsShipping) {
          const billingFields = ['firstName', 'lastName', 'address', 'city', 'state', 'pincode'];
          for (let field of billingFields) {
            if (!billingInfo[field]?.trim()) {
              return false;
            }
          }
        }
        return true;

      case 2:
        if (!paymentMethod) return false;
        if (paymentMethod === 'card') {
          const cardFields = ['cardNumber', 'cardName', 'expiryDate', 'cvv'];
          for (let field of cardFields) {
            if (!cardInfo[field]?.trim()) return false;
          }
        }
        if (paymentMethod === 'upi' && !upiId.trim()) return false;
        return true;

      case 3:
        return true;

      default:
        return false;
    }
  };

  // Navigation between steps
  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      alert('Please fill in all required fields before proceeding.');
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Enhanced place order function
  const handlePlaceOrder = async () => {
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const orderItems = cart.map(item => {
        const itemPrice = getItemPrice(item);
        const itemTotal = getItemTotal(item);
        
        return {
          ...item,
          originalPrice: itemPrice,
          finalPrice: itemPrice,
          price: itemPrice,
          itemPrice: itemPrice,
          totalPrice: itemTotal,
          quantity: item.quantity || 1
        };
      });

      const orderSubtotal = orderItems.reduce((total, item) => total + item.totalPrice, 0);
      const orderShipping = orderSubtotal > 5000 ? 0 : 100;
      const orderTax = orderSubtotal * 0.03;
      const orderTotal = orderSubtotal + orderShipping + orderTax;
      
      const order = {
        id: `ORD${Date.now()}`,
        date: new Date().toISOString(),
        items: orderItems,
        shippingInfo,
        billingInfo: billingInfo.sameAsShipping ? shippingInfo : billingInfo,
        paymentMethod,
        paymentDetails: paymentMethod === 'card' ? cardInfo : paymentMethod === 'upi' ? { upiId } : {},
        subtotal: orderSubtotal,
        shipping: orderShipping,
        tax: orderTax,
        total: orderTotal,
        status: 'confirmed'
      };
      
      console.log('Order placed with items:', orderItems);
      console.log('Order totals:', { orderSubtotal, orderShipping, orderTax, orderTotal });
      
      setOrderDetails(order);
      setOrderSuccess(true);
      clearCart();
      
    } catch (error) {
      console.error('Order failed:', error);
      alert('Order failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Debug cart data on mount and cart changes
  useEffect(() => {
    console.log('=== CART DEBUG INFO ===');
    console.log('Cart items:', cart);
    
    if (cart.length > 0) {
      console.log('=== ITEM PRICE ANALYSIS ===');
      cart.forEach((item, index) => {
        const analyzedItem = {
          index,
          name: item.title || item.name,
          id: item.id,
          originalPrice: item.originalPrice,
          finalPrice: item.finalPrice,
          price: item.price,
          calculatedPrice: getItemPrice(item),
          calculatedTotal: getItemTotal(item),
          quantity: item.quantity
        };
        console.log(`Item ${index}:`, analyzedItem);
      });
      
      console.log('=== CALCULATED TOTALS ===');
      console.log('Subtotal:', subtotal);
      console.log('Shipping:', shipping);
      console.log('Tax:', tax);
      console.log('Total:', total);
    }
  }, [cart]);

  // If cart is empty
  if (cart.length === 0 && !orderSuccess) {
    return (
      <div className="checkout-process-section">
        <div className="checkout-process-banner">
          <div className="checkout-process-banner-image">
            <div className="checkout-process-banner-bg"></div>
          </div>
          <div className="checkout-process-banner-overlay">
            <div className="checkout-process-banner-content">
              <h1 className="checkout-process-main-heading">Checkout</h1>
              <div className="checkout-process-breadcrumb">
                <span onClick={onContinueShopping} style={{cursor: 'pointer'}}>Home</span>
                <span className="breadcrumb-divider">&gt;</span>
                <span onClick={onContinueShopping} style={{cursor: 'pointer'}}>Cart</span>
                <span className="breadcrumb-divider">&gt;</span>
                <span className="breadcrumb-current">Checkout</span>
              </div>
            </div>
          </div>
        </div>

        <div className="checkout-process-container">
          <div className="checkout-empty-cart-state">
            <FontAwesomeIcon icon={faShoppingBag} className="checkout-empty-cart-icon" />
            <h2 className="checkout-empty-cart-title">Your Cart is Empty</h2>
            <p className="checkout-empty-cart-message">
              Looks like you haven't added any items to your cart yet.
            </p>
            <button 
              className="checkout-continue-shopping-btn"
              onClick={onContinueShopping}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-process-section">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="checkout-loading-overlay">
          <div className="checkout-loading-spinner"></div>
        </div>
      )}

      {/* Order Success Modal */}
      {orderSuccess && orderDetails && (
        <div className="checkout-order-success-modal">
          <div className="checkout-order-success-content">
            <FontAwesomeIcon icon={faCheckCircle} className="checkout-success-icon" />
            <h2 className="checkout-order-success-title">Order Placed Successfully!</h2>
            <p className="checkout-order-success-message">
              Thank you for your order. Your order number is <strong>{orderDetails.id}</strong>. 
              You will receive an email confirmation shortly.
            </p>
            
            <div className="checkout-order-details-summary">
              <div className="checkout-order-detail-row">
                <span>Order Total:</span>
                <span>{formatPrice(orderDetails.total)}</span>
              </div>
              <div className="checkout-order-detail-row">
                <span>Payment Method:</span>
                <span>{orderDetails.paymentMethod.toUpperCase()}</span>
              </div>
              <div className="checkout-order-detail-row">
                <span>Delivery Address:</span>
                <span>{orderDetails.shippingInfo.city}, {orderDetails.shippingInfo.state}</span>
              </div>
            </div>

            <div className="checkout-order-success-actions">
              <button 
                className="checkout-view-order-btn"
                onClick={() => onViewOrder(orderDetails)}
              >
                View Order Details
              </button>
              <button 
                className="checkout-continue-shopping-success-btn"
                onClick={onContinueShopping}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Banner */}
      <div className="checkout-process-banner">
        <div className="checkout-process-banner-image">
          <div className="checkout-process-banner-bg"></div>
        </div>
        <div className="checkout-process-banner-overlay">
          <div className="checkout-process-banner-content">
            <h1 className="checkout-process-main-heading">Checkout</h1>
            <div className="checkout-process-breadcrumb">
              <span onClick={onContinueShopping} style={{cursor: 'pointer'}}>Home</span>
              <span className="breadcrumb-divider">&gt;</span>
              <span onClick={onContinueShopping} style={{cursor: 'pointer'}}>Cart</span>
              <span className="breadcrumb-divider">&gt;</span>
              <span className="breadcrumb-current">Checkout</span>
            </div>
          </div>
        </div>
      </div>

      <div className="checkout-process-container">
        {/* Checkout Steps */}
        <div className="checkout-process-steps">
          <div className="checkout-process-step">
            <div className={`checkout-step-number ${currentStep >= 1 ? 'checkout-active' : ''} ${currentStep > 1 ? 'checkout-completed' : ''}`}>
              {currentStep > 1 ? <FontAwesomeIcon icon={faCheck} /> : '1'}
            </div>
            <span className={`checkout-step-label ${currentStep >= 1 ? 'checkout-active' : ''}`}>Shipping</span>
            <div className={`checkout-step-connector ${currentStep >= 2 ? 'checkout-active' : ''}`}></div>
          </div>
          
          <div className="checkout-process-step">
            <div className={`checkout-step-number ${currentStep >= 2 ? 'checkout-active' : ''} ${currentStep > 2 ? 'checkout-completed' : ''}`}>
              {currentStep > 2 ? <FontAwesomeIcon icon={faCheck} /> : '2'}
            </div>
            <span className={`checkout-step-label ${currentStep >= 2 ? 'checkout-active' : ''}`}>Payment</span>
            <div className={`checkout-step-connector ${currentStep >= 3 ? 'checkout-active' : ''}`}></div>
          </div>
          
          <div className="checkout-process-step">
            <div className={`checkout-step-number ${currentStep >= 3 ? 'checkout-active' : ''}`}>
              {currentStep > 3 ? <FontAwesomeIcon icon={faCheck} /> : '3'}
            </div>
            <span className={`checkout-step-label ${currentStep >= 3 ? 'checkout-active' : ''}`}>Review</span>
          </div>
        </div>

        <div className="checkout-process-wrapper">
          {/* Checkout Forms */}
          <div className="checkout-process-content">
            {/* Step 1: Shipping Information */}
            <div className={`checkout-process-step-content ${currentStep === 1 ? 'checkout-active' : ''}`}>
              <h2 className="checkout-step-title">
                <FontAwesomeIcon icon={faTruck} style={{marginRight: '10px'}} />
                Shipping Information
              </h2>
              
              <div className="checkout-form-row">
                <div className="checkout-form-group">
                  <label className="checkout-form-label checkout-required">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={shippingInfo.firstName}
                    onChange={handleShippingChange}
                    className="checkout-form-input"
                    required
                  />
                </div>
                <div className="checkout-form-group">
                  <label className="checkout-form-label checkout-required">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={shippingInfo.lastName}
                    onChange={handleShippingChange}
                    className="checkout-form-input"
                    required
                  />
                </div>
              </div>

              <div className="checkout-form-row">
                <div className="checkout-form-group">
                  <label className="checkout-form-label checkout-required">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={shippingInfo.email}
                    onChange={handleShippingChange}
                    className="checkout-form-input"
                    required
                  />
                </div>
                <div className="checkout-form-group">
                  <label className="checkout-form-label checkout-required">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleShippingChange}
                    className="checkout-form-input"
                    required
                  />
                </div>
              </div>

              <div className="checkout-form-group">
                <label className="checkout-form-label checkout-required">Address</label>
                <textarea
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleShippingChange}
                  className="checkout-form-textarea"
                  required
                />
              </div>

              <div className="checkout-form-row">
                <div className="checkout-form-group">
                  <label className="checkout-form-label checkout-required">City</label>
                  <input
                    type="text"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleShippingChange}
                    className="checkout-form-input"
                    required
                  />
                </div>
                <div className="checkout-form-group">
                  <label className="checkout-form-label checkout-required">State</label>
                  <input
                    type="text"
                    name="state"
                    value={shippingInfo.state}
                    onChange={handleShippingChange}
                    className="checkout-form-input"
                    required
                  />
                </div>
                <div className="checkout-form-group">
                  <label className="checkout-form-label checkout-required">PIN Code</label>
                  <input
                    type="text"
                    name="pincode"
                    value={shippingInfo.pincode}
                    onChange={handleShippingChange}
                    className="checkout-form-input"
                    required
                  />
                </div>
              </div>

              {/* Billing Information Section */}
              <div className="checkout-billing-section">
                <h3 className="checkout-billing-title">
                  <FontAwesomeIcon icon={faCreditCard} style={{marginRight: '10px'}} />
                  Billing Information
                </h3>
                
                <div className="checkout-billing-toggle">
                  <label>
                    <input
                      type="checkbox"
                      checked={billingInfo.sameAsShipping}
                      onChange={handleSameAsShippingChange}
                    />
                    Same as shipping information
                  </label>
                </div>

                {!billingInfo.sameAsShipping && (
                  <div className="checkout-billing-fields">
                    <div className="checkout-form-row">
                      <div className="checkout-form-group">
                        <label className="checkout-form-label checkout-required">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          value={billingInfo.firstName}
                          onChange={handleBillingChange}
                          className="checkout-form-input"
                          required
                        />
                      </div>
                      <div className="checkout-form-group">
                        <label className="checkout-form-label checkout-required">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={billingInfo.lastName}
                          onChange={handleBillingChange}
                          className="checkout-form-input"
                          required
                        />
                      </div>
                    </div>

                    <div className="checkout-form-group">
                      <label className="checkout-form-label checkout-required">Address</label>
                      <textarea
                        name="address"
                        value={billingInfo.address}
                        onChange={handleBillingChange}
                        className="checkout-form-textarea"
                        required
                      />
                    </div>

                    <div className="checkout-form-row">
                      <div className="checkout-form-group">
                        <label className="checkout-form-label checkout-required">City</label>
                        <input
                          type="text"
                          name="city"
                          value={billingInfo.city}
                          onChange={handleBillingChange}
                          className="checkout-form-input"
                          required
                        />
                      </div>
                      <div className="checkout-form-group">
                        <label className="checkout-form-label checkout-required">State</label>
                        <input
                          type="text"
                          name="state"
                          value={billingInfo.state}
                          onChange={handleBillingChange}
                          className="checkout-form-input"
                          required
                        />
                      </div>
                      <div className="checkout-form-group">
                        <label className="checkout-form-label checkout-required">PIN Code</label>
                        <input
                          type="text"
                          name="pincode"
                          value={billingInfo.pincode}
                          onChange={handleBillingChange}
                          className="checkout-form-input"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="checkout-process-actions">
                <button 
                  className="checkout-back-btn"
                  onClick={onContinueShopping}
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                  Continue Shopping
                </button>
                <button 
                  className="checkout-continue-btn"
                  onClick={handleNextStep}
                >
                  Continue to Payment
                  <FontAwesomeIcon icon={faArrowRight} />
                </button>
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className={`checkout-process-step-content ${currentStep === 2 ? 'checkout-active' : ''}`}>
              <h2 className="checkout-step-title">
                <FontAwesomeIcon icon={faCreditCard} style={{marginRight: '10px'}} />
                Payment Method
              </h2>
              
              <div className="checkout-payment-methods-horizontal">
                <label className={`checkout-payment-method ${paymentMethod === 'card' ? 'checkout-selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="checkout-payment-method-label">
                    <img 
                      src="https://images.seeklogo.com/logo-png/24/2/visa-logo-png_seeklogo-244624.png" 
                      alt="Credit Card" 
                      className="checkout-payment-icon"
                    />
                    Credit/Debit Card
                  </span>
                </label>

                <label className={`checkout-payment-method ${paymentMethod === 'upi' ? 'checkout-selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="checkout-payment-method-label">
                    <img 
                      src="https://logowik.com/content/uploads/images/upi-unified-payments-interface9346.logowik.com.webp" 
                      alt="UPI" 
                      className="checkout-payment-icon"
                    />
                    UPI
                  </span>
                </label>

                <label className={`checkout-payment-method ${paymentMethod === 'cod' ? 'checkout-selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="checkout-payment-method-label">
                    <FontAwesomeIcon icon={faReceipt} style={{marginRight: '8px', fontSize: '20px'}} />
                    Cash on Delivery
                  </span>
                </label>
              </div>

              {/* Card Payment Details */}
              {paymentMethod === 'card' && (
                <div className="checkout-payment-details checkout-active">
                  <h4 className="checkout-payment-details-title">Card Information</h4>
                  <div className="checkout-card-form">
                    <div className="checkout-form-group">
                      <label className="checkout-form-label checkout-required">Card Number</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={cardInfo.cardNumber}
                        onChange={handleCardInfoChange}
                        className="checkout-form-input"
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                        required
                      />
                    </div>
                    <div className="checkout-form-group">
                      <label className="checkout-form-label checkout-required">Name on Card</label>
                      <input
                        type="text"
                        name="cardName"
                        value={cardInfo.cardName}
                        onChange={handleCardInfoChange}
                        className="checkout-form-input"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="checkout-card-row">
                      <div className="checkout-form-group">
                        <label className="checkout-form-label checkout-required">Expiry Date</label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={cardInfo.expiryDate}
                          onChange={handleCardInfoChange}
                          className="checkout-form-input"
                          placeholder="MM/YY"
                          maxLength="5"
                          required
                        />
                      </div>
                      <div className="checkout-form-group">
                        <label className="checkout-form-label checkout-required">CVV</label>
                        <input
                          type="text"
                          name="cvv"
                          value={cardInfo.cvv}
                          onChange={handleCardInfoChange}
                          className="checkout-form-input"
                          placeholder="123"
                          maxLength="3"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* UPI Payment Details */}
              {paymentMethod === 'upi' && (
                <div className="checkout-payment-details checkout-active">
                  <h4 className="checkout-payment-details-title">UPI Payment</h4>
                  <div className="checkout-upi-form">
                    <div className="checkout-form-group">
                      <label className="checkout-form-label checkout-required">UPI ID</label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="checkout-form-input"
                        placeholder="yourname@upi"
                        required
                      />
                    </div>
                    <p className="checkout-upi-note">
                      You will be redirected to your UPI app for payment confirmation.
                    </p>
                  </div>
                </div>
              )}

              {/* Cash on Delivery Message */}
              {paymentMethod === 'cod' && (
                <div className="checkout-payment-details checkout-active">
                  <div className="checkout-cash-message">
                    <h4>Cash on Delivery</h4>
                    <div className="checkout-cash-amount">
                      {formatPrice(total)}
                    </div>
                    <p className="checkout-cash-note">
                      Pay with cash when your order is delivered. Our delivery executive will collect the payment at your doorstep.
                    </p>
                    <p className="checkout-cash-note" style={{marginTop: '10px', fontStyle: 'italic'}}>
                      Please keep exact change ready for smooth delivery experience.
                    </p>
                  </div>
                </div>
              )}

              <div className="checkout-process-actions">
                <button 
                  className="checkout-back-btn"
                  onClick={handlePrevStep}
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                  Back to Shipping
                </button>
                <button 
                  className="checkout-continue-btn"
                  onClick={handleNextStep}
                  disabled={!validateStep(2)}
                >
                  Review Order
                  <FontAwesomeIcon icon={faArrowRight} />
                </button>
              </div>
            </div>

            {/* Step 3: Order Review - ONLY STEP WITH ORDER SUMMARY */}
            <div className={`checkout-process-step-content ${currentStep === 3 ? 'checkout-active' : ''}`}>
              <h2 className="checkout-step-title">
                <FontAwesomeIcon icon={faCheck} style={{marginRight: '10px'}} />
                Review Your Order
              </h2>

              <div className="checkout-order-review-section">
                <h3 className="checkout-order-review-title">Order Items</h3>
                
                <div className="checkout-order-items">
                  {cart.map(item => (
                    <div key={`${item.id}-${item.selectedWeight}`} className="checkout-order-item">
                      <img 
                        src={item.images?.[0] || item.image} 
                        alt={item.name}
                        className="checkout-order-item-image"
                      />
                      <div className="checkout-order-item-details">
                        <h3 className="checkout-order-item-name">{item.name}</h3>
                        {item.selectedWeight && (
                          <p className="checkout-order-item-weight">Weight: {item.selectedWeight}</p>
                        )}
                        <p className="checkout-order-item-price">{formatPrice(item.finalPrice)}</p>
                        <div className="checkout-order-item-quantity">
                          <span>Quantity: </span>
                          <div className="checkout-quantity-controls">
                            <button 
                              className="checkout-quantity-btn"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            >
                              -
                            </button>
                            <span className="checkout-quantity-display">{item.quantity}</span>
                            <button 
                              className="checkout-quantity-btn"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ORDER SUMMARY - ONLY IN STEP 3 */}
                <div className="checkout-order-summary-calculations">
                  <div className="checkout-calculation-row">
                    <span>Subtotal:</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="checkout-calculation-row">
                    <span>Shipping:</span>
                    <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                  </div>
                  <div className="checkout-calculation-row">
                    <span>Tax (GST 3%):</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <div className="checkout-calculation-row checkout-total">
                    <span>Total Amount:</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              <div className="checkout-process-actions">
                <button 
                  className="checkout-back-btn"
                  onClick={handlePrevStep}
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                  Back to Payment
                </button>
                <button 
                  className="checkout-place-order-btn"
                  onClick={handlePlaceOrder}
                  disabled={isLoading}
                >
                  <FontAwesomeIcon icon={faLock} />
                  {isLoading ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;