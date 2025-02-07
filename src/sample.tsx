import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { BsShieldFillCheck } from "react-icons/bs";
import React from "react";
import SwiperSlides from "./component/comon/popular_location";
import Link from "next/link";
import LogoCarousel from "./component/comon/company"
import { useState,useEffect,useRef } from "react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import CalendarComponent from "./component/comon/search"
import  CarCarousel from "./component/comon/car";
import api from '../api/api'
import { useRouter } from "next/router";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenCalendar, setIsOpenCalendar] = useState(false);
  const [startDate, setStartDate] = useState("");
const [endDate, setEndDate] = useState("");
const router = useRouter();
const [homeData, setHomeData] = useState<HomeData | null>(null);
const [locationClicked, setLocationClicked] = useState<string | undefined>(undefined); // eslint-disable-line
const [brandClicked, setBrandClicked] = useState<string | undefined>(undefined); // eslint-disable-line
const [loading, setLoading] = useState(true);
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


  const features = [
    { title: "100%", description: "Hassle-free Secured Trip" },
    { title: "24/7", description: "Customer Support" },
    { title: "Affordable", description: "Best Price Guarantee" },
    { title: "Trusted", description: "Reliable Service" },
  ];
 

  return (
    <main>
    <div className=" bg-cover bg-center bg-[url('/home-bg.png')] flex flex-col relative">
    <div className="w-10/12 bg-white  p-8 mt-8 m-auto rounded-2xl flex flex-col   gap-4">
    <div className="flex w-full   sm:flex gap-3">
    <div className="">
                      
    <div className="w-2/6">
     
     

      {!loading && (
        <select
          id="city"
          className="py-5 font-light text-customCyan hover:border-gray-300"
        >
          { homeData?.locations.map((location, index) => (
            <option key={location.id} value={location.city_name.toLowerCase()}>
              {location.city_name}
            </option>
          ))}
        </select>
      )}
    </div>
                     </div>
                     <div className="flex flex-col space-x-4 w-5/6 bg-gray-200 border-2 rounded-lg relative" ref={dropdownRef}>
      <label htmlFor="city" className="text-gray-500 ml-5 mt-2 text-xs">
        Location
      </label>
      <div className="ml-0 p-1">
        <input
          id="location"
          type="text"
          className="bg-gray-200 h-full w-full"
          placeholder="Enter a location"
          value={locationClicked}
          onClick={() => setIsOpen(true)}
          readOnly
        />
        {isOpen && (
          <div className="absolute mt-2 w-full border border-gray-300 rounded-md bg-white shadow-lg">
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
    </div>

                     <div className="flex flex-col space-x-7 w-2/5 bg-gray-200 b border-2 rounded-lg">
                       <label htmlFor="city" className="text-gray-500 ml-5 mt-2 text text-xs ">Trip Starts</label>
                       <div className="">
     
            <input
              id="location"
              type="Text"
              className=" w-full h-full font-bold bg-gray-200"
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
                     <div className="flex flex-col space-x-7 w-1/5 bg-gray-200 b border-2 rounded-lg">
                       
                  
                       <label htmlFor="city" className="text-gray-500 ml-5 mt-2 text text-xs ">Trip End</label>
                       <input
                         id="location"
                         type="text"
                         className="   font-bold bg-gray-200" 
                         placeholder="Enter a location"
                         onClick={handleCalendarClick}  // Opens the calendar
                 // Closes the calendar
                 value={endDate}
                 readOnly 
                       />
                       
                     </div>
                     
                     <button className="bg-customCyan   w-1/4 flex justify-center align-center items-center font-bold text-normal   font-sans  rounded-xl text-white  "> SEARCH CAR </button>
                     </div>
    <div className="flex  gap-3">
      <input type="checkbox"  className="text-customCyan   "/>
      <p className="text-normal" >Home Delivery & Pick-up</p>
      </div>                 
    </div>
   
    <div>
    
    </div>
 <div>
   <h1 className="text-white mb-72 text-6xl pt-10 pl-10"> Easy and <br /> Convenient 
      Way of <br /> Car  Booking in <br /> <span className="text-customCyan"> UniBooker</span></h1>

 </div>
 

 </div> 
 <div className="w-8/12 bg-customwhite mx-auto  py-1 relative z-40 -top-16 rounded-full ">
 <div className="flex  py-2 w-12/12">
 <div className="flex pl-5  pr-2 space-x-2 border-r-2 border-r-gray w-1/4">
  <BsShieldFillCheck
  style={{ width: '25px', height: '25px' }}
  className="fill-customCyan" />
  <div className="flex flex-col gap-1">
  <h4 className="font-bold">100%</h4>
  <p className="text-xs">Hassle-free Secured Trip</p>
   
</div>    </div>
<div className="flex pl-5  pr-2 space-x-2 border-r-2 border-r-gray w-1/4">
  <BsShieldFillCheck
  style={{ width: '25px', height: '25px' }}
  className="fill-customCyan" />
  <div className="flex flex-col gap-1">
  <h4 className="font-bold">100%</h4>
  <p className="text-xs">Hassle-free Secured Trip</p>
   
</div>    </div>
<div className="flex pl-5  pr-2 space-x-2 border-r-2 border-r-gray w-1/4">
  <BsShieldFillCheck
  style={{ width: '25px', height: '25px' }}
  className="fill-customCyan" />
  <div className="flex flex-col gap-1">
  <h4 className="font-bold">100%</h4>
  <p className="text-xs">Hassle-free Secured Trip</p>
   
</div>    </div>
<div className="flex pl-5  pr-2 space-x-2 border-r-2 border-r-gray">
  <BsShieldFillCheck
  style={{ width: '25px', height: '25px' }}
  className="fill-customCyan" />
  <div className="flex flex-col gap-1">
  <h4 className="font-bold">100%</h4>
  <p className="text-xs">Hassle-free Secured Trip</p>
   
</div>    </div>
 
 
 </div>


 </div>
 
 <h1 className="font-bold text-3xl text-center py-6 pb-9">Popular Locations</h1>
 <div>
 <SwiperSlides/>
 </div>
  
  
  <h1 className="font-bold text-3xl text-center py-6 pb-9">Company</h1>
  <LogoCarousel/>

 <CarCarousel/>
 
</main>
  );
}
