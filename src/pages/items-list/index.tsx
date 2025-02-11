import Head from 'next/head'
import React, { useEffect, useState,useRef } from 'react'
import styles from "@/styles/CarList.module.css";
import { Col, Container, Row } from 'react-bootstrap';
import CarCard from '../components/common/CarCard';
import { Jost } from 'next/font/google';
import Loader from '../components/common/Loader';
import api from '../../api/api';
import { useAuth } from '@/context/AuthContext';
import { Nav, Accordion, Tab, Tabs } from "react-bootstrap";



const jostFont = Jost({
    variable: "--font-jost",
    subsets: ["latin"],
});

interface Feature {
    id: string;
    name: string;
}
interface Car {
    id: string;
    name: string;
    item_rating: number;
    is_in_wishlist: boolean
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
    id: number;
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

const Index = () => {
    const [tabs, setTabs] = useState<{ id: string; label: string }[]>([]);


    const accordionRef = useRef<HTMLDivElement>(null);

    const [homeData, setHomeData] = useState<Car[]>([]);
    const [filteredData, setFilteredData] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
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
    const [sortOption, setSortOption] = useState<string>("");
    const { settings } = useAuth();
    const [hasFilterChanged, setHasFilterChanged] = useState(false);
    
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
    setTabs((prevTabs) => prevTabs.filter((tab) => tab.id !== tabId));
    if (activeTab === tabId) {
        setActiveTab(tabs.length > 1 ? tabs[0]?.id ?? null : null);
    }
};
   // Scroll event handler for the accordion
  

// Adding event listener when mouse enters the accordion area
const handleAccordionScroll = (e: WheelEvent) => {
    if (!accordionRef.current) return;
    const delta = e.deltaY;
    const currentKey = activeKeys[0]; // Get the current active accordion item
    const totalItems = 6; // Number of accordion items, adjust as necessary

    // Scroll down
    if (delta > 0) {
        if (currentKey === undefined || parseInt(currentKey) < totalItems - 1) {
            handleToggle((parseInt(currentKey || "0") + 1).toString());
        }
    }
    // Scroll up
    else if (delta < 0) {
        if (currentKey === undefined || parseInt(currentKey) > 0) {
            handleToggle((parseInt(currentKey || "0") - 1).toString());
        }
    }
};

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
                setFilteredData(mergedData);
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
                setLoading(false);
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
        setFilteredData(filtered);
    }, [selectedCategories, priceRange, selectedYears]);

    useEffect(() => {
        const data = sessionStorage.getItem("data");
        const selectedBrand = Number(sessionStorage.getItem("selectedBrand"));
        if (data) {
            setFilteredData(JSON.parse(data));
        }

        if (selectedBrand) {
            handleBrandChange(selectedBrand)
        }
    }, []);

    const fetchFilteredData = async () => {
        if (!hasFilterChanged) return;
        try {
            setLoading(true);
            const params: Record<string, string> = {};

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

            const response = await api.post("/itemSearch", params);
            const filteredItems = response.data.data.items;
            setFilteredData(filteredItems);
            setHasFilterChanged(false);
        } catch (error) {
            console.error("Error fetching filtered data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (hasFilterChanged) {
            fetchFilteredData();
        }
    }, [hasFilterChanged]);

    const handleSortChange = (option: string) => {
        setSortOption(option);
        setHasFilterChanged(true);
    }

    const handleBrandChange = (id: number) => {
        setSelectedBrands((prev) => {
            const updatedBrands = prev.includes(id)
                ? prev.filter((b) => b !== id)
                : [...prev, id];
            setHasFilterChanged(true);
            return updatedBrands;
        });
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategories((prev) =>
            prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
        );
    };

    const handleFeatureChange = (feature: Feature) => {
        setSelectedFeatures((prev) => {
            const updatedFeatures = prev.some((f) => f.id === feature.id)
                ? prev.filter((item) => item.id !== feature.id)
                : [...prev, feature];
            setHasFilterChanged(true);
            return updatedFeatures;
        });
    };

    const handleYearChange = (year: string) => {
        setSelectedYears((prev) =>
            prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]
        );
    };

    const handleOdometerChange = (odometerId: number) => {
        setSelectedOdometer((prev) => {
            const updatedOdometer = prev.includes(odometerId)
                ? prev.filter((o) => o !== odometerId)
                : [...prev, odometerId];
            setHasFilterChanged(true);
            return updatedOdometer;
        });
    };

    const saveSelectedCar = (car: Car) => {
        sessionStorage.setItem("selectedCar", JSON.stringify(car));
    };
    

    useEffect(() => {
        fetchFilteredData();
    }, [selectedBrands, selectedFeatures, selectedOdometer, sortOption]);
    

    if (loading) {
        return <Loader />;
    }

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

                            </Row>
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
                onChange={() => {
                    // Handle checkbox change logic
              
                    const categoryId = `category-${item.id}`;
                    handleCategoryChange(item.id.toString());


                    // Prevent adding a duplicate tab
                    const tabExists = tabs.some((tab) => tab.id === categoryId);

                    if (!tabExists) {
                        // Open the tab for this category if it doesn't exist
                        setTabs((prevTabs) => [
                            ...prevTabs,
                            { id: categoryId, label: `Category: ${item.name}` }
                        ]);
                    } else {
                        // Close the tab if unchecked
                        handleTabClose(categoryId);
                    }
                }}
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
        max={settings?.general_maximum_price}
        step="50"
        value={priceRange[0]}
        onChange={(e) => {
            // Update price range
            setPriceRange([parseFloat(e.target.value), priceRange[1]]);

            // Open or close tab based on range selected
            const priceRangeId = `priceRange-${priceRange[0]}-${priceRange[1]}`;

            // Check if the tab exists for this price range
            if (!tabs.some(tab => tab.id === priceRangeId)) {
                // Open the tab for this price range
                setTabs((prevTabs) => [
                    ...prevTabs,
                    { id: priceRangeId, label: `Price: $${priceRange[0]} - $${priceRange[1]}` }
                ]);
            } else {
                // Close the tab if the price range is deselected (or when the range is reset)
                handleTabClose(priceRangeId);
            }
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

        // After updating selectedOdometer, check whether the tab should be added or removed
        const odometerId = `odometer-${odometer.id}`;
        const tabExists = tabs.some((tab) => tab.id === odometerId);

        if (!tabExists) {
            // Open the tab if it doesn't exist
            setTabs((prevTabs) => [
                ...prevTabs,
                { id: odometerId, label: `Odometer: ${odometer.odometer}` }
            ]);
        } else {
            // Close the tab if it's already open
            handleTabClose(odometerId);
        }

        // Call the odometer change handler
        handleOdometerChange(odometer.id);
    }}
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
            id={`feature-${feature.name}`}
            checked={selectedFeatures.some((f) => f.id === feature.id)}
            onChange={() => {
                handleFeatureChange(feature);

                // Check if the feature is selected or deselected
                if (!selectedFeatures.some((f) => f.id === feature.id)) {
                    // Open the tab for this feature
                    setTabs((prevTabs) => [
                        ...prevTabs,
                        { id: `feature-${feature.id}`, label: `Feature: ${feature.name}` }
                    ]);
                } else {
                    // Close the tab if the checkbox is unchecked
                    handleTabClose(`feature-${feature.id}`);
                }
            }}
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
                            {filteredData.length === 0 ? (
                                <div className="no_data">No data available</div>
                            ) : (
                                <div className={styles.cars_row}>
                                    {filteredData.map((car, index) => (
                                        <div
                                            key={index}
                                            onClick={() => saveSelectedCar(car)}
                                        >
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
                                    ))}
                                </div>
                            )}
                        </Col>
                    </Row>
                </Container>
            </section>
        </>
    )
};

export default Index;