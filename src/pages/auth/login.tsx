import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import Newsletter from "../components/common/Newsletter";
import styles from "@/styles/Auth.module.css";
import Image from "next/image";
import loginimg from "../../Images/login.png";
import { Jost } from "next/font/google";
import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import api from "../api/api";
import changePassword from '../../Images/changePassword.svg';
import GoogleLogin from "./google-login";

const jostFont = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
});

type RegistrationData = {
  phone: string;
  phone_country: string;
  token: string;
}

const Login = () => {
  const { login } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState("login");
  const [otp, setOtp] = useState("");
  const [registrationData, setRegistrationData] = useState<RegistrationData | null>();
  const [resendEnabled, setResendEnabled] = useState(true);
  const [timer, setTimer] = useState(300);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    } else {
      setResendEnabled(true);
    }
  }, [timer]);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validateForm = () => {
      const { email, password } = formData;
      if (!email || !password) {
        toast.error("Please fill in all fields.");
        return false;
      }
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        toast.error("Please enter a valid email address.");
        setError("Please enter a valid email address.")
        return false;
      }
      return true;
    };
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await api.post("/userEmailLogin", formData);
      if (response.status === 200) {
        if (response.data.message === "Account Inactive") {
          setRegistrationData(response.data.data);
          setStep("otpVerification");
          toast.info("Your account is inactive. Please verify via OTP.");
        } else {
          const userData = response.data.data;
          login(userData);
          toast.success(response?.data?.message);
          localStorage.setItem("userToken", userData.token);
          router.push("/");
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setOtp("");
    if (!registrationData) {
      toast.error("No account data found. Please try logging in again.");
      return;
    }
    try {
      setResendEnabled(false);
      setTimer(300);
      const queryParams = new URLSearchParams({
        phone: registrationData.phone,
        phone_country: registrationData.phone_country,
        token: registrationData.token,
      }).toString();
      const response = await api.get(`/ResendOtp?${queryParams}`);
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

  const handleOtpSubmit = async () => {
    if (!registrationData) {
      toast.error("No registration data found. Please try logging in again.");
      return;
    }
    try {
      const queryParams = new URLSearchParams({
        phone: registrationData.phone,
        otp_value: otp,
        phone_country: registrationData.phone_country,
        token: registrationData.token,
      }).toString();
      const response = await api.get(`/otpVerification?${queryParams}`);
      if (response.status === 200) {
        const userData = response.data.data;
        login(userData);
        localStorage.setItem("userToken", userData.token);
        toast.success(response.data.message);
        router.push("/");
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

  return (
    <>
      <div className={`${styles.page} ${jostFont.variable}`}>
        <div className={styles.authContainer}>
          <Container>
            {step === "login" && (
              <Row className="align-items-center">
                <Col md={6}>
                  <div className={styles.authBox_image}>
                    <Image src={loginimg} className="img-fluid" alt="Login" />
                  </div>
                </Col>
                <Col md={6}>
                  <div className={styles.authBox}>
                    <div className={styles.contentBox}>
                      <h2 className={styles.authTitle}>Sign In</h2>
                      <p className={styles.authPara}>Welcome Back.</p>
                    </div>
                    <form onSubmit={handleSubmit}>
                      {/* Email Input with Icon */}
                      <div className={styles.formGroup}>
                        <div className={styles.inputWithIcon}>
                          <svg className={styles.icon} width="24" height="17" viewBox="0 0 24 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20.4 0H3.6C2.64522 0 1.72955 0.335825 1.05442 0.933597C0.379285 1.53137 0 2.34212 0 3.1875V13.8125C0 14.6579 0.379285 15.4686 1.05442 16.0664C1.72955 16.6642 2.64522 17 3.6 17H20.4C21.3548 17 22.2705 16.6642 22.9456 16.0664C23.6207 15.4686 24 14.6579 24 13.8125V3.1875C24 2.34212 23.6207 1.53137 22.9456 0.933597C22.2705 0.335825 21.3548 0 20.4 0ZM3.6 2.125H20.4C20.7183 2.125 21.0235 2.23694 21.2485 2.4362C21.4736 2.63546 21.6 2.90571 21.6 3.1875L12 8.3725L2.4 3.1875C2.4 2.90571 2.52643 2.63546 2.75147 2.4362C2.97652 2.23694 3.28174 2.125 3.6 2.125ZM21.6 13.8125C21.6 14.0943 21.4736 14.3645 21.2485 14.5638C21.0235 14.7631 20.7183 14.875 20.4 14.875H3.6C3.28174 14.875 2.97652 14.7631 2.75147 14.5638C2.52643 14.3645 2.4 14.0943 2.4 13.8125V5.61L11.376 10.4656C11.5584 10.5589 11.7654 10.608 11.976 10.608C12.1866 10.608 12.3936 10.5589 12.576 10.4656L21.6 5.61V13.8125Z" fill="#17BEBB" />
                          </svg>
                          <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            required
                            className={styles.authInput}
                            value={formData.email}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      {/* Password Input with Eye Icon */}
                      <div className={styles.formGroup}>
                        <div className={styles.inputWithIcon}>
                          <svg className={styles.icon} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z" stroke="#17BEBB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M7 11.0002V7.00015C6.99876 5.7602 7.45828 4.56402 8.28938 3.64382C9.12047 2.72362 10.2638 2.14506 11.4975 2.02044C12.7312 1.89583 13.9671 2.23406 14.9655 2.96947C15.9638 3.70488 16.6533 4.785 16.9 6.00015" stroke="#17BEBB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <input
                            type={passwordVisible ? "text" : "password"}
                            name="password"
                            placeholder="Enter your password"
                            required
                            className={styles.authInput}
                            value={formData.password}
                            onChange={handleChange}
                          />
                          <span className={styles.eyeIcon} onClick={togglePasswordVisibility}>
                            {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                          </span>
                        </div>
                      </div>
                      {/* Forgot Password Link */}
                      <div className={styles.authLinks}>
                        <Link href="/auth/forgot-password">Forgot Password?</Link>
                      </div>
                      <button type="submit" className={styles.authButton} disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                      </button>
                    </form>
                    {/* Sign In with Google/Apple */}
                    <GoogleLogin />
                    {/* Sign Up Option */}
                    <div className={styles.authLinks}>
                      <p>Don&apos;t have an account?<Link href="/auth/signup"> Sign up</Link></p>
                    </div>
                  </div>
                </Col>
              </Row>
            )}
            {step === "otpVerification" && (
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
            )}
            {error && <p className="text-sm text-red-600">{error}</p>}

          </Container>
        </div>
        <Newsletter />
        <ToastContainer />
      </div>
    </>
  );
};

export default Login;
