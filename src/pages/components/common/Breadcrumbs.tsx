import Link from 'next/link';
import { useRouter } from 'next/router'; // Import useRouter for navigation
import styles from "@/styles/Layout.module.css";
import { Col, Container, Row } from 'react-bootstrap';
import Image from 'next/image';
import home from '../../../Images/home.svg';
import { useState, useRef, useEffect } from 'react';

import api from '../../api/api'
import dynamic from "next/dynamic";
interface BreadcrumbsProps {
    parent?: {
        name?: string;
        link?: string;
    };
    currentPage?: string;
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
    testimonials: {
        name: string;
        message: string;
    }[];
    popularCompanies: {
        name: string;
        logo: string;
    }[];
    nearby_items: {
        address: string;
    }[];
}

const Breadcrumbs = ({ parent = {}, currentPage }: BreadcrumbsProps) => {
    const router = useRouter();
    const pathSegments = router.pathname.split('/').filter(Boolean);
    const parentPageName = parent.name || pathSegments[pathSegments.length - 2] || 'Parent Page';
    const parentPageLink = parent.link || `/${pathSegments.slice(0, -1).join('/')}`;
    const currentPageName = currentPage || pathSegments[pathSegments.length - 1] || 'Current Page';

    const [homeData, setHomeData] = useState<HomeData | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenCalendar, setIsOpenCalendar] = useState(false);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [locationClicked, setLocationClicked] = useState<string | undefined>(undefined);
    const CalendarComponent = dynamic(() => import("../../component/comon/search"), {
        ssr: false, // ✅ Prevents running on the server
      });
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleDateChange = (selectedRange: { startDate: Date; endDate: Date }) => {
        const startFormattedDate = selectedRange.startDate.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: '2-digit',
        });

        const endFormattedDate = selectedRange.endDate.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: '2-digit',
        });

        const startTime = selectedRange.startDate.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });

        const endTime = selectedRange.endDate.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });

        const startDateTime = `${startFormattedDate} ${startTime}`;
        const endDateTime = `${endFormattedDate} ${endTime}`;

        setStartDate(startDateTime); // Set start date and time
        setEndDate(endDateTime); // Set end date and time
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get("/homeData");
                setHomeData(response.data.data);
            } catch (error) {
                console.error("Error fetching home data:", error);
            }
        };
        fetchData();
    }, []);

    const handleCalendarClick = () => setIsOpenCalendar(true);
    const calendarRef = useRef<HTMLDivElement>(null);

    const handleSearch = () => {
        // Navigate to search page with the selected location and date range
        if (locationClicked && startDate && endDate) {
            router.push({
                pathname: '/car-list', // The path to your search page
                query: {
                    location: locationClicked,
                    startDate,
                    endDate,
                },
            });
        }
    };

    // Close calendar and dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
                setIsOpenCalendar(false);
            }

            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <section className={styles.breadcrumbs_section}>
            <Container>
                <Row>
                    <Col md={12}>
                        <nav className={styles.breadcrumbs}>
                            <ul>
                                <li>
                                    <Link href="/"><Image src={home} alt="Home" /> Home</Link>
                                </li>
                                {pathSegments.length > 1 && (
                                    <li>
                                        <Link href={parentPageLink}>{parentPageName.replace(/-/g, ' ')}</Link>
                                    </li>
                                )}
                                <li className={styles.current}>{currentPageName.replace(/-/g, ' ')}</li>
                            </ul>
                            <div className={styles.container}>
                                <div className='flex h-8'>
                                    <img
                                        src="https://www.zoomcar.com/build/dbdacdf082fa72edcdd12dd78bbdf779.svg"
                                        className='bg-customCyan  rounded-full p-1'
                                        alt=""
                                    />
                                    <input
                                        type="text"
                                        className='w-[200px] bg-customgray border-b border-b-gray-300'
                                        value={locationClicked}
                                        onClick={() => setIsOpen(true)}
                                        readOnly
                                    />
                                    {isOpen && (
                                        <div ref={dropdownRef} className="absolute mt-10 z-20 w-2/6 border border-gray-300 rounded-2xl bg-white shadow-lg">
                                            <button className="bg-gray-100 px-4 py-3 flex m-4 text-xs rounded-2xl gap-3 mx-9 hover:bg-gray-200">
                                                <img
                                                    src="https://www.zoomcar.com/img/icons/icons_my_location.png"
                                                    className="h-4"
                                                    alt="My Location"
                                                />
                                                Current Location
                                            </button>

                                            <div className="bg-gray-200 mx-9">
                                                <h3 className="text-sm font-bold text-center mx-7">Suggested Locations</h3>
                                            </div>

                                            {Array.isArray(homeData?.nearby_items) && homeData.nearby_items.length > 0 && (
                                                <div className="max-h-60 overflow-y-auto flex z-20 flex-col space-y-2 p-4 scrollbar-hide">
                                                    {homeData.nearby_items.map((address) => (
                                                        <div
                                                            key={address.address}
                                                            className="cursor-pointer py-2 px-3 hover:bg-gray-100 flex h-14 gap-3 mx-9 border-b border-gray-300"
                                                            onClick={() => {
                                                                setLocationClicked(address.address);
                                                                setIsOpen(false);
                                                            }}
                                                        >
                                                            <img
                                                                src="https://www.zoomcar.com/img/icons/icons_location.png"
                                                                className="h-7"
                                                                alt="location"
                                                            />
                                                            <p className="text-sm text-black">{address.address}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className='flex h-8'>
                                    <img
                                        src="https://www.zoomcar.com/build/8d21eb21d85b19268e718ae5faf8a141.svg"
                                        alt=""
                                        className='bg-customCyan rounded-full p-1'
                                    />
                                    <input
                                        type="text"
                                        className='w-[400px] hover:border-none bg-customgray border-b border-b-gray-300'
                                        onClick={handleCalendarClick}
                                        value={`${startDate} - ${endDate}`}
                                    />
                                    {isOpenCalendar && (
                                        <div className='absolute right-0 mt-12' ref={calendarRef}>
                                            <CalendarComponent onDateSelect={handleDateChange} />
                                        </div>
                                    )}
                                </div>

                                <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2  rounded">
                                    Search
                                </button>
                            </div>
                        </nav>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default Breadcrumbs;
