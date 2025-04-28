import React from 'react';
import { Card, CardContent, CardFooter } from './ui/card';
import { MaskImage } from '../types';

interface ImageCardProps {
  mask: MaskImage;
  rank: number | null;
  onClick: () => void;
  showOverlay: boolean;
  overlayOpacity: number;
  originalImage: string;
  hideLabel?: boolean;
}

export const ImageCard: React.FC<ImageCardProps> = ({ 
  mask, 
  rank,
  onClick,
  showOverlay,
  overlayOpacity,
  originalImage,
  hideLabel = false
}) => {
  return (
    <div 
      className="relative cursor-pointer"
      onClick={onClick}
    >
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {showOverlay ? (
            <div className="relative w-full h-72">
              <img 
                src={originalImage} 
                alt="Original" 
                className="absolute top-0 left-0 w-full h-full object-contain"
              />
              
              <img 
                src={mask.imageUrl} 
                alt={mask.name} 
                className="absolute top-0 left-0 w-full h-full object-contain"
                style={{ 
                  opacity: 1 - overlayOpacity,  
                  mixBlendMode: 'screen'        
                }}
              />
            </div>
          ) : (
            <div className="w-full h-72">
              <img 
                src={mask.imageUrl} 
                alt={mask.name} 
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </CardContent>
        {!hideLabel && (
          <CardFooter className="p-1 flex justify-between items-center">
            <span className="text-sm font-medium">{mask.name}</span>
          </CardFooter>
        )}
      </Card>
      
      {rank !== null && (
        <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg">
          {rank}
        </div>
      )}
    </div>
  );
};