import React, { useState, useEffect } from "react";
import styles from "../../../styles/Profile.module.css";
import api from "@/pages/api/api";
import { BsArrowBarLeft, BsFillSendFill } from 'react-icons/bs';
interface AdminReply {
    message: string;
    created_at: string;
    is_admin_reply: string;
}
interface Ticket {
    id: number;
    user_id: string;
    thread_id: string;
    thread_status: string;
    title: string;
    description: string;
    module: number;
    created_at: string;
    updated_at: string;
}

const Tickets = () => {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const [activeTab, setActiveTab] = useState("Open");
    const [openTickets, setOpenTickets] = useState<Ticket[]>([]);
    const [closedTickets, setClosedTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [showCreateTicketForm, setShowCreateTicketForm] = useState(false);
    const [ticketTitle, setTicketTitle] = useState("");
    const [ticketDescription, setTicketDescription] = useState("");
    const [ticketCreated, setTicketCreated] = useState(false);
    const [isTicketClosed, setIsTicketClosed] = useState(false);
    const [adminReplies, setAdminReplies] = useState<AdminReply[]>([]);
    const [userMessage, setUserMessage] = useState("");

    const fetchOpenTickets = async () => {
        try {
            const response = await api.get("/getUserThreads", {
                params: { thread_status: "1" },
            });
            if (response.status === 200 && response.data) {
                setOpenTickets(response.data.data.threads || []);
            } else {
                setError("Failed to fetch open tickets.");
            }
        } catch (err) {
            setError("An error occurred while fetching open tickets.");
            console.error(err);
        }
    };

    const fetchClosedTickets = async () => {
        try {
            const response = await api.get("/getUserThreads", {
                params: { thread_status: "0" },
            });
            if (response.status === 200 && response.data) {
                setClosedTickets(response.data.data.threads || []);
            } else {
                setError("Failed to fetch closed tickets.");
            }
        } catch (err) {
            setError("An error occurred while fetching closed tickets.");
            console.error(err);
        }
    };

    const fetchTickets = async () => {
        setLoading(true);
        setError("");
        await Promise.all([fetchOpenTickets(), fetchClosedTickets()]);
        setLoading(false);
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const handleTicketClick = (ticket: Ticket) => {
        setSelectedTicket(ticket);
        setIsTicketClosed(ticket.thread_status === "0");
        fetchAdminReplies(ticket.thread_id);
    };

    const handleCreateTicket = async (e: React.FormEvent<HTMLFormElement>) => {
        setSelectedTicket(null)
        e.preventDefault();
        const ticketData = { title: ticketTitle, description: ticketDescription };
        try {
            const response = await api.post('/createSupportTicket', ticketData);
            if (response.status === 200) {
                setTicketCreated(true);
                setShowCreateTicketForm(false)
                fetchTickets();
            }
        } catch (error) {
            console.error("Error creating ticket", error);
        }
    };

    const handleCloseTicket = async (thread_id: string) => {
        try {
            const response = await api.post('/closeSupportTicket', { thread_id: thread_id });
            if (response.status === 200) {
                setIsTicketClosed(true);
                fetchTickets();
            }
        } catch (error) {
            console.error("Error closing ticket", error);
        }
    };

    const fetchAdminReplies = async (threadId: string) => {
        try {
            const response = await api.get("/getReplyThreads", {
                params: { thread_id: threadId },
            });
            if (response.status === 200 && response.data) {
                const replies = response.data.data.replyThreads || [];
                setAdminReplies(replies);
            } else {
                console.error("Failed to fetch admin replies.");
            }
        } catch (error) {
            console.error("Error fetching admin replies", error);
        }
    };

    const handleReplyToAdmin = async (threadId: string, message: string) => {
        try {
            const response = await api.post("/replyToSupportTicket", {
                thread_id: threadId,
                message: message,
            });
            if (response.status === 200) {
                setUserMessage("");
                setAdminReplies(prevReplies => [
                    ...prevReplies,
                    { message: message, created_at: new Date().toISOString(), is_admin_reply: "0" }
                ]);
                fetchAdminReplies(threadId);
            }
        } catch (error) {
            console.error("Error replying to admin", error);
        }
    };

    const handleBackClick = async () => {
        setSelectedTicket(null)
    }
    
    const tickets = activeTab === "Open" ? openTickets : closedTickets;

    return (
        <div className={styles.ProfileChildCard}>
            <h3>Tickets</h3>
            <div className={styles.ProfileChildCardForm}>
                <div className={styles.Tabs}>
                    <div className={styles.TabsList}>
                        <button
                            className={`${styles.TabButton} ${activeTab === "Open" ? styles.ActiveTab : ""}`}
                            onClick={() => setActiveTab("Open")}
                        >
                            Open
                        </button>
                        <button
                            className={`${styles.TabButton} ${activeTab === "Closed" ? styles.ActiveTab : ""}`}
                            onClick={() => setActiveTab("Closed")}
                        >
                            Closed
                        </button>
                    </div>
                    <div className={styles.CreateTicketButton}>
                        <button className="theme_btn" onClick={() => setShowCreateTicketForm(!showCreateTicketForm)}>
                            {showCreateTicketForm ? "Cancel" : "Create Ticket"}
                        </button>
                    </div>
                </div>
                {selectedTicket ? (
                    <div className={styles.TicketDisplayCard}>
                        <h4>{selectedTicket.title}</h4>
                        <button className="backBtn" onClick={handleBackClick}><BsArrowBarLeft /> Back</button>
                        <hr />
                        <p className={styles.TicketDescription}>{selectedTicket.description}</p>
                        <div className={styles.ChatSection}>
                            {adminReplies.map((reply, index) => (
                                <div key={index} className={reply?.is_admin_reply === "0" ? styles.ChatBubbleLeft : styles.ChatBubbleRight}>
                                    {reply.message} <br />
                                    <span className={styles.ChatTime}>{new Date(reply.created_at).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                        <div className={styles.MessageInputSection}>
                            <input
                                type="text"
                                placeholder="Your message"
                                value={userMessage}
                                className={styles.MessageInput}
                                onChange={(e) => setUserMessage(e.target.value)}
                            />
                            <button className={styles.SendMessageButton}
                                onClick={() => handleReplyToAdmin(selectedTicket.thread_id, userMessage)}
                            >
                                <BsFillSendFill />
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {showCreateTicketForm ? (
                            <div className={styles.ProfileCreateTicketForm}>
                                <h4>Create Ticket</h4>
                                <form onSubmit={handleCreateTicket}>
                                    <div className="row mb-4">
                                        <input
                                            type="text"
                                            id="ticketTitle"
                                            className="form-control"
                                            placeholder="Ticket Title"
                                            value={ticketTitle}
                                            onChange={(e) => setTicketTitle(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="row mb-4">
                                        <textarea
                                            id="ticketDescription"
                                            className="form-control"
                                            placeholder="Tell us about your issue"
                                            value={ticketDescription}
                                            onChange={(e) => setTicketDescription(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="text-center">
                                        <button className="theme_btn" type="submit" disabled={loading}>
                                            {loading ? "Submitting..." : "Send Ticket"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        ) : loading ? (
                            <p>Loading tickets...</p>
                        ) : error ? (
                            <p className={styles.Error}>{error}</p>
                        ) : tickets.length > 0 ? (
                            <div className={styles.ReviewsGrid}>
                                {tickets.map((ticket) => (
                                    <div
                                        key={ticket.id}
                                        className={styles.ReviewCard}
                                        onClick={() => handleTicketClick(ticket)}
                                    >
                                        <div className={styles.ReviewCardHeader}>
                                            <div className={styles.ReviewCardHeaderAvtar}>
                                                <div className={`${styles.ReviewCardInfo} ${styles.TicketInfo}`}>
                                                    <h4>Ticket: {ticket.thread_id}</h4>
                                                    <h6>{ticket.title}</h6>
                                                    <p>{ticket.description}</p>
                                                </div>
                                            </div>
                                            <div className={styles.ReviewsInfo}>
                                                <p className={styles.ReviewDate}>
                                                    <span className={styles.deliveredText}>Created on </span>
                                                    {new Date(ticket.created_at).toLocaleDateString()} <br />
                                                    {new Date(ticket.created_at).toLocaleTimeString()}
                                                </p>
                                                {!isTicketClosed && (
                                                    <button onClick={() => handleCloseTicket(ticket?.thread_id)} className="closeTicketBtn">
                                                        Close Ticket
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No tickets available for {activeTab.toLowerCase()} tab.</p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Tickets;
