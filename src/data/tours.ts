import { Tour } from '../types';

export const tours: Tour[] = [
  {
    id: '1',
    title: 'Huyền Thoại Vịnh Hạ Long',
    description: 'Khám phá vẻ đẹp kỳ vĩ của hàng ngàn hòn đảo đá vôi nhô lên từ làn nước trong xanh, trải nghiệm đêm trên du thuyền sang trọng.',
    price: 3500000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjXbtAgz3f_KOWA9dLQmk7UHktcgA-ROZ-ZshvjGj2X9f_iHBU5Rw59MnVOgMb-VRJaxYCDwDgM5qIbAFgn9ZpBHH-EaQMNo5xvTtEm3Za9fbWmSgj4OnRQ4uT_nUgvcA_cYKo1bDm8DxVIG646DLhLLsrPPzqUfw1v1UTY_eA8RTsK9LQKhjl3nRSrOT7fPOoAFqFr0wZ-LlNIufMau8lMpzzCbScSY4AFv7ZNVIlJLHFcniBhUKKqSjJ3UZ1Z48NTXsdlEeGkH4',
    category: 'Biển đảo',
    duration: '3 ngày 2 đêm',
    groupSize: 'Tối đa 12 người',
    tag: 'Di sản UNESCO'
  },
  {
    id: '2',
    title: 'Phố Cổ Hội An',
    description: 'Lạc bước trong những con ngõ nhỏ màu vàng rực rỡ, chiêm ngưỡng vẻ đẹp lung linh của lồng đèn và thưởng thức ẩm thực tinh tế.',
    price: 2200000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdxogDULp6ES2vixpdCkAh4XOevcjUFWUm9ljOXy6ydqYnzKLCF1IvzsEY_aWrvfc0HzkFd5PbPJEriv91XG-ONyFHKwmY5asJN0KdE87CuNWGeqle3cBmdnU9b3y8CDXZfG4-GKg_w5SKiODZY47rME841mOUy2QPB16IzKBiVTraMCbiHyEYcIsKZngySQ5PjfYuFjjBV3NyBKNqWhvRsrTASeQFf3dJYxBJMssWb8bsGxrmkIiwGFNqVPxzgbJM4RNrAS6GoW0',
    category: 'Văn hóa',
    duration: '2 ngày 1 đêm',
    groupSize: 'Tối đa 10 người',
    tag: 'Văn hóa',
    accommodation: 'Resort 5 sao'
  },
  {
    id: '3',
    title: 'Chinh Phục Fansipan',
    description: 'Hành trình leo núi đầy thử thách lên đỉnh cao nhất Đông Dương, ngắm nhìn biển mây bồng bềnh và núi non hùng vĩ.',
    price: 4800000,
    image: 'https://i.pinimg.com/1200x/7d/7d/9d/7d7d9d3d43fae3902e1201d7c2e66842.jpg',
    category: 'Mạo hiểm',
    duration: '2 ngày 1 đêm',
    groupSize: 'Tối đa 8 người',
    tag: 'Mạo hiểm'
  },
  {
    id: '4',
    title: 'Nghỉ Dưỡng Phú Quốc',
    description: 'Tận hưởng kỳ nghỉ thiên đường tại đảo ngọc với bãi cát trắng mịn, làn nước trong xanh và những dịch vụ đẳng cấp.',
    price: 6500000,
    image: 'https://picsum.photos/seed/phuquoc/800/600',
    category: 'Nghỉ dưỡng',
    duration: '4 ngày 3 đêm',
    groupSize: 'Tối đa 6 người',
    tag: 'Nghỉ dưỡng',
    accommodation: 'Villa hướng biển'
  },
  {
    id: '5',
    title: 'Ẩm Thực Đường Phố Sài Gòn',
    description: 'Khám phá thiên đường ẩm thực Sài Gòn qua những món ăn đường phố đặc sắc và tìm hiểu về cuộc sống sôi động về đêm.',
    price: 1200000,
    image: 'https://doanhnhanplus.vn/wp-content/uploads/2017/05/Am-thuc-duong-pho-sai-gon-Amthuc-704-2017-ok.jpg',
    category: 'Văn hóa',
    duration: '1 ngày',
    groupSize: 'Tối đa 15 người',
    tag: 'Ẩm thực'
  },
  {
    id: '6',
    title: 'Khám Phá Hang Sơn Đoòng',
    description: 'Trải nghiệm thám hiểm hang động lớn nhất thế giới, một kỳ quan thiên nhiên vô song với hệ sinh thái độc đáo bên trong.',
    price: 65000000,
    image: 'https://i.pinimg.com/736x/b1/a0/59/b1a059de0d28aff2eb3f0fa6a6cb4647.jpg',
    category: 'Mạo hiểm',
    duration: '5 ngày 4 đêm',
    groupSize: 'Tối đa 10 người',
    tag: 'Thám hiểm'
  },
  {
    id: '7',
    title: 'Cố Đô Huế Trầm Mặc',
    description: 'Tìm về vẻ đẹp cung đình xưa cũ với những lăng tẩm, đại nội và thưởng thức nhã nhạc cung đình Huế.',
    price: 2800000,
    image: 'https://i.pinimg.com/1200x/6c/f6/a3/6cf6a3791f7d8e7aa59c5ca7a7fd3097.jpg',
    category: 'Văn hóa',
    duration: '3 ngày 2 đêm',
    groupSize: 'Tối đa 12 người',
    tag: 'Di sản'
  },
  {
    id: '8',
    title: 'Lặn Biển Nha Trang',
    description: 'Khám phá thế giới đại dương rực rỡ sắc màu với những rạn san hô tuyệt đẹp tại vịnh biển đẹp nhất Việt Nam.',
    price: 1800000,
    image: 'https://khoinguonsangtao.vn/wp-content/uploads/2022/11/anh-nha-trang-voi-bien-xanh-ngat.jpg',
    category: 'Biển đảo',
    duration: '1 ngày',
    groupSize: 'Tối đa 20 người',
    tag: 'Biển'
  }
];
