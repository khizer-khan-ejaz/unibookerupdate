import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import Image from "next/image";
import api from "../../api/hello";
import styles from "@/styles/Home.module.css";

interface Logo {
  id: string;
  name: string;
  imageURL: string;
}

interface HomeData {
  locations: {
    city_name: string;
    image: string;
  }[];
  makes: Logo[];
  most_viewed_items: {
    id: string;
    title: string;
    image: string;
  }[];
  featured_items: {
    id: string;
    title: string;
    image: string;
  }[];
  testimonials: {
    name: string;
    message: string;
  }[];
  popularCompanies: {
    name: string;
    logo: string;
  }[];
}

export default function LogoCarousel() {
  const [logos, setLogos] = useState<Logo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [homeData, setHomeData] = useState<HomeData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/homeData");

        if (response.status !== 200) {
          throw new Error("Failed to fetch data");
        }

        const homeData: HomeData = response.data.data;
        setHomeData(response.data.data);

        if (!homeData.makes || homeData.makes.length === 0) {
          throw new Error("No logo data available");
        }

        setLogos(
          homeData.makes.map((make) => ({
            id: make.id,
            name: make.name,
            imageURL: make.imageURL,
          }))
        );
      } catch (error) {
        setError("Error fetching home data");
        console.error("API Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full flex justify-center items-center py-4">
      {loading && <p>Loading logos...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && logos.length > 0 && (
        <Swiper
          modules={[Navigation]}
          slidesPerView={4}
          spaceBetween={30}
          navigation
          loop
          className="w-full"
        >
          {homeData?.makes.map((make) => (
            <SwiperSlide key={make.id}> {/* ✅ Corrected key placement */}
              <section className={styles.company_logos}>
                <div className={styles.company_logos_row}>
                  <div>
                    <div
                      className={styles.company_logos_div}
                      style={{ cursor: "pointer" }}
                    >
                      <Image
                        src={make.imageURL}
                        alt={make.name}
                        width={100}
                        height={100}
                        layout="intrinsic"
                      />
                    </div>
                  </div>
                </div>
              </section>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}
