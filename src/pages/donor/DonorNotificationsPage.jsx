import { useDonorNav } from "../../hooks/useDonorNav.jsx";
import Sidebar from "../../components/modules/sidebar/Sidebar";
import NotificationsPage from "./NotificationsPage";

export default function DonorNotificationsPage() {
  const navItems = useDonorNav();
  return (
    <NotificationsPage
      sidebar={<Sidebar navItems={navItems} />}
      role="Donante"
    />
  );
}
