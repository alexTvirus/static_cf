import React from 'react';
import { Link } from 'react-router-dom';

const FooterLink = ({ to, label }) => (
  <Link
    to={to}
    className="block text-slate-700 hover:text-brand transition-colors duration-300"
  >
    {label}
  </Link>
);

const GlobalFooter = () => {
  return (
    <footer className="bg-slate-50 text-slate-700 mt-6 rounded-none">
      <div className="container mx-auto px-6 py-6">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h4 className="font-bold text-lg mb-2">Thông tin</h4>
            <FooterLink to="/about-us" label="Về chúng tôi" />
            <FooterLink to="/" label="Liên hệ" />
            <FooterLink to="/" label="Chính sách bảo mật" />
          </div>
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h4 className="font-bold text-lg mb-2">Hỗ trợ</h4>
            <FooterLink to="/" label="FAQs" />
          </div>
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h4 className="font-bold text-lg mb-2">Theo dõi</h4>
            <p>Đăng kí để nhận được thông báo mới nhất</p>
            <form>
              <input
                type="email"
                placeholder="email"
                className="p-2 rounded"
              />
              <button className="ml-2 p-2 bg-brand text-white rounded">
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="text-center mt-10">
          <p>Designed and styled by tester</p>
          <p>
            &copy; {new Date().getFullYear()} HotelBooking. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default GlobalFooter;
