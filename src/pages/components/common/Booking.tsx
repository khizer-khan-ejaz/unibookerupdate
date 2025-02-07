import React, { useState, useEffect } from "react";
import location from '../../../Images/location.svg';
import styles from "../../../styles/Profile.module.css";
import Image from "next/image";
import { BsCalendar2Event, BsFillPersonFill, BsStarFill } from "react-icons/bs";
import { FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import { MdArrowForward, MdArrowBack } from "react-icons/md";
import api from "@/pages/api/api";
import { useRouter } from "next/router";
import { Modal } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";

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

type BookingData = {
  upcoming: Booking[];
  previous: Booking[];
  cancelled: Booking[];
};

interface CancelReason {
  id: string;
  name: string;
  reason: string;
  order_cancellation_id: number
}

const Booking = () => {
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingData>({
    upcoming: [],
    previous: [],
    cancelled: [],
  });

  const [activeTab, setActiveTab] = useState<'upcoming' | 'previous' | 'cancelled'>('upcoming');
  const [currentPage, setCurrentPage] = useState(1);
  const [cancelReasons, setCancelReasons] = useState<CancelReason[]>([]);
  const [selectedReason, setSelectedReason] = useState<string | number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBookingId, setCurrentBookingId] = useState<number | null>(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const bookingsPerPage = 5;

  const fetchBookings = async () => {
    const params = {
      type: "upcoming",
      offset: "0",
      item_type: "0",
    };

    try {
      const response = await api.get("/bookingRecord", { params });
      if (response.data.status === 200) {
        const bookings: Booking[] = response.data.data.Bookings || [];
        setBookings({
          upcoming: bookings.filter(booking => booking.status === "Confirmed" || booking.status === "Pending") || [],
          previous: bookings.filter(booking => booking.status === "Completed") || [],
          cancelled: bookings.filter(booking => booking.status === "Cancelled") || [],
        });
      } else {
        toast.error("Error fetching booking records:", response.data.message);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('An unknown error occurred');
      }
    }
  };

  const currentBookings = bookings[activeTab].slice(
    (currentPage - 1) * bookingsPerPage,
    currentPage * bookingsPerPage
  );
  const totalPages = Math.ceil(bookings[activeTab].length / bookingsPerPage);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEReceiptClick = (booking: Booking) => {
    sessionStorage.setItem('bookingData', JSON.stringify(booking));
    router.push('/customer-reciept');
  };

  const fetchCancelReasons = async () => {
    try {
      const userType = "user";
      const response = await api.get(`/getCancelReasons?userType=${userType}`);
      if (response.data.status === 200) {
        const reasons: CancelReason[] = response.data?.data?.reasons || [];
        if (reasons.length === 0) {
          toast.error("No cancellation reasons are available. Please contact support.");
        } else {
          setCancelReasons(reasons);
          setIsModalOpen(true);
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('An unknown error occurred');
      }
    }
  };

  const openCancelModal = (bookingId: number) => {
    setCurrentBookingId(bookingId);
    setIsModalOpen(true);
    fetchCancelReasons();
  };

  const handleCancelBooking = async () => {
    if (!currentBookingId) return;
    const ticketData = {
      booking_id: currentBookingId,
      cancellation_reasion: selectedReason,
    };

    try {
      const response = await api.post('/cancelBookingByUser', ticketData);
      if (response.data.status === 200) {
        toast.success("Booking cancelled successfully.");
        setIsModalOpen(false);
        fetchBookings();
      } else {
        toast.error("Error cancelling booking:", response.data.message);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('An unknown error occurred');
      }
    }
  };

  const openConfirmationModal = () => {
    setIsConfirmationOpen(true);
  };

  const handleConfirmation = () => {
    handleCancelBooking();
    setIsConfirmationOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsConfirmationOpen(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className={styles.ProfileChildCard}>
      <h3>My Bookings</h3>
      <div className={styles.ProfileChildCardForm}>
        <div className={styles.Tabs}>
          <div className={styles.TabsList}>
            <button
              className={`${styles.TabButton} ${activeTab === "upcoming" ? styles.ActiveTab : ""}`}
              onClick={() => setActiveTab("upcoming")}
            >
              Upcoming
            </button>
            <button
              className={`${styles.TabButton} ${activeTab === "previous" ? styles.ActiveTab : ""}`}
              onClick={() => setActiveTab("previous")}
            >
              Previous
            </button>
            <button
              className={`${styles.TabButton} ${activeTab === "cancelled" ? styles.ActiveTab : ""}`}
              onClick={() => setActiveTab("cancelled")}
            >
              Cancelled
            </button>
          </div>
          {/* <Link href="/" className={styles.SeeAllLink}>See All</Link> */}
        </div>
        <div className={styles.BookingGrid}>
          {currentBookings.length === 0 ? (
            <p>No data available</p>
          ) : (
            currentBookings.map((booking: Booking) => {
              const itemData = JSON.parse(booking.item_data);
              const itemInfo = itemData[0];
              return (
                <div key={booking.id} className={styles.BookingCard}>
                  <Image
                    src={booking.item_img}
                    alt={booking.item_title}
                    className={styles.BookingImage}
                    width={300}
                    height={500}
                  />
                  <div className={styles.BookingDetails}>
                    <div className={styles.BookingDetailsRow}>
                      <div className={styles.BookingDetailsRowHead}>
                        <h4>{booking.item_title}</h4>
                        <p className={styles.BookingLocation}>
                          <Image src={location} alt="Location" />
                          {itemInfo.address}
                        </p>
                      </div>
                      <div>
                        <p className={styles.BookingPrice}>${itemInfo.price} <span>/night</span></p>
                        <p className={styles.BookingRating}>{itemInfo.item_rating} <BsStarFill /></p>
                      </div>
                    </div>
                    <div>
                      <p className={styles.BookingDates}><BsCalendar2Event className={styles.Icon} />{booking?.check_in}<sub className={styles.BookingStatus}>{booking.status}</sub></p>
                      <p className={styles.BookingOwner}>
                        <BsFillPersonFill className={styles.Icon} />
                        Owner: {booking.host_name}
                      </p>
                      <p>
                        <FaEnvelope className={styles.Icon} /> {booking.host_email}
                      </p>
                      <p>
                        <FaPhoneAlt className={styles.Icon} /> {booking.host_number}
                      </p>
                    </div>
                    <div className={styles.BookingActions}>
                      <button className={styles.CancelButton} onClick={() => openCancelModal(booking.id)}>Cancel</button>
                      <button onClick={() => handleEReceiptClick(booking)} className={styles.EReceiptButton}>E-Receipt</button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {currentBookings.length > 0 && (
          <div className="Pagination">
            <button
              className="PageButton"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <MdArrowBack />
            </button>
            <div className="d-flex gap-3">
              <span className="PageInfo active">
                {currentPage}
              </span>
              <span className="PageInfo">
                {totalPages}
              </span>
            </div>
            <button
              className="PageButton"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <MdArrowForward />
            </button>
          </div>
        )}
      </div>
      <Modal show={isModalOpen} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Select a reason for cancellation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <select
            className="form-control"
            value={selectedReason ?? ""}
            onChange={(e) => setSelectedReason(Number(e.target.value))}
          >
            <option value="" disabled>Select reason</option>
            {cancelReasons.map((reason) => (
              <option key={reason.order_cancellation_id} value={reason.order_cancellation_id}>
                {reason.reason}
              </option>
            ))}
          </select>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-primary"
            onClick={openConfirmationModal}
          >
            Proceed
          </button>
          <button
            className="btn btn-secondary"
            onClick={closeModal}
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>

      {/* Bootstrap Modal for confirmation */}
      <Modal show={isConfirmationOpen} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure you want to cancel this booking?</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <button
            className="btn btn-danger"
            onClick={handleConfirmation}
          >
            Yes
          </button>
          <button
            className="btn btn-secondary"
            onClick={closeModal}
          >
            No
          </button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default Booking;
