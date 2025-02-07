import React, { useState } from "react";
import { FaHome, FaUser, FaCog, FaHeart, FaShoppingCart, FaBars } from "react-icons/fa";
import Link from "next/link";
import styles from "@/styles/Sidebar.module.css";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={isOpen ? styles.sidebarOpen : styles.sidebarClosed}>
      <div className={styles.toggleButton} onClick={() => setIsOpen(!isOpen)}>
        <FaBars />
      </div>
      <ul className={styles.menu}>
        <li>
          <Link href="/"><FaHome className={styles.icon} /> {isOpen && <span>Home</span>}</Link>
        </li>
        <li>
          <Link href="/profile"><FaUser className={styles.icon} /> {isOpen && <span>Profile</span>}</Link>
        </li>
        <li>
          <Link href="/wishlist"><FaHeart className={styles.icon} /> {isOpen && <span>Wishlist</span>}</Link>
        </li>
        <li>
          <Link href="/cart"><FaShoppingCart className={styles.icon} /> {isOpen && <span>Cart</span>}</Link>
        </li>
        <li>
          <Link href="/settings"><FaCog className={styles.icon} /> {isOpen && <span>Settings</span>}</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;