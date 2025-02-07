import React, { useState } from "react";
import car from "../../../Images/car.png";
import styles from "../../../styles/Profile.module.css";
import Image from "next/image";
import { BsStarFill } from "react-icons/bs";
import { MdArrowBack, MdArrowForward } from "react-icons/md";

const Booking = () => {
  const reviews = [
    {
      id: 1,
      name: "Asteria Hotel",
      location: "Wilora NT 0872, Australia",
      rating: "5.0",
      reviewText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      reviewer: {
        name: "Sabbir Sourov",
        email: "asteriahotel@gmail.com",
        phone: "+9 681 08629",
      },
      dates: "Reviewed on 13 April 2024",
      imageUrl: car,
    },
    {
      id: 2,
      name: "Sunrise Villa",
      location: "Malibu, California",
      rating: "4.8",
      reviewText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      reviewer: {
        name: "John Doe",
        email: "sunrisevilla@gmail.com",
        phone: "+1 123 456 789",
      },
      dates: "Reviewed on 14 March 2024",
      imageUrl: car,
    },
    {
      id: 3,
      name: "Ocean Breeze Resort",
      location: "Miami Beach, Florida",
      rating: "4.5",
      reviewText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua..",
      reviewer: {
        name: "Anna Smith",
        email: "oceanbreeze@gmail.com",
        phone: "+1 987 654 321",
      },
      dates: "Reviewed on 25 February 2024",
      imageUrl: car,
    },
  ];

  const [activeTab, setActiveTab] = useState("All Reviews");
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 2; // You can change the number of reviews per page
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getCurrentPageReviews = () => {
    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    return reviews.slice(indexOfFirstReview, indexOfLastReview);
  };

  return (
    <div className={styles.ProfileChildCard}>
      <h3>My Bookings</h3>
      <div className={styles.ProfileChildCardForm}>
        <div className={styles.Tabs}>
          <div className={styles.TabsList}>
            <button
              className={`${styles.TabButton} ${activeTab === "All Reviews" ? styles.ActiveTab : ""}`}
              onClick={() => setActiveTab("All Reviews")}
            >
              All Reviews
            </button>
            <button
              className={`${styles.TabButton} ${activeTab === "previous" ? styles.ActiveTab : ""}`}
              onClick={() => setActiveTab("previous")}
            >
              Reviews By Me
            </button>
          </div>
        </div>
        <div className={styles.ReviewsGrid}>
          {getCurrentPageReviews().map((review) => (
            <div key={review.id} className={styles.ReviewCard}>
              <div className={styles.ReviewCardHeader}>
                <div className={styles.ReviewCardHeaderAvtar}>
                  <Image
                    src={review.imageUrl}
                    alt={review.name}
                    className={styles.ReviewCardImage}
                    width={100}
                    height={80}
                  />
                  <div className={styles.ReviewCardInfo}>
                    <h4>{review.name}</h4>
                    <p>{review.rating} <BsStarFill className={styles.StarIcon} /></p>
                  </div>
                </div>
                <div className={styles.ReviewsInfo}>
                  <p className={styles.ReviewDate}>Reviewed in <br />{review.dates}</p>
                </div>
              </div>
              <div className={styles.ReviewDetails}>
                <p className={styles.ReviewText}>{review.reviewText}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="Pagination">
          <button
            className="PageButton"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <MdArrowBack />
          </button>
          <div className="d-flex gap-3">
            <span className="PageInfo active">{currentPage}</span>
            <span className="PageInfo">{totalPages}</span>
          </div>
          <button
            className="PageButton"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <MdArrowForward />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Booking;
