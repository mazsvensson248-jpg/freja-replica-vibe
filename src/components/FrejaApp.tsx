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

type PageType = 'main' | 'välja' | 'ändra';

const FrejaApp = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('välja');
  const [userData, setUserData] = useState<UserData>({
    namn: '',
    efternamn: '',
    personnummer: '',
    personnummerEnd: '',
    alder: '',
    imageUrl: avatarImage
  });
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [countdown, setCountdown] = useState(120);

  // Update time every second
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timeInterval);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (currentPage === 'main' && countdown > 0) {
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
    <div className="flex items-center justify-between w-full px-4 py-2 relative">
      {showBackButton && (
        <button onClick={onBackClick} className="absolute left-4">
          <img src={leftArrowImage} alt="Back" className="w-6 h-6" />
        </button>
      )}
      <img src={logoImage} alt="Freja" className="h-12 mx-auto" />
    </div>
  );

  // Face/Avatar Component with spinning border
  const FaceContent = ({ imageUrl, showSpinning = false }: { imageUrl: string; showSpinning?: boolean }) => (
    <div className="relative flex items-center justify-center w-[250px] h-[250px] mx-auto">
      {showSpinning && (
        <img 
          src={avatarImage} 
          alt="Spinning border" 
          className="absolute w-[205px] h-[205px] rounded-full object-cover freja-spin z-10"
        />
      )}
      <img 
        src={imageUrl} 
        alt="Profile" 
        className="w-[200px] h-[200px] rounded-full object-cover z-20 relative"
      />
    </div>
  );

  // Personal Text Component
  const PersonalText = () => (
    <div className="text-center mt-4 text-white space-y-1">
      <p>Giltigt t o m: <span className="font-bold">2029-02-03</span></p>
      <p>Efternamn: <span className="font-bold">{userData.efternamn || '-'}</span></p>
      <p>Namn: <span className="font-bold">{userData.namn || '-'}</span></p>
      <p>Ålder: <span className="font-bold">{userData.alder || '-'}</span></p>
    </div>
  );

  // QR Panel Component
  const QrPanel = () => (
    <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-[90%] max-w-[370px]">
      <div className="freja-panel p-0 h-[330px]">
        {/* Time/Date/Countdown Header */}
        <div className="flex items-center justify-around h-[60px] text-white px-2">
          <div className="text-center">
            <p className="text-xs">Tid</p>
            <p className="text-sm font-bold">{formatTime(currentTime)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs">Datum</p>
            <p className="text-sm font-bold">{formatDate(currentTime)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs">Giltig i</p>
            <p className="text-sm font-bold">
              {countdown} <span className="font-normal text-xs">sek</span>
            </p>
          </div>
        </div>
        
        {/* QR Code Section */}
        <div className="bg-white m-2 h-[73%] rounded-[10px] p-2">
          <img 
            src={qrCodeImage} 
            alt="QR Code" 
            className="w-full h-[84%] object-contain"
          />
          <div className="flex justify-center items-center text-muted font-semibold text-sm">
            <p>
              Personnummer: <span className="font-bold">{userData.personnummer || '----'}</span>-
              <span className="font-bold">{userData.personnummerEnd || '----'}</span>
            </p>
          </div>
        </div>
        
        {/* Check ID Text */}
        <div className="text-center text-white text-xs pb-2">
          <p>Kolla ID på: kontroll.frejaeid.com</p>
        </div>
      </div>
    </div>
  );

  // Credits Card Component
  const CreditsCard = () => (
    <div className="freja-card border border-accent p-20 w-[325px] h-[200px] bg-cover bg-center relative">
      <div className="text-white text-center relative z-10">
        <div className="credits-section">
          {/* Credits content would go here */}
        </div>
      </div>
    </div>
  );

  // Footer Navigation
  const FooterNav = () => (
    <footer className="fixed bottom-0 left-0 w-full bg-white h-[12%] flex items-center justify-center">
      <nav className="w-full">
        <ul className="flex justify-around list-none p-0">
          <li className="p-4">
            <a href="#home" className="text-gray-600 flex flex-col items-center text-decoration-none">
              <i className="fas fa-home text-xl"></i>
              <span className="text-xs mt-1">Hem</span>
            </a>
          </li>
          <li className="p-4">
            <a href="#scan-qr" className="text-gray-600 flex flex-col items-center text-decoration-none">
              <i className="fas fa-qrcode text-xl"></i>
              <span className="text-xs mt-1">Skanna</span>
            </a>
          </li>
          <li className="p-4">
            <a href="#explore" className="text-gray-600 flex flex-col items-center text-decoration-none">
              <i className="fas fa-search text-xl"></i>
              <span className="text-xs mt-1">Utforska</span>
            </a>
          </li>
          <li className="p-4">
            <a href="#settings" className="text-gray-600 flex flex-col items-center text-decoration-none">
              <i className="fas fa-cog text-xl"></i>
              <span className="text-xs mt-1">Inställningar</span>
            </a>
          </li>
        </ul>
      </nav>
    </footer>
  );

  // Page: Update ID Form
  const UpdateIdPage = () => {
    const [formData, setFormData] = useState({
      namn: userData.namn,
      efternamn: userData.efternamn,
      personnummer: userData.personnummer,
      personnummerEnd: userData.personnummerEnd,
      alder: userData.alder
    });

    const handleInputChange = (field: string, value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    };

    const saveChanges = () => {
      setUserData(prev => ({
        ...prev,
        ...formData
      }));
      setCurrentPage('välja');
    };

    const openImageInput = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setUserData(prev => ({ ...prev, imageUrl: e.target?.result as string }));
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    };

    return (
      <div className="w-full h-full">
        <FrejaHeader onBackClick={() => setCurrentPage('välja')} />
        
        <div className="flex justify-center items-center h-full mt-[-70px]">
          <div className="flex flex-col items-center w-[90%] space-y-2">
            <Input
              className="freja-input mb-2"
              placeholder="Namn"
              value={formData.namn}
              onChange={(e) => handleInputChange('namn', e.target.value)}
            />
            <Input
              className="freja-input mb-2"
              placeholder="Efternamn"
              value={formData.efternamn}
              onChange={(e) => handleInputChange('efternamn', e.target.value)}
            />
            
            <div className="flex items-center justify-center gap-2 w-full mb-2">
              <Input
                className="freja-input w-[55%] h-[45px]"
                placeholder="Personnummer"
                maxLength={8}
                value={formData.personnummer}
                onChange={(e) => handleInputChange('personnummer', e.target.value)}
              />
              <Input
                className="freja-input w-[35%] h-[45px]"
                placeholder="Ålder"
                maxLength={2}
                value={formData.alder}
                onChange={(e) => handleInputChange('alder', e.target.value)}
              />
              <Input
                className="freja-input w-[55%] h-[45px]"
                placeholder="2244"
                maxLength={4}
                value={formData.personnummerEnd}
                onChange={(e) => handleInputChange('personnummerEnd', e.target.value)}
              />
            </div>

            <div className="text-center my-4">
              <p className="font-bold text-4xl text-white">
                {formData.alder || 'Ingen ålder'}
              </p>
            </div>

            <img 
              src={userData.imageUrl} 
              alt="Preview" 
              className="w-[120px] h-[120px] rounded-full object-cover"
            />

            <div className="flex w-full mt-5 justify-center gap-4">
              <Button
                className="freja-btn freja-btn-primary max-w-[195px]"
                onClick={saveChanges}
              >
                Spara Ändringar
              </Button>
              <Button
                className="freja-btn freja-btn-primary max-w-[195px]"
                onClick={openImageInput}
              >
                Nytt Foto
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Page: Selection/Profile
  const VäljaPage = () => (
    <div className="w-full h-full">
      <FrejaHeader 
        showBackButton={true} 
        onBackClick={() => {/* logout logic */}} 
      />
      
      <div className="flex justify-center items-center h-full mt-[-70px]">
        <div className="flex flex-col items-center w-[90%] space-y-6">
          <button 
            onClick={() => setCurrentPage('main')}
            className="text-center text-decoration-none"
          >
            <FaceContent imageUrl={userData.imageUrl} showSpinning={true} />
            <div className="mt-4">
              <CreditsCard />
            </div>
          </button>
          
          <Button
            className="freja-btn w-[90%]"
            onClick={() => setCurrentPage('ändra')}
          >
            Ändra ID
          </Button>
        </div>
      </div>
    </div>
  );

  // Page: Main ID Card
  const MainIdPage = () => (
    <div className="w-full h-full">
      <FrejaHeader onBackClick={() => setCurrentPage('välja')} />
      
      <div className="flex flex-col items-center pt-8">
        <FaceContent imageUrl={userData.imageUrl} showSpinning={true} />
        <PersonalText />
        <QrPanel />
      </div>
    </div>
  );

  // Render current page
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'ändra':
        return <UpdateIdPage />;
      case 'välja':
        return <VäljaPage />;
      case 'main':
        return <MainIdPage />;
      default:
        return <VäljaPage />;
    }
  };

  return (
    <div className="w-full h-screen overflow-hidden">
      {renderCurrentPage()}
      <FooterNav />
    </div>
  );
};

export default FrejaApp;