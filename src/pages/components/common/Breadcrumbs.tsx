import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from "@/styles/Layout.module.css";
import { Col, Container, Row } from 'react-bootstrap';
import Image from 'next/image';
import home from '../../../Images/home.svg';

interface BreadcrumbsProps {
    parent?: {
        name?: string;
        link?: string;
    };
    currentPage?: string;
}

const Breadcrumbs = ({ parent = {}, currentPage }: BreadcrumbsProps) => {
    const router = useRouter();
    const pathSegments = router.pathname.split('/').filter(Boolean);
    const parentPageName = parent.name || pathSegments[pathSegments.length - 2] || 'Parent Page';
    const parentPageLink = parent.link || `/${pathSegments.slice(0, -1).join('/')}`;
    const currentPageName = currentPage || pathSegments[pathSegments.length - 1] || 'Current Page';

    return (
        <section className={styles.breadcrumbs_section}>
            <Container>
                <Row>
                    <Col md={12}>
                        <nav className={styles.breadcrumbs}>
                            <ul>
                                <li>
                                    <Link href="/"><Image src={home} alt="Home" /> Home</Link>
                                </li>
                                {pathSegments.length > 1 && (
                                    <li>
                                        <Link href={parentPageLink}>{parentPageName.replace(/-/g, ' ')}</Link>
                                    </li>
                                )}
                                <li className={styles.current}>{currentPageName.replace(/-/g, ' ')}</li>
                            </ul>
                        </nav>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default Breadcrumbs;
