import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "../../styles/Profile.module.css";
import CarCard from "../components/common/CarCard";
import { BsStarFill } from "react-icons/bs";
import person from '../../Images/person1.jpg'
interface UserProfile {
    name: string;
    profile_image: string;
    profile_background: string;
    intro_text: string;
    total_reviews_on_items: number;
    average_rating_on_items: number;
    years_of_hosting: string;
    languages: string;
    livecity: string;
    age: string;
    join_in: string;
    verified_identity: string;
    verified_email: string;
    verified_phone: string;
}

interface Item {
    id: string;
    name: string;
    item_rating: number;
    price: string;
    image: string;
    city: string;
    state_region: string;
    address: string;
    is_in_wishlist: boolean;
    item_info: string;
}

interface VendorReview {
    item_id: string;
    item_name: string;
    created_at: string;
    guest_response: {
        guest_name: string;
        guest_rating: string;
        guest_message: string;
        guest_profile: string | null;
    };
    host_response: {
        host_name: string;
        host_rating: string;
        host_message: string | null;
        host_profile: string;
    };
}

const ProfilePage: React.FC = () => {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [vendorReviews, setVendorReviews] = useState<VendorReview[] | null>(
        null
    );
    const [userItems, setUserItems] = useState<Item[] | null>(null);

    useEffect(() => {
        const profileData = sessionStorage.getItem("userProfile");
        const reviewsData = sessionStorage.getItem("vendorReviews");
        const itemsData = sessionStorage.getItem("userItems");

        if (profileData) setUserProfile(JSON.parse(profileData));
        if (reviewsData) {
            const parsedReviews = JSON.parse(reviewsData);
            setVendorReviews(parsedReviews.reviews || []);
        }
        if (itemsData) {
            const parsedItems = JSON.parse(itemsData);
            setUserItems(parsedItems.items || []);
        }
    }, []);

    const saveSelectedCar = (car: Item) => {
        sessionStorage.setItem("selectedCar", JSON.stringify(car));
    };

    return (
        <div className={`${styles.ProfileChildCardForm} ${styles.ProfileViewCard} d-flex flex-column gap-5`} >
            {userProfile && (
                <div className="d-flex align-items-center justify-content-center gap-5 text-center">
                    <div className={styles.ProfileImgSection}>
                        <Image
                            src={userProfile.profile_image}
                            width={80}
                            height={80}
                            alt="Profile"
                            className={styles.profileImageDisplay}
                        />
                        <h4>{userProfile.name}</h4>
                        <p>{userProfile.intro_text}</p>
                    </div>

                    <div>
                        <p>
                            <strong>City:</strong> {userProfile.livecity}
                        </p>
                        <p>
                            <strong>Languages:</strong> {userProfile.languages}
                        </p>
                        <p>
                            <strong>Hosting Experience:</strong> {userProfile.years_of_hosting}
                        </p>
                        <p>
                            <strong>Joined In:</strong> {userProfile.join_in}
                        </p>
                        <p>
                            <strong>Verified Identity:</strong>{" "}
                            {userProfile.verified_identity === "1" ? "Yes" : "No"}
                        </p>
                    </div>
                </div>
            )}

            <section className={styles.most_viewed_cars}>
                <h2 className={styles.main_heading}>Most Viewed Cars</h2>
                <div className={styles.cars_row}>
                    {userItems?.map((car: Item, index) => (
                        <div
                            key={index}
                            onClick={() => saveSelectedCar(car)}
                        >
                            <CarCard
                                id={car.id}
                                image={car.image}
                                name={car.name}
                                item_rating={car.item_rating}
                                rating={car.item_rating}
                                location={car.address}
                                price={car.price}
                                is_in_wishlist={car.is_in_wishlist}
                                item_info={car.item_info}
                                saveSelectedCar={saveSelectedCar}
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* Vendor Reviews Section */}
            {vendorReviews && vendorReviews.length > 0 && (
                <div>
                    <h3 className="mb-5">Customer Reviews</h3>
                    <div className={styles.ReviewsGrid}>
                        {vendorReviews.map((review, index) => (
                            <div key={index} className={styles.ReviewCard}>
                                <div className={styles.ReviewCardHeader}>
                                    <div className={styles.ReviewCardHeaderAvtar}>
                                        <Image
                                            src={person}
                                            alt={review.guest_response.guest_name}
                                            className={styles.ReviewCardImage}
                                            width={100}
                                            height={80}
                                        />
                                        <div className={styles.ReviewCardInfo}>
                                            <h4>{review.guest_response.guest_name}</h4>
                                            <p>
                                                {review.guest_response.guest_rating}{" "}
                                                <BsStarFill className={styles.StarIcon} />
                                            </p>
                                        </div>
                                    </div>
                                    <div className={styles.ReviewsInfo}>
                                        <p className={styles.ReviewDate}>
                                            Reviewed in <br />
                                            {new Date(review.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className={styles.ReviewDetails}>
                                    <p className={styles.ReviewText}>{review.guest_response.guest_message}</p>
                                    {review.host_response.host_message && (
                                        <p className={styles.HostResponse}>
                                            <strong></strong> {review.host_response.host_message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
};

export default ProfilePage;
