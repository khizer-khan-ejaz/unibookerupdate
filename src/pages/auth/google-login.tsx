import React, { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { Button } from "react-bootstrap";
import { FaGoogle } from "react-icons/fa";
import styles from "@/styles/Auth.module.css";

const GoogleLogin = () => {
  const { data: session } = useSession();

  const handleLogin = async () => {
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  useEffect(() => {
    if (session?.user) {
      const userData = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        accessToken: session.user.accessToken,
      };
      localStorage.setItem("userData", JSON.stringify(userData));
    }
  }, [session]);
  
  return (
    <div className={`${styles.page}`}>
      <div>
        <div className={styles.socialSignIn}>
          <p>Or Sign in with</p>
          <Button
            onClick={handleLogin}
            className={styles.socialButton}
            variant="outline-dark"
          >
            <FaGoogle className={styles.socialIcon} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GoogleLogin;
