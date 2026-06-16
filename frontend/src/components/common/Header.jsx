import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Header.module.css";

const navLinks = [
  {
    path: "/dashboard",
    label: "Dashboard",
    isActive: (pathname) => pathname === "/dashboard",
  },
  {
    path: "/",
    label: "Posts",
    isActive: (pathname) => pathname === "/" || /^\/posts\/[^/]+(\/edit)?$/.test(pathname),
  },
  {
    path: "/workflow",
    label: "Workflow",
    isActive: (pathname) => pathname === "/workflow",
  },
  {
    path: "/insights",
    label: "Insights",
    isActive: (pathname) => pathname === "/insights",
  },
  {
    path: "/posts/new",
    label: "Write Post",
    isActive: (pathname) => pathname === "/posts/new",
  },
];

const Header = () => {
  const location = useLocation();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/dashboard" className={styles.logo}>
          <span className={styles.logoIcon}>✦</span>
          <span className={styles.logoText}>BlogVault</span>
        </Link>

        <nav className={styles.nav}>
          {navLinks.map(({ path, label, isActive }) => (
            <Link
              key={path}
              to={path}
              className={`${styles.navLink} ${
                isActive(location.pathname) ? styles.navLinkActive : ""
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
