import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import CardRegistrationPage from "./pages/CardRegistrationPage";

export function App() {
  const path = typeof window !== "undefined" ? window.location.pathname : "/login";

  if (path.startsWith("/dashboard")) {
    return <DashboardPage />;
  }

  if (path.startsWith("/cards/new")) {
    return <CardRegistrationPage />;
  }

  if (path.startsWith("/signup")) {
    return <SignupPage />;
  }

  return <LoginPage />;
}
