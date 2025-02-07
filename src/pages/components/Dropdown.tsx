import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";

const DropdownFilters = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedOdometer, setSelectedOdometer] = useState("");
  const [selectedFeature, setSelectedFeature] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const categoryOptions = ["Car", "Motorbike", "Bus", "Electric Car", "Van", "Bike"];
  const brandOptions = ["Audi", "BMW", "Ford", "Honda", "Hyundai", "Lamborghini", "Mahindra", "Mercedes-Benz", "Nissan", "Porsche", "Royal Enfield", "Tesla", "Toyota", "Volkswagen", "Yamaha"];
  const odometerOptions = ["100 KM - 500 KM", "500 KM - 900 KM", "900 KM - 1500 KM", "1000 KM - 1500 KM", "1500 KM - 2000 KM", "2000 KM - 3000 KM", "3000 KM - 5000 KM", "Over 5000 KM"];
  const featureOptions = ["Airbags", "Backup Camera", "Bluetooth Connectivity", "Navigation System", "Cruise Control", "Power Windows", "Power Seats", "Heated/Cooled Seats", "Sunroof/Moonroof", "Alloy Wheels", "Keyless Entry"];
  const yearOptions = ["2025", "2024", "2023", "2021", "2020"];

  return (
    <div className="container mt-3">
      {/* Categories Dropdown */}
      <Dropdown className="mb-2">
        <Dropdown.Toggle variant="primary" id="dropdown-category">
          {selectedCategory || "Categories"}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {categoryOptions.map((category, index) => (
            <Dropdown.Item key={index} onClick={() => setSelectedCategory(category)}>
              {category}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>

      {/* Brands Dropdown */}
      <Dropdown className="mb-2">
        <Dropdown.Toggle variant="primary" id="dropdown-brand">
          {selectedBrand || "Brands"}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {brandOptions.map((brand, index) => (
            <Dropdown.Item key={index} onClick={() => setSelectedBrand(brand)}>
              {brand}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>

      {/* Odometer Dropdown */}
      <Dropdown className="mb-2">
        <Dropdown.Toggle variant="primary" id="dropdown-odometer">
          {selectedOdometer || "Odometer"}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {odometerOptions.map((range, index) => (
            <Dropdown.Item key={index} onClick={() => setSelectedOdometer(range)}>
              {range}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>

      {/* Features Dropdown */}
      <Dropdown className="mb-2">
        <Dropdown.Toggle variant="primary" id="dropdown-feature">
          {selectedFeature || "Features"}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {featureOptions.map((feature, index) => (
            <Dropdown.Item key={index} onClick={() => setSelectedFeature(feature)}>
              {feature}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>

      {/* Year Dropdown */}
      <Dropdown className="mb-2">
        <Dropdown.Toggle variant="primary" id="dropdown-year">
          {selectedYear || "Year"}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {yearOptions.map((year, index) => (
            <Dropdown.Item key={index} onClick={() => setSelectedYear(year)}>
              {year}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default DropdownFilters;
