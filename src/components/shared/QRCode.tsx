
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
}

const QRCode = ({ value, size = 200, className }: QRCodeProps) => {
  const [qrCodeSrc, setQrCodeSrc] = useState<string>('');
  
  useEffect(() => {
    // In a real implementation, we would use a QR code library
    // For now, we'll simulate with a placeholder that would represent dynamic QR generation
    const generateQRCode = async () => {
      // Simulate API call to generate QR code
      // In a real implementation, use a library like qrcode.react or call an API
      setTimeout(() => {
        const encodedValue = encodeURIComponent(value);
        // Using a free QR code service for demonstration
        setQrCodeSrc(`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedValue}`);
      }, 500);
    };
    
    generateQRCode();
  }, [value, size]);
  
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {qrCodeSrc ? (
        <div className="relative overflow-hidden rounded-2xl animate-fade-in">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 blur-xl opacity-30 animate-pulse"></div>
          <img 
            src={qrCodeSrc} 
            alt="QR Code" 
            className="relative rounded-2xl bg-black p-3 transform transition-transform duration-300 hover:scale-105"
            width={size} 
            height={size}
          />
        </div>
      ) : (
        <div className="rounded-2xl bg-secondary/50 p-3 animate-pulse" style={{ width: size, height: size }}></div>
      )}
    </div>
  );
};

export default QRCode;
