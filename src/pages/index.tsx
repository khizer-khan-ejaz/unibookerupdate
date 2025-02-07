import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { Jost } from "next/font/google";
import d1 from '../Images/d1.svg'
import d2 from '../Images/d2.svg'
import d3 from '../Images/d3.svg'
import testimonial from '../Images/testimonial.png'
import person1 from '../Images/person1.jpg'
import Newsletter from "./components/common/Newsletter";
import { BsShieldFillCheck } from "react-icons/bs";

import Loader from "./components/common/Loader";
import Popularlocations from './components/common/PopularLocations'
import Slider from "react-slick";
import styles from "@/styles/Home.module.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";


import LogoCarousel from "./component/comon/company"
import { useRef } from "react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import CalendarComponent from "./component/comon/search"
import  CarCarousel from "./component/comon/car";
import api from '../api/api'
import { useRouter } from "next/router";

interface MostViewedItem {
  id: string;
  name: string;
  item_rating: number;
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
  host_id: string;
  host_first_name: string;
  host_last_name: string;
  host_email: string;
  host_phone: string;
  host_player_id: string;
  host_profile_image: string;
  gallery_image_urls: string[];
  review_data: {
    id: number;
    booking_id: string;
    guest_id: string;
    guest_name: string;
    guest_profile_image: string | null;
    rating: string;
    message: string;
    created_at: string;
    updated_at: string;
  }[];
  total_reviews: number;
  is_in_wishlist: boolean;
  item_type: string;
}
interface HomeData {
  locations: {
    city_name: string;
    image: string;
  }[];
  makes: {
    id: string;
    imageURL: string;
    name: string
  }[];
  most_viewed_items: MostViewedItem[]
  featured_items: MostViewedItem[]
  testimonials: {
    name: string;
    message: string;
  }[];
  popularCompanies: {
    name: string;
    logo: string;
  }[];
}

const jostFont = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
});

const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 1,
  margin: 30,
  arrows: true,
  prevArrow: <div className="prev-arrow">Prev</div>,
  nextArrow: <div className="next-arrow">Next</div>,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  nextArrow: <button className={styles.nextArrow}>Next</button>,
  prevArrow: <button className={styles.prevArrow}>Prev</button>,
};

export default function Home() {
  const router = useRouter();
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [locationClicked, setLocationClicked] = useState<string | undefined>(undefined); // eslint-disable-line
  const [brandClicked, setBrandClicked] = useState<string | undefined>(undefined); // eslint-disable-line
  const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenCalendar, setIsOpenCalendar] = useState(false);
    const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const dropdownRef = useRef(null);
  
  
    const formatDate = (date: Date) => {
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    };
    const calendarRef = useRef(null);
  
  
    const handleInputClick1 = () => {
      setIsOpen(true);
    };
  
    const handleInputBlur1= () => {
      setIsOpen(false);
    };
    const handleInputClick = () => setIsOpen(true);
    const handleInputBlur = () => setTimeout(() => setIsOpen(false), 150);
    const [formattedDateTime, setFormattedDateTime] = useState<string>("");
  
    // Handle calendar selection
    const handleDateChange = (range: Range, start: string, end: string) => {
      setStartDate(start);
      setEndDate(end);
      
    };
    
  
  
    // Handle calendar opening
    const handleCalendarClick = () => setIsOpenCalendar(true);
  
    // Close calendar when clicking outside
    useEffect(() => {
      function handleClickOutside(event) {
        if (calendarRef.current && !calendarRef.current.contains(event.target)) {
          setIsOpenCalendar(false);
        }
        const fetchData = async () => {
          try {
            const response = await api.get("/homeData");
            setHomeData(response.data.data);
            setLoading(false);
          } catch (error) {
            console.error("Error fetching home data:", error);
            setLoading(false);
          }
        };
        fetchData();
    
      }
  
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    // Close calendar when clicking outside
    useEffect(() => {
      function handleClickOutside(event) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);
  

  useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await api.get("/homeData");
          setHomeData(response.data.data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching home data:", error);
          setLoading(false);
        }
      };
      fetchData();
  }, []);

  const handleLocationClick = (cityName: string) => {
    setLocationClicked(cityName)
    sessionStorage.setItem("selectedCity", cityName);
    router.push('/items-list')
  };

  const handleBrandClick = async (id: string) => {
    setBrandClicked(id);
    sessionStorage.setItem("selectedBrand", id);
    router.push('/items-list');
  };  

  const saveSelectedCar = (car: MostViewedItem) => {
    sessionStorage.setItem("selectedCar", JSON.stringify(car));
  };

  if (loading) {
    return <Loader />;
  }

  const testimonials = [
    {
      name: 'John Doe',
      location: 'New York, USA',
      testimonial: 'We have a unique combination of talents motivated by ambitious goals and a can-do attitude. Our drive to develop excellent products is built on teamwork, passion, and giving team members full control over their work to succeed on their own. We want to create an environment where ideas can flourish.',
      image: person1,
    },
    {
      name: 'Jane Smith',
      location: 'London, UK',
      testimonial: 'Amazing experience! I highly recommend this service.',
      image: person1,
    },
  ];

  return (
    <>
      <Head>
        <title>Unibooker | Home</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`${styles.page} ${jostFont.variable}`}>
        {/* Hero Section */}
        <div className={styles.hero_bg}>
          <Container>
            <Row>
              <Col md={12}>
                <Card className={styles.search_box}>
                  <Card.Body>
                    <form>
                      <Row>
                        <Col md={2}>
                          <div className="form-inputs mb-3">
                            <label htmlFor="city">City</label>
                            <select id="city" className="form-control">
                              {homeData?.locations.map((location, index) => (
                                <option key={index} value={location.city_name}>
                                  {location.city_name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </Col>
                        <Col md={4}>
                        <div className="form-inputs mb-3" ref={dropdownRef}>
                        <label htmlFor="location">Location</label>
        <input
          id="location"
          type="text"
          className="form-control"
          placeholder="Enter a location"
          value={locationClicked}
          onClick={() => setIsOpen(true)}
          readOnly
        />
        {isOpen && (
          <div className="absolute mt-2 w-3/6  border border-gray-300 rounded-md bg-white shadow-lg">
            <button className="bg-gray-100 px-4 py-3 flex m-4 text-xs rounded-2xl gap-3 mx-9 hover:bg-gray-200">
              <img src="https://www.zoomcar.com/img/icons/icons_my_location.png" className="h-5" alt="" />
              Current Location
            </button>

            <div className="bg-gray-200 mx-9">
              <h3 className="text-sm font-bold text-center mx-7">Suggested Locations</h3>
            </div>

            {loading && <p className="text-center py-2">Loading locations...</p>}

            {!loading && homeData?.locations.length > 0 && (
              <div className="max-h-60 overflow-y-auto flex flex-col space-y-2 p-4 scrollbar-hide">
                {homeData?.locations.map((location) => (
                  <div
                    key={location.id}
                    className="cursor-pointer py-2 px-3 hover:bg-gray-100 flex h-14 gap-3 mx-9 border-b border-gray-300"
                    onClick={() => {
                      setLocationClicked(location.city_name); // Set input value
                      setIsOpen(false); // Close dropdown
                    }}
                  >
                    <img src="https://www.zoomcar.com/img/icons/icons_location.png" className="h-7" alt="" />
                    <p className="text-sm text-black">{location.city_name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
                        </Col>
                        <Col md={2}>
                            <div className="form-inputs mb-3">
                                                 <label htmlFor="city" className="text-gray-500 ml-5 mt-2 text text-xs ">Trip Starts</label>
                                                 <div className="">
                               
                                      <input
                                        id="location"
                                        type="Text"
                                        className=" form-control"
                                        onClick={handleCalendarClick}  // Opens the calendar
                                           // Closes the calendar
                                           value={startDate}
                                           readOnly
                                         
                                      />
                                    
                                      
                                    {isOpenCalendar &&  ( 
                                        <div ref={calendarRef} >
                                      <CalendarComponent   onDateSelect={handleDateChange}   />  </div>)} {/* Custom calendar component */}
                                    
                          
                                  
                                  </div> 
                                               
                                               </div>
                        </Col>
                        <Col md={2}>
                          <div className="form-inputs mb-3">
                            <label htmlFor="endDate">Trip Ends</label>
                            <input
                         id="location"
                         type="text"
                         className="   form-control" 
                         placeholder="Enter a location"
                         onClick={handleCalendarClick}  // Opens the calendar
                 // Closes the calendar
                 value={endDate}
                 readOnly 
                       />
                          </div>
                        </Col>
                        <Col md={2}>
                          <Button className={styles.theme_btn} type="submit">
                            Search Car
                          </Button>
                        </Col>
                      </Row>
                    </form>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={12} lg={6} xl={6} className="mt-5">
                <h1>Easy and Convenient Way of Car Booking in <span>UniBooker</span></h1>
                <p>Vestibulum ultricies aliquam convallis. Maecenas ut tellus mi. Proin tincidunt, lectus eu volutpat.</p>
              </Col>
            </Row>
            <div className={styles.carouselValue}>
              <div className={styles.carouselValueContainer}>
                <div className={styles.carouselValueSection}>
                  <div className={styles.carouselValueSectionIcon}>
                    <BsShieldFillCheck />
                  </div>
                  <div className={styles.carouselValueSectionContent}>
                    <h4>100%</h4>
                    <p>Hassle-free Secured Trip</p>
                  </div>
                </div>
                <div className={styles.carouselValueSection}>
                  <div className={styles.carouselValueSectionIcon}>
                    <BsShieldFillCheck />
                  </div>
                  <div className={styles.carouselValueSectionContent}>
                    <h4>25000+</h4>
                    <p>Quality cars available</p>
                  </div>
                </div>
                <div className={styles.carouselValueSection}>
                  <div className={styles.carouselValueSectionIcon}>
                    <BsShieldFillCheck />
                  </div>
                  <div className={styles.carouselValueSectionContent}>
                    <h4>Delivery</h4>
                    <p>Anywhere, Anytime</p>
                  </div>
                </div>
                <div className={styles.carouselValueSection}>
                  <div className={styles.carouselValueSectionIcon}>
                    <BsShieldFillCheck />
                  </div>
                  <div className={styles.carouselValueSectionContent}>
                    <h4>Endless</h4>
                    <p>Drives, pay by hour</p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </div>
        <main className={`${styles.main} container`}>
          <section className={styles.popular_locations}>
            <h2 className={styles.main_heading}>Popular Locations</h2>
            <Popularlocations
              locations={homeData?.locations}
              sliderSettings={sliderSettings}
              onLocationClick={handleLocationClick}
              variant="slider"
            />
            <Link className={styles.btn_link} href="/">Explore All</Link>
          </section>
          <LogoCarousel/>
          {/* Most Viewed Cars Section */}
         < CarCarousel/>
        
          {/* Deliverables Section */}
          <section className={styles.deliverables}>
            <div className={styles.deliverables_row}>
              <div className={styles.deliverables_block}>
                <Image src={d1} alt="Deliverables" />
                <div className={styles.deliverables_content_block}>
                  <h5>700 Destinations</h5>
                  <p>Our expert team handpicked all destinations in this site</p>
                </div>
              </div>
              <div className={styles.deliverables_block}>
                <Image src={d2} alt="Deliverables" />
                <div className={styles.deliverables_content_block}>
                  <h5>700 Destinations</h5>
                  <p>Our expert team handpicked all destinations in this site</p>
                </div>
              </div>
              <div className={styles.deliverables_block}>
                <Image src={d3} alt="Deliverables" />
                <div className={styles.deliverables_content_block}>
                  <h5>700 Destinations</h5>
                  <p>Our expert team handpicked all destinations in this site</p>
                </div>
              </div>
            </div>
          </section>
          {/* Short Advertising Banner */}
          <section className={styles.advertising_banner}>
            <div className={styles.advertising_banner_content}>
              <h3>Lend your car to make <br /> some extra cash</h3>
              <Link className={styles.advertising_btn} href="/">Become A Host</Link>
            </div>
          </section>
          {/* Recommended Cars Section */}
          <section className={styles.recommended_cars}>
            <h2 className={styles.main_heading}>Recommended Cars</h2>
            
            < CarCarousel/>

          </section>
          {/* Travel Stories Section */}
          <section className={styles.travel_stories}>
            <h3>Client Testimonial</h3>
            <Row className="align-items-center">
              <Col md={6}>
                <Image src={testimonial} className={`${styles.travel_stories_img} img-fluid`} alt="Travel Story" />
              </Col>
              <Col md={6}>
                <div className={styles.clientBox}>
                  <Slider {...settings}>
                    {testimonials.map((testimonial, index) => (
                      <div key={index} className={styles.testimonialSlide}>
                        <p>{testimonial.testimonial}</p>
                        <div className={`${styles.testimonialUser} d-flex gap-3`}>
                          <Image src={testimonial.image} className={styles.testimonial_img} alt={`Testimonial from ${testimonial.name}`} />
                          <div className={styles.clientInfo}>
                            <h5>{testimonial.name}</h5>
                            <p>{testimonial.location}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </Slider>
                </div>
              </Col>
            </Row>
          </section>
        </main>
        <Newsletter />
      </div>
    </>
  );
}