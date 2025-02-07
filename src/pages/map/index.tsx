import React from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import carImage from '../../Images/car.png';
import styles from '@/styles/MapPage.module.css'

const index = () => {
  const containerStyle = {
    width: '100%',
    height: '100vh',
  };

  const center = {
    lat: 22.8456,
    lng: 89.5403,
  };

  return (
    <Container fluid className={styles.mapPage}>
      <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
        </GoogleMap>
      </LoadScript>
      <div className={styles.searchBar}>
        <Form.Control
          type="text"
          placeholder="Where do you go?"
          className={styles.searchInput}
        />
        <Button variant="light" className={styles.filterButton}>
          Filter
        </Button>
      </div>
      <div className={styles.cardContainer}>
        <Card className={styles.infoCard}>
          <Card.Img variant="top" src={carImage.src} alt="Car" />
          <Card.Body>
            <Card.Title>BMW Cabriolet</Card.Title>
            <Card.Text>
              <small>Wilora NT 0872, Australia</small>
              <small>THB 4000 / Day</small>
            </Card.Text>
            <Button variant="outline-secondary" className={styles.closeButton}>
              ×
            </Button>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default index;
