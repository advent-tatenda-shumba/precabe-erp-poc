import Link from "next/link";

export default function Dashboard() {
  const modules = [
    { title: "Dashboard", icon: "📊", link: "/" },
    { title: "Purchasing", icon: "🛍️", link: "/purchasing" },
    { title: "Inventory", icon: "📦", link: "/inventory" },
    { title: "CRM", icon: "🤝", link: "/crm" },
    { title: "Sales", icon: "💰", link: "/sales" },
    { title: "Address Book", icon: "📖", link: "/address-book" },
    { title: "Cost Accounting", icon: "🏦", link: "/cost-accounting" },
    { title: "Project Management", icon: "🏗️", link: "/projects" },
    { title: "Activity Management", icon: "🔄", link: "/activity" },
    { title: "Support Management", icon: "🎧", link: "/support" },
    { title: "Notification", icon: "🔔", link: "/notifications" },
    { title: "HRM", icon: "👥", link: "/hrm" },
    { title: "Payroll Management", icon: "💸", link: "/payroll" },
    { title: "Setup & Overview", icon: "⚙️", link: "/setup" },
    { title: "Report Overview", icon: "📈", link: "/reports" },
  ];

  return (
    <div>
      <div className="dashboard-grid">
        {modules.map((mod) => (
          <Link href={mod.link} key={mod.title} className="module-card">
            <div className="module-icon">{mod.icon}</div>
            <div className="module-title">{mod.title}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
