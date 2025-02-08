import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";

import styles from '@/styles/Auth.module.css';
import Image from "next/image";
import changePassword from '../../Images/changePassword.svg';
import pattern from '../../Images/pattern.svg';
import { Jost } from "next/font/google";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { BsFillInfoCircleFill } from "react-icons/bs";

const jostFont = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
});

const CreatePassword = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <>
      <div className={`${styles.page} ${jostFont.variable}`}>
        <div className={styles.authContainer}>
          <Container>
            <Row className="align-items-center">
              <Col md={6}>
                <div className={styles.authBox_image}>
                  <Image src={changePassword} className="img-fluid" alt="changePassword" />
                </div>
              </Col>
              <Col md={6}>
                <div className={styles.authBox}>
                  <div className={styles.contentBox}>
                    <h2 className={styles.authTitle}>Change Password?</h2>
                    <p className={styles.authPara}>Verification code was sent to your email address.</p>
                  </div>
                  <form>
                    {/* Email Input with Icon */}
                    <div className={styles.formGroup}>
                      <div className={styles.inputWithIcon}>
                        <svg className={styles.icon} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z" stroke="#17BEBB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M7 11.0002V7.00015C6.99876 5.7602 7.45828 4.56402 8.28938 3.64382C9.12047 2.72362 10.2638 2.14506 11.4975 2.02044C12.7312 1.89583 13.9671 2.23406 14.9655 2.96947C15.9638 3.70488 16.6533 4.785 16.9 6.00015" stroke="#17BEBB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <input
                          type={passwordVisible ? "text" : "password"}
                          placeholder="Enter your password"
                          required
                          className={styles.authInput}
                        />
                        <span className={styles.eyeIcon} onClick={togglePasswordVisibility}>
                          {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                        </span>
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <div className={styles.inputWithIcon}>
                        <svg className={styles.icon} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z" stroke="#17BEBB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M7 11.0002V7.00015C6.99876 5.7602 7.45828 4.56402 8.28938 3.64382C9.12047 2.72362 10.2638 2.14506 11.4975 2.02044C12.7312 1.89583 13.9671 2.23406 14.9655 2.96947C15.9638 3.70488 16.6533 4.785 16.9 6.00015" stroke="#17BEBB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <input
                          type={passwordVisible ? "text" : "password"}
                          placeholder="Confirm your password"
                          required
                          className={styles.authInput}
                        />
                        <span className={styles.eyeIcon} onClick={togglePasswordVisibility}>
                          {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                        </span>
                      </div>
                    </div>
                    <div className={styles.infoIcon}>
                        <BsFillInfoCircleFill /> <p>For enhanced security, ensure your password includes at least one uppercase letter, one lowercase letter, a symbol, and incorporate numbers.</p>
                    </div>
                    <button type="submit" className={styles.authButton}>
                      Continue
                    </button>
                  </form>
                  {/* Sign Up Option */}
                  <div className={styles.authLinks}>
                    <p>Try again<Link href="/auth/signup"> Go Back</Link></p>
                  </div>
                </div>
                <div className={styles.patternBox}>
                    <Image src={pattern} className="img-fluid" alt="Pattern" />
                </div>
              </Col>
            </Row>
          </Container>
        </div>
        
      </div>
    </>
  );
};

export default CreatePassword;
