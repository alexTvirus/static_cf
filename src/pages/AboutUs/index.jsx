import React from 'react';


const AboutUs = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold text-brand mb-2">Về chúng tôi</h1>
      <p className="text-lg mb-8">
        Chào mừng đến <span className="text-brand"> HOTEL BOOKING </span>
        nơi mang đến cho bạn trải nghiệm lưu trú tuyệt vời nhất! Tọa lạc tại vị trí đắc địa, khách sạn của chúng tôi không chỉ gần gũi với những điểm tham quan nổi tiếng mà còn được bao quanh bởi không gian yên bình, lý tưởng cho những khoảnh khắc thư giãn.
        Với thiết kế hiện đại, phòng ốc được trang bị đầy đủ tiện nghi, chúng tôi cam kết mang đến sự thoải mái tối đa cho bạn. Đội ngũ nhân viên tận tâm, chuyên nghiệp sẽ luôn sẵn sàng phục vụ bạn, đảm bảo mỗi khoảnh khắc tại HOTEL BOOKING đều trở nên đáng nhớ.
        Hãy đến và trải nghiệm dịch vụ chất lượng cùng những tiện ích độc đáo mà chúng tôi cung cấp. Chúng tôi rất mong được chào đón bạn tại HOTEL BOOKING!
      </p>

      <h2 className="text-3xl font-extrabold text-brand mb-2">Định hướng</h2>
      <p className="text-lg mb-8">
        Tại <span className="text-brand">HOTEL BOOKING</span>,
        chúng tôi cam kết mang đến trải nghiệm lưu trú tuyệt vời thông qua việc không ngừng cải tiến chất lượng dịch vụ và nâng cao sự hài lòng của khách hàng. Định hướng của chúng tôi là trở thành lựa chọn hàng đầu cho du khách bằng cách kết hợp giữa sự sang trọng, tiện nghi hiện đại và dịch vụ chăm sóc khách hàng tận tâm.
        Chúng tôi luôn nỗ lực phát triển bền vững, bảo vệ môi trường và hỗ trợ cộng đồng địa phương, đồng thời tạo ra những trải nghiệm độc đáo cho mỗi khách hàng. Với triết lý "Khách hàng là trung tâm", chúng tôi hướng tới việc xây dựng một môi trường thân thiện và ấm áp, nơi mọi khách hàng đều cảm thấy như ở nhà.
      </p>

      <h2 className="text-3xl font-extrabold text-brand mb-2">
        Tại sao lại chọn chúng tôi?
      </h2>
      <ul className="list-disc ml-6 mb-8">
        <li className="text-lg mb-3">
          Vị trí lý tưởng: Khách sạn của chúng tôi tọa lạc tại trung tâm, thuận tiện để bạn khám phá những điểm tham quan nổi tiếng và trải nghiệm văn hóa địa phương.
        </li>
        <li className="text-lg mb-3">
          Dịch vụ tận tâm: Đội ngũ nhân viên chuyên nghiệp và thân thiện luôn sẵn sàng phục vụ bạn, đảm bảo rằng bạn sẽ có những khoảnh khắc thoải mái và đáng nhớ.
        </li>
        <li className="text-lg mb-3">
          Tiện nghi hiện đại: Các phòng nghỉ được trang bị đầy đủ tiện nghi sang trọng, mang đến cho bạn sự thoải mái tối đa trong suốt thời gian lưu trú.
        </li>
        <li className="text-lg mb-3">
          Ẩm thực phong phú: Nhà hàng của chúng tôi phục vụ đa dạng món ăn từ địa phương đến quốc tế, chắc chắn sẽ làm hài lòng khẩu vị của bạn.
        </li>
        <li className="text-lg mb-3">
          Chính sách linh hoạt: Chúng tôi cung cấp nhiều gói dịch vụ và ưu đãi hấp dẫn, giúp bạn dễ dàng chọn lựa phương án phù hợp với nhu cầu và ngân sách của mình.
        </li>

      </ul>

      <h2 className="text-3xl font-extrabold text-brand mb-2">Liên hệ với chúng tôi</h2>
      <p className="text-lg mb-4">
        Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn! Để biết thêm thông tin hoặc đặt phòng, xin vui lòng liên hệ với chúng tôi qua các kênh dưới đây{' '}
        <a
          className="text-brand hover:underline"
          href="mailto:proxywindert11@gmail.com"
        >
          proxywindert11@gmail.com
        </a>
        . Chúng tôi luôn sẳn sàng giúp bạn!
      </p>
      <p className="text-lg">
        Cảm ơn sự lựa chọn của quý khách, Chúng tôi rất mong được chào đón bạn tại <span className="text-brand">HOTEL BOOKING</span>.
        
      </p>
    </div>
  );
};

export default AboutUs;
