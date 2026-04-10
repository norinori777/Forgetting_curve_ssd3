import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";

export function App() {
  const path = typeof window !== "undefined" ? window.location.pathname : "/login";

  if (path.startsWith("/dashboard")) {
    return <DashboardPage />;
  }

  if (path.startsWith("/signup")) {
    return <SignupPage />;
  }

  return <LoginPage />;
}
