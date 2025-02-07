/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
import { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import Image from 'next/image';
import 'react-calendar/dist/Calendar.css';
import styles from '@/styles/CheckAvailability.module.css';
import Calendar from 'react-calendar';
import { FaCalendarAlt } from 'react-icons/fa';
import { useRouter } from 'next/router';
import api from '../api/api';
import { toast, ToastContainer } from 'react-toastify';
import Loader from '../components/common/Loader';
import Head from 'next/head';
import { isToday, isFuture, startOfDay } from "date-fns"
interface Profile {
    token: string;
    id: string;
    name: string;
    email: string;
}
interface AvailabilityData {
    available_dates: { date: string, price: string }[];
    booked_dates: { date: string }[];
    not_available_dates: { date: string }[];
}
interface CarDetails {
    id: number;
    name: string;
    image: string;
    address: string;
    price: string;
}

const CheckAvailability = () => {
    const router = useRouter();
    const [selectedRange, setSelectedRange] = useState<{ start: Date | null; end: Date | null }>({
        start: null,
        end: null
    });
    const [fromDate, setFromDate] = useState<Date | null>(null);
    const [toDate, setToDate] = useState<Date | null>(null);
    const [availabilityData, setAvailabilityData] = useState<AvailabilityData | null>(null);
    const [startTime, setStartTime] = useState<string | null>(null);
    const [endTime, setEndTime] = useState<string>('');
    const [timeSlots, setTimeSlots] = useState<{ start: string; end: string }[]>([]);
    const [itemId, setItemId] = useState<string>('');
    const [selectedCar, setSelectedCar] = useState<CarDetails | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isavailable, setIsAvailable] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedData = localStorage.getItem('userData');
        if (storedData) {
            setProfile(JSON.parse(storedData));
        }
    }, []);

    useEffect(() => {
        const availabilityData = sessionStorage.getItem('availability');
        const itemId = sessionStorage.getItem('itemId');
        const selectedCarData = sessionStorage.getItem('carDetails');
        if (itemId) {
            setItemId(itemId);
        }

        if (selectedCarData) {
            const parsedCarData = JSON.parse(selectedCarData);
            setSelectedCar(parsedCarData);
        }

        if (availabilityData) {
            setAvailabilityData(JSON.parse(availabilityData));
        }
    }, []);

    const handleRedirect = async () => {
        const checkInDate = fromDate?.toISOString().split('T')[0];
        const checkOutDate = toDate?.toISOString().split('T')[0]
        const isSameDay = checkInDate === checkOutDate;
        const formattedStartTime = startTime?.trim();
        const formattedEndTime = endTime?.trim();
        if (!formattedStartTime || !formattedEndTime) {
            toast.error("Please select a valid start and end time.");
            return;
        }
        if (isSameDay && formattedStartTime === formattedEndTime) {
            console.error("Error: Start time and end time cannot be the same for same-day bookings.");
            toast.error("For same-day bookings, end time must be different from start time.");
            return;
        }
        const checkoutData = {
            ...selectedCar,
            checkInDate: fromDate?.toISOString().split('T')[0],
            checkOutDate: toDate?.toISOString().split('T')[0],
            startTime: startTime,
            endTime: endTime,
        };
        sessionStorage.setItem('checkoutDetails', JSON.stringify(checkoutData));
        // sessionStorage.removeItem('carDetails');
        router.push('/checkout');
    };

    const availableDates = availabilityData?.available_dates?.map((item: any) => item.date);
    const bookedDates = availabilityData?.booked_dates?.map((item: any) => item.date);
    const priceData = availabilityData?.available_dates?.reduce((acc: any, item: any) => {
        acc[item.date] = item.price;
        return acc;
    }, {});

    const tileClassName = ({ date }: any) => {
        const dateString = date.toISOString().split('T')[0];
        const fromDateNormalized = fromDate && new Date(fromDate.setHours(0, 0, 0, 0));
        const toDateNormalized = toDate && new Date(toDate.setHours(0, 0, 0, 0));
        const isSelected = fromDateNormalized && toDateNormalized && date >= fromDateNormalized && date <= toDateNormalized;
        let classNames = '';
        if (bookedDates?.includes(dateString)) {
            classNames = `${styles.booking} ${styles.booked}`;
        }
        else  if (availableDates?.includes(dateString)) {
            classNames = styles.availablity;
        } 
        if (isSelected) {
            classNames += ` ${styles.selectedDate}`;
        }
        return classNames;
    };

    const tileContent = ({ date }: any) => {
        const dateString = date.toISOString().split('T')[0];
        if (availableDates?.includes(dateString)) {
            return (
                <div className={styles.priceLabel}>
                    {priceData[dateString] ? `${priceData[dateString]} USD` : ''}
                </div>
            );
        }
        return null;
    };

    const handleDateChange = async (dates: any) => {
        if (Array.isArray(dates) && dates.length === 2) {
            const adjustedFromDate = new Date(dates[0]);
            adjustedFromDate.setHours(12, 0, 0, 0);
            const adjustedToDate = new Date(dates[1]);
            adjustedToDate.setHours(12, 0, 0, 0);
            const currentDate = new Date();
            const isCurrentDate = adjustedFromDate.toISOString().split('T')[0] === currentDate.toISOString().split('T')[0];
            const isBetween11PMAnd12AM = currentDate.getHours() === 23 && currentDate.getMinutes() >= 0 && currentDate.getMinutes() < 60;
            if (isCurrentDate && isBetween11PMAnd12AM) {
                alert("You cannot book a slot between 11 PM and 12 AM.");
                setIsAvailable(false);
                return;
            }
            // if (adjustedFromDate.toISOString().split('T')[0] === adjustedToDate.toISOString().split('T')[0]) {
            //     setStartTime('12:00 AM');
            //     const startTimeObj = new Date(`1970-01-01T12:00:00Z`);
            //     startTimeObj.setMinutes(startTimeObj.getMinutes() + 30);
            //     setEndTime(formatAMPM(startTimeObj));
            // }
            setFromDate(adjustedFromDate);
            setToDate(adjustedToDate);
            setSelectedRange({
                start: adjustedFromDate,
                end: adjustedToDate
            });
            await checkAvailability(adjustedFromDate, adjustedToDate);
        }
    };

    function formatAMPM(date: Date): string {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        return `${formattedHours}:${formattedMinutes} ${ampm}`;
    }

    function formatTime(date: Date): string {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;
        const formattedMinutes = minutes.toString().padStart(2, '0');
        return `${formattedHours}:${formattedMinutes} ${ampm}`;
    }

    const checkAvailability = async (fromDate: Date, toDate: Date) => {
        const fromDateStr = fromDate.toISOString().split('T')[0];
        const toDateStr = toDate.toISOString().split('T')[0];
        const requestData = {
            item_id: itemId,
            check_in: fromDateStr,
            check_out: toDateStr
        };
        setLoading(true)
        try {
            const response = await api.post('/checkBookingAvailability', requestData);
            const data = response.data.data;
            const { availability } = data;
            if (response.data.status === 200) {
                if (availability.is_available) {
                    setIsAvailable(true);
                    setStartTime(response.data.data.availability.next_start_time)
                }
                setLoading(false)
            }
        } catch (error: any) {
            setIsAvailable(false);
            if (error.response?.status === 422) {
                const overlapDetails = error.response.data.data.bookingOverlapDetails;
                const bookingMessages = overlapDetails.map((booking: any) =>
                    `The Vehicle is Booked on ${booking.date} from ${booking.start_time} to ${booking.end_time}`
                ).join("\n");

                toast.error(`Dates overlap with existing bookings:\n${bookingMessages}`);
            } else {
                console.error("An unexpected error occurred: ", error);
            }
        }
        finally {
            setLoading(false)
        }
    };

    const staticTimeSlots = [
        '12:30 AM', '1:00 AM', '1:30 AM', '2:00 AM', '2:30 AM', '3:00 AM', '3:30 AM', '4:00 AM', '4:30 AM', '5:00 AM', '5:30 AM', '6:00 AM',
        '6:30 AM', '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM',
        '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM',
        '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM', '10:00 PM', '10:30 PM', '11:00 PM',
    ];

    const generateSlots = (startSlot: Date, slots: { start: string; end: string }[]) => {
        startSlot = new Date(startSlot.getTime() + 30 * 60000);
        while (startSlot.getHours() < 23 || (startSlot.getHours() === 23 && startSlot.getMinutes() < 30)) {
            let endSlot = new Date(startSlot);
            slots.push({ start: formatTime(startSlot), end: formatTime(endSlot) });
            startSlot = new Date(startSlot.getTime() + 30 * 60000);
        }
        slots.push({ start: "11:30 PM", end: "11:30 PM" });
    };

    const generateTimeSlots = (startTime: string, fromDate: Date, toDate: Date) => {
        const isTodayDate = isToday(fromDate);
        const isFutureDate = isFuture(startOfDay(fromDate));
        const isEndDateInFuture = isFuture(startOfDay(toDate));
        const isStartTimeDifferent = startTime !== '12:00 AM';
        let slots: { start: string; end: string }[] = [];
        if (isStartTimeDifferent) {
            let nextStartSlot = getNextStartSlot(startTime, isTodayDate);
            generateSlots(nextStartSlot, slots);
            return slots;
        }
        let nextStartSlot: Date;
        if (startTime && startTime !== "12:00 AM") {
            nextStartSlot = getNextStartSlot(startTime, isTodayDate);
        } else {
            if (isTodayDate && isEndDateInFuture) {
                nextStartSlot = getNextStartSlot(startTime, isTodayDate);
            } else {
                nextStartSlot = getNextStartSlot(startTime, isTodayDate);
            }
        }
        let nextEndSlot: Date;
        while (nextStartSlot.getHours() !== 23 || nextStartSlot.getMinutes() !== 30) {
            if (isTodayDate) {
                nextEndSlot = new Date(nextStartSlot);
            } else {
                nextEndSlot = new Date(nextStartSlot.getTime() + 30 * 60000);
            }
            if (isEndDateInFuture) {
                slots.push({
                    start: formatTime(nextStartSlot),
                    end: "",
                });
            } else {
                slots.push({
                    start: formatTime(nextStartSlot),
                    end: formatTime(nextEndSlot),
                });
            }
            nextStartSlot = new Date(nextStartSlot.getTime() + 30 * 60000);
        }
        if (isEndDateInFuture) {
            staticTimeSlots.forEach(staticSlot => {
                slots.push({
                    start: '',
                    end: staticSlot,
                });
            });
        }
        slots.push({
            start: "11:30 PM",
            end: "11:30 PM",
        });
        return slots;
    };

    const getNextStartSlot = (startTime: string, isTodayDate: boolean) => {
        if (!startTime) return new Date(1970, 0, 1, 0, 30);
        let [time, period] = startTime.split(" ");
        let [hours, minutes] = time.split(":").map(Number);
        if (period === "PM" && hours !== 12) hours += 12;
        if (period === "AM" && hours === 12) hours = 0;
        let nextStartSlot = new Date(1970, 0, 1, hours, minutes);
        if (isTodayDate && startTime === "12:00 AM") {
            const currentTime = new Date();
            let currentHours = currentTime.getHours();
            let currentMinutes = currentTime.getMinutes();
            let roundedMinutes = Math.ceil(currentMinutes / 30) * 30;
            if (roundedMinutes === 60) {
                roundedMinutes = 0;
                currentHours = (currentHours + 1) % 24;
            }
            nextStartSlot = new Date(1970, 0, 1, currentHours, roundedMinutes);
        }
        return nextStartSlot;
    };

    useEffect(() => {
        if (startTime && fromDate && toDate) {
            try {
                const slots = generateTimeSlots(startTime, fromDate, toDate);
                setTimeSlots(slots);
                if (fromDate.toISOString().split('T')[0] === toDate.toISOString().split('T')[0] && startTime === endTime) {
                    toast.error("For same-day bookings, end time must be different from start time.");
                    setEndTime('');
                }
            } catch (error) {
                console.error("Error generating time slots:", error);
            }
        }
    }, [isavailable, fromDate, toDate]);

    const handleStartTimeChange = (e: any) => {
        const selectedStartTime = e.target.value;
        setStartTime(selectedStartTime);
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <>
            <Head>
                <title>Check Availability | Unibooker</title>
                <meta name="description" content="Wishlist for cars and bikes on Unibooker" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <Container className={styles.availabilityPage}>
                    <Row className="justify-content-center text-center my-5 ">
                        <h2>Check Availability</h2>
                    </Row>
                    <Row>
                        <Col md={6} className={styles.imageSection}>
                            <Image src={selectedCar?.image || ''} alt="Car" width={500} height={500} className={`${styles.carImage} img-fluid rounded mb-5`} />
                        </Col>
                        <Col md={6} className={styles.calendarSection}>
                            <div className={styles.calendarContainer}>
                                <Calendar
                                    selectRange={true}
                                    onChange={handleDateChange}
                                    tileClassName={tileClassName}
                                    tileContent={tileContent}
                                    minDate={new Date()}
                                    value={selectedRange.start && selectedRange.end ? [selectedRange.start, selectedRange.end] : null}
                                />
                                <div className={styles.legend}>
                                    <p>
                                        <span className={styles.available}></span> Available
                                    </p>
                                    <p>
                                        <span className={styles.unavailable}></span> Booked
                                    </p>
                                </div>
                            </div>
                            <Form>
                                <div className="row">
                                    <div className="col-md-6 mb-4">
                                        <Form.Group controlId="fromDate">
                                            <Form.Label>Check In</Form.Label>
                                            <InputGroup>
                                                <InputGroup.Text>
                                                    <FaCalendarAlt />
                                                </InputGroup.Text>
                                                <div className="selected-date">
                                                    {selectedRange?.start ? selectedRange.start.toLocaleDateString('en-CA') : "Not Selected"}
                                                </div>
                                            </InputGroup>
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-6 mb-4">
                                        <Form.Group controlId="toDate">
                                            <Form.Label>Check Out</Form.Label>
                                            <InputGroup>
                                                <InputGroup.Text>
                                                    <FaCalendarAlt />
                                                </InputGroup.Text>
                                                <div className="selected-date">
                                                    {selectedRange?.end ? selectedRange.end.toLocaleDateString('en-CA') : "Not Selected"}
                                                </div>
                                            </InputGroup>
                                        </Form.Group>
                                    </div>
                                    {isavailable && (
                                        <>
                                            <div className="col-md-6 mb-4">
                                                <Form.Group controlId="startTime">
                                                    <Form.Label>Start Time</Form.Label>
                                                    <Form.Control
                                                        as="select"
                                                        value={startTime ?? ''}
                                                        onChange={handleStartTimeChange}
                                                    >
                                                        {timeSlots.length > 0 ? (
                                                            timeSlots.map((slot, index) => (
                                                                <option key={index} value={slot.start}>
                                                                    {slot.start}
                                                                </option>
                                                            ))
                                                        ) : (
                                                            <option disabled>No available time slots</option>
                                                        )}
                                                    </Form.Control>
                                                </Form.Group>
                                            </div>

                                            <div className="col-md-6 mb-4">
                                                <Form.Group controlId="endTime">
                                                    <Form.Label>End Time</Form.Label>
                                                    <Form.Control
                                                        as="select"
                                                        value={endTime}
                                                        onChange={(e) => setEndTime(e.target.value)}
                                                    >
                                                        {timeSlots.map((slot, index) => (
                                                            <option key={index} value={slot.end}>
                                                                {slot.end}
                                                            </option>
                                                        ))}
                                                    </Form.Control>
                                                </Form.Group>
                                            </div>
                                        </>
                                    )}
                                    <Button
                                        className="theme_btn"
                                        variant="primary"
                                        onClick={handleRedirect}
                                    >
                                        Proceed to Checkout
                                    </Button>
                                </div>
                            </Form>
                        </Col>
                    </Row>
                </Container>
                <ToastContainer />
            </main>
        </>
    );
};

export default CheckAvailability;
