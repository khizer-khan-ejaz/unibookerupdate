import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { FaMoon, FaKey, FaBell, FaSms, FaEnvelope } from "react-icons/fa";
import styles from "../../../styles/Profile.module.css";
import { useTheme } from "../../../context/ThemeContext";
import { toast } from "react-toastify";
import api from "@/pages/api/api";
import { useRouter } from "next/router";
import Loader from "./Loader";

const Settings = () => {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("settings");
  const [passwords, setPasswords] = useState({
    old_password: "",
    new_password: "",
    conf_new_password: "",
  });

  const handleToggleTheme = () => {
    toggleTheme();
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const showForm = async () => {
    setStep("changePassword");
  }

  const updatePassword = async () => {
    setLoading(true)
    try {
      const payload = {
        old_password: passwords.old_password,
        new_password: passwords.new_password,
        conf_new_password: passwords.conf_new_password,
      };
      const response = await api.post('/updatePassword', payload);
      toast.success(response.data.message)
      router.push('/profile')
      setLoading(false)
    } catch (error) {
      console.error('Error fetching availability data', error);
      setLoading(true)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Loader />
  }

  return (
    <div className={styles.ProfileChildCard}>
      <h3>Settings</h3>
      <div className={styles.ProfileChildCardForm}>
        {step === "settings" && (
          <div className={styles.settingBox}>
            {/* Dark Mode */}
            <div className={styles.settingItem}>
              <div>
                <FaMoon className={styles.settingIcon} />
                <span>Dark Mode</span>
              </div>
              <Form>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  className={styles.switchIcon}
                  checked={theme === "dark"}
                  onChange={handleToggleTheme}
                />
              </Form>
            </div>
            <div className={styles.settingItem}>
              <span>Change Language</span>
              <span className={styles.settingArrow}>&gt;</span>
            </div>
            <div
              className={styles.settingItem}
              onClick={showForm}
            >
              <div>
                <FaKey className={styles.settingIcon} />
                <span>Change Password</span>
              </div>
              <span className={styles.settingArrow}>&gt;</span>
            </div>
            <h5 className={styles.notificationHeader}>Notification</h5>
            <div className={styles.settingItem}>
              <FaBell className={styles.settingIcon} />
              <span>Push Notification</span>
              <Form.Check type="switch" className={styles.settingSwitch} defaultChecked />
            </div>
            <div className={styles.settingItem}>
              <FaSms className={styles.settingIcon} />
              <span>SMS Notification</span>
              <Form.Check type="switch" className={styles.settingSwitch} defaultChecked />
            </div>
            <div className={styles.settingItem}>
              <FaEnvelope className={styles.settingIcon} />
              <span>Email Notification</span>
              <Form.Check type="switch" className={styles.settingSwitch} />
            </div>
          </div>
        )}
        {step === "changePassword" && (
          <div className={styles.settingBox}>
            <div className={styles.passwordForm}>
              <Form>
                <Form.Group>
                  <Form.Label>Current Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="old_password"
                    placeholder="Enter current password"
                    value={passwords.old_password}
                    onChange={handlePasswordChange}
                    className="form-control mb-4"
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="new_password"
                    placeholder="Enter new password"
                    value={passwords.new_password}
                    onChange={handlePasswordChange}
                    className="form-control mb-4"
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Confirm New Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="conf_new_password"
                    placeholder="Confirm new password"
                    value={passwords.conf_new_password}
                    onChange={handlePasswordChange}
                    className="form-control mb-4"
                  />
                </Form.Group>
                <Button variant="primary" className="theme_btn" onClick={updatePassword}>
                  Update Password
                </Button>
              </Form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;