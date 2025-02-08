import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";

import styles from '@/styles/Auth.module.css';
import Image from "next/image";
import success from '../../Images/success.svg';
import { Jost } from "next/font/google";
import { useRouter } from "next/router";

const jostFont = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
});

const LoginSuccess = () => {
  const router = useRouter();
  const handleLogin = () => {
    router.push('/auth/login'); 
  };
  return (
    <>
      <div className={`${styles.page} ${jostFont.variable}`}>
        <div className={styles.authContainer}>
          <Container>
            <Row className="align-items-center">
              <Col md={6}>
                <div className={styles.authBox_image}>
                  <Image src={success} className="img-fluid" alt="changePassword" />
                </div>
              </Col>
              <Col md={6} className="text-center">
                <div className={styles.authBox}>
                  <div className={styles.contentBox}>
                    <h2 className={styles.authTitle}>Great! Password Changed</h2>
                    <p className={styles.authPara}>Don’t worry We’ll let you know if there is any problem with your account</p>
                  </div>
                  <button type="submit" onClick={handleLogin} className={styles.authButton}>
                      Login
                    </button>
                  {/* Sign Up Option */}
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
        </div>
        
      </div>
    </>
  );
};

export default LoginSuccess;
