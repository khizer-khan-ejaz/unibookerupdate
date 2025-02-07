import React, { useRef, useState, useEffect } from "react";
import { Virtual, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from 'next/image';
import api from '../../api/hello'
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

interface Location {
  city_name: string;
  image: string;
}

interface HomeData {
  locations: Location[];
  makes: {
    id: string;
    imageURL: string;
    name: string;
  }[];
  most_viewed_items: any[]; // You can type this more specifically later
  featured_items: any[]; // You can type this more specifically later
  testimonials: {
    name: string;
    message: string;
  }[];
  popularCompanies: {
    name: string;
    logo: string;
  }[];
}

export default function SwiperSlides() {
  const [swiperRef, setSwiperRef] = useState<any>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [homeData, setHomeData] = useState<HomeData | null>(null);

  // Fetch locations from API
  useEffect(() => {
    async function fetchLocations() {
      try {
        const response = await api.get("/homeData");// Replace with your API URL
        
        setHomeData(response.data.data);
       // Ensure to set locations correctly
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchLocations();
  }, []);

  return (
    <>
        <Swiper
        modules={[Virtual, Navigation, Pagination]}
        onSwiper={setSwiperRef}
        slidesPerView={5}
        centeredSlides={true}
        spaceBetween={40}
        pagination={{ type: "fraction" }}
        navigation={true}
        pagination={{
          type: "fraction",
          renderFraction: () => "", // This will remove the fraction numbers
        }}
        virtual
        className="gap-4 w-4/5"
      >
        {homeData?.locations.length > 0 ? (
          homeData?.locations.map((location, index) => (
            <SwiperSlide key={index} virtualIndex={index}>
              <div className="relative w-full h-[250px] overflow-hidden rounded-2xl group">
                {/* Image with Zoom Effect */}
                <Image
                  className="w-full h-full object-cover rounded-2xl transition-transform opacity-100  duration-300 group-hover:scale-110"
                  src={location.image} // Assuming location.image is the URL
                  alt={location.city_name}
                  width={150} // Adjust width if needed
                  height={150} // Adjust height if needed
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* City Name */}
                <h2 className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white font-bold text-lg">
                  {location.city_name}
                </h2>
              </div>
            </SwiperSlide>
        ))
      ) : (
        <div>Loading...</div>
      )}
    </Swiper>
    </>
  );
}
