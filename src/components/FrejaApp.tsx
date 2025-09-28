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
  efternamn: string;
  personnummer: string;
  personnummerEnd: string;
  alder: string;
  imageUrl: string;
}

type PageType = 'onboarding-info' | 'onboarding-photo' | 'profile';

const FrejaApp = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('onboarding-info');
  const [userData, setUserData] = useState<UserData>({
    namn: '',
    efternamn: '',
    personnummer: '950631',
    personnummerEnd: '4628',
    alder: '',
    imageUrl: avatarImage
  });
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [countdown, setCountdown] = useState(7200000); // 2000 hours in seconds
  const [tempData, setTempData] = useState({
    namn: '',
    efternamn: '',
    alder: ''
  });

  // Update time every 5 seconds - only when on profile page to reduce re-renders
  useEffect(() => {
    if (currentPage === 'profile') {
      const timeInterval = setInterval(() => {
        setCurrentTime(new Date());
      }, 5000); // Update every 5 seconds instead of every second
      return () => clearInterval(timeInterval);
    }
  }, [currentPage]);

  // Countdown timer
  useEffect(() => {
    if (currentPage === 'profile' && countdown > 0) {
      const countdownInterval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearInterval(countdownInterval);
    }
  }, [currentPage, countdown]);

  // Convert seconds to hours for display
  const formatCountdown = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    return hours;
  };

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

  // Onboarding: Personal Info
  const OnboardingInfoPage = () => (
    <div className="w-full h-full flex flex-col">
      <FrejaHeader showBackButton={false} />
      
      <div className="flex-1 flex justify-center items-center">
        <div className="flex flex-col items-center w-[90%] space-y-6">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Fyll i dina uppgifter</h2>
          
          <Input
            className="freja-input"
            placeholder="Förnamn"
            value={tempData.namn}
            onChange={(e) => setTempData(prev => ({ ...prev, namn: e.target.value }))}
          />
          
          <Input
            className="freja-input"
            placeholder="Efternamn"
            value={tempData.efternamn}
            onChange={(e) => setTempData(prev => ({ ...prev, efternamn: e.target.value }))}
          />
          
          <Input
            className="freja-input"
            placeholder="Ålder"
            type="number"
            value={tempData.alder}
            onChange={(e) => setTempData(prev => ({ ...prev, alder: e.target.value }))}
          />
          
          <Button
            className="freja-btn freja-btn-primary w-full"
            onClick={() => {
              if (tempData.namn.trim() && tempData.efternamn.trim() && tempData.alder.trim()) {
                setUserData(prev => ({ 
                  ...prev, 
                  namn: tempData.namn.trim(),
                  efternamn: tempData.efternamn.trim(),
                  alder: tempData.alder.trim()
                }));
                setCurrentPage('onboarding-photo');
              }
            }}
            disabled={!tempData.namn.trim() || !tempData.efternamn.trim() || !tempData.alder.trim()}
          >
            Fortsätt
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
        <FrejaHeader onBackClick={() => setCurrentPage('onboarding-info')} />
        
        <div className="flex-1 flex justify-center items-center">
          <div className="flex flex-col items-center w-[90%] space-y-6">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Ta ett foto av dig själv</h2>
            
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
              Ta foto
            </Button>
            
            <Button
              className="freja-btn w-full"
              onClick={() => setCurrentPage('profile')}
            >
              Hoppa över
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // Main Profile Page
  const ProfilePage = () => (
    <div className="w-full min-h-screen pb-8">
      <FrejaHeader showBackButton={false} />
      
      <div className="flex flex-col items-center px-4 space-y-6">
        {/* Profile Photo */}
        <div className="w-48 h-48 rounded-full bg-white flex items-center justify-center">
          <img 
            src={userData.imageUrl} 
            alt="Profile" 
            className="w-44 h-44 rounded-full object-cover"
          />
        </div>
        
        {/* User Info */}
        <div className="text-center text-white space-y-2 mb-8">
          <p className="text-lg">Giltigt till: <span className="font-bold">2029-08-15</span></p>
          <p className="text-lg">Efternamn: <span className="font-bold">{userData.efternamn || 'Andersson'}</span></p>
          <p className="text-lg">Namn: <span className="font-bold">{userData.namn || 'Anna Marielle Sara'}</span></p>
          <p className="text-lg">Ålder: <span className="font-bold">{userData.alder || '26'}</span></p>
        </div>
        
        {/* QR Panel */}
        <div className="w-full max-w-[370px] bg-primary-dark rounded-xl p-4">
          {/* Time/Date/Countdown Header */}
          <div className="flex items-center justify-around mb-4 text-white text-center">
            <div>
              <p className="text-sm opacity-80">Tid</p>
              <p className="text-lg font-bold">{formatTime(currentTime)}</p>
            </div>
            <div>
              <p className="text-sm opacity-80">Datum</p>
              <p className="text-lg font-bold">{formatDate(currentTime)}</p>
            </div>
            <div>
              <p className="text-sm opacity-80">Giltigt i</p>
              <p className="text-lg font-bold">
                2 <span className="text-sm font-normal">år</span>
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
            <p>Kolla ID på: kontroll.frejaeid.com</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Render current page
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'onboarding-info':
        return <OnboardingInfoPage />;
      case 'onboarding-photo':
        return <OnboardingPhotoPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <OnboardingInfoPage />;
    }
  };

  return (
    <div className="w-full min-h-screen">
      {renderCurrentPage()}
    </div>
  );
};

export default FrejaApp;