import { Route, Routes } from "react-router-dom";
import { Toaster } from "./shared/components/ui/sonner";
import SignupSigninPage from "./features/auth/pages/SignupSigninPage";
import { useAuthStore } from "./features/auth/stores/auth.store";
import HomePage from "./app/pages/HomePage";
import SearchPage from "./app/pages/SearchPage";
import NotFoundPage from "./app/pages/NotFoundPage";
import { useEffect } from "react";
import UpdateMeForm from "./features/auth/components/UpdateMeForm";
import AuthProtectedRoute from "./app/routes/AuthProtectedRoute";
import ChangePasswordForm from "./features/auth/components/ChangePasswordForm";

const App = () => {
  const { user, signinWithSocialMediaSuccess } = useAuthStore();

  useEffect(() => {
    if (!user) {
      signinWithSocialMediaSuccess();
    }
  }, [user]);

  return (
    <div>
      <Toaster />

      <Routes>
        {/* public */}
        <Route index element={<HomePage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="*" element={<NotFoundPage />} />

        {/* auth */}
        <Route path="signin" element={<SignupSigninPage />} />
        <Route path="signup" element={<SignupSigninPage />} />
        <Route path="forgot-password" element={<SignupSigninPage />} />
        <Route path="reset-password" element={<SignupSigninPage />} />

        {/* auth protected */}
        <Route element={<AuthProtectedRoute />}>
          {/*  */}
          {/* <Route path="chat" element={<ChatPage />}>
            <Route path=":id" element={<ChatIdPage />} />
          </Route> */}

          {/*  */}
          <Route path="me">
            <Route path="update-me" element={<UpdateMeForm />} />
            <Route path="change-password" element={<ChangePasswordForm />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
};

export default App;
