import styles from "@/styles/Layout.module.css";
import logo from '../../../Images/logo.svg';
import { Col, Container, Row } from "react-bootstrap";
import Image from "next/image";
import Link from "next/link";
import { BsFacebook, BsInstagram, BsTwitter, BsYoutube } from "react-icons/bs";
import ios from '../../../Images/app-store.png'
import android from '../../../Images/google-play.png'

const Footer = () => (
  <footer className={styles['theme-footer']}>
    <Container>
      <Row>
        <Col md={2}>
          <div className={styles['logo-section']}>
            <Image src={logo} className={styles['logo']} alt="UniBooker" />
            <p>Elegant pink origami design threedimensional view and decoration co-exist.Great for adding a decorative touch toany room’s decor.</p>
            <ul className={styles['social_icons']}>
              <li><Link href="/"><BsFacebook /></Link></li>
              <li><Link href="/"><BsTwitter /></Link></li>
              <li><Link href="/"><BsInstagram /></Link></li>
              <li><Link href="/"><BsYoutube /></Link></li>
            </ul>
          </div>
        </Col>
        <Col md={8}>
          <Row>
            <Col md={4}>
              <div className={styles['link-section']}>
                <h5>About</h5>
                <ul className={styles['info-section']}>
                  <li><Link href="/about">About Us</Link></li>
                  <li><Link href="/terms-and-services">Terms & Services</Link></li>
                  <li><Link href="/get-help">Get Help</Link></li>
                  <li><Link href="/give-feedback">Give Feedback</Link></li>
                </ul>
              </div>
            </Col>
            <Col md={4}>
              <div className={styles['link-section']}>
                <h5>Sell</h5>
                <ul className={styles['info-section']}>
                  <li><Link href="/">Start Links</Link></li>
                  <li><Link href="/">Seller Protection</Link></li>
                  <li><Link href="/">Learn to Sell</Link></li>
                </ul>
              </div>
            </Col>
            <Col md={4}>
              <div className={styles['link-section']}>
                <h5>Sell</h5>
                <ul className={styles['info-section']}>
                  <li><Link href="/">Start Links</Link></li>
                  <li><Link href="/">Seller Protection</Link></li>
                  <li><Link href="/">Learn to Sell</Link></li>
                </ul>
              </div>
            </Col>
          </Row>
        </Col>
        <Col md={2}>
          <div className={styles['app-section']}>
            <h5>Download Our App</h5>
            <div className="d-flex gap-3">
              <Link href="/"><Image src={android} alt="App" className="img-fluid" /></Link>
              <Link href="/"><Image src={ios} alt="App" className="img-fluid" /></Link>
            </div>
          </div>
        </Col>
        <Col md={12} className={styles['copyright-section']}>
          <p> Copyright &copy; {new Date().getFullYear()} Unibooker All rights reserved. <Link href="/">User agreement</Link>, <Link href="/">Privacy </Link>and <Link href="/">Cookies.</Link></p>
        </Col>
      </Row>
    </Container>
  </footer>
);

export default Footer;
