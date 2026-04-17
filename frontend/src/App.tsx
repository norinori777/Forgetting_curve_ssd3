import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import CardRegistrationPage from "./pages/CardRegistrationPage";
import CardListPage from "./pages/CardListPage";
import ReviewPage from "./pages/ReviewPage";
import SettingsPage from "./pages/SettingsPage";
import { resolveAppRouteKey } from "./utils/baseScreenRoutes";

export function App() {
  const path = typeof window !== "undefined" ? window.location.pathname : "/login";
  const routeKey = resolveAppRouteKey(path);

  if (routeKey === "dashboard") {
    return <DashboardPage />;
  }

  if (routeKey === "cardRegistration") {
    return <CardRegistrationPage />;
  }

  if (routeKey === "cardList") {
    return <CardListPage />;
  }

  if (routeKey === "review") {
    return <ReviewPage />;
  }

  if (routeKey === "settings") {
    return <SettingsPage />;
  }

  if (routeKey === "signup") {
    return <SignupPage />;
  }

  return <LoginPage />;
}
