import React from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
import styles from "@/styles/Layout.module.css";
const Newsletter = () => {
  return (
    <div>
      {/* Subscribe Newsletter Section */}
      <section className={styles.newsletter}>
          <Container>
            <Row className="align-items-center">
              <Col md={6} className="text-start">
                <h3>Stay Connected With Us</h3>
              </Col>
              <Col md={6} className="text-end">
                <p>Subscribe and receive a discount of up to 15% on your first purchase!</p>
                <div className={styles.newsletter_form}>
                  <input type="email" placeholder="Enter your email" className="form-control" />
                  <Button className={styles.newsletter_btn}>Subscribe</Button>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
    </div>
  )
}

export default Newsletter
