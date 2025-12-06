import { Link } from 'react-router-dom'
import { FiInstagram, FiTwitter, FiPhone, FiMail, FiMapPin } from 'react-icons/fi'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Book Store</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              The largest online bookstore with over 100,000 titles.
              Fast and secure delivery worldwide.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="#" className="hover:text-primary-500"><FiInstagram size={20} /></a>
              <a href="#" className="hover:text-primary-500"><FiTwitter size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products" className="hover:text-primary-500">All Books</Link></li>
              <li><Link to="/products?bestseller=true" className="hover:text-primary-500">Bestsellers</Link></li>
              <li><Link to="/products?featured=true" className="hover:text-primary-500">Featured Books</Link></li>
              <li><Link to="/products?sort=newest" className="hover:text-primary-500">New Arrivals</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/faq" className="hover:text-primary-500">FAQ</Link></li>
              <li><Link to="/shipping" className="hover:text-primary-500">Shipping Info</Link></li>
              <li><Link to="/returns" className="hover:text-primary-500">Returns Policy</Link></li>
              <li><Link to="/contact" className="hover:text-primary-500">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <FiPhone className="text-primary-500" />
                <span>+1-234-567-8900</span>
              </li>
              <li className="flex items-center gap-2">
                <FiMail className="text-primary-500" />
                <span>info@bookstore.com</span>
              </li>
              <li className="flex items-start gap-2">
                <FiMapPin className="text-primary-500 mt-1" />
                <span>123 Book Street, New York, NY 10001</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="max-w-md mx-auto text-center">
            <h4 className="text-white font-bold mb-2">Subscribe to Newsletter</h4>
            <p className="text-gray-400 text-sm mb-4">Get updates on new releases and discounts</p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-primary-500 outline-none"
              />
              <button type="submit" className="btn btn-primary">Subscribe</button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>All rights reserved. Online Book Store 2024</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
