import { Button } from "@/shared/components/ui/button";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      {" "}
      {/* Nền màu xám nhạt hơn */}
      <div className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-lg text-center transform transition-all duration-300 hover:scale-105">
        {" "}
        {/* Container lớn hơn, bo tròn, đổ bóng sâu, hiệu ứng hover */}
        {/* Biểu tượng cảm xúc lớn để thu hút sự chú ý */}
        <span className="text-8xl mb-4 block">😔</span>
        <h1 className="text-7xl font-extrabold text-gray-900 tracking-tight mb-4">
          {" "}
          {/* Kích thước chữ lớn, cực đậm, khoảng cách chữ hẹp, màu tối */}
          404
        </h1>
        <p className="text-2xl text-gray-700 mb-6 font-semibold">
          {" "}
          {/* Chữ lớn hơn, đậm hơn, màu tối */}
          Ối! Không tìm thấy trang này.
        </p>
        <p className="text-base text-gray-500 mb-10">
          {" "}
          {/* Mô tả chi tiết, khoảng cách dưới */}
          Có vẻ như liên kết bạn vừa nhấp bị hỏng hoặc trang đã bị di chuyển.
          Đừng lo lắng, bạn có thể quay lại trang chủ.
        </p>
        <Link to="/">
          <Button
            variant="default"
            size="lg"
            className="bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl transition duration-300"
          >
            {" "}
            {/* Nút màu xanh indigo nổi bật, có bóng, hiệu ứng hover */}
            {/* Icon mũi tên hoặc nhà để tăng tính trực quan */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2.586l.293.293A1 1 0 0010 16.586V19a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Về trang chủ
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
