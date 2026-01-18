
import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'compact' | 'invoice';
}

export const Logo: React.FC<LogoProps> = ({ className = "w-auto h-auto", variant = 'full' }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Exact Tooth Icon from Image */}
      <div className={`${variant === 'compact' ? 'w-10 h-10' : 'w-24 h-24'} relative`}>
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <linearGradient id="dhoolLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1155B3" /> {/* Deep Blue */}
              <stop offset="100%" stopColor="#87D44F" /> {/* Bright Green */}
            </linearGradient>
          </defs>
          {/* Recreating the specific tooth shape from the image */}
          <path 
            d="M50,40 C30,20 15,60 20,110 C25,160 60,180 85,180 C95,180 100,165 100,165 C100,165 105,180 115,180 C140,180 175,160 180,110 C185,60 170,20 150,40 C130,60 100,90 100,90 C100,90 70,60 50,40 Z" 
            fill="none" 
            stroke="url(#dhoolLogoGradient)" 
            strokeWidth="14" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          {/* The characteristic "smile" swoosh inside the tooth */}
          <path 
            d="M70,90 Q100,140 130,90" 
            fill="none" 
            stroke="url(#dhoolLogoGradient)" 
            strokeWidth="10" 
            strokeLinecap="round" 
            opacity="0.7"
          />
        </svg>
      </div>

      {variant !== 'compact' && (
        <div className="text-center mt-1">
          {/* Main Brand Name */}
          <h1 className={`${variant === 'invoice' ? 'text-4xl' : 'text-5xl'} font-[900] text-[#1155B3] tracking-tight leading-none mb-1`}>DHOOL</h1>
          
          {/* Subtitle */}
          <p className={`${variant === 'invoice' ? 'text-xs' : 'text-sm'} font-bold text-[#87D44F] uppercase tracking-[0.25em] leading-none`}>
            Dental Clinic
          </p>
          
          {/* Decorative Line */}
          <div className="w-full h-[1px] bg-gray-300 mt-2"></div>
          
          {/* Tagline */}
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 font-medium">
            Your Smile Is Our Mission
          </p>
        </div>
      )}
    </div>
  );
};
