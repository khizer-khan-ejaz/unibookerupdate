import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import PopularLocations from '../components/common/PopularLocations';
import styles from "@/styles/Home.module.css";
import { Jost } from 'next/font/google';
import Loader from '../components/common/Loader';
import api from '../api/api';
// Define Jost font
const jostFont = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
});
interface Profile {
  token: string;
  id: string;
  name: string;
  email: string;
}

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};


export default function Place() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [locationClicked, setLocationClicked] = useState<string | undefined>(undefined);
  const [locations, setLocations] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const handleLocationClick = (cityName: string) => {
    setLocationClicked(cityName)
    sessionStorage.setItem("selectedCity", cityName);
  };
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      setProfile(JSON.parse(storedData));
    }
  }, []);

  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true)
      try {
        const response = await api.get('/yourLocations', {
          params: {
            token: profile?.token,
          },
        });
        const { Locations } = response.data?.data || [];
        setLocations(Locations);
        setLoading(false)
      } catch (error) {
        console.error('Error fetching availability data', error);
        setLoading(true)
      } finally {
        setLoading(false)
      }
    }
    fetchWishlist();
  }, [profile]);

  if (loading) {
    return <Loader />;
  }
  return (
    <section className={`${styles.popular_locations} ${jostFont.variable}`}>
      <h2 className={styles.main_heading}>Popular Locations</h2>
      <PopularLocations
        locations={locations}
        sliderSettings={sliderSettings}
        variant="grid"
        onLocationClick={handleLocationClick}
      />
      <Link className={styles.btn_link} href="/locations">
        Explore All
      </Link>
    </section>
  );
}
