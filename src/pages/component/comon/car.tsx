import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaStar, FaMapMarkerAlt, FaTruck } from "react-icons/fa";
import api from '../../api/api'
import CarCard from '../../components/common/CarCard';

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
  most_viewed_items: MostViewedItem[];
  featured_items: MostViewedItem[];
  testimonials: {
    name: string;
    message: string;
  }[];
  popularCompanies: {
    name: string;
    logo: string;
  }[];
}
const saveSelectedCar = (car: MostViewedItem) => {
  sessionStorage.setItem("selectedCar", JSON.stringify(car));
};

const CarCarousel = () => {
  const [homeData, setHomeData] = useState<HomeData | null>(null);

  useEffect(() => {
    async function fetchLocations() {
      try {
        const response = await api.get("/homeData"); // Replace with your API URL
        setHomeData(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchLocations();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };



  return (
    <div className="mt-20  w-full bg-slate-50 mx-auto py-10">
      <h2 className="text-3xl font-bold text-center mb-6">Top cars</h2>
      <Slider {...settings}>
        {homeData?.most_viewed_items.map((car, index) => (
          <div key={car.id || index} onClick={() => saveSelectedCar(car)}> {/* Use car.id if available, otherwise fallback to index */}
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
              saveSelectedCar={saveSelectedCar} // You probably don't need to pass this down here
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default CarCarousel;
