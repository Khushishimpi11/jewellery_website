import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheckCircle,
  faTruck,
  faCreditCard,
  faFileInvoice,
  faPrint,
  faDownload,
  faUser,
  faLocationDot,
  faEnvelope,
  faPhone,
  faBox,
  faCalendar,
  faReceipt
} from '@fortawesome/free-solid-svg-icons';
import './Checkout.css';

const OrderSummary = ({ order, onContinueShopping, onBackToOrders }) => {
  if (!order) {
    return (
      <div className="order-summary-section">
        <div className="order-summary-empty-state">
          <FontAwesomeIcon icon={faFileInvoice} className="order-summary-empty-icon" />
          <h2 className="order-summary-empty-title">Order Not Found</h2>
          <p className="order-summary-empty-message">
            The order you're looking for doesn't exist.
          </p>
          <button 
            className="order-summary-continue-shopping-btn"
            onClick={onContinueShopping}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const formatPrice = (price) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert('Download feature would generate a PDF invoice in a real application.');
  };

  return (
    <div className="order-summary-section">
      {/* Order Banner */}
      <div className="order-summary-banner">
        <div className="order-summary-banner-image">
          <div className="order-summary-banner-bg"></div>
        </div>
        <div className="order-summary-banner-overlay">
          <div className="order-summary-banner-content">
            <h1 className="order-summary-main-heading">Order Confirmation</h1>
            <div className="order-summary-breadcrumb">
              <span onClick={onContinueShopping} style={{cursor: 'pointer'}}>Home</span>
              <span className="order-breadcrumb-divider">&gt;</span>
              <span onClick={onBackToOrders} style={{cursor: 'pointer'}}>Orders</span>
              <span className="order-breadcrumb-divider">&gt;</span>
              <span className="order-breadcrumb-current">Order #{order.id}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="order-summary-container">
        <div className="order-summary-wrapper">
          {/* Main Content Area */}
          <div className="order-summary-layout">
            
            {/* Left Column - Order Details */}
            <div className="order-summary-details-column">
              
              {/* Order Status Header with Payment Info */}
              <div className="order-summary-header-section">
                <div className="order-summary-status-indicator">
                  <div className="order-summary-status-icon-wrapper">
                    <FontAwesomeIcon icon={faCheckCircle} className="order-summary-status-icon" />
                  </div>
                  <div className="order-summary-status-content">
                    <h1>Order Confirmed!</h1>
                    <p>Thank you for your purchase. Your order has been successfully placed.</p>
                  </div>
                </div>
                
                <div className="order-summary-meta-info">
                  <div className="order-summary-meta-row">
                    <FontAwesomeIcon icon={faReceipt} />
                    <span className="order-summary-meta-label">Order Number:</span>
                    <span className="order-summary-meta-value">#{order.id}</span>
                  </div>
                  <div className="order-summary-meta-row">
                    <FontAwesomeIcon icon={faCalendar} />
                    <span className="order-summary-meta-label">Order Date:</span>
                    <span className="order-summary-meta-value">{formatDate(order.date)}</span>
                  </div>
                  <div className="order-summary-meta-row">
                    <FontAwesomeIcon icon={faCreditCard} />
                    <span className="order-summary-meta-label">Payment Method:</span>
                    <span className="order-summary-meta-value">{order.paymentMethod.toUpperCase()}</span>
                  </div>
                  <div className="order-summary-meta-row">
                    <FontAwesomeIcon icon={faCheckCircle} />
                    <span className="order-summary-meta-label">Payment Status:</span>
                    <span className="order-summary-status-badge order-summary-paid">Paid</span>
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              <div className="order-summary-info-section">
                <div className="order-summary-section-header">
                  <FontAwesomeIcon icon={faTruck} />
                  <h2>Shipping Information</h2>
                </div>
                <div className="order-summary-section-content">
                  <div className="order-summary-info-row">
                    <div className="order-summary-info-group">
                      <label>Full Name</label>
                      <p>{order.shippingInfo.firstName} {order.shippingInfo.lastName}</p>
                    </div>
                  </div>
                  <div className="order-summary-separator-line"></div>
                  <div className="order-summary-info-row">
                    <div className="order-summary-info-group">
                      <label>Address</label>
                      <p>{order.shippingInfo.address}</p>
                      <p>{order.shippingInfo.city}, {order.shippingInfo.state} - {order.shippingInfo.pincode}</p>
                      <p>{order.shippingInfo.country}</p>
                    </div>
                  </div>
                  <div className="order-summary-separator-line"></div>
                  <div className="order-summary-info-row order-summary-double-column">
                    <div className="order-summary-info-group">
                      <label>Email Address</label>
                      <p>{order.shippingInfo.email}</p>
                    </div>
                    <div className="order-summary-info-group">
                      <label>Phone Number</label>
                      <p>{order.shippingInfo.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Billing Information */}
              <div className="order-summary-info-section">
                <div className="order-summary-section-header">
                  <FontAwesomeIcon icon={faFileInvoice} />
                  <h2>Billing Information</h2>
                </div>
                <div className="order-summary-section-content">
                  <div className="order-summary-info-row">
                    <div className="order-summary-info-group">
                      <label>Full Name</label>
                      <p>{order.billingInfo.firstName} {order.billingInfo.lastName}</p>
                    </div>
                  </div>
                  <div className="order-summary-separator-line"></div>
                  <div className="order-summary-info-row">
                    <div className="order-summary-info-group">
                      <label>Billing Address</label>
                      <p>{order.billingInfo.address}</p>
                      <p>{order.billingInfo.city}, {order.billingInfo.state} - {order.billingInfo.pincode}</p>
                      <p>{order.billingInfo.country}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="order-summary-summary-column">
              <div className="order-summary-summary-section">
                <div className="order-summary-section-header">
                  <FontAwesomeIcon icon={faBox} />
                  <h2>Order Summary</h2>
                </div>

                {/* Order Items */}
                <div className="order-summary-items-container">
                  {order.items.map((item, index) => (
                    <React.Fragment key={`${item.id}-${item.selectedWeight}`}>
                      <div className="order-summary-item">
                        <div className="order-summary-item-image-container">
                          <img 
                            src={item.images?.[0] || item.image} 
                            alt={item.name}
                            className="order-summary-item-image"
                          />
                        </div>
                        <div className="order-summary-item-details">
                          <h3 className="order-summary-item-name">{item.name}</h3>
                          {item.selectedWeight && (
                            <p className="order-summary-item-variant">Weight: {item.selectedWeight}</p>
                          )}
                          <div className="order-summary-item-meta">
                            <span className="order-summary-item-quantity">Qty: {item.quantity}</span>
                            <span className="order-summary-item-price">{formatPrice(item.finalPrice * item.quantity)}</span>
                          </div>
                        </div>
                      </div>
                      {index < order.items.length - 1 && <div className="order-summary-item-separator"></div>}
                    </React.Fragment>
                  ))}
                </div>

                {/* Order Calculations */}
                <div className="order-summary-calculations">
                  <div className="order-summary-calculation-row">
                    <span>Subtotal</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="order-summary-divider-line"></div>
                  <div className="order-summary-calculation-row">
                    <span>Shipping</span>
                    <span>{order.shipping === 0 ? 'FREE' : formatPrice(order.shipping)}</span>
                  </div>
                  <div className="order-summary-divider-line"></div>
                  <div className="order-summary-calculation-row">
                    <span>Tax (GST 3%)</span>
                    <span>{formatPrice(order.tax)}</span>
                  </div>
                  <div className="order-summary-section-separator"></div>
                  <div className="order-summary-calculation-row order-summary-grand-total">
                    <span>Total Amount</span>
                    <span>{formatPrice(order.total)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="order-summary-actions">
                  <button 
                    className="order-summary-btn-secondary"
                    onClick={onContinueShopping}
                  >
                    Continue Shopping
                  </button>
                  <button 
                    className="order-summary-btn-primary"
                    onClick={onBackToOrders}
                  >
                    View All Orders
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;