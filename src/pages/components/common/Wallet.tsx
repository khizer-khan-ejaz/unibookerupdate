import React, { useEffect, useState } from 'react';
import styles from "../../../styles/Profile.module.css";
import { MdArrowBack, MdArrowForward } from 'react-icons/md';
import api, { API_BASE_URL } from '@/pages/api/api';
import Loader from './Loader';

interface WalletTransaction {
    id: string;
    description: string;
    amount: string | number;
    created_at: string;
    type: string;
    currency: string;
}

const Wallet = () => {
    const [walletBalance, setWalletBalance] = useState<string>("");
    const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState({ wallet: false, transactions: false, recharge: false });
    const [walletError, setWalletError] = useState("");
    const [transactionError, setTransactionError] = useState("");
    const [showRechargeForm, setShowRechargeForm] = useState(false);
    const [rechargeAmount, setRechargeAmount] = useState("");
    const [rechargeError, setRechargeError] = useState("");
    const itemsPerPage = 2;

    const fetchWallet = async () => {
        setLoading((prev) => ({ ...prev, wallet: true }));
        setWalletError("");
        try {
            const response = await api.get('/getUserWallet');
            if (response.status === 200 && response.data) {
                setWalletBalance(response.data.data.wallet_balance);
            } else {
                setWalletError("Failed to fetch wallet balance.");
            }
        } catch (err) {
            setWalletError("An error occurred while fetching wallet balance.");
            console.error(err);
        } finally {
            setLoading((prev) => ({ ...prev, wallet: false }));
        }
    };

    const fetchWalletTransactions = async () => {
        setLoading((prev) => ({ ...prev, transactions: true }));
        setTransactionError("");
        try {
            const response = await api.get(`/getUserWalletTransactions`);
            if (response.status === 200 && response.data) {
                setWalletTransactions(response.data.data.WalletTransactionsDetails || []);
            } else {
                setTransactionError("Failed to fetch transactions.");
            }
        } catch (err) {
            setTransactionError("An error occurred while fetching transactions.");
            console.error(err);
        } finally {
            setLoading((prev) => ({ ...prev, transactions: false }));
        }
    };

    const handleRecharge = async () => {
        setLoading((prev) => ({ ...prev, recharge: true }));
        setRechargeError("");
        const token = JSON.parse(localStorage.getItem("userData") || "{}").token;
        const currency = JSON.parse(localStorage.getItem("generalSettings") || "{}").general_default_currency;
        if (!rechargeAmount || parseFloat(rechargeAmount) <= 0) {
            setRechargeError("Please enter a valid amount.");
            setLoading((prev) => ({ ...prev, recharge: false }));
            return;
        }
        try {
            let baseURL = API_BASE_URL;
            baseURL = baseURL.replace("/api/v1", "");
            baseURL = baseURL.replace(/\/$/, "");
            const paymentUrl = `${baseURL}/wallet_recharge?token=${token}&amount=${rechargeAmount}&currency=${currency}`;
            window.location.href = paymentUrl;
        } catch (err) {
            setRechargeError("An error occurred during recharge.");
            console.error(err);
        } finally {
            setLoading((prev) => ({ ...prev, recharge: false }));
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        fetchWallet();
        if(walletBalance){
            fetchWalletTransactions()
        }
    }, [walletBalance]);

    if (loading.wallet || loading.transactions) {
        return <Loader />
    }

    return (
        <div className={styles.ProfileChildCard}>
            <h3>Wallet</h3>
            <div className={styles.ProfileChildCardForm}>
                <div className='d-flex align-items-center justify-content-between'>
                    {/* <Image src={card} className='img-fluid' alt='Card' /> */}
                    {walletBalance ? (
                        <h3>Wallet Balance: <br /><span className='d-block my-3'>USD {walletBalance}</span></h3>
                    ) : (
                        <p>Loading wallet balance...</p>
                    )}
                    <button className="theme_btn" onClick={() => setShowRechargeForm(!showRechargeForm)}>
                        {showRechargeForm ? "Cancel" : "Add Money"}
                    </button>
                </div>
                {showRechargeForm && (
                    <div className={styles.RechargeForm}>
                        <input
                            type="number"
                            value={rechargeAmount}
                            onChange={(e) => setRechargeAmount(e.target.value)}
                            placeholder="Enter amount"
                            className="form-control my-2"
                        />
                        <button className="theme_btn" onClick={handleRecharge} disabled={loading?.recharge}>
                            {loading?.recharge ? "Recharging..." : "Recharge"}
                        </button>
                        {rechargeError && <p className="text-danger mt-2">{rechargeError}</p>}
                    </div>
                )}
                <h5>History</h5>
                {walletTransactions.map((transaction) => (
                    <div key={transaction?.id} className={styles.ProfileCardRow}>
                        <div className={styles.ProfileCardRowIn}>
                            <div className={styles.ProfileCardInfo}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="22" viewBox="0 0 25 22" fill="none">
                                    <path d="M4.54905 21.1657V19.7579C4.54905 19.218 4.24855 18.8662 3.73347 18.8662C3.47598 18.8662 3.19699 18.96 3.00382 19.2651C2.85367 19.0069 2.6391 18.8662 2.31719 18.8662C2.10251 18.8662 1.88804 18.9365 1.71628 19.1946V18.9131H1.26562V21.1657H1.71628V19.922C1.71628 19.5232 1.90945 19.3354 2.20995 19.3354C2.51025 19.3354 2.6606 19.5466 2.6606 19.922V21.1657H3.11126V19.922C3.11126 19.5232 3.32573 19.3354 3.60473 19.3354C3.90523 19.3354 4.05538 19.5466 4.05538 19.922V21.1657H4.54905ZM11.2229 18.9131H10.4934V18.2326H10.0427V18.9131H9.635V19.3588H10.0426V20.3914C10.0426 20.9077 10.2358 21.2127 10.7509 21.2127C10.944 21.2127 11.1585 21.1423 11.3089 21.0485L11.18 20.626C11.0513 20.7199 10.9011 20.7434 10.7938 20.7434C10.5792 20.7434 10.4934 20.6026 10.4934 20.3679V19.3588H11.2229V18.9131ZM15.0429 18.866C14.7854 18.866 14.6137 19.0069 14.5064 19.1946V18.9131H14.0557V21.1657H14.5064V19.8986C14.5064 19.5232 14.6565 19.312 14.9355 19.312C15.0213 19.312 15.1287 19.3355 15.2145 19.3589L15.3433 18.8897C15.2574 18.8662 15.1287 18.8662 15.0429 18.8662M9.27017 19.1009C9.0555 18.9366 8.7551 18.8663 8.43319 18.8663C7.91821 18.8663 7.57489 19.1478 7.57489 19.5937C7.57489 19.9692 7.83238 20.1803 8.28303 20.2507L8.49761 20.2743C8.73369 20.3211 8.86243 20.3915 8.86243 20.5089C8.86243 20.6731 8.69077 20.7904 8.39027 20.7904C8.08987 20.7904 7.85379 20.6731 7.70354 20.5558L7.48896 20.9312C7.72504 21.1189 8.04695 21.2128 8.36876 21.2128C8.96967 21.2128 9.31309 20.9078 9.31309 20.4854C9.31309 20.0864 9.03409 19.8752 8.60485 19.8049L8.39027 19.7814C8.19711 19.7579 8.04695 19.711 8.04695 19.5703C8.04695 19.406 8.19711 19.3121 8.43319 19.3121C8.69077 19.3121 8.94826 19.4294 9.07701 19.4998L9.27017 19.1009ZM21.2448 18.8663C20.9872 18.8663 20.8155 19.007 20.7082 19.1947V18.9132H20.2575V21.1658H20.7082V19.8987C20.7082 19.5233 20.8585 19.3121 21.1373 19.3121C21.2233 19.3121 21.3306 19.3356 21.4164 19.359L21.5452 18.8898C21.4594 18.8663 21.3306 18.8663 21.2448 18.8663ZM15.4935 20.0395C15.4935 20.72 15.9227 21.2128 16.588 21.2128C16.8884 21.2128 17.103 21.1424 17.3175 20.9547L17.103 20.5558C16.9313 20.6966 16.7596 20.7669 16.5665 20.7669C16.2017 20.7669 15.9442 20.4854 15.9442 20.0395C15.9442 19.6172 16.2017 19.3355 16.5665 19.3121C16.7596 19.3121 16.9313 19.3824 17.103 19.5233L17.3175 19.1244C17.103 18.9366 16.8884 18.8663 16.588 18.8663C15.9227 18.8663 15.4935 19.359 15.4935 20.0395ZM19.6567 20.0395V18.9132H19.2061V19.1947C19.0558 18.9836 18.8413 18.8663 18.5623 18.8663C17.9829 18.8663 17.5322 19.359 17.5322 20.0395C17.5322 20.72 17.9829 21.2128 18.5623 21.2128C18.8627 21.2128 19.0773 21.0955 19.2061 20.8843V21.1658H19.6567V20.0395ZM18.0043 20.0395C18.0043 19.6406 18.2404 19.3121 18.6266 19.3121C18.9914 19.3121 19.249 19.6172 19.249 20.0395C19.249 20.4384 18.9914 20.7669 18.6266 20.7669C18.2404 20.7434 18.0043 20.4384 18.0043 20.0395ZM12.6179 18.8663C12.017 18.8663 11.5878 19.3355 11.5878 20.0395C11.5878 20.7435 12.0169 21.2128 12.6393 21.2128C12.9397 21.2128 13.2402 21.1189 13.4763 20.9078L13.2616 20.5558C13.09 20.6966 12.8754 20.7904 12.6608 20.7904C12.3818 20.7904 12.1028 20.6497 12.0384 20.2506H13.5621V20.063C13.5837 19.3355 13.1974 18.8663 12.6179 18.8663ZM12.6178 19.2886C12.8967 19.2886 13.09 19.4764 13.1328 19.8284H12.0598C12.1027 19.5233 12.2959 19.2886 12.6178 19.2886ZM23.7984 20.0395V18.0215H23.3477V19.1947C23.1975 18.9836 22.9829 18.8663 22.7039 18.8663C22.1245 18.8663 21.6738 19.359 21.6738 20.0395C21.6738 20.72 22.1245 21.2128 22.7039 21.2128C23.0044 21.2128 23.219 21.0955 23.3477 20.8843V21.1658H23.7984V20.0395ZM22.146 20.0395C22.146 19.6406 22.382 19.3121 22.7683 19.3121C23.1331 19.3121 23.3906 19.6172 23.3906 20.0395C23.3906 20.4384 23.1331 20.7669 22.7683 20.7669C22.382 20.7434 22.146 20.4384 22.146 20.0395ZM7.08112 20.0395V18.9132H6.63047V19.1947C6.48022 18.9836 6.26564 18.8663 5.98665 18.8663C5.40725 18.8663 4.95659 19.359 4.95659 20.0395C4.95659 20.72 5.40725 21.2128 5.98665 21.2128C6.28715 21.2128 6.50172 21.0955 6.63047 20.8843V21.1658H7.08112V20.0395ZM5.40725 20.0395C5.40725 19.6406 5.64333 19.3121 6.02956 19.3121C6.39439 19.3121 6.65198 19.6172 6.65198 20.0395C6.65198 20.4384 6.39439 20.7669 6.02956 20.7669C5.64333 20.7434 5.40725 20.4384 5.40725 20.0395Z" fill="black" />
                                    <path d="M9.12109 1.80664H15.8809V15.0882H9.12109V1.80664Z" fill="#FF5F00" />
                                    <path d="M9.54968 8.44764C9.54968 5.74913 10.7085 3.35558 12.4896 1.80681C11.1806 0.68048 9.52827 0 7.72565 0C3.45499 0 0 3.77792 0 8.44764C0 13.1173 3.45499 16.8953 7.72555 16.8953C9.52817 16.8953 11.1805 16.2148 12.4896 15.0884C10.7085 13.5631 9.54968 11.1461 9.54968 8.44764Z" fill="#EB001B" />
                                    <path d="M24.9994 8.44764C24.9994 13.1173 21.5444 16.8953 17.2738 16.8953C15.4712 16.8953 13.8188 16.2148 12.5098 15.0884C14.3124 13.5397 15.4498 11.1461 15.4498 8.44764C15.4498 5.74913 14.2909 3.35558 12.5098 1.80681C13.8187 0.68048 15.4712 0 17.2738 0C21.5444 0 24.9994 3.80143 24.9994 8.44764Z" fill="#F79E1B" />
                                </svg>
                                <p>{transaction?.description}</p>
                            </div>
                            <div className={styles.ProfileCardPrice}><p>{transaction?.currency} {transaction?.amount}</p></div>
                        </div>
                        <div className={`${styles.ProfileCardRowIn} ${styles.ProfileCardRowMoreInfo}`}>
                            <div><p>{transaction?.type} </p></div>
                            <div><p>{transaction?.created_at}</p></div>
                        </div>
                    </div>
                ))}
                 {walletError && <p className="text-sm text-red-600">{walletError}</p>}
                 {transactionError && <p className="text-sm text-red-600">{transactionError}</p>}
                <div className="Pagination">
                    <button
                        className="PageButton"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        <MdArrowBack />
                    </button>
                    <div className="d-flex gap-3">
                        <span className="PageInfo active">
                            {currentPage}
                        </span>
                    </div>
                    <button
                        className="PageButton"
                        disabled={walletTransactions.length < itemsPerPage}
                        onClick={() => handlePageChange(currentPage + 1)}
                    >
                        <MdArrowForward />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Wallet;
