import React from 'react';


const AboutUs = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold text-brand mb-2">About Us</h1>
      <p className="text-lg mb-8">
        Welcome to <span className="text-brand">HOTEL BOOKING</span>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat, quam harum
        debitis, ex eius vitae dicta cum molestiae ipsam ea animi tempore tenetur
        sapiente exercitationem velit a veritatis inventore minus?
      </p>

      <h2 className="text-3xl font-extrabold text-brand mb-2">Our Vision</h2>
      <p className="text-lg mb-8">
        At <span className="text-brand">HOTEL BOOKING</span>,
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat, quam harum
        debitis, ex eius vitae dicta cum molestiae ipsam ea animi tempore tenetur
        sapiente exercitationem velit a veritatis inventore minus?
      </p>

      <h2 className="text-3xl font-extrabold text-brand mb-2">
        Why Choose Us?
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

      <h2 className="text-3xl font-extrabold text-brand mb-2">Contact Us</h2>
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
        . We're here to help!
      </p>
      <p className="text-lg">
        Thank you for choosing <span className="text-brand">HOTEL BOOKING</span>.
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat, quam harum
        debitis, ex eius vitae dicta cum molestiae ipsam ea animi tempore tenetur
        sapiente exercitationem velit a veritatis inventore minus?
      </p>
    </div>
  );
};

export default AboutUs;
