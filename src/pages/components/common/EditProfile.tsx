import React, { useEffect, useState } from 'react';
import styles from "../../../styles/Profile.module.css";
import Image from 'next/image';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import api from '@/pages/api/api';
import { toast } from 'react-toastify';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { BsTrash } from 'react-icons/bs';
import { useRouter } from 'next/router';
interface Profile {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  birthdate: string;
  aboutYourself: string;
  phone_country: string;
  profile_image: {
    url: string;
  };
}
interface PhoneType {
  phone: string;
  phone_country: string;
}


const EditProfile = () => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [otp, setOtp] = useState<string>('');
  const [isEmailBeingEdited, setIsEmailBeingEdited] = useState(false);
  const [isPhoneBeingEdited, setIsPhoneBeingEdited] = useState(false);
  const [previousPhone, setPreviousPhone] = useState<string>('');
  const [isCountrySelected, setIsCountrySelected] = useState(false);
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [isPhoneValid, setIsPhoneValid] = useState(false)
  const [editedPhone, setEditedPhone] = useState<PhoneType | null>(null);
  
  useEffect(() => {
    const storedData = localStorage.getItem("userData");
    if (storedData) {
      setProfile(JSON.parse(storedData));
    }
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const uploadProfileImage = async () => {
    if (!imageFile) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      await api.post('/uploadProfileImage', { profile_image: base64 });
      toast.success('Profile image updated successfully!');
    };
    reader.readAsDataURL(imageFile);
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    if (imageFile) {
      await uploadProfileImage();
    }
    if (profile) {
      const response = await api.post('/editProfile', {
        first_name: profile.first_name,
        last_name: profile.last_name,
        birthdate: profile.birthdate,
        aboutYourself: profile.aboutYourself,
        email: profile.email,
        phone: profile.phone,
      });
      if (response.status === 200) {
        localStorage.setItem("userData", JSON.stringify({
          ...profile,
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: profile.email,
          phone: profile.phone,
          profile_image: profile.profile_image,
        }));
        toast.success("Profile updated successfully!");
      }
    }
  };

  const handlePhoneChange = async (value?: string) => {
    const phoneValue = value || '';
    const parsedPhoneNumber = parsePhoneNumberFromString(phoneValue);
    if (parsedPhoneNumber && isCountrySelected && phoneValue.replace(/\D/g, '').length === 12) {
      setIsPhoneValid(true);
      const phoneNumber = parsedPhoneNumber.nationalNumber;
      const dialCode = parsedPhoneNumber.countryCallingCode ? `+${parsedPhoneNumber.countryCallingCode}` : '';
      const countryCode = parsedPhoneNumber.country || '';
      const phoneChanged = phoneNumber !== previousPhone;
      const countryChanged = dialCode !== previousPhone.slice(0, dialCode.length);
      if (phoneChanged || countryChanged) {
        setPreviousPhone(phoneNumber);
        const payload = {
          phone: phoneNumber,
          phone_country: dialCode,
          default_country: countryCode,
        }
        setEditedPhone(payload)
        const response = await api.post('/checkMobileNumber', payload);
        if (response.data.data.otp) {
          setIsPhoneBeingEdited(true)
          toast.success('OTP sent to your phone.');
        }
      }
    } else {
      setIsPhoneValid(false);
      console.error('Invalid phone number or country not selected');
    }
  };

  const handlePhoneVerification = async () => {
    const response = await api.post('/changeMobileNumber', { phone: editedPhone?.phone, phone_country: editedPhone?.phone_country, otp_value: otp });
    if (response.data.data.token) {
      toast.success('Phone number updated successfully!');
      setIsPhoneBeingEdited(false)
      if (profile) {
        localStorage.setItem("userData", JSON.stringify({
          ...profile,
          phone: editedPhone?.phone,
          phone_country: editedPhone?.phone_country
        }));
      }
    } else {
      toast.error('Failed to verify phone number.');
    }
  };

  const handleEmailChange = async () => {
    setIsEmailBeingEdited(true);
    const response = await api.post('/checkEmail', { email: profile?.email });
    if (response.data.data.otp) {
      toast.success('OTP sent to your email.');
    } else {
      toast.error('Email already in use.');
    }
  };

  const handleEmailVerification = async () => {
    const response = await api.post('/changeEmail', { email: profile?.email, otp_value: otp });
    if (response.data.data.token) {
      toast.success('Email updated successfully!');
      setIsEmailBeingEdited(false)
      if (profile) {
        localStorage.setItem("userData", JSON.stringify({
          ...profile,
          email: profile?.email
        }));
      }
    } else {
      toast.error('Failed to verify email.');
    }
  };

  const handleDeleteAccount = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (confirmation) {
      const response = await api.post('/deleteAccount');
      if (response.data.status === 200) {
        toast.success('Account Deleted successfully!');
        router.push("/auth/login");
      }
      else {
        toast.success(response.data.message);
      }
    }
  }

  if (!profile) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.ProfileChildCard}>
      <div className="d-flex align-items-center">
        <h3>{isEditing ? 'Edit Profile' : 'Personal Profile'}</h3>
        {!isEditing && (
          <button onClick={handleEditClick} className={styles.themeEditProfile}>
            Edit
          </button>
        )}
      </div>
      {isEditing ? (
        <form className={styles.ProfileChildCardForm} onSubmit={handleSaveChanges}>
          <div className="row">
            <div className="col-md-12 mb-4">
              <label htmlFor="profileImage" className="form-label">Profile Image</label>
              <input type="file" id="profileImage" className="form-control" onChange={handleImageChange} />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-4">
              <label htmlFor="firstName" className="form-label">First Name</label>
              <input
                type="text"
                id="firstName"
                className="form-control"
                value={profile.first_name}
                onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
              />
            </div>
            <div className="col-md-6 mb-4">
              <label htmlFor="lastName" className="form-label">Last Name</label>
              <input
                type="text"
                id="lastName"
                className="form-control"
                value={profile.last_name}
                onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-4">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                className="form-control"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                onBlur={handleEmailChange}
              />
            </div>
            <div className="col-md-6 mb-4">
              <label htmlFor="phone" className="form-label">Phone</label>
              <PhoneInput
                countrySelectProps={{ unicodeFlags: true }}
                value={profile?.phone_country + profile?.phone}
                withCountryCallingCode
                international
                onChange={handlePhoneChange}
                onCountryChange={(country) => setIsCountrySelected(!!country)}
              />
            </div>
            <div className="col-md-6 mb-4">
              {isPhoneBeingEdited && (
                <div className="mb-4">
                  <label htmlFor="otp" className="form-label">Enter OTP</label>
                  <input
                    type="text"
                    id="otp"
                    className="form-control"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
              )}
              {isPhoneBeingEdited && (
                <button type="button" onClick={handlePhoneVerification} className="theme_btn">
                  Verify Phone
                </button>
              )}
            </div>
          </div>
          {isEmailBeingEdited && (
            <div className="col-md-6 mb-4">
              <div className="mb-4">
                <label htmlFor="otp" className="form-label">Enter OTP</label>
                <input
                  type="text"
                  id="otp"
                  className="form-control"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
              {isEmailBeingEdited && (
                <button type="button" onClick={handleEmailVerification} className="theme_btn">
                  Verify Email
                </button>
              )}
            </div>
          )}
          <div className="row">
            <div className="col-md-6 mb-4">
              <label htmlFor="birthDate" className="form-label">Birth Date</label>
              <input
                type="date"
                id="birthDate"
                className="form-control"
                value={profile.birthdate}
                onChange={(e) => setProfile({ ...profile, birthdate: e.target.value })}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 mb-4">
              <label htmlFor="aboutYourself" className="form-label">About Yourself</label>
              <textarea
                id="aboutYourself"
                className="form-control"
                rows={8}
                value={profile.aboutYourself}
                onChange={(e) => setProfile({ ...profile, aboutYourself: e.target.value })}
              ></textarea>
            </div>
          </div>
          <button type="submit" className="theme_btn">Save Changes</button>
        </form>
      ) : (
        <div className={`${styles.ProfileChildCardForm} ${styles.ProfileViewCard} d-flex justify-content-between gap-5`}>
          <div className={styles.ProfileImgSection}>
            <Image src={profile?.profile_image?.url || ""} width={50} height={50} alt="Profile" className={styles.profileImageDisplay} />
            <h4>{`${profile.first_name} ${profile.last_name}`}</h4>
            <p>{profile.aboutYourself}</p>

            <button
              className="theme_btn flex items-center gap-2 px-4 py-2 text-white bg-red-600 hover:bg-red-700"
              onClick={handleDeleteAccount}
            >
              <BsTrash className="w-5 h-5 me-1" />
              Delete Account
            </button>
          </div>
          <div className={styles.ProfileContentDisplaySection}>
            <div className="d-flex gap-5 mb-3 justify-content-between">
              <p><strong>First Name:</strong> {profile.first_name}</p>
              <p><strong>Last Name:</strong> {profile.last_name}</p>
            </div>
            <div className="d-flex gap-5 mb-3 justify-content-between">
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Phone:</strong> {profile.phone}</p>
            </div>
            {profile.birthdate && (<div className="d-flex gap-5 mb-3 justify-content-between">
              <p><strong>Birth Date:</strong> {profile.birthdate}</p>
            </div>)}
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;