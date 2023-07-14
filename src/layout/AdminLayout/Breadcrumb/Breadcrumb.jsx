import { Breadcrumb as BSBreadcrumb } from "react-bootstrap";

export default function Breadcrumb() {
  return (
    <BSBreadcrumb listProps={{ className: "mb-0 align-items-center" }}>
      <BSBreadcrumb.Item
        linkProps={{ className: "text-decoration-none" }}
        href="/admin/audit_trail"
      >
        Inicio
      </BSBreadcrumb.Item>
    </BSBreadcrumb>
  );
}
