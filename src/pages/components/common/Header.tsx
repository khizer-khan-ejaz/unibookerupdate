import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../../../Images/logo.svg';
import userIcon from '../../../Images/user.svg';
import wishlist from '../../../Images/heart.svg';
import cart from '../../../Images/cart.svg';
import styles from "@/styles/Layout.module.css";
import { Navbar, Nav, Dropdown } from 'react-bootstrap';
import { ChangeEvent, useEffect, useState } from 'react';
import { BsSearch } from 'react-icons/bs';
import 'react-datepicker/dist/react-datepicker.css';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import api from '@/pages/api/api';
import Breadcrumbs from './Breadcrumbs';

interface Profile {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  birthdate: string;
  aboutYourself: string;
  profileImage: string;
}

interface Place {
  name: string;
  formatted_address: string;
  rating: number;
  user_ratings_total: number;
  icon: string;
  description: string;
}
interface SearchPlace {
  name: string;
  formatted_address: string;
  rating?: number;
}


const Header = () => {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const router = useRouter();
  const { logout } = useAuth();
  const isHomePage = router.pathname === "/";
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<Place[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; long: number } | null>(null);
  
  useEffect(() => {
    const storedData = localStorage.getItem("userData");
    if (storedData) {
      setProfile(JSON.parse(storedData));
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            long: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  const fetchSuggestions = async (query: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SUGGESTION_API_URL}?input=${query}&types=(cities)&key=${process.env.NEXT_PUBLIC_API_KEY}`
      );
      const places = response.data.results.map((item: SearchPlace) => ({
        name: item.name,
        formatted_address: item.formatted_address,
        rating: item.rating || 0,
      }));

      setSuggestions(places);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSuggestionClick = (suggestion: Place) => {
    setSelectedPlace(suggestion);
    setSearchQuery(suggestion.name);
    setSuggestions([]);
    triggerItemSearch(suggestion.name);
    sessionStorage.setItem("selectedCity", suggestion.name);
  };

  useEffect(() => {
    if (searchQuery.length > 2) {
      fetchSuggestions(searchQuery);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const handleLogoClicked = async () => {
    sessionStorage.clear()
  };

  const triggerItemSearch = async (city: string): Promise<void> => {
    
    if (!userLocation) return;
    const { lat, long } = userLocation;
    try {
      const payload = {
        title: searchQuery,
        Slatitude: lat,
        Slongitude: long,
        check_in: "",
        check_out: "",
        sort: "nearest_location",
      }
      const response = await api.post("/itemSearch", payload);
      sessionStorage.setItem('data', JSON.stringify(response.data.data.items))
      router.push('/items-list')
    } catch (error) {
      console.error('Error triggering item search:', error);
    }
  };

  const isLoggedIn = profile !== null;

  return (
    <>
      <header
        className={`${styles['theme-header']} ${isHomePage ? styles['header-absolute'] : styles['header-static']}`}>
        <div className={`container d-flex justify-content-between align-items-center ${styles.headerContainer}`}>
          <div className="logo-section">
            <div className="logo-img">
              <Link href="/" onClick={handleLogoClicked}>
                <Image src={logo} className={styles['logo']} alt="UniBooker" />
              </Link>
            </div>
          </div>
          {/* Search bar section */}
          {!isHomePage ? (
            <>
              <div className={styles['search-bar']}>
                <input
                  type="text"
                  placeholder="Search for places..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className={styles['search-input']}
                />
                <div className={styles['search-icon']}>
                  <BsSearch />
                </div>
              </div>
              {suggestions.length > 0 && (
                <ul className={styles.suggestions}>
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={styles.suggestionItem}
                    >
                      <div>{suggestion.formatted_address}</div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <Navbar expand="lg" className={styles['menu-section']}>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className={`ml-auto gap-4 ${styles.nav}`}>
                  <Nav.Link className={`${styles['nav-link']}`} href="/">Home</Nav.Link>
                  <Nav.Link className={`${styles['nav-link']}`} href="/about">About</Nav.Link>
                  <Nav.Link className={`${styles['nav-link']}`} href="/items-list">Items List</Nav.Link>
                  <Nav.Link className={`${styles['nav-link']}`} href="/place">Place</Nav.Link>
                  <Nav.Link className={`${styles['nav-link']}`} href="/contact">Contact Us</Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Navbar>
          )}
          {/* Profile Section with Dropdown */}
          {!isHomePage ? (
            <div className={`d-flex gap-3 ${styles.ProfileSection}`}>
              {isLoggedIn ? (
                <Dropdown align="end">
                  <Dropdown.Toggle variant="link" id="profile-dropdown">
                    <Image src={userIcon} className={styles['user-icon']} alt="User Profile" />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item href="/profile">My Profile</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <div className={styles['profile-section']}>
                  <Link href={isLoggedIn ? "/profile" : "/auth/login"}><Image src={userIcon} className={styles['user-icon']} alt="User Profile" /></Link>
                </div>
              )}
              <div className={styles['profile-section']}>
                <Link href="/wishlist"><Image src={wishlist} className={styles['user-icon']} alt="Wishlist" /></Link>
              </div>
              <div className={styles['profile-section']}>
                <Link href="#"><Image src={cart} className={styles['user-icon']} alt="Cart" /></Link>
              </div>
            </div>
          ) : (
            <Dropdown align="end">
              <Dropdown.Toggle variant="link" id="profile-dropdown">
                <Image src={userIcon} className={styles['user-icon']} alt="User Profile" />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="/profile">My Profile</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>
      </header>
      {!isHomePage && (<Breadcrumbs />)}
    </>
  );
};

export default Header;
