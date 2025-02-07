import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaStar, FaMapMarkerAlt, FaTruck } from "react-icons/fa";
import api from '../../api/hello'


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

const CarCarousel = () => {
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  
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
    <div className="mt-20 max-w-5xl w-full bg-slate-50 mx-auto py-10">
      <h2 className="text-3xl font-bold text-center mb-6">Top cars</h2>
      <Slider {...settings}>
        {homeData?.most_viewed_items.map((car: MostViewedItem, index) => (
          <div key={index} className="p-4">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="relative">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-52 object-cover"
                />
                <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
                  {car.item_rating} <FaStar className="inline ml-1 text-xs" />
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold">{car.name}</h3>
                <p className="text-xl font-semibold text-gray-800">{car.price}</p>
                <p className="text-sm text-gray-500 mt-1">{car.item_rating}</p>
                <div className="flex items-center text-sm text-gray-500 mt-2">
                  <FaMapMarkerAlt className="text-red-500 mr-1" />
                  {car.address}
                  <FaTruck className="ml-2 text-gray-700" />
                  <span className="ml-1">Delivery</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default CarCarousel;
