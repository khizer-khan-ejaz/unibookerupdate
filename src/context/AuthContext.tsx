import api from '@/pages/api/api';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from 'react-toastify';

interface AuthContextProps {
  user: { name: string; email: string } | null;
  login: (userData: { name: string; email: string }) => void;
  logout: () => void;
  settings: Settings | null;
  loginWithGoogle: (userData: UserData) => void;
}

interface Settings {
  general_email: string;
  general_phone: string;
  activeModules: string;
  app_become_lend: string;
  app_item_type: string;
  app_make: string;
  app_most_viewed: string;
  app_near_you: string;
  app_popular_region: string;
  feedback_intro: string;
  general_becomehost_image: string;
  general_default_country_code: string;
  general_default_currency: string;
  general_default_language: string;
  general_default_phone_country: string;
  general_description: string;
  general_favicon: string;
  general_host_link: string;
  general_host_title_first: string;
  general_host_title_fourth: string;
  general_host_title_second: string;
  general_host_title_third: string;
  general_logo: string;
  general_maximum_price: string;
  general_minimum_price: string;
  general_title: string;
  head_title: string;
  onlinepayment: string;
  personalization_max_search_price: string;
  personalization_min_search_price: string;
  sliders: string;
  socialnetwork_google_login: string;
  ticket_intro: string;
  timer: string;
}

interface Profile {
  token: string;
  id: string;
  name: string;
  email: string;
}
interface UserData {
  displayName: string;
  email: string;
  id: string;
  profile_image: string;
  login_type: string;
  identityToken: string;
  authorizationCode: string;
  token: string;
  module_id: string;
  time_zone: string;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);

  const login = (userData: { name: string; email: string }) => {
    setUser(userData);
    localStorage.setItem('userData', JSON.stringify(userData));
  };

  useEffect(() => {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      setProfile(JSON.parse(storedData));
      // validateUser();
    }
    fetchGeneralSettings();
  }, []);

  const logout = async () => {
    if (profile) {
      try {
        const payload = {
          token: profile?.token,
          id: profile?.id,
        };
        const response = await api.post("/userLogout", payload);
        if (response.status === 200) {
          setUser(null);
          setProfile(null);
          localStorage.clear();
          toast.success(response?.data?.message);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          toast.error(err.message);
        } else {
          toast.error('An unknown error occurred');
        }
      }
    } else {
      toast.error("No user is currently logged in.");
    }
  };  

  const fetchGeneralSettings = async () => {
    const storedSettings = localStorage.getItem('generalSettings');
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
      return;
    }
    try {
      const response = await api.get('/getgeneralSettings');
      if (response.status === 200) {
        setSettings(response.data);
        localStorage.setItem('generalSettings', JSON.stringify(response.data.data.metaData));
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('An unknown error occurred');
      }
    }
  };

  const loginWithGoogle = async () => {
    try {
      const response = await api.post("/socialLogin");
      const data = await response.data;
      setUser(data);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // const validateUser = async () => {
  //   if (profile && profile.token) {
  //     try {
  //       const response = await api.post('/userValidate', { token: profile.token });
  //       if (response.status === 200) {
  //         toast.success(response?.data?.message);
  //       }
  //     }  catch (err: unknown) {
  //       if (err instanceof Error) {
  //         toast.error(err.message);
  //       } else {
  //         toast.error('An unknown error occurred');
  //       }
  //     }
  //   }
  // };

  return <AuthContext.Provider value={{ user, login, logout, settings, loginWithGoogle }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
