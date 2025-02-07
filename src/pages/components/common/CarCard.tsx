import React, { useState } from "react";
import Image from "next/image";
import styles from "../../../styles/CarCard.module.css";

import wishlistIcon from "../../../Images/wishlist.svg";
import heartfilled from "../../../Images/heart-filled.svg";
import { FaStar, FaMapMarkerAlt } from "react-icons/fa";
import Link from "next/link";
import { toast } from "react-toastify";
import api from "../../api/api"; // Ensure API is properly imported

// ✅ Define an interface for the car object
interface Car {
  id: string;
  name: string;
  image: string;
  item_rating: number;
}

interface CarCardProps {
  id: string;
  name: string;
  item_rating: number;
  image: string;
  price: number;
  is_in_wishlist?: boolean;
  saveSelectedCar: (car: Car) => void; // ✅ Updated with a proper type
}

const CarCard: React.FC<CarCardProps> = ({
  id,
  name,
  item_rating,
  image,
  price,
  is_in_wishlist = false,
  saveSelectedCar,
}) => {
  const [inWishlist, setInWishlist] = useState(is_in_wishlist);

  const handleWishlistToggle = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (typeof window === "undefined") return;
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");

    if (!userData?.token && !userData?.accessToken) {
      toast.info("Please log in to use the wishlist.");
      return;
    }

    const payload = { item_id: id, token: userData?.token || userData?.accessToken };

    try {
      const response = inWishlist
        ? await api.get("/removeFromWishlist", { params: payload })
        : await api.post("/addToWishlist", payload);

      if (response.status === 200) {
        setInWishlist(!inWishlist);
        toast.success(inWishlist ? "Removed from wishlist!" : "Added to wishlist!");
      } else {
        toast.error("Failed to update wishlist.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An unknown error occurred");
    }
  };

  return (
    <div className={styles.carCard}>
      {/* Car Image */}
      <div className={styles.carImage}>
        <Image src={image} alt={name} width={300} height={200} />
        <div className={styles.wishlist} onClick={handleWishlistToggle}>
          <Image src={inWishlist ? heartfilled : wishlistIcon} alt="Wishlist" width={20} height={20} />
        </div>
      </div>

      {/* Car Details */}
      <div className={styles.carDetails}>
        <div className={styles.rating}>
          <span className={styles.ratingValue}>
            {item_rating} <FaStar color="white" size={12} />
          </span>
          <span className={styles.trips}> | 28 Trips</span>
        </div>

        <div className={styles.priceRow}>
          <div className={styles.carsitem}>
            <Link
              href={`/items/${id}`}
              className={styles.carName}
              onClick={() => saveSelectedCar({ id, name, image, item_rating })} // ✅ Properly typed function
            >
              {name}
            </Link>
            <p className={styles.carInfo}>Seats</p>
          </div>
          <div className={styles.carsitem}>
            <span className={styles.price}>₹{price}/hr</span>
            <span className={styles.fees}>₹46 excluding fees</span>
          </div>
        </div>

        <hr className={styles.dotted} />

        <div className={styles.caritemfooter}>
          <div className={styles.locationRow}>
            <FaMapMarkerAlt size={12} />
            <span>8.5 km away</span>
          </div>

          {/* Features Badges */}
          <div className={styles.badges}>
            <span className={styles.badge}>ACTIVE FASTAG</span>
            <span className={styles.badge}>HOME DELIVERY</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
