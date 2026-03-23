export interface Story {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  image: string;
  category: string;
}

export const stories: Story[] = [
  {
    id: 1,
    title: "Bình minh trên Vịnh Hạ Long",
    excerpt: "Trải nghiệm một buổi sáng yên bình giữa những hòn đảo đá vôi hùng vĩ, nơi sương mù tan biến nhường chỗ cho ánh nắng vàng rực rỡ.",
    author: "Minh Anh",
    date: "15/03/2024",
    image: "https://i.pinimg.com/736x/1d/0c/34/1d0c3486ffe197fd5907e37cf78966e1.jpg",
    category: "Trải nghiệm"
  },
  {
    id: 2,
    title: "Hương vị Phố Cổ Hội An",
    excerpt: "Hành trình khám phá những góc khuất của Hội An qua những món ăn truyền thống và câu chuyện của những người thợ thủ công lâu đời.",
    author: "Hoàng Nam",
    date: "10/03/2024",
    image: "https://i.pinimg.com/1200x/c9/e7/72/c9e772015630fcadba24046c81f29cf7.jpg",
    category: "Ẩm thực"
  },
  {
    id: 3,
    title: "Chinh phục đèo Mã Pí Lèng",
    excerpt: "Cảm giác nghẹt thở khi đứng trên đỉnh đèo cao nhất Việt Nam, ngắm nhìn dòng sông Nho Quế xanh ngắt uốn lượn dưới chân núi.",
    author: "Thu Trang",
    date: "05/03/2024",
    image: "https://i.pinimg.com/736x/10/f2/37/10f2376cd76063851c81d0fd1536de5e.jpg",
    category: "Mạo hiểm"
  },
  {
    id: 4,
    title: "Nét đẹp trầm mặc của Cố đô Huế",
    excerpt: "Tìm lại những giá trị văn hóa lịch sử qua những lăng tẩm và kiến trúc cung đình cổ kính giữa lòng thành phố Huế mộng mơ.",
    author: "Lê Hùng",
    date: "01/03/2024",
    image: "https://i.pinimg.com/736x/b4/6f/23/b46f2301a1ca8ed5d0eb53ae49cb1971.jpg",
    category: "Văn hóa"
  },
  {
    id: 5,
    title: "Sapa - Nơi gặp gỡ đất trời",
    excerpt: "Hành trình săn mây trên đỉnh Fansipan và những trải nghiệm văn hóa độc đáo tại các bản làng dân tộc thiểu số vùng cao Tây Bắc.",
    author: "Thanh Hải",
    date: "25/02/2024",
    image: "https://i.pinimg.com/1200x/db/54/e2/db54e22188f9a2f920c0f29a4fe205cc.jpg",
    category: "Trải nghiệm"
  },
  {
    id: 6,
    title: "Đà Lạt - Thành phố ngàn hoa",
    excerpt: "Khám phá vẻ đẹp lãng mạn của Đà Lạt qua những con dốc nhỏ, những quán cà phê xinh xắn và không khí se lạnh đặc trưng.",
    author: "Ngọc Mai",
    date: "20/02/2024",
    image: "https://i.pinimg.com/736x/e7/a9/95/e7a995349b2bede965ceac719a767610.jpg",
    category: "Nghỉ dưỡng"
  }
];
