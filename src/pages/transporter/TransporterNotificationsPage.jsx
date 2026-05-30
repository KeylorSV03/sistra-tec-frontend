import { useTransporterNav } from "../../hooks/useTransporterNav.jsx";
import Sidebar from "../../components/modules/sidebar/Sidebar";
import NotificationsPage from "../donor/NotificationsPage";

export default function TransporterNotificationsPage() {
  const navItems = useTransporterNav();
  return (
    <NotificationsPage
      sidebar={<Sidebar navItems={navItems} />}
      role="Transportista"
    />
  );
}
