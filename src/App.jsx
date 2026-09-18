import { useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import './App.css'
import Navbar from './component/Navbar'
import Banner from './component/Banner'
import JewelryMarquee from './component/JewelryMarquee'
import JewelleryCoreValues from './component/JewelleryCoreValues'
import JewelryCollection from './component/JewelryCollection'
import AboutUs from './component/AboutUs'
import AboutUsInnerPage from './component/AboutUsInnerPage'
import JewelryBanners from './component/JewelryBanners'
import ProductGallery from './component/ProductGallery'
import ProductSlider from './component/ProductSlider'
import LuxuryMarquee from './component/LuxuryMarquee'
import ClientLogoMarquee from './component/ClientLogoMarquee'
import TestimonialSection from './component/TestimonialSection'
import TestimonialInnerPage from './component/TestimonialInnerPage'
import Contact from './component/Contact'
import ContactInnerPage from './component/ContactInnerPage'
import Footer from './component/Footer'
import ProductsPage from './component/ProductPage'
import ProductDetail from './component/ProductDetail'
import Checkout from './component/Checkout'
import OrderSummary from './component/OrderSummary'
import { CartWishlistProvider } from './component/CartWishlistContext'
import { UserProvider } from './component/UserContext'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)

  // Function to handle navigation
  const navigateToPage = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Function to handle category selection from various components
  const handleCategorySelect = (category) => {
    const categoryMap = {
      'All Products': 'all',
      'Earrings': 'earrings',
      'Rings': 'rings', 
      'Bracelets': 'bracelets',
      'Pendants': 'pendants',
      'Necklaces': 'necklaces'
    };
    
    setSelectedCategory(categoryMap[category] || category || 'all');
    setCurrentPage('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Function to handle product selection for detail view
  const handleProductSelect = (product) => {
    setSelectedProduct(product)
    setCurrentPage('product-detail')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Function to handle back navigation from product detail
  const handleBackFromProductDetail = () => {
    setSelectedProduct(null)
    setCurrentPage('products')
  }

  // Function to handle back to products from product detail
  const handleBackToProducts = () => {
    setSelectedProduct(null)
    setCurrentPage('products')
  }

  // Function to handle back to home from product detail
  const handleBackToHome = () => {
    setSelectedProduct(null)
    setCurrentPage('home')
  }

  // Function to handle shop navigation (all products)
  const handleShopNavigation = () => {
    setSelectedCategory('all')
    setCurrentPage('products')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Function to handle checkout navigation
  const handleCheckout = () => {
    setCurrentPage('checkout')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Function to handle continue shopping from checkout
  const handleContinueShopping = () => {
    setCurrentPage('products')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Function to handle view order details
  const handleViewOrder = (order) => {
    setSelectedOrder(order)
    setCurrentPage('order-summary')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Function to handle back to orders
  const handleBackToOrders = () => {
    setSelectedOrder(null)
    setCurrentPage('products')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Function to handle navigation from order summary
  const handleBackToHomeFromOrder = () => {
    setSelectedOrder(null)
    setCurrentPage('home')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Render the appropriate page based on currentPage state
  const renderCurrentPage = () => {
    switch(currentPage) {
      case 'about':
        return (
          <AboutUsInnerPage 
            onNavigateHome={() => navigateToPage('home')}
            onNavigateToProducts={() => navigateToPage('products')}
            onNavigateToContact={() => navigateToPage('contact')}
          />
        )
      case 'products':
        return (
          <ProductsPage 
            onNavigateHome={() => navigateToPage('home')}
            onProductSelect={handleProductSelect}
            initialCategory={selectedCategory}
            onCheckout={handleCheckout}
          />
        )
      case 'product-detail':
        return (
          <ProductDetail 
            product={selectedProduct}
            onBack={handleBackFromProductDetail}
            onNavigateHome={() => navigateToPage('home')}
            onProductSelect={handleProductSelect}
            onCheckout={handleCheckout}
          />
        )
      case 'checkout':
        return (
          <Checkout 
            onContinueShopping={handleContinueShopping}
            onViewOrder={handleViewOrder}
            onNavigateHome={() => navigateToPage('home')}
          />
        )
      case 'order-summary':
        return (
          <OrderSummary 
            order={selectedOrder}
            onContinueShopping={handleContinueShopping}
            onBackToOrders={handleBackToOrders}
            onNavigateHome={handleBackToHomeFromOrder}
          />
        )
      case 'testimonials':
        return (
          <TestimonialInnerPage 
            onNavigateHome={() => navigateToPage('home')}
          />
        )
      case 'contact':
        return (
          <ContactInnerPage 
            onNavigateHome={() => navigateToPage('home')}
          />
        )
      case 'home':
      default:
        return (
          <>
            <Banner 
              onNavigateToProducts={() => navigateToPage('products')}
              onNavigateToAbout={() => navigateToPage('about')}
              onProductSelect={handleProductSelect}
            />
            <JewelryMarquee />
            <AboutUs 
              onNavigateToAbout={() => navigateToPage('about')}
              onNavigateToProducts={() => navigateToPage('products')}
            />
            <JewelleryCoreValues 
              onCategorySelect={handleCategorySelect}
            />
            <ProductGallery 
              onNavigateToProducts={() => navigateToPage('products')}
              onProductSelect={handleProductSelect}
            />
            <JewelryBanners 
              onNavigateToProducts={() => navigateToPage('products')}
            />
            <LuxuryMarquee />
            <JewelryCollection 
              onNavigateToProducts={() => navigateToPage('products')}
              onProductSelect={handleProductSelect}
            />
            <ProductSlider 
              onNavigateToProducts={() => navigateToPage('products')}
              onProductSelect={handleProductSelect}
            />
            <ClientLogoMarquee />
            <TestimonialSection 
              onNavigateToTestimonials={() => navigateToPage('testimonials')}
            />
            <Contact 
              onNavigateToContact={() => navigateToPage('contact')}
            />
          </>
        )
    }
  }

  return (
    <UserProvider>
      <CartWishlistProvider>
        <Router>
          <div className="App">
            <Navbar 
              currentPage={currentPage} 
              onNavigate={navigateToPage}
              onCategorySelect={handleCategorySelect}
              onShopNavigation={handleShopNavigation}
              onCheckout={handleCheckout}
            />
            <main className="main-content">
              {renderCurrentPage()}
            </main>
            <Footer 
              currentPage={currentPage} 
              onNavigate={navigateToPage}
            />
          </div>
        </Router>
      </CartWishlistProvider>
    </UserProvider>
  )
}

export default App