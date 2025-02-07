import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import Newsletter from "../components/common/Newsletter";
import styles from '@/styles/Auth.module.css';
import Image from "next/image";
import checkLogin from '../../Images/loggedin.png';
import pattern from '../../Images/pattern.svg';
import { Jost } from "next/font/google";
  
const jostFont = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
});

const Loggedin = () => {

  return (
    <>
      <div className={`${styles.page} ${jostFont.variable}`}>
        <div className={styles.authContainer}>
          <Container>
            <Row className="align-items-center">
              <Col md={8} className="m-auto text-center">
                <div className={styles.authBox_image}>
                  <Image src={checkLogin} className="img-fluid" alt="Login" />
                </div>
                <div className={styles.authBox}>
                  <div className={styles.contentBox}>
                    <h2 className={styles.authTitle}>Please log in again to access all functionality.</h2>
                    <p className={styles.authParaLoggedin}>You are logged in with another device, so the token has expired.</p>
                    <Link className={styles.authParaLoggedinLink} href="/auth/signup"> Login</Link>
                  </div>
                </div>
                <div className={styles.patternBox}>
                    <Image src={pattern} className="img-fluid" alt="Pattern" />
                </div>
              </Col>
            </Row>
          </Container>
        </div>
        <Newsletter />
      </div>
    </>
  );
};

export default Loggedin;
