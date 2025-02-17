import Head from 'next/head';
import React, { useEffect, useState, useCallback,useRef } from 'react';
import styles from "@/styles/CarList.module.css";
import { Col, Container, Row } from 'react-bootstrap';
import CarCard from '../components/common/CarCard';
import { Jost } from 'next/font/google';
import api from '../../api/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from "next/router";
import { Nav, Accordion, Tab, Tabs } from "react-bootstrap";
const jostFont = Jost({
    variable: "--font-jost",
    subsets: ["latin"],
});

interface Car {
    id: string;
    name: string;
    item_rating: number;
    is_in_wishlist: boolean;
    address: string;
    state_region: string;
    city: string | null;
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
}
interface ItemType {
    id: number;  // Ensure this is a string, not a number

    name: string;
    description: string;
    status: string;
    image: string | null;
}
interface Make {
    id: number;
    name: string;
    description: string;
    status: string;
    imageURL: string;
}
interface OdometerRange {
    id: number;
    odometer: string;
}
interface Feature {
    id: string;
    name: string;
}
interface CarSearchParams {
    check_in: string;
    check_out: string;
    address: string;
    start_time: string;
    end_time: string;
    meta?: string;
    facility?: string;
    odometer?: string;
    sort?: string;
    price_range?: string; 
    item_type?: number[];
}

const Index: React.FC = () => {
    const [cars, setCars] = useState<Car[]>([]);
    const [homeData, setHomeData] = useState<Car[]>([]);
    const [tabs, setTabs] = useState<{ id: string; label: string }[]>([]);
    const accordionRef = useRef<HTMLDivElement>(null);
    
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { settings } = useAuth();
    const router = useRouter();
     const [itemTypes, setItemTypes] = useState<ItemType[]>([]);
     const [makes, setMakes] = useState<Make[]>([]);
    const [selectedBrands, setSelectedBrands] = useState<Array<number>>([]);
        const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
        const [priceRange, setPriceRange] = useState<number[]>([0, 0]);
        const [years, setYears] = useState<string[]>([]);
        const [odometerRanges, setOdometerRanges] = useState<OdometerRange[]>([]);
        const [selectedOdometer, setSelectedOdometer] = useState<number[]>([]);
        const [featureData, setFeatureData] = useState<Feature[]>([]);
        const [selectedFeatures, setSelectedFeatures] = useState<Feature[]>([]);
        const [selectedYears, setSelectedYears] = useState<string[]>([]);
    const [hasFilterChanged, setHasFilterChanged] = useState(false);
    const [sortOption, setSortOption] = useState<string>("");
    const { startDate, startTime, endDate, endTime, location } = router.query;
    const check_in = startDate as string;
    const check_out = endDate as string;
    
    const start_time = Array.isArray(startTime) ? startTime[0] : startTime || "00:00";
    const end_time = Array.isArray(endTime) ? endTime[0] : endTime || "23:59";
      const [activeTab, setActiveTab] = useState<string | null>(null);
        const [activeKeys, setActiveKeys] = useState<string[]>([]);// Open all by default
        
        const handleToggle = (eventKey: string | null) => {
            if (eventKey === null || eventKey === undefined) return; // Handle undefined or null
            
            setActiveKeys((prevKeys) =>
                prevKeys.includes(eventKey)
                    ? prevKeys.filter((k) => k !== eventKey) // Close the accordion if it's already open
                    : [...prevKeys, eventKey] // Open the accordion if it's not open
            );
        };
      
        const handleTabClose = (tabId: string) => {
            // Extract the identifier type and value from the tabId
            const [type, ...rest] = tabId.split('-');
            const value = rest.join('-'); // Rejoin in case the ID contains multiple hyphens
        
            // Remove the tab
            setTabs((prevTabs) => prevTabs.filter((tab) => tab.id !== tabId));
        
            // Update the corresponding state based on the tab type
            switch (type) {
                case 'category':
                    setSelectedCategories((prev) => 
                        prev.filter((id) => id !== value)
                    );
                    break;
                case 'make':
                    setSelectedBrands((prev) => 
                        prev.filter((id) => id !== parseInt(value))
                    );
                    break;
                case 'feature':
                    setSelectedFeatures((prev) => 
                        prev.filter((feature) => feature.id !== value)
                    );
                    break;
                case 'odometer':
                    setSelectedOdometer((prev) => 
                        prev.filter((id) => id !== parseInt(value))
                    );
                    break;
                case 'year':
                    setSelectedYears((prev) => 
                        prev.filter((year) => year !== value)
                    );
                    break;
                case 'priceRange':
                    // Handle price range tab close if needed
                    // You might want to reset the price range to default values
                    break;
            }
        
            setTabs((prevTabs) => {
                const updatedTabs = prevTabs.filter((tab) => tab.id !== tabId);
                setActiveTab(updatedTabs.length > 0 ? updatedTabs[0].id : null);
                return updatedTabs;
            });
        };
        
        // Example of updated checkbox handler for categories
        const handleCategoryCheckbox = (item: ItemType) => {
            const categoryId = `category-${item.id}`;
            
            if (!selectedCategories.includes(item.id.toString())) {
                // Checkbox is being checked
                setSelectedCategories(prev => [...prev, item.id.toString()]);
                
                // Add tab if it doesn't exist
                if (!tabs.some(tab => tab.id === categoryId)) {
                    setTabs(prev => [...prev, { 
                        id: categoryId, 
                        label: `Category: ${item.name}` 
                    }]);
                }
            } else {
                // Checkbox is being unchecked
                handleTabClose(categoryId);
            }
        };
       
    
    
        const handleSortChange = (option: string) => {
            setSortOption(option);
            setHasFilterChanged(true);
        }

       // Scroll event handler for the accordion
      
    
    // Adding event listener when mouse enters the accordion area
    const handleAccordionScroll = useCallback((e: WheelEvent) => {
        if (!accordionRef.current) return;
    
        const delta = e.deltaY;
        const currentKey = activeKeys[0] || "0"; // Ensure it's a valid string
        const currentIndex = parseInt(currentKey, 10);
    
        const totalItems = 6; // Number of accordion items, adjust as necessary
    
        // Scroll down
        if (delta > 0 && currentIndex < totalItems - 1) {
            handleToggle((currentIndex + 1).toString());
        }
        // Scroll up
        else if (delta < 0 && currentIndex > 0) {
            handleToggle((currentIndex - 1).toString());
        }
    }, [activeKeys, handleToggle]); // Dependencies for useCallback
    
    
    // Adding event listener when mouse enters the accordion area
    useEffect(() => {
        const handleMouseEnter = () => {
            if (accordionRef.current) {
                // Enable mouse scroll on accordion hover
                accordionRef.current.addEventListener('wheel', handleAccordionScroll);
            }
        };
    
        const handleMouseLeave = () => {
            if (accordionRef.current) {
                // Disable mouse scroll once mouse leaves the accordion area
                accordionRef.current.removeEventListener('wheel', handleAccordionScroll);
            }
        };
    
        // Attach the hover events to the accordion
        if (accordionRef.current) {
            accordionRef.current.addEventListener('mouseenter', handleMouseEnter);
            accordionRef.current.addEventListener('mouseleave', handleMouseLeave);
        }
    
        // Cleanup listeners on component unmount
        return () => {
            if (accordionRef.current) {
                accordionRef.current.removeEventListener('mouseenter', handleMouseEnter);
                accordionRef.current.removeEventListener('mouseleave', handleMouseLeave);
            }
        };
    }, [activeKeys]);
    
        

    // Format date to 'YYYY-MM-DD'
    const formatDate = useCallback((dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    }, []);
    
    const convertTo24HourFormat = (timeString: string): string => {
        const [time, modifier] = timeString.split(" "); // time and modifier don't change
        const [hours, minutes] = time.split(":").map(Number); // minutes doesn't change, so use const
    
        let newHours = hours; // Use let for hours since it gets reassigned
    
        if (modifier === "PM" && newHours !== 12) {
            newHours += 12;
        } else if (modifier === "AM" && newHours === 12) {
            newHours = 0;
        }
    
        return `${newHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    };
    const formattedStartTime = convertTo24HourFormat(start_time);
    const formattedEndTime = convertTo24HourFormat(end_time);
    const locationString = location ? (Array.isArray(location) ? location.join(", ") : location) : "";
    // Fetch available cars
    useEffect(() => {
        fetchAvailableCars();
    }, [startDate, endDate, location]); // Fetch data whenever query parameters change
       // Function to fetch available cars based on filters and search parameters
       const fetchAvailableCars = async () => {
        const response = await api.get("/homeData");
        console.log( response.data.data.itemTypes );
        

        setIsLoading(true);
        setError(null);
        try {
            if (!startDate || !endDate || !location) {
                setError('Missing required parameters.');
                setIsLoading(false);
                return;
            }
    
            const formattedStartDate = formatDate(check_in);
            const formattedEndDate = formatDate(check_out);
            console.log(itemTypes)
        
          const params: CarSearchParams = {
    check_in: formattedStartDate,
    check_out: formattedEndDate,
    address: locationString,
    start_time: formattedStartTime,
    end_time: formattedEndTime,
    ...fetchFilteredData(), // Apply filters
   // Ensure string or undefined
};
    
            console.log("API Call Params:", params);
    
            const response = await api.post('/itemSearch', params);
            console.log("API Response:", response.data);
    
            if (response.data && response.data.data.items) {
                setCars(response.data.data.items);
            } else {
                setError("API Response does not contain a valid 'items' array.");
                setCars([]);
            }
        } catch (error) {
            console.error("Error fetching available cars:", error);
            setError('Failed to fetch cars.');
            setCars([]);
        } finally {
            setIsLoading(false);
        }
    };
    // Consolidated filters logic to reduce redundancy
  
    // Consolidating data fetching logic
    useEffect(() => {
        const fetchData = async () => {
            try {
                const amenitiesResponse = await api.get("/amenities");
                const makesResponse = await api.get("/getMakes");
                const odometerResponse = await api.get("/vechileOdometer");

                const amenities = amenitiesResponse.data.data.amenities;
                const makes = makesResponse.data.data.makes;
                const odometer = odometerResponse.data.data.getodometer;

                const response = await api.get("/homeData");
                const mergedData = [
                    ...response.data.data.nearby_items,
                    ...response.data.data.featured_items,
                    ...response.data.data.new_arrival_items,
                    
                ];

                setHomeData(mergedData);
                setCars(mergedData);
                setFeatureData(amenities);
                setItemTypes(response.data.data.itemTypes || []);
                setMakes(makes);
                setOdometerRanges(odometer);
                const yearsSet = new Set<string>();
                mergedData.forEach((car) => {
                    const itemInfo = car.item_info ? JSON.parse(car.item_info) : {};
                    if (itemInfo.year) yearsSet.add(itemInfo.year);
                });
                setYears(Array.from(yearsSet).sort((a, b) => parseInt(b) - parseInt(a)));
            } catch (error) {
                console.error("Error fetching home data:", error);
            } finally {
               
            }
        };
        fetchData();
        if (settings) {
            setPriceRange([
                parseFloat(settings?.general_minimum_price),
                parseFloat(settings?.general_maximum_price)
            ]);
        }
    }, [settings])
    
    // Consolidated useEffect to trigger fetchData and fetchAvailableCars based on dependency changes
    useEffect(() => {
        fetchAvailableCars();
       
    
        if (settings) {
            setPriceRange([
                parseFloat(settings.general_minimum_price),
                parseFloat(settings.general_maximum_price),
            ]);
        }
    }, [
        startDate,
        endDate,
        location,
        
       
       
    ]);
    useEffect(() => {
        const selectedCity = localStorage.getItem("selectedCity");
        const filtered = homeData.filter((car) => {
            const itemInfo = car.item_info ? JSON.parse(car.item_info) : {};
            const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(car.item_type_id.toString());
            const matchesCity = !selectedCity || car.city === selectedCity;
            const carPrice = parseFloat(car.price.replace(/[^0-9.-]+/g, ""));
            const matchesPrice = carPrice >= priceRange[0] && carPrice <= priceRange[1];
            const matchesYear = selectedYears.length === 0 || selectedYears.includes(itemInfo.year);
            return matchesCategory && matchesCity && matchesPrice && matchesYear;
        });
        setCars(filtered);
    }, [selectedCategories, priceRange, selectedYears]);

    useEffect(() => {
        const data = sessionStorage.getItem("data");
        const selectedBrand = Number(sessionStorage.getItem("selectedBrand"));
        if (data) {
            setCars(JSON.parse(data));
        }

        if (selectedBrand) {
            handleBrandChange(selectedBrand)
        }
    }, []);

    const fetchFilteredData = async () => {
    if (!hasFilterChanged) return;

    try {
        const params: Record<string, string> = {};

        // Building params for the API call
        if (selectedBrands.length > 0) {
           params["meta"] = `{"make_type":"[${selectedBrands.join(",")}]"}`
        }

        if (selectedFeatures.length > 0) {
            const featureIds = selectedFeatures.map(f => f.id).join(",");
            params["facility"] = `[${featureIds}]`;
        }

        if (selectedOdometer.length > 0) {
            params["odometer"] = `[${selectedOdometer.join(",")}]`;
        }

        if (sortOption) {
            params["sort"] = sortOption;
        }
        if (priceRange.length > 0) {
            params["price_range"] = `[${priceRange[0]},${priceRange[1]}]`;
        }

        if (selectedYears.length > 0) {
            params["year_range"] = `[${selectedYears.join(",")}]`; // Assuming filtering by year
        }

        if (sortOption) {
            params["sort"] = sortOption;
        }

        console.log("API Call Params:", params);

        const response = await api.post("/itemSearch", params);
        const filteredItems = response.data.data.items;

        setCars(filteredItems);
        setHasFilterChanged(false);
    } catch (error) {
        console.error("Error fetching filtered data:", error);
    } finally {
        setIsLoading(false);
    }
};


    useEffect(() => {
        if (hasFilterChanged) {
            fetchFilteredData();
        }
    }, [hasFilterChanged]);    
    
    
        const handleBrandChange = (id: number) => {
            setSelectedBrands((prev) => {
                const updatedBrands = prev.includes(id)
                    ? prev.filter((b) => b !== id)
                    : [...prev, id];
                setHasFilterChanged(true);
                return updatedBrands;
            });
        };
    
        
    
        
        const handleYearChange = (year: string) => {
            setSelectedYears((prev) =>
                prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]
            );
        };
        
    
        
    
    // Save selected car to session storage
    const saveSelectedCar = (car: Car) => {
        sessionStorage.setItem("selectedCar", JSON.stringify(car));
    };
    const handleOdometerChange = (odometer: OdometerRange) => {
        const odometerId = `odometer-${odometer.id}`;
        
        // Check if this odometer range is currently selected
        const isSelected = selectedOdometer.includes(odometer.id);
        
        if (!isSelected) {
            // Adding new odometer selection
            setSelectedOdometer(prev => [...prev, odometer.id]);
            
            // Add tab if it doesn't exist
            if (!tabs.some(tab => tab.id === odometerId)) {
                setTabs(prev => [...prev, {
                    id: odometerId,
                    label: `Odometer: ${odometer.odometer}`
                }]);
            }
        } else {
            // Removing odometer selection
            setSelectedOdometer(prev => prev.filter(id => id !== odometer.id));
            handleTabClose(odometerId);
        }
        
        // Trigger filter update
        setHasFilterChanged(true);
    };
    const handleFeatureChange = (feature: Feature) => {
        const featureId = `feature-${feature.id}`;
    
        setSelectedFeatures(prev => {
            const isSelected = prev.some(f => f.id === feature.id);
    
            if (!isSelected) {
                // Add feature and new tab
                setTabs(prevTabs => [...prevTabs, { id: featureId, label: `Feature: ${feature.name}` }]);
                setHasFilterChanged(true);
                return [...prev, feature];
            } else {
                // Remove feature and close tab
                setTabs(prevTabs => prevTabs.filter(tab => tab.id !== featureId));
                setHasFilterChanged(true);
                return prev.filter(f => f.id !== feature.id);
            }
        });
    };
    

    return (
        <>
            <Head>
                <title>Unibooker | Car List</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <section className={`${styles.car_list_main} ${styles.page} ${jostFont.variable}`}>
                <Container>
                    <Row>
                        <Col md={18} className={styles.main_heading}>
                            <Row className='m-4'>
                                <Col md={2} className='text-start'>
                                    <h2>Car List</h2>
                                </Col>
                                <Col>
<Tabs activeKey={activeTab ?? undefined} onSelect={(k) => setActiveTab(k ?? null)}>
    {tabs.map((tab) => (
        <Tab
            key={tab.id}
            eventKey={tab.id}
            title={
                <div>
                    {tab.label}
                    <button
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent tab switch
                            handleTabClose(tab.id);
                            e.preventDefault();
                        }}
                        style={{ marginLeft: "10px", background: "none", border: "none" }}
                    >
                        ×
                    </button>
                </div>
            }
        >
            <div>Content for {tab.label}</div>
        </Tab>
    ))}
</Tabs>

     
</Col>
                            </Row>
                        </Col>

                        <Col md={16} className='text-end'>
                          <div>
                            <h5>Sort By</h5>
                            <select onChange={(e) => handleSortChange(e.target.value)} value={sortOption}>
                              <option value="">Select Sort</option>
                              <option value="nearest_location">Nearest Location</option>
                              <option value="cheapest_price">Cheapest Price</option>
                              <option value="most_viewed">Most Viewed</option>
                            </select>
                          </div>
                        </Col>
                        <Col md={3}>
                            
                            <div className={styles.filter_section}>
                            <div ref={accordionRef} style={{ overflowY: 'auto', maxHeight: '500px' }}>
                            <Accordion activeKey={activeKeys} onSelect={(eventKey) => handleToggle(eventKey as string | null)}>
        <Accordion.Item eventKey="0">
            <Accordion.Header>Categories</Accordion.Header>
            <Accordion.Body>
                <Nav className="flex-column">
                    {itemTypes.map((item) => (
                        <Nav.Item key={item.id}>
                 <input
                type="checkbox"
                id={`filter-${item.id}`}
                checked={selectedCategories.includes(item.id.toString())}
                onChange={() => handleCategoryCheckbox(item)}
            />
                            <label htmlFor={`filter-${item.id}`} className="ms-2">
                                {item.name}
                            </label>
                        </Nav.Item>
                    ))}
                </Nav>
            </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1">
            <Accordion.Header>Price Range</Accordion.Header>
            <Accordion.Body>
                <div>Range: ${priceRange[0]} - ${priceRange[1]}</div>
                <input
    type="range"
    min={settings?.general_minimum_price}
    max={settings?.general_maximum_price}    step="50"
    value={priceRange[0]}
    onChange={(e) => {
        // Update price range
        const newMinPrice = parseFloat(e.target.value);

        // Update the minimum price of the range while keeping the maximum price intact
        setPriceRange([newMinPrice, priceRange[1]]);

        // Create the price range ID
        const priceRangeId = `priceRange-${newMinPrice}-${priceRange[1]}`;

        // Close any previously open tabs for this price range
        const existingTab = tabs.find(tab => tab.id === priceRangeId);
        
        if (existingTab) {
            // If the tab already exists, close it first (remove it from the tabs)
            setTabs(prevTabs => prevTabs.filter(tab => tab.id !== priceRangeId));
        }

        // Now open the new tab for this price range
        setTabs(prevTabs => [
            ...prevTabs,
            { id: priceRangeId, label: `Price: $${newMinPrice} - $${priceRange[1]}` }
        ]);
    }}
/>

            </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="2">
            <Accordion.Header>Brands</Accordion.Header>
            <Accordion.Body>
                <Nav className="flex-column">
                    {makes.map((make) => (
                        <Nav.Item key={make.id}>
                             <input
                type="checkbox"
                id={`make-${make.id}`}
                checked={selectedBrands.includes(make.id) || sessionStorage.getItem("selectedBrand") === make.name}
                onChange={() => {
                    

                    // Check if the make is selected or deselected
                    if (!selectedBrands.includes(make.id) && sessionStorage.getItem("selectedBrand") !== make.name) {
                        // Open the tab for this make
                        setTabs((prevTabs) => [
                            ...prevTabs,
                            { id: `make-${make.id}`, label: `Make: ${make.name}` }
                        ]);
                    } else {
                        // Close the tab if the checkbox is unchecked
                        handleTabClose(`make-${make.id}`);
                    }

                    handleBrandChange(make.id);
                }}
            />
                            <label htmlFor={`make-${make.id}`} className="ms-2">
                                {make.name}
                            </label>
                        </Nav.Item>
                    ))}
                </Nav>
            </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="3">
            <Accordion.Header>Odometer</Accordion.Header>
            <Accordion.Body>
                <Nav className="flex-column">
                    {odometerRanges.map((odometer) => (
                        <Nav.Item key={odometer.id}>
                <input
    type="checkbox"
    id={`odometer-${odometer.id}`}
    checked={selectedOdometer.includes(odometer.id)}
    onChange={() => {
        // Handle checkbox change logic
         handleOdometerChange(odometer)}
        // After updating selectedOdometer, check whether the tab should be added or removed
       

        // Call the odometer change handler
    
    }
/>
                            <label htmlFor={`odometer-${odometer.id}`} className="ms-2">
                                {odometer.odometer}
                            </label>
                        </Nav.Item>
                    ))}
                </Nav>
            </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="4">
            <Accordion.Header>Features</Accordion.Header>
            <Accordion.Body>
                <Nav className="flex-column">
                    {featureData.map((feature, index) => (
                        <Nav.Item key={index}>
                            <input
            type="checkbox"
            id={`feature-${feature.id}`}
            checked={selectedFeatures.some((f) => f.id === feature.id)}
            onChange={() => handleFeatureChange(feature)}
        />
                            <label htmlFor={`feature-${feature.name}`} className="ms-2">
                                {feature.name}
                            </label>
                        </Nav.Item>
                    ))}
                </Nav>
            </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="5">
            <Accordion.Header>Year</Accordion.Header>
            <Accordion.Body>
                <Nav className="flex-column">
                    {years.map((year) => (
                        <Nav.Item key={year}>
                            <input
                                type="checkbox"
                                id={`year-${year}`}
                                checked={selectedYears.includes(year)}
                                onChange={() =>{ handleYearChange(year)
                                    if (!selectedYears.includes(year)) {
                                        // Open the tab for this year
                                        setTabs((prevTabs) => [
                                            ...prevTabs,
                                            { id: `year-${year}`, label: `Year: ${year}` }  // Ensure `label` is set
                                        ]);
                                    } else {
                                        // Close the tab if it's unchecked
                                        handleTabClose(`year-${year}`);
                                    }
                                }
                            }
                            />
                            <label htmlFor={`year-${year}`} className="ms-2">
                                {year}
                            </label>
                        </Nav.Item>
                    ))}
                </Nav>
            </Accordion.Body>
        </Accordion.Item>
    </Accordion>
</div>
                            </div>
                        </Col>

                        <Col md={9} className='text-center'>
                            <div className={styles.cars_row}>
                                {isLoading ? (
                                    <p>Loading cars...</p>
                                ) : error ? (
                                    <p>{error}</p> // Display error message if any
                                ) : Array.isArray(cars) && cars.length > 0 ? (
                                    cars.map((car, index) => (
                                        <div key={index} onClick={() => saveSelectedCar(car)}>
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
                                                saveSelectedCar={saveSelectedCar}
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <p>No cars available</p> // Fallback message if no cars are found
                                )}
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </>
)};
    

export default Index;
