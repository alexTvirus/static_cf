import React from 'react';


const AboutUs = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold text-brand mb-2">Về chúng tôi</h1>
      <p className="text-lg mb-8">
        Chào mừng đến <span className="text-brand">HOTEL BOOKING</span>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat, quam harum
        debitis, ex eius vitae dicta cum molestiae ipsam ea animi tempore tenetur
        sapiente exercitationem velit a veritatis inventore minus?
      </p>

      <h2 className="text-3xl font-extrabold text-brand mb-2">Định hướng</h2>
      <p className="text-lg mb-8">
        At <span className="text-brand">HOTEL BOOKING</span>,
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat, quam harum
        debitis, ex eius vitae dicta cum molestiae ipsam ea animi tempore tenetur
        sapiente exercitationem velit a veritatis inventore minus?
      </p>

      <h2 className="text-3xl font-extrabold text-brand mb-2">
        Tại sao lại chọn chúng tôi?
      </h2>
      <ul className="list-disc ml-6 mb-8">
        <li className="text-lg mb-3">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat, quam harum
          debitis, ex eius vitae dicta cum molestiae ipsam ea animi tempore tenetur
          sapiente exercitationem velit a veritatis inventore minus?
        </li>
        <li className="text-lg mb-3">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat, quam harum
          debitis, ex eius vitae dicta cum molestiae ipsam ea animi tempore tenetur
          sapiente exercitationem velit a veritatis inventore minus?
        </li>
        <li className="text-lg mb-3">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat, quam harum
          debitis, ex eius vitae dicta cum molestiae ipsam ea animi tempore tenetur
          sapiente exercitationem velit a veritatis inventore minus?
        </li>
        <li className="text-lg mb-3">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat, quam harum
          debitis, ex eius vitae dicta cum molestiae ipsam ea animi tempore tenetur
          sapiente exercitationem velit a veritatis inventore minus?
        </li>
      </ul>

      <h2 className="text-3xl font-extrabold text-brand mb-2">Liên hệ với chúng tôi</h2>
      <p className="text-lg mb-4">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat, quam harum
        debitis, ex eius vitae dicta cum molestiae ipsam ea animi tempore tenetur
        sapiente exercitationem velit a veritatis inventore minus?{' '}
        <a
          className="text-brand hover:underline"
          href="mailto:info@booking.com"
        >
          info@booking.com
        </a>
        . Chúng tôi luôn sẳn sàng giúp bạn!
      </p>
      <p className="text-lg">
        Cảm ơn sự lựa chọn của quý khách <span className="text-brand">HOTEL BOOKING</span>.
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat, quam harum
        debitis, ex eius vitae dicta cum molestiae ipsam ea animi tempore tenetur
        sapiente exercitationem velit a veritatis inventore minus?
      </p>
    </div>
  );
};

export default AboutUs;
