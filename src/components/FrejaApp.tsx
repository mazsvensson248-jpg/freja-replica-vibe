import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import logoImage from '@/assets/logo.png';
import leftArrowImage from '@/assets/left.png';
import avatarImage from '@/assets/avatar.png';
import qrCodeImage from '@/assets/qr-code.png';

interface UserData {
  namn: string;
  personnummer: string;
  personnummerEnd: string;
  alder: string;
  imageUrl: string;
}

type PageType = 'onboarding-name' | 'onboarding-photo' | 'profile';

const FrejaApp = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('onboarding-name');
  const [userData, setUserData] = useState<UserData>({
    namn: '',
    personnummer: '950631',
    personnummerEnd: '4628',
    alder: '26',
    imageUrl: avatarImage
  });
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [countdown, setCountdown] = useState(120);
  const [tempName, setTempName] = useState('');

  // Update time every second
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timeInterval);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (currentPage === 'profile' && countdown > 0) {
      const countdownInterval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearInterval(countdownInterval);
    }
  }, [currentPage, countdown]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('sv-SE', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('sv-SE', { 
      day: '2-digit', 
      month: 'short' 
    });
  };

  // Header Component
  const FrejaHeader = ({ showBackButton = true, onBackClick }: { showBackButton?: boolean; onBackClick?: () => void }) => (
    <div className="flex items-center justify-center w-full px-4 py-8 relative">
      {showBackButton && (
        <button onClick={onBackClick} className="absolute left-4">
          <img src={leftArrowImage} alt="Back" className="w-6 h-6" />
        </button>
      )}
      <h1 className="text-4xl font-bold text-white tracking-wider">FREJA</h1>
    </div>
  );

  // Onboarding: Name Input
  const OnboardingNamePage = () => (
    <div className="w-full h-full flex flex-col">
      <FrejaHeader showBackButton={false} />
      
      <div className="flex-1 flex justify-center items-center">
        <div className="flex flex-col items-center w-[90%] space-y-6">
          <h2 className="text-2xl font-bold text-white mb-8">What's your name?</h2>
          
          <Input
            className="freja-input"
            placeholder="Enter your name"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
          />
          
          <Button
            className="freja-btn freja-btn-primary w-full"
            onClick={() => {
              if (tempName.trim()) {
                setUserData(prev => ({ ...prev, namn: tempName.trim() }));
                setCurrentPage('onboarding-photo');
              }
            }}
            disabled={!tempName.trim()}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );

  // Onboarding: Photo Capture
  const OnboardingPhotoPage = () => {
    const openImageInput = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'user';
      input.onchange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setUserData(prev => ({ ...prev, imageUrl: e.target?.result as string }));
            setCurrentPage('profile');
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    };

    return (
      <div className="w-full h-full flex flex-col">
        <FrejaHeader onBackClick={() => setCurrentPage('onboarding-name')} />
        
        <div className="flex-1 flex justify-center items-center">
          <div className="flex flex-col items-center w-[90%] space-y-6">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Take a picture of yourself</h2>
            
            <div className="w-48 h-48 rounded-full bg-white/20 flex items-center justify-center mb-8">
              <img 
                src={userData.imageUrl} 
                alt="Preview" 
                className="w-44 h-44 rounded-full object-cover"
              />
            </div>
            
            <Button
              className="freja-btn freja-btn-primary w-full"
              onClick={openImageInput}
            >
              Take Photo
            </Button>
            
            <Button
              className="freja-btn w-full"
              onClick={() => setCurrentPage('profile')}
            >
              Skip for now
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // Main Profile Page
  const ProfilePage = () => (
    <div className="w-full h-full flex flex-col">
      <FrejaHeader showBackButton={false} />
      
      <div className="flex-1 flex flex-col items-center px-4">
        {/* Profile Photo */}
        <div className="w-48 h-48 rounded-full bg-white mb-6 flex items-center justify-center">
          <img 
            src={userData.imageUrl} 
            alt="Profile" 
            className="w-44 h-44 rounded-full object-cover"
          />
        </div>
        
        {/* User Info */}
        <div className="text-center text-white space-y-2 mb-8">
          <p className="text-lg">Expiry date: <span className="font-bold">2029-07-21</span></p>
          <p className="text-lg">Name: <span className="font-bold">{userData.namn || 'Anna Marielle Sara'}</span></p>
          <p className="text-lg">Age: <span className="font-bold">{userData.alder}</span></p>
        </div>
        
        {/* QR Panel */}
        <div className="w-full max-w-[370px] bg-primary-dark rounded-xl p-4">
          {/* Time/Date/Countdown Header */}
          <div className="flex items-center justify-around mb-4 text-white text-center">
            <div>
              <p className="text-sm opacity-80">Time</p>
              <p className="text-lg font-bold">{formatTime(currentTime)}</p>
            </div>
            <div>
              <p className="text-sm opacity-80">Date</p>
              <p className="text-lg font-bold">{formatDate(currentTime)}</p>
            </div>
            <div>
              <p className="text-sm opacity-80">Valid for</p>
              <p className="text-lg font-bold">
                {countdown} <span className="text-sm font-normal">sec</span>
              </p>
            </div>
          </div>
          
          {/* QR Code Section */}
          <div className="bg-white rounded-lg p-4 mb-4">
            <img 
              src={qrCodeImage} 
              alt="QR Code" 
              className="w-full h-48 object-contain mb-4"
            />
            <div className="text-center text-primary-dark font-semibold">
              <p>
                Personnummer: <span className="font-bold">{userData.personnummer}-{userData.personnummerEnd}</span>
              </p>
            </div>
          </div>
          
          {/* Check ID Text */}
          <div className="text-center text-white text-sm">
            <p>Check ID on: kontroll.frejaeid.com</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Render current page
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'onboarding-name':
        return <OnboardingNamePage />;
      case 'onboarding-photo':
        return <OnboardingPhotoPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <OnboardingNamePage />;
    }
  };

  return (
    <div className="w-full h-screen overflow-hidden">
      {renderCurrentPage()}
    </div>
  );
};

export default FrejaApp;