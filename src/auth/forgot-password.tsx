import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";

import styles from '@/styles/Auth.module.css';
import Image from "next/image";
import forgot_password from '../../Images/forgot_password.png';
import { Jost } from "next/font/google";
import { useEffect, useState } from "react";
import api from "../api/api";
import changePassword from '../../Images/changePassword.svg';
import { toast, ToastContainer } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { BsFillInfoCircleFill } from "react-icons/bs";
import { useRouter } from "next/router";

const jostFont = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
});

const ForgotPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForgotPasswordForm, setShoworgotPasswordForm] = useState(true);
  const [otp, setOtp] = useState("");
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [timer, setTimer] = useState(10);
  const [resendEnabled, setResendEnabled] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    } else {
      setResendEnabled(true);
    }
  }, [timer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({
        email: email,
      }).toString();
      const response = await api.get(`/forgotPassword?${queryParams}`);
      toast.success(response.data.message);
      setResetToken(response.data.data.reset_token);
      setShoworgotPasswordForm(false)
      setShowOtpForm(true)
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('An unknown error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const queryParams = new URLSearchParams({
        email: email,
        token: "",
        reset_token: otp,
      }).toString();
      const response = await api.get(`/verifyResetToken?${queryParams}`);
      if (response.status === 200) {
        setShowOtpForm(false)
        setShowPasswordForm(true)
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('An unknown error occurred');
      }
    }
  };

  const handleResendOtp = async () => {
    setOtp("")
    try {
      setResendEnabled(false);
      setTimer(300);
      const queryParams = new URLSearchParams({
        email: email,
        token: "",
      }).toString();
      const response = await api.get(`/ResendToken?${queryParams}`);
      if (response.status === 200) {
        toast.success("OTP has been resent successfully.");
      } else {
        toast.error("Failed to resend OTP. Please try again.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('An unknown error occurred');
      }
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Password didn't match")
      return;
    }
    const requestData = {
      email: email,
      reset_token: resetToken,
      password: password,
      confirm_password: confirmPassword,
      token: ""
    };

    try {
      const response = await api.post("/resetPassword", requestData);
      if (response.status === 200) {
        toast.success(response.data.message)
        router.push("/auth/login-success");
      }
      else {
        toast.error(response.data.message)
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('An unknown error occurred');
      }
    }
  };


  return (
    <>
      <div className={`${styles.page} ${jostFont.variable}`}>
        <div className={styles.authContainer}>
          {showForgotPasswordForm && (
            <Container>
              <Row className="align-items-center">
                <Col md={6}>
                  <div className={styles.authBox_image}>
                    <Image src={forgot_password} className="img-fluid" alt="Login" />
                  </div>
                </Col>
                <Col md={6}>
                  <div className={styles.authBox}>
                    <div className={styles.contentBox}>
                      <h2 className={styles.authTitle}>Change Password?</h2>
                      <p className={styles.authPara}>
                        To reset your password, please enter the email address associated with your account.
                        We will then send you a secure link to create a new password.
                      </p>
                    </div>
                    <form onSubmit={handleSubmit}>
                      <div className={styles.formGroup}>
                        <div className={styles.inputWithIcon}>
                          <svg className={styles.icon} width="24" height="17" viewBox="0 0 24 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20.4 0H3.6C2.64522 0 1.72955 0.335825 1.05442 0.933597C0.379285 1.53137 0 2.34212 0 3.1875V13.8125C0 14.6579 0.379285 15.4686 1.05442 16.0664C1.72955 16.6642 2.64522 17 3.6 17H20.4C21.3548 17 22.2705 16.6642 22.9456 16.0664C23.6207 15.4686 24 14.6579 24 13.8125V3.1875C24 2.34212 23.6207 1.53137 22.9456 0.933597C22.2705 0.335825 21.3548 0 20.4 0ZM3.6 2.125H20.4C20.7183 2.125 21.0235 2.23694 21.2485 2.4362C21.4736 2.63546 21.6 2.90571 21.6 3.1875L12 8.3725L2.4 3.1875C2.4 2.90571 2.52643 2.63546 2.75147 2.4362C2.97652 2.23694 3.28174 2.125 3.6 2.125ZM21.6 13.8125C21.6 14.0943 21.4736 14.3645 21.2485 14.5638C21.0235 14.7631 20.7183 14.875 20.4 14.875H3.6C3.28174 14.875 2.97652 14.7631 2.75147 14.5638C2.52643 14.3645 2.4 14.0943 2.4 13.8125V5.61L11.376 10.4656C11.5584 10.5589 11.7654 10.608 11.976 10.608C12.1866 10.608 12.3936 10.5589 12.576 10.4656L21.6 5.61V13.8125Z" fill="#17BEBB" />
                          </svg>
                          <input
                            type="email"
                            placeholder="Email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.authInput}
                          />
                        </div>
                      </div>
                      <button type="submit" className={styles.authButton} disabled={isLoading}>
                        {isLoading ? "Sending..." : "Continue"}
                      </button>
                    </form>
                    <div className={styles.authLinks}>
                      <p>Try again<Link href="/auth/signup"> Go Back</Link></p>
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
          )}
          {showOtpForm && (
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
                    <form onSubmit={handleOtpSubmit}>
                      <div className={styles.formGroup}>
                        <div className={styles.inputWithIcon}>
                          <input
                            type="number"
                            placeholder="Enter OTP here"
                            required
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className={styles.authInput}
                          />
                        </div>
                      </div>
                      <div className={styles.inputWithIcon}>
                        <button
                          type="button"
                          className={styles.resendButton}
                          onClick={handleResendOtp}
                          disabled={!resendEnabled}
                        >
                          {resendEnabled ? "Resend OTP" : `Resend OTP in ${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, "0")}`}
                        </button>
                      </div>
                      <button type="submit" className={styles.authButton}>
                        Continue
                      </button>
                    </form>
                    <div className={styles.authLinks}>
                      <p>Try again<Link href="/auth/signup"> Go Back</Link></p>
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
          )}
          {showPasswordForm && (
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
                    <form onSubmit={handlePasswordSubmit}>
                      <div className={styles.formGroup}>
                        <div className={styles.inputWithIcon}>
                          <svg className={styles.icon} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z" stroke="#17BEBB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M7 11.0002V7.00015C6.99876 5.7602 7.45828 4.56402 8.28938 3.64382C9.12047 2.72362 10.2638 2.14506 11.4975 2.02044C12.7312 1.89583 13.9671 2.23406 14.9655 2.96947C15.9638 3.70488 16.6533 4.785 16.9 6.00015" stroke="#17BEBB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <input
                            type={passwordVisible ? "text" : "password"}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={styles.authInput}
                            required
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
                    <div className={styles.authLinks}>
                      <p>Try again<Link href="/auth/signup"> Go Back</Link></p>
                    </div>
                  </div>
                  {/* <div className={styles.patternBox}>
                     <Image src={pattern} className="img-fluid" alt="Pattern" />
                 </div> */}
                </Col>
              </Row>
            </Container>
          )}
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      
        <ToastContainer />
      </div>
    </>
  );
};

export default ForgotPassword;