import { Button } from "@/shared/components/ui/button";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { IMAGE_NOTFOUND } from "@/shared/constants/image.constanr";

const HomePage = () => {
  const { user, signout } = useAuthStore();
  const signoutResult = useMutation({
    mutationFn: () => {
      return signout();
    },
    onSuccess(data) {
      toast(data?.message, {
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
    },
    onError(error) {
      toast(error.message, {
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
    },
  });
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md text-center space-y-8">
        <h1 className="text-4xl font-bold text-gray-800 ">
          Chào mừng đến với ứng dụng của bạn!
        </h1>
        <p className="text-lg text-gray-600">
          Đây là trang chủ. Khám phá các tính năng khác hoặc đăng nhập để tiếp
          tục.
        </p>
        {user && (
          <div className="flex flex-col items-center gap-3">
            <img
              src={user.avatar || IMAGE_NOTFOUND.avatar_notfound}
              alt="avatar"
              loading="lazy"
              className="object-cover object-center aspect-square w-24 rounded-full overflow-hidden block"
            />
            <h3>
              Hi, my name is{" "}
              <span className="italic font-medium">{user.name}</span>
            </h3>
          </div>
        )}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {user ? (
            <Button
              disabled={signoutResult.isPending}
              onClick={() => {
                signoutResult.mutate();
              }}
            >
              Signout
            </Button>
          ) : (
            <Link to="/signin">
              <Button>Đăng nhập</Button>
            </Link>
          )}
          <Link to="/me/profile">
            <Button>Hồ sơ của tôi</Button>
          </Link>
          <Link to="/me/update-me">
            <Button>Cập nhật thông tin</Button>
          </Link>
          <Link to="/me/change-password">
            <Button>Đổi mật khẩu</Button>
          </Link>
          <Link to="/chat">
            <Button>Chat</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
