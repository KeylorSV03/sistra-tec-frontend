import { useAdminNav } from "../../hooks/useAdminNav.jsx";
import Sidebar from "../../components/modules/sidebar/Sidebar";
import NotificationsPage from "../donor/NotificationsPage";

export default function AdminNotificationsPage() {
  const navItems = useAdminNav();
  return (
    <NotificationsPage
      sidebar={<Sidebar navItems={navItems} />}
      role="Administrador"
    />
  );
}
