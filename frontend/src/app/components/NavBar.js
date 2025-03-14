"use client";

import React from "react";
import Image from "next/image";
import { Layout, Menu, Avatar, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import styles from "./Navbar.module.css";

const { Header } = Layout;

const Navbar = () => {
  const menuItems = [
    { key: "1", label: "Home" },
    { key: "2", label: "About Us" },
    { key: "3", label: "Contact Us" },
  ];

  return (
    <Header className={styles.navbar}>
      {/* Left Side - Logo */}
      <div className={styles.logoContainer}>
        <Image
          src="/images/logo.png"
          alt="Logo"
          width={150} 
          height={50} 
          priority
          className={styles.logo}
        />
      </div>

      {/* Center - Navigation Links */}
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={["1"]}
        className={styles.menu}
        items={menuItems}
      />

      {/* Right Side - Profile/Login Buttons */}
      <div className={styles.profileContainer}>
        
        <Button type="primary" className={styles.authButton}>
          Login
        </Button>
        <Button type="default" className={styles.authButton}>
          Sign Up
        </Button>
        <Avatar size="large" icon={<UserOutlined />} />
      </div>
    </Header>
  );
};

export default Navbar;