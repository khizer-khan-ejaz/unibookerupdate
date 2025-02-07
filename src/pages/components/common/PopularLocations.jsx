import React from 'react';
import Slider from 'react-slick';
import Image from 'next/image';
import styles from "@/styles/Home.module.css";

const PopularLocations = ({ locations, sliderSettings, variant = 'slider', onLocationClick }) => {
    if (!Array.isArray(locations) || locations.length === 0) {
        console.error("The 'locations' prop is not an array or is empty.");
        return null;
    }
    return (
        <>
            {variant === 'slider' ? (
                <Slider className={styles.location_slider} {...sliderSettings}>
                    {locations.map((location, index) => (
                        <div className={styles.location_card} key={index} onClick={() => onLocationClick(location.city_name)} style={{ cursor: "pointer" }}>
                            <Image
                                className={styles.locationImg}
                                src={location.image}
                                alt={`Location ${index + 1}`}
                                width="220"
                                height="220"
                            />
                            <h3>{location.city_name}</h3>
                        </div>
                    ))}
                </Slider>
            ) : (
                <div className={styles.grid_layout}>
                    {locations.map((location, index) => (
                        <div className={styles.location_card} key={index} onClick={() => onLocationClick(location.city_name)} style={{ cursor: "pointer" }}>
                            <Image
                                src={location.image}
                                alt={`Location ${index + 1}`}
                                width="220"
                                height="220"
                                className={styles.locationImgGrid}
                            />
                            <h3>{location.city_name}</h3>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default PopularLocations;
