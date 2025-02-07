import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from "../../styles/CarDetails.module.css";
import { Button, Col, Container, Modal, Row } from 'react-bootstrap';
import { Jost } from 'next/font/google';
import { BsFillSendFill, BsStarFill } from 'react-icons/bs'
import Image from 'next/image';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import Newsletter from '../components/common/Newsletter';
import api from '../api/api';
import Loader from '../components/common/Loader';

interface Feature {
    id: string | number;
    name: string;
}
interface Profile {
    token: string;
    id: string;
    name: string;
    email: string;
}
interface Car {
    id: string;
    name: string;
    item_rating: number;
    latitude: number;
    longitude: number;
    image: string;
    item_type: string;
    address: string;
    reviews: number;
    location?: string;
    price: string;
    distance: string;
    wishlist?: string;
    item_info: {
        host_id: string;
        host_profile_image: string;
        host_first_name: string;
        host_last_name: string;
        odometer: string;
        year: string;
        transmission: string;
        vehicleType: string;
        description: string;
        features_data: Feature[];
        rules: string[];
        cancellation_reason_title: string,
        cancellation_reason_description: string[];
        gallery_image_urls: string[];
    };
}

const jostFont = Jost({
    variable: "--font-jost",
    subsets: ["latin"],
});

const CarDetails = () => {
    const router = useRouter();
    const [carDetails, setCarDetails] = useState<Car | null>(null);
    const [selectedImage, setSelectedImage] = useState<string>("");
    const [showRulesModal, setShowRulesModal] = useState(false);
    const [showCancellationModal, setShowCancellationModal] = useState(false);
    const [profile, setProfile] = useState<Profile | null>(null);

    useEffect(() => {
        const storedData = localStorage.getItem('userData');
        if (storedData) {
            setProfile(JSON.parse(storedData));
        }
    }, []);

    const handleRedirect = async () => {
        try {
            const response = await api.get('/getItemDates', {
                params: {
                    item_id: carDetails?.id,
                    token: profile?.token,
                },
            });
            const { ItemDates } = response.data.data;
            router.push('/check-availability');
            sessionStorage.setItem("availability", JSON.stringify(ItemDates))
            sessionStorage.setItem("itemId", carDetails?.id || "");
            sessionStorage.setItem("carDetails", JSON.stringify(carDetails || ""));
        } catch (error) {
            console.error('Error fetching availability data', error);
        }
    };

    const handleClose = () => {
        setShowRulesModal(false);
        setShowCancellationModal(false);
    };

    const handleShowRules = () => setShowRulesModal(true);
    const handleShowCancellation = () => setShowCancellationModal(true);

    const handleThumbnailClick = (image: string) => {
        setSelectedImage(image);
    };

    useEffect(() => {
        const storedCar = sessionStorage.getItem("selectedCar");
        if (storedCar) {
            const parsedCar = JSON.parse(storedCar);
            setCarDetails({
                ...parsedCar,
                item_info: JSON.parse(parsedCar.item_info),
            });
            if (parsedCar.image) {
                setSelectedImage(parsedCar.image);
            }
        }
    }, []);

    const handleViewProfile = async () => {
        if (!profile) {
            console.error("User profile not available in local storage.");
            return;
        }
        try {
            const userProfileResponse = await api.get('/getUserProfile', {
                params: {
                    userid: carDetails?.item_info.host_id,
                    token: profile.token,
                },
            });
            const userProfile = userProfileResponse.data.data;
            const vendorReviewsResponse = await api.get('/getVendorItemReviews', {
                params: {
                    userid: carDetails?.item_info.host_id,
                    token: profile.token,
                },
            });
            const vendorReviews = vendorReviewsResponse.data.data;
            const userItemsResponse = await api.get('/getUseritems', {
                params: {
                    userid: carDetails?.item_info.host_id,
                    token: profile.token,
                },
            });
            const userItems = userItemsResponse.data.data;
            sessionStorage.setItem("userProfile", JSON.stringify(userProfile));
            sessionStorage.setItem("vendorReviews", JSON.stringify(vendorReviews));
            sessionStorage.setItem("userItems", JSON.stringify(userItems));
            router.push("/host-profile");
        } catch (error) {
            console.error("Error fetching data for profile view:", error);
        }
    };

    if (!carDetails) {
        return <Loader />;
    }

    return (
        <>
            <section className={`${styles.page} ${jostFont.variable} ${styles.carDetailMain}`}>
                <Container>
                    <Row>
                        <Col md={6}>
                            <div className={styles.carDetailImage}>
                                <Zoom>
                                    <Image
                                        src={selectedImage || ""}
                                        alt={carDetails.name}
                                        width={500}
                                        height={500}
                                        className={styles.mainImage}
                                    />
                                </Zoom>
                            </div>
                            <div className={styles.thumbnailGallery}>
                                <Row className="mt-3">
                                    {carDetails.item_info.gallery_image_urls.map((img, index) => (
                                        <Col key={index} xs={3}>
                                            <Image
                                                src={img}
                                                alt={`Thumbnail ${index + 1}`}
                                                width={100}
                                                height={100}
                                                className={`${styles.thumbnail} ${selectedImage === img ? styles.activeThumbnail : ''}`}
                                                onClick={() => handleThumbnailClick(img)}
                                            />
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className={styles.carDetailContent}>
                                <div className={styles.carDetailContentHeading}>
                                    <div>
                                        <h1>{carDetails?.name}</h1>
                                        <p> <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                            <path d="M15.75 7.5C15.75 12.75 9 17.25 9 17.25C9 17.25 2.25 12.75 2.25 7.5C2.25 5.70979 2.96116 3.9929 4.22703 2.72703C5.4929 1.46116 7.20979 0.75 9 0.75C10.7902 0.75 12.5071 1.46116 13.773 2.72703C15.0388 3.9929 15.75 5.70979 15.75 7.5Z" stroke="#17BEBB" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M9 9.75C10.2426 9.75 11.25 8.74264 11.25 7.5C11.25 6.25736 10.2426 5.25 9 5.25C7.75736 5.25 6.75 6.25736 6.75 7.5C6.75 8.74264 7.75736 9.75 9 9.75Z" stroke="#17BEBB" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg> {carDetails?.address}</p>
                                    </div>
                                    <div className={styles.carDetailRating}>
                                        <p>{carDetails?.item_rating} <BsStarFill /></p>
                                    </div>
                                </div>
                                <div className={styles.PersonDetailBox}>
                                    <div className={styles.personBox}>
                                        <Image src={carDetails?.item_info?.host_profile_image} alt={carDetails?.item_info?.host_first_name} className={styles.postedPersonImg} width={65} height={65} />
                                        <div className={styles.personBoxContact}>
                                            <h4>Hosted by {carDetails?.item_info?.host_first_name} {carDetails?.item_info?.host_last_name}</h4>
                                            <button onClick={handleViewProfile}>View Profile</button>
                                        </div>
                                    </div>
                                    <div className={styles.personBoxIcon}>
                                        <BsFillSendFill />
                                    </div>
                                </div>
                                <div className={styles.carDetailBox}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M12 3.6C10.795 3.6 9.81818 4.67454 9.81818 6C9.81818 7.32546 10.795 8.4 12 8.4C13.2044 8.39832 14.1803 7.3248 14.1818 6C14.1818 4.67454 13.205 3.6 12 3.6ZM12 7.2C11.3975 7.2 10.9091 6.66277 10.9091 6C10.9091 5.33723 11.3975 4.8 12 4.8C12.6023 4.80044 13.0905 5.33745 13.0909 6C13.0909 6.66277 12.6025 7.2 12 7.2ZM12 15.6C10.795 15.6 9.81818 16.6745 9.81818 18C9.81818 19.3255 10.795 20.4 12 20.4C13.2044 20.3983 14.1803 19.3248 14.1818 18C14.1818 16.6745 13.205 15.6 12 15.6ZM12 19.2C11.3975 19.2 10.9091 18.6628 10.9091 18C10.9091 17.3372 11.3975 16.8 12 16.8C12.6023 16.8004 13.0905 17.3375 13.0909 18C13.0909 18.6628 12.6025 19.2 12 19.2ZM24 3C23.9998 2.66887 23.7556 2.39978 23.4545 2.4H18.4462C18.1268 1.02371 17.0024 0.00139164 15.652 0H8.34801C6.99763 0.00139164 5.87316 1.02371 5.55382 2.4H0.545455C0.244429 2.40022 -0.000199623 2.6688 1.22236e-07 3C0.000532813 5.23455 1.01294 7.20593 2.55782 8.4H0.545455C0.244429 8.40022 -0.000199623 8.6688 1.22236e-07 9C0.000532813 11.2345 1.01294 13.2059 2.55782 14.4H0.545455C0.244429 14.4002 -0.000199623 14.6688 1.22236e-07 15C0.000799104 18.4764 2.44582 21.3183 5.5467 21.5747C5.85778 22.9641 6.98917 23.9985 8.34801 24H15.652C17.0108 23.9985 18.1422 22.9641 18.4533 21.5747C21.5542 21.3183 23.9992 18.4764 24 15C23.9998 14.6689 23.7556 14.3998 23.4545 14.4H21.4422C22.9871 13.2059 23.9995 11.2345 24 9C23.9998 8.66887 23.7556 8.39978 23.4545 8.4H21.4422C22.9871 7.20593 23.9995 5.23455 24 3ZM5.45455 20.366C3.17551 20.0856 1.37669 18.1069 1.1218 15.6H5.45455V20.366ZM5.45455 14.366C3.17551 14.0856 1.37669 12.1069 1.1218 9.6H5.45455V14.366ZM5.45455 8.36602C3.17551 8.08564 1.37669 6.10693 1.1218 3.6H5.45455V8.36602ZM17.4545 9V15V20.8172C17.4534 21.9118 16.6471 22.7988 15.652 22.8H8.34801C7.35292 22.7988 6.54659 21.9118 6.54545 20.8172V15V9V3.18281C6.54659 2.08821 7.35292 1.20125 8.34801 1.2H15.652C16.6471 1.20125 17.4534 2.08821 17.4545 3.18281V9ZM22.8782 15.6C22.6233 18.1069 20.8245 20.0856 18.5455 20.366V15.6H22.8782ZM22.8782 9.6C22.6233 12.1069 20.8245 14.0856 18.5455 14.366V9.6H22.8782ZM18.5455 8.36602V3.6H22.8782C22.6233 6.10693 20.8245 8.08564 18.5455 8.36602ZM12 9.6C10.795 9.6 9.81818 10.6745 9.81818 12C9.81818 13.3255 10.795 14.4 12 14.4C13.2044 14.3983 14.1803 13.3248 14.1818 12C14.1818 10.6745 13.205 9.6 12 9.6ZM12 13.2C11.3975 13.2 10.9091 12.6628 10.9091 12C10.9091 11.3372 11.3975 10.8 12 10.8C12.6023 10.8004 13.0905 11.3375 13.0909 12C13.0909 12.6628 12.6025 13.2 12 13.2Z" fill="#17BEBB" />
                                    </svg>
                                    <div className={styles.carDetailBoxContent}>
                                        <h6>Odometer</h6>
                                        <p>{carDetails?.item_info?.odometer}</p>
                                    </div>
                                </div>
                                <div className={styles.carDetailBox}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                                        <g opacity="0.7">
                                            <path d="M19.7578 4H17.7578V3C17.7578 2.73478 17.6525 2.48043 17.4649 2.29289C17.2774 2.10536 17.023 2 16.7578 2C16.4926 2 16.2382 2.10536 16.0507 2.29289C15.8632 2.48043 15.7578 2.73478 15.7578 3V4H9.75781V3C9.75781 2.73478 9.65246 2.48043 9.46492 2.29289C9.27738 2.10536 9.02303 2 8.75781 2C8.4926 2 8.23824 2.10536 8.05071 2.29289C7.86317 2.48043 7.75781 2.73478 7.75781 3V4H5.75781C4.96216 4 4.1991 4.31607 3.63649 4.87868C3.07388 5.44129 2.75781 6.20435 2.75781 7V19C2.75781 19.7956 3.07388 20.5587 3.63649 21.1213C4.1991 21.6839 4.96216 22 5.75781 22H19.7578C20.5535 22 21.3165 21.6839 21.8791 21.1213C22.4417 20.5587 22.7578 19.7956 22.7578 19V7C22.7578 6.20435 22.4417 5.44129 21.8791 4.87868C21.3165 4.31607 20.5535 4 19.7578 4ZM20.7578 19C20.7578 19.2652 20.6525 19.5196 20.4649 19.7071C20.2774 19.8946 20.023 20 19.7578 20H5.75781C5.4926 20 5.23824 19.8946 5.05071 19.7071C4.86317 19.5196 4.75781 19.2652 4.75781 19V12H20.7578V19ZM20.7578 10H4.75781V7C4.75781 6.73478 4.86317 6.48043 5.05071 6.29289C5.23824 6.10536 5.4926 6 5.75781 6H7.75781V7C7.75781 7.26522 7.86317 7.51957 8.05071 7.70711C8.23824 7.89464 8.4926 8 8.75781 8C9.02303 8 9.27738 7.89464 9.46492 7.70711C9.65246 7.51957 9.75781 7.26522 9.75781 7V6H15.7578V7C15.7578 7.26522 15.8632 7.51957 16.0507 7.70711C16.2382 7.89464 16.4926 8 16.7578 8C17.023 8 17.2774 7.89464 17.4649 7.70711C17.6525 7.51957 17.7578 7.26522 17.7578 7V6H19.7578C20.023 6 20.2774 6.10536 20.4649 6.29289C20.6525 6.48043 20.7578 6.73478 20.7578 7V10Z" fill="#17BEBB" />
                                        </g>
                                    </svg>
                                    <div className={styles.carDetailBoxContent}>
                                        <h6>Year {carDetails?.item_info?.year}</h6>
                                    </div>
                                </div>
                                <div className={styles.carDetailBox}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                                        <path d="M12.2232 1.40436e-07C12.0308 -0.000110206 11.844 0.0648105 11.6932 0.184223C11.5423 0.303636 11.4363 0.470531 11.3922 0.657814L9.92301 6.90491C8.1414 6.6604 6.32799 6.98137 4.73854 7.82254C3.14909 8.66372 1.86383 9.98266 1.06403 11.5933C0.264234 13.204 -0.00973654 15.0251 0.280764 16.7998C0.571264 18.5745 1.41157 20.2132 2.68317 21.4848C3.95477 22.7564 5.59348 23.5967 7.36817 23.8872C9.14287 24.1777 10.964 23.9037 12.5746 23.1039C14.1853 22.3041 15.5042 21.0189 16.3454 19.4294C17.1866 17.84 17.5076 16.0266 17.2631 14.245L23.5102 12.7758C23.6974 12.7317 23.8643 12.6256 23.9837 12.4748C24.1032 12.3239 24.1681 12.1371 24.168 11.9447C24.1644 8.77791 22.9047 5.74181 20.6654 3.50252C18.4262 1.26323 15.3901 0.00361319 12.2232 1.40436e-07ZM8.20724 15.9607C8.3672 16.1207 8.58418 16.2107 8.81045 16.2107C8.8762 16.2108 8.94176 16.2033 9.00583 16.1885L12.2155 15.4326C12.2014 16.1006 11.9912 16.7497 11.6112 17.2992C11.2312 17.8488 10.6981 18.2746 10.0781 18.5237C9.45816 18.7728 8.77866 18.8343 8.12406 18.7004C7.46946 18.5666 6.86861 18.2434 6.39616 17.771C5.92371 17.2985 5.6005 16.6977 5.46667 16.0431C5.33284 15.3885 5.3943 14.709 5.64342 14.089C5.89253 13.469 6.31832 12.9359 6.86787 12.5559C7.41743 12.1759 8.06652 11.9658 8.73451 11.9516L7.97943 15.1621C7.94624 15.3036 7.94975 15.4513 7.98962 15.591C8.02948 15.7308 8.10439 15.858 8.20724 15.9607ZM9.95629 14.2117L11.8939 5.97834C13.5555 6.00515 15.1415 6.67715 16.3166 7.85222C17.4917 9.0273 18.1637 10.6133 18.1905 12.2749L9.95629 14.2117ZM15.636 15.3575C15.636 16.7075 15.2357 18.0271 14.4857 19.1496C13.7357 20.2721 12.6697 21.1469 11.4225 21.6635C10.1753 22.1801 8.80287 22.3153 7.47884 22.0519C6.15481 21.7886 4.93861 21.1385 3.98404 20.1839C3.02947 19.2294 2.3794 18.0132 2.11603 16.6891C1.85267 15.3651 1.98784 13.9927 2.50445 12.7455C3.02106 11.4983 3.89591 10.4323 5.01836 9.68227C6.14082 8.93227 7.46048 8.53196 8.81045 8.53196C9.05101 8.53278 9.29137 8.54617 9.53054 8.57206L9.13466 10.2546C9.0263 10.2477 8.9188 10.2383 8.81045 10.2383C7.79797 10.2383 6.80823 10.5386 5.96638 11.1011C5.12454 11.6636 4.4684 12.4631 4.08095 13.3985C3.69349 14.3339 3.59211 15.3632 3.78964 16.3562C3.98716 17.3492 4.47471 18.2614 5.19064 18.9773C5.90657 19.6933 6.81872 20.1808 7.81174 20.3783C8.80477 20.5759 9.83406 20.4745 10.7695 20.087C11.7049 19.6996 12.5044 19.0434 13.0669 18.2016C13.6294 17.3597 13.9296 16.37 13.9296 15.3575C13.9296 15.2492 13.9202 15.1417 13.9134 15.0333L15.5959 14.6374C15.6218 14.8766 15.6352 15.117 15.636 15.3575ZM19.8764 11.8765C19.7538 9.905 18.9153 8.04619 17.5185 6.64945C16.1218 5.2527 14.263 4.41421 12.2915 4.29157L12.8938 1.72772C15.371 1.89381 17.7039 2.95291 19.4595 4.70849C21.2151 6.46407 22.2742 8.79692 22.4402 11.2741L19.8764 11.8765Z" fill="#17BEBB" />
                                    </svg>
                                    <div className={styles.carDetailBoxContent}>
                                        <h6>Transmission </h6>
                                        <p>{carDetails?.item_info?.transmission}</p>
                                    </div>
                                </div>
                                <div className={styles.carDetailBox}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                        <path d="M24.3242 16.911C24.3242 14.6196 24.1367 12.3805 24.0617 12.1342C24.0055 11.955 23.6445 11.4848 22.8242 10.5966C21.9945 9.6935 22.0133 9.82785 21.8633 9.23821C21.9992 9.17103 22.1305 9.04415 22.2102 9.02922C22.3883 8.99936 22.3977 9.26806 22.768 9.26806C23.1383 9.26806 23.9398 9.11132 24.1039 8.85009C24.268 8.58885 24.3195 8.49929 24.3195 8.26791C24.3195 8.03653 24.2352 7.55884 24.0758 7.27521C23.9164 6.99159 23.2367 6.84978 22.8383 6.76767C22.4398 6.68557 22.3836 6.76767 22.2805 6.87217C22.1164 7.03637 22.107 8.5366 22.107 8.5366L21.718 8.55153C21.4648 7.55884 21.1133 5.55853 20.5648 3.98366C19.9648 2.26697 19.3367 1.72958 19.0742 1.59523C18.8164 1.46834 18.582 1.37878 16.8242 1.09515C15.0289 0.796597 13.5992 0.759277 12.3242 0.759277C11.0492 0.759277 9.61953 0.80406 7.82422 1.09515C6.06641 1.38624 5.83203 1.46834 5.57422 1.59523C5.31641 1.72211 4.68359 2.26697 4.08359 3.98366C3.53516 5.55853 3.18359 7.55884 2.93047 8.55153L2.54141 8.5366C2.54141 8.5366 2.53672 7.03637 2.36797 6.87217C2.26484 6.76767 2.20859 6.67811 1.81016 6.76767C1.41172 6.85724 0.732031 6.99159 0.572656 7.27521C0.413281 7.55884 0.328906 8.03653 0.328906 8.26791C0.328906 8.49929 0.380469 8.59632 0.544531 8.85009C0.708594 9.11132 1.51016 9.26806 1.88047 9.26806C2.25078 9.26806 2.26016 8.99936 2.43828 9.02922C2.51797 9.04415 2.65391 9.17103 2.78516 9.23821C2.63047 9.82785 2.65391 9.6935 1.82422 10.5966C1.00391 11.4923 0.638281 11.955 0.586719 12.1342C0.511719 12.3805 0.324219 14.6196 0.324219 16.911C0.324219 19.2024 0.427344 21.2625 0.427344 21.9939C0.427344 22.2999 0.427344 22.8373 0.469531 23.3523C0.497656 23.6584 0.539844 23.9569 0.614844 24.1883C0.741406 24.5988 0.858594 24.6361 1.34141 24.5988C1.96016 24.554 2.85547 24.5988 3.77891 24.6585C4.39766 24.6958 5.03047 24.7331 5.59297 24.7555C6.99922 24.8003 6.58672 24.4271 7.18672 24.4421C7.78672 24.457 10.1539 24.6137 12.3195 24.6137C14.4852 24.6137 16.857 24.457 17.4523 24.4421C18.0523 24.4271 17.6398 24.8003 19.0461 24.7555C19.6086 24.7406 20.2414 24.6958 20.8602 24.6585C21.7836 24.6063 22.6836 24.554 23.2977 24.5988C23.7805 24.6361 23.8977 24.5988 24.0242 24.1883C24.0945 23.9569 24.1414 23.6584 24.1695 23.3523C24.2164 22.8373 24.2117 22.2999 24.2117 21.9939C24.2211 21.2699 24.3242 19.2024 24.3242 16.911ZM4.36484 5.61078C4.58984 4.77483 5.26484 3.09546 5.59297 2.79691C5.67266 2.72227 6.37109 2.37147 8.11953 2.18487C9.72734 2.0132 11.5039 1.94603 12.3289 1.94603C13.1539 1.94603 14.9305 2.0132 16.5383 2.18487C18.282 2.37147 18.9898 2.71481 19.0648 2.79691C19.4867 3.25967 20.068 4.77483 20.293 5.61078C20.518 6.44673 20.818 8.08877 20.7617 8.31269C20.7055 8.5366 20.818 8.64856 20.0586 8.55153C19.3039 8.46197 14.5648 8.36494 12.3336 8.36494C10.107 8.36494 5.36797 8.46197 4.60859 8.55153C3.84922 8.6411 3.96172 8.5366 3.90547 8.31269C3.83984 8.08877 4.13984 6.45419 4.36484 5.61078ZM6.08984 14.9555C5.75234 15.0899 5.55078 15.381 5.12891 15.3735C4.70703 15.3735 3.56797 15.0675 3.32422 15.0525C3.08047 15.0376 2.86484 15.3138 2.73828 15.366C2.61172 15.4183 2.36328 15.2765 1.98828 15.0899C1.61328 14.9033 1.39297 14.9555 1.27109 14.142C1.14453 13.3359 1.27109 12.179 1.27109 12.179C2.08203 12.1193 2.86484 12.2387 4.33203 12.8955C5.79922 13.5523 6.61484 14.8137 6.61484 14.8137C6.61484 14.8137 6.42734 14.8212 6.08984 14.9555ZM17.1148 20.837C16.4445 20.9788 13.6367 21.0162 12.3242 21.0162C11.0117 21.0162 8.20391 20.9714 7.53359 20.837C6.84922 20.6952 5.95859 19.389 6.57266 18.3516C7.40234 16.9409 7.24766 16.9857 9.13203 16.5976C10.7633 16.2617 12.0008 16.2468 12.3242 16.2468C12.643 16.2468 13.8852 16.2691 15.5164 16.5976C17.4008 16.9857 17.2461 16.9409 18.0758 18.3516C18.6898 19.389 17.7992 20.6952 17.1148 20.837ZM23.3773 14.1494C23.2508 14.9555 23.0352 14.9107 22.6602 15.0973C22.2852 15.2839 22.0367 15.4183 21.9102 15.3735C21.7836 15.3287 21.568 15.0525 21.3242 15.06C21.0805 15.0749 19.9414 15.381 19.5195 15.381C19.0977 15.381 18.8961 15.0973 18.5586 14.963C18.2211 14.8286 18.0336 14.8286 18.0336 14.8286C18.0336 14.8286 18.8445 13.5598 20.3164 12.9104C21.7836 12.2536 22.5664 12.1342 23.3773 12.1939C23.3773 12.179 23.5039 13.3359 23.3773 14.1494Z" fill="#17BEBB" />
                                    </svg>
                                    <div className={styles.carDetailBoxContent}>
                                        <h6>Car Type </h6>
                                        <p>{carDetails?.item_info?.vehicleType}</p>
                                    </div>
                                </div>
                                <div className={styles.carFeatures}>
                                    <h4>Car Features</h4>
                                    <div className={styles.carFeaturesList}>
                                        <ul>
                                            {carDetails?.item_info?.features_data?.map((feature: Feature, index: number) => (
                                                <li key={feature.id || index}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                        <path d="M17.3006 6.29988C17.2081 6.20717 17.0982 6.13363 16.9772 6.08344C16.8563 6.03326 16.7266 6.00743 16.5956 6.00743C16.4647 6.00743 16.335 6.03326 16.214 6.08344C16.093 6.13363 15.9831 6.20717 15.8906 6.29988L10.2506 11.9399L11.6606 13.3499L17.3006 7.69988C17.6806 7.31988 17.6806 6.67988 17.3006 6.29988ZM21.5406 6.28988L11.6606 16.1699L8.18063 12.6999C7.99365 12.5129 7.74005 12.4079 7.47563 12.4079C7.2112 12.4079 6.9576 12.5129 6.77063 12.6999C6.58365 12.8869 6.4786 13.1405 6.4786 13.4049C6.4786 13.6693 6.58365 13.9229 6.77063 14.1099L10.9506 18.2899C11.3406 18.6799 11.9706 18.6799 12.3606 18.2899L22.9506 7.70988C23.0433 7.61736 23.1169 7.50747 23.1671 7.3865C23.2172 7.26553 23.2431 7.13585 23.2431 7.00488C23.2431 6.87391 23.2172 6.74423 23.1671 6.62325C23.1169 6.50228 23.0433 6.39239 22.9506 6.29988H22.9406C22.8504 6.20548 22.7421 6.13017 22.6223 6.0784C22.5024 6.02664 22.3733 5.99949 22.2427 5.99856C22.1122 5.99763 21.9827 6.02293 21.8621 6.07298C21.7415 6.12302 21.6322 6.19678 21.5406 6.28988ZM1.12062 14.1199L5.30063 18.2999C5.69063 18.6899 6.32063 18.6899 6.71063 18.2999L7.41062 17.5999L2.53062 12.6999C2.43811 12.6072 2.32822 12.5336 2.20725 12.4834C2.08628 12.4333 1.95659 12.4074 1.82563 12.4074C1.69466 12.4074 1.56497 12.4333 1.444 12.4834C1.32303 12.5336 1.21314 12.6072 1.12062 12.6999C0.730625 13.0899 0.730625 13.7299 1.12062 14.1199Z" fill="#63EB67" />
                                                    </svg>
                                                    <span>{feature.name}</span>
                                                </li>
                                            ))}

                                        </ul>
                                    </div>
                                </div>
                                <div className={styles.checkoutRightSectionPolicy}>
                                    <div className={styles.checkoutRightSectionPolicyBox} onClick={handleShowRules} data-bs-toggle="modal" data-bs-target="#rulesModal">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <g clipPath="url(#clip0_1966_5371)">
                                                <g clipPath="url(#clip1_1966_5371)">
                                                    <path d="M8 6.13281H21" stroke="#17BEBB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M8 12.1328H21" stroke="#17BEBB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M8 18.1328H21" stroke="#17BEBB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M3 6.13281H3.01" stroke="#17BEBB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M3 12.1328H3.01" stroke="#17BEBB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M3 18.1328H3.01" stroke="#17BEBB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </g>
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_1966_5371">
                                                    <rect width="24" height="24" fill="white" />
                                                </clipPath>
                                                <clipPath id="clip1_1966_5371">
                                                    <rect width="24" height="24" fill="white" transform="translate(0 0.132812)" />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                        <p>House Rules</p>
                                    </div>
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <g clipPath="url(#clip0_1966_5380)">
                                                <path d="M9.99981 18.9999C9.76615 19.0004 9.53972 18.919 9.35981 18.7699C9.25855 18.686 9.17485 18.5829 9.11349 18.4665C9.05214 18.3502 9.01435 18.2229 9.00227 18.0919C8.99019 17.9609 9.00408 17.8289 9.04312 17.7033C9.08217 17.5777 9.1456 17.461 9.22981 17.3599L13.7098 11.9999L9.38981 6.62994C9.30674 6.52765 9.24471 6.40996 9.20728 6.28362C9.16985 6.15728 9.15775 6.02479 9.17169 5.89376C9.18563 5.76273 9.22533 5.63575 9.2885 5.52011C9.35168 5.40447 9.43708 5.30246 9.53981 5.21994C9.64327 5.1289 9.76444 5.06024 9.8957 5.01825C10.027 4.97626 10.1655 4.96185 10.3026 4.97594C10.4397 4.99002 10.5724 5.03229 10.6924 5.1001C10.8123 5.1679 10.917 5.25977 10.9998 5.36994L15.8298 11.3699C15.9769 11.5489 16.0573 11.7733 16.0573 12.0049C16.0573 12.2366 15.9769 12.461 15.8298 12.6399L10.8298 18.6399C10.7295 18.761 10.6021 18.8566 10.4578 18.9192C10.3136 18.9817 10.1567 19.0094 9.99981 18.9999Z" fill="#BDBDBD" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_1966_5380">
                                                    <rect width="24" height="24" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                    </div>
                                </div>
                                <div className={styles.checkoutRightSectionPolicy}>
                                    <div className={styles.checkoutRightSectionPolicyBox} onClick={handleShowCancellation} data-bs-toggle="modal" data-bs-target="#cancellationModal">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                                            <path d="M4 9.13281H20" stroke="#17BEBB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M4 15.1328H20" stroke="#17BEBB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M10 3.13281L8 21.1328" stroke="#17BEBB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M16 3.13281L14 21.1328" stroke="#17BEBB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <p>Cancellation Policy</p>
                                    </div>
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <g clipPath="url(#clip0_1966_5380)">
                                                <path d="M9.99981 18.9999C9.76615 19.0004 9.53972 18.919 9.35981 18.7699C9.25855 18.686 9.17485 18.5829 9.11349 18.4665C9.05214 18.3502 9.01435 18.2229 9.00227 18.0919C8.99019 17.9609 9.00408 17.8289 9.04312 17.7033C9.08217 17.5777 9.1456 17.461 9.22981 17.3599L13.7098 11.9999L9.38981 6.62994C9.30674 6.52765 9.24471 6.40996 9.20728 6.28362C9.16985 6.15728 9.15775 6.02479 9.17169 5.89376C9.18563 5.76273 9.22533 5.63575 9.2885 5.52011C9.35168 5.40447 9.43708 5.30246 9.53981 5.21994C9.64327 5.1289 9.76444 5.06024 9.8957 5.01825C10.027 4.97626 10.1655 4.96185 10.3026 4.97594C10.4397 4.99002 10.5724 5.03229 10.6924 5.1001C10.8123 5.1679 10.917 5.25977 10.9998 5.36994L15.8298 11.3699C15.9769 11.5489 16.0573 11.7733 16.0573 12.0049C16.0573 12.2366 15.9769 12.461 15.8298 12.6399L10.8298 18.6399C10.7295 18.761 10.6021 18.8566 10.4578 18.9192C10.3136 18.9817 10.1567 19.0094 9.99981 18.9999Z" fill="#BDBDBD" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_1966_5380">
                                                    <rect width="24" height="24" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                    </div>
                                </div>
                                <div className={styles.carDetailBoxButton}>
                                    <p>${carDetails.price}<span>/day</span> </p>
                                    <Button type='button' onClick={handleRedirect} className={styles.themeBtn}>Check Availability</Button>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <div className={styles.aboutSection}>
                                <h4>About the car</h4>
                                <p>{carDetails?.item_info?.description}</p>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <div className={styles.aboutSection}>
                                <h4>We will be here</h4>
                                <iframe
                                    className={styles.aboutSectionMap}
                                    src={`https://www.google.com/maps?q=${carDetails.latitude},${carDetails.longitude}&hl=en&z=15&output=embed`}
                                    width="100%"
                                    height="600"
                                    loading="lazy"
                                />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
            {/* House Rules Modal */}
            <Modal show={showRulesModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>House Rules</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ul>
                        {carDetails.item_info.rules.map((rule: string, index: number) => (
                            <li key={index}>{rule}</li>
                        ))}
                    </ul>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Cancellation Policy Modal */}
            <Modal show={showCancellationModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{carDetails.item_info.cancellation_reason_title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ul>
                        {carDetails.item_info.cancellation_reason_description?.map((desc, index) => (
                            <li key={index}>{desc}</li>
                        ))}
                    </ul>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <Newsletter />
        </>
    );
};

export default CarDetails;
