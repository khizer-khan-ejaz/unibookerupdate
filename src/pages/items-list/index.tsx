import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import styles from "@/styles/CarList.module.css";
import { Col, Container, Row } from 'react-bootstrap';
import CarCard from '../components/common/CarCard';
import { Jost } from 'next/font/google';
import Loader from '../components/common/Loader';
import api from '../../api/api';
import { useAuth } from '@/context/AuthContext';

import { Accordion, Nav } from "react-bootstrap";

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
                           
    <Accordion defaultActiveKey="0">
        {/* Categories */}
        <Accordion.Item eventKey="0">
            <Accordion.Header>Categories</Accordion.Header>
            <Accordion.Body>
                <Nav className="flex-column">
                    {itemTypes.map((item) => (
                        <Nav.Item key={item?.id}>
                            <input
                                type="checkbox"
                                id={`filter-${item.id}`}
                                checked={selectedCategories.includes(item.id.toString())}
                                onChange={() => handleCategoryChange(item.id.toString())}
                            />
                            <label htmlFor={`filter-${item.id}`} className="ms-2">
                                {item.name}
                            </label>
                        </Nav.Item>
                    ))}
                </Nav>
            </Accordion.Body>
        </Accordion.Item>

        {/* Price Range */}
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
                    onChange={(e) => setPriceRange([parseFloat(e.target.value), priceRange[1]])}
                />
            </Accordion.Body>
        </Accordion.Item>

        {/* Brands */}
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
                                onChange={() => handleBrandChange(make.id)}
                            />
                            <label htmlFor={`make-${make.id}`} className="ms-2">
                                {make.name}
                            </label>
                        </Nav.Item>
                    ))}
                </Nav>
            </Accordion.Body>
        </Accordion.Item>

        {/* Odometer */}
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
                                onChange={() => handleOdometerChange(odometer.id)}
                            />
                            <label htmlFor={`odometer-${odometer.id}`} className="ms-2">
                                {odometer.odometer}
                            </label>
                        </Nav.Item>
                    ))}
                </Nav>
            </Accordion.Body>
        </Accordion.Item>

        {/* Features */}
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

        {/* Year */}
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
                                onChange={() => handleYearChange(year)}
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