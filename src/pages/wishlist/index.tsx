import React, { useEffect, useState } from "react";
import Head from "next/head";
import { Container, Row, Col } from "react-bootstrap";
import styles from "@/styles/CarList.module.css";
import api from "@/pages/api/api";
import CarCard from "@/pages/components/common/CarCard";
import Loader from "@/pages/components/common/Loader";
interface Car {
    id: string;
    name: string;
    item_rating: number;
    is_in_wishlist: boolean
    address: string;
    state_region: string;
    city: string;
    zip_postal_code: string;
    price: string;
    latitude: string;
    longitude: string;
    status: string;
    item_type_id: string;
    image: string;
    item_info: string;
    is_verified: string;
    is_featured: string;
    booking_policies_id: number;
    weekly_discount: string;
    weekly_discount_type: string;
    monthly_discount: string;
    monthly_discount_type: string;
    doorStep_price: string | null;
    cancellation_reason_title: string;
    cancellation_reason_description: string[];
    features_data: {
        id: number;
        name: string;
        image_url: string | null;
    }[];
}

interface Profile {
    token: string;
    id: string;
    name: string;
    email: string;
}

const Wishlist = () => {
    const [wishlist, setWishlist] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<Profile | null>(null);

    useEffect(() => {
        const storedData = localStorage.getItem('userData');
        if (storedData) {
            setProfile(JSON.parse(storedData));
        }
    }, []);

    useEffect(() => {
        const fetchWishlist = async () => {
            setLoading(true)
            if (profile?.token) {
                try {
                    const response = await api.get('/getWishlist', {
                        params: {
                            token: profile?.token,
                        },
                    });
                    const items = response.data?.data?.items || [];
                    setWishlist(items);
                    setLoading(false)
                } catch (error) {
                    console.error('Error fetching availability data', error);
                    setLoading(true)
                } finally {
                    setLoading(false)
                }
            }
        };

        if (profile) {
            fetchWishlist();
        }
    }, [profile]);

    const saveSelectedCar = (item: Car) => {
        sessionStorage.setItem("selectedCar", JSON.stringify(item));
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <>
            <Head>
                <title>Wishlist | Unibooker</title>
                <meta name="description" content="Wishlist for cars and bikes on Unibooker" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <section className={`${styles.car_list_main} ${styles.page}`}>
                <Container>
                    <Row>
                        <Col md={12} className={styles.main_heading}>
                            <h2>Your Wishlist</h2>
                        </Col>
                    </Row>
                    <Row>
                        <div className={styles.cars_row}>
                            {wishlist.length > 0 ? (
                                wishlist.map((item, index) => (

                                    <div
                                        key={index}
                                        onClick={() => saveSelectedCar(item)}
                                    >
                                        <CarCard
                                            id={item.id}
                                            image={item.image}
                                            name={item.name}
                                            item_rating={item.item_rating}
                                            rating={item.item_rating}
                                            location={item.address}
                                            price={item.price}
                                            is_in_wishlist={item.is_in_wishlist}
                                            item_info={item.item_info}
                                            saveSelectedCar={saveSelectedCar}
                                        />
                                    </div>

                                ))
                            ) : (
                                <Col md={12}>
                                    <p className={styles.no_items}>No items in your wishlist yet.</p>
                                </Col>
                            )}
                        </div>
                    </Row>
                </Container>
            </section>
        </>
    );
};

export default Wishlist;
