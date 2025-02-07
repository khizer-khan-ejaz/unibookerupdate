import React, { useEffect, useState } from 'react'
import { Container, Row } from 'react-bootstrap'
import styles from '@/styles/Reciept.module.css';
interface Booking {
    id: number;
    token: string;
    itemid: string;
    userid: string;
    host_id: string;
    check_in: string;
    check_out: string;
    start_time: string;
    end_time: string;
    status: string;
    total_night: string;
    per_night: string;
    base_price: string;
    cleaning_charge: string;
    guest_charge: string;
    service_charge: string;
    security_money: string;
    iva_tax: string;
    coupon_code: string | null;
    coupon_discount: number;
    discount_price: number;
    total_guest: string | null;
    amount_to_pay: string;
    total: string;
    admin_commission: string;
    vendor_commission: string;
    vendor_commission_given: string;
    currency_code: string;
    cancellation_reasion: string | null;
    cancelled_charge: string;
    transaction: string;
    payment_method: string;
    payment_status: string;
    item_img: string;
    item_title: string;
    item_data: string;
    wall_amt: string;
    note: string | null;
    rating: string;
    module: string;
    cancelled_by: string | null;
    deductedAmount: number;
    refundableAmount: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    is_item_delivered: number;
    is_item_received: number;
    is_item_returned: number;
    review_status: string;
    review_rating: string;
    review: string;
    host_name: string;
    host_number: string;
    host_email: string;
    host_phone_country: string;
    doorStep_price: string;
    is_received_button: string;
    booking_meta: string;
};
interface Profile {
    token: string;
    first_name: string;
    last_name: string;
    id: string;
    name: string;
    email: string;
    phone: string;
}

const CustomerReciept = () => {
    const [booking, setBooking] = useState<Booking | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);

    useEffect(() => {
        const storedData = localStorage.getItem('userData');
        if (storedData) {
            setProfile(JSON.parse(storedData));
        }
    }, []);

    useEffect(() => {
        const storedBooking = sessionStorage.getItem('bookingData');
        if (storedBooking) {
            setBooking(JSON.parse(storedBooking));
        }
    }, []);

    const extractItemInfo = () => {
        if (!booking || !booking.item_data) return null;
        const itemData = JSON.parse(booking.item_data);
        if (itemData && itemData[0] && itemData[0].item_info) {
            return JSON.parse(itemData[0].item_info);
        }
        return null;
    };

    const itemInfo = extractItemInfo();

    return (
        <main>
            <Container className={styles.availabilityPage}>
                <Row className="justify-content-center text-center my-5 ">
                    <h2>Customer Receipt  #{booking?.id}</h2>
                </Row>
                <Row className={styles.ReceiptPage}>
                    <div>
                        <h3>Customer Receipt #{booking?.id}</h3>
                        <div className={styles.ReceiptCard}>
                            <div className={styles.RecieptCardRow}>
                                <div><p>Booked by <br /><span>{profile?.first_name} {profile?.last_name}</span></p></div>
                            </div>
                            <div className={styles.RecieptCardRow}>
                                <div><p>Reservation Code <br /><span>#{booking?.token}</span></p></div>
                            </div>
                            <div className={styles.RecieptCardRow}>
                                <div><p>Transaction Id <br /><span>{booking?.transaction}</span></p></div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3>Trip Details</h3>
                        <div className={styles.ReceiptCard}>
                            <div className={styles.RecieptCardRow}>
                                <div><p>Trip Start <br /><span>{booking?.check_in} {booking?.start_time}</span></p></div>
                                <div><p>Trip End <br /><span>{booking?.check_out} {booking?.end_time}</span></p></div>
                            </div>
                            <div className={styles.RecieptCardRow}>
                                <div><p>Duration <br /><span>{booking?.total_night} Nights</span></p></div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3>Vehicle Details</h3>
                        <div className={styles.ReceiptCard}>
                            <div className={styles.RecieptCardRow}>
                                <div><p>{booking?.item_title} <br /><span>{booking?.check_in}</span></p></div>
                                <div><p>Type<br /><span>{itemInfo?.vehicleType}</span></p></div>
                            </div>
                            <div className={styles.RecieptCardRow}>
                                <div><p>Year <br /><span>{itemInfo?.year}</span></p></div>
                                <div><p>Model<br /><span>{itemInfo?.model}</span></p></div>
                            </div>
                            <div className={styles.RecieptCardRow}>
                                <div><p>Tramission <br /><span>{itemInfo?.transmission}</span></p></div>
                                <div><p>Odometer<br /><span>{itemInfo?.odometer}</span></p></div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3>Renter Info</h3>
                        <div className={styles.ReceiptCard}>
                            <div className={styles.RecieptCardRow}>
                                <div><p>Name <br /><span>{profile?.first_name} {profile?.last_name}</span></p></div>
                            </div>
                            <div className={styles.RecieptCardRow}>
                                <div><p>Email <br /><span>{profile?.email}</span></p></div>
                            </div>
                            <div className={styles.RecieptCardRow}>
                                <div><p>Phone <br /><span>{profile?.phone}</span></p></div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3>Billing Details</h3>
                        <div className={styles.ReceiptCard}>
                            <div className={styles.RecieptCardRow}>
                                <div><p>Amount {booking?.total_night} Nights<br /><span>{booking?.total}</span></p></div>
                            </div>
                            <div className={styles.RecieptCardRow}>
                                <div><p>Tax<br /><span>{booking?.iva_tax}</span></p></div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3>Owner Details</h3>
                        <div className={styles.ReceiptCard}>
                            <div className={styles.RecieptCardRow}>
                                <div><p>Name <br /><span>{booking?.host_name}</span></p></div>
                                <div><p>Phone <br /><span>{booking?.host_number}</span></p></div>
                            </div>
                            <div className={styles.RecieptCardRow}>
                                <div><p>Email <br /><span>{booking?.host_email}</span></p></div>
                            </div>
                        </div>
                    </div>
                </Row>
            </Container>
        </main>
    )
}

export default CustomerReciept
