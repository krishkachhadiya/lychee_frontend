import AdminLayout from "@/admin/layouts/AdminLayout";

export const metadata = {
  // Admin panel is behind auth and shouldn't be indexed.
  robots: { index: false, follow: false },
  title: "Admin Panel",
};

export default function AdminSectionLayout({ children }) {
  return <AdminLayout>{children}</AdminLayout>;
}
