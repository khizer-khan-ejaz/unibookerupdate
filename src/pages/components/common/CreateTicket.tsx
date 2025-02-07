import React, { useState } from 'react';
import styles from "../../../styles/Profile.module.css";
import Link from 'next/link';
import { BsFillSendFill } from 'react-icons/bs';
import api from '@/pages/api/api';

const CreateTicket = () => {
    const [isTicketCreated, setIsTicketCreated] = useState(true);
    const [ticketTitle, setTicketTitle] = useState("");
    const [ticketDescription, setTicketDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const ticketData = {
            title: ticketTitle,
            description: ticketDescription,
        };

        try {
            const response = await api.post('/createSupportTicket', ticketData);
            if (response.status === 200) {
                setIsTicketCreated(true);
            }
        } catch (error) {
            console.error("Error creating ticket", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.ProfileChildCard}>
            {!isTicketCreated ? (
                <>
                    <h3>Create Ticket</h3>
                    <div className={styles.ProfileChildCardForm}>
                        <div className={styles.ProfileCreateTicket}>
                            <h4>
                                {/* <input type="checkbox" className='checkInput' id="terms" /> */}
                                Create <Link href="/">Ticket</Link>
                            </h4>
                            <p>Welcome! Heres what you need to know about your tickets.</p>
                            <hr />
                            {/* <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                                in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                                sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </p> */}
                        </div>
                        <form className={styles.ProfileCreateTicketForm} onSubmit={handleSubmit}>
                            <div className="row mb-4">
                                <input
                                    type="text"
                                    id="ticketTitle"
                                    className="form-control"
                                    placeholder="Ticket Title"
                                    value={ticketTitle}
                                    onChange={(e) => setTicketTitle(e.target.value)}
                                    required
                                />                            </div>
                            <div className="row mb-4">
                                <textarea
                                    id="ticketDescription"
                                    className="form-control"
                                    placeholder="Tell us about your issue"
                                    value={ticketDescription}
                                    onChange={(e) => setTicketDescription(e.target.value)}
                                    required
                                />                            </div>
                            <div className="text-center">
                                <button type="submit" className={styles.ProfileCreateTicketFormButton} disabled={loading}>
                                    {loading ? "Submitting..." : "Send Ticket"}
                                </button>                            </div>
                        </form>
                    </div>
                </>
            ) : (
                <div className={styles.TicketDisplayCard}>
                    <h4>{ticketTitle}</h4>
                    <hr />
                    <p className={styles.TicketDescription}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                        in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                        sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                    <div className={styles.ChatSection}>
                        <div className={styles.ChatBubbleLeft}>Hey there?</div>
                        <span className={`${styles.ChatTimestamp} text-start`}>11:59 am</span>
                        <div className={styles.ChatBubbleLeft}>Ok come with carefully!<br />Remember the address please!</div>
                        <span className={`${styles.ChatTimestamp} text-start`}>11:59 am</span>
                        <div className={styles.ChatBubbleRight}>On my way sir.<br />Will reach in 10 mins</div>
                        <span className={`${styles.ChatTimestamp} text-end`}>11:59 am</span>
                        <div className={styles.ChatBubbleRight}>Btw, I want to know more about the room space and facilities & can I get some more picture of current.</div>
                        <span className={`${styles.ChatTimestamp} text-end`}>11:59 am</span>
                    </div>
                    <div className={styles.MessageInputSection}>
                        <input type="text" className={styles.MessageInput} placeholder="Write a message..." />
                        <button className={styles.SendMessageButton}><BsFillSendFill /></button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateTicket;
