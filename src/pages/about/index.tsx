import React, { useEffect, useState } from 'react';
import styles from '../../styles/About.module.css';
import { Container, Row, Col } from 'react-bootstrap';
import Loader from '../components/common/Loader'
import api from "@/pages/api/api";

interface AboutUsData {
    name: string;
    content: string;
}

const About = () => {
    const [loading, setLoading] = useState(true);
    const [aboutUsData, setAboutUsData] = useState<AboutUsData | null>(null)

    useEffect(() => {
        const fetchAboutUs = async () => {
            setLoading(true)
            try {
                const response = await api.get('/StaticPage', {
                    params: {
                        id: 2,
                    }
                });
                const items = response.data?.data.StaticPage || [];
                setAboutUsData(items);
                setLoading(false)
            } catch (error) {
                console.error('Error fetching availability data', error);
                setLoading(true)
            } finally {
                setLoading(false)
            }
        }
        fetchAboutUs();
    }, []);

    if (loading) {
        return <Loader />;
    }

    return (
        <section className={styles.aboutPage}>
            <Container>
                <Row>
                    <Col md={12} className={styles.aboutContent}>
                        <h1 className={styles.aboutHeading}>{aboutUsData?.name}</h1>
                        <div
                        dangerouslySetInnerHTML={{ __html: aboutUsData?.content || '' }}
                    />
                        
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default About;
