import React, { useState, useEffect } from 'react';
import { ImageSet, MaskImage } from '../types';
import { ImageCard } from './image-card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';

interface MaskRankingProps {
  imageSet: ImageSet;
  onValidate: (rankedMasks: Array<{ maskId: string; rank: number }>) => void;
}

export const MaskRanking: React.FC<MaskRankingProps> = ({ 
  imageSet, 
  onValidate 
}) => {
  const [rankings, setRankings] = useState<Map<string, number>>(new Map());
  const [overlayOpacity, setOverlayOpacity] = useState(0.75); 
  const [showOverlay, setShowOverlay] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  useEffect(() => {
    setRankings(new Map());
  }, [imageSet.id]);
  
  useEffect(() => {
    if (rankings.size === imageSet.masks.length && rankings.size > 0) {
      setIsTransitioning(true);
      
      const timer = setTimeout(() => {
        handleValidate();
        setIsTransitioning(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [rankings]);
  
  const nextRank = rankings.size + 1;
  const allMasksRanked = rankings.size === imageSet.masks.length;
  
  const handleMaskClick = (mask: MaskImage) => {
    if (rankings.has(mask.id)) return;
    
    const newRankings = new Map(rankings);
    newRankings.set(mask.id, nextRank);
    setRankings(newRankings);
  };
  
  const resetRankings = () => {
    setRankings(new Map());
  };
  
  const handleValidate = () => {
    if (!allMasksRanked) return;
    
    const result = Array.from(rankings.entries()).map(([maskId, rank]) => ({
      maskId,
      rank
    }));
    
    onValidate(result);
    resetRankings();
  };
  
  const getRank = (maskId: string): number | null => {
    return rankings.has(maskId) ? rankings.get(maskId)! : null;
  };

  if (isTransitioning) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="text-white text-2xl font-bold">
          Showing Next...
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4">
      <div className="mb-4 p-3 bg-muted rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1">
            <span>Transparency:</span>
            <div className="w-48 md:w-64">
              <Slider
                value={[overlayOpacity]}
                min={0}
                max={1}
                step={0.05}
                onValueChange={(values) => setOverlayOpacity(values[0])}
              />
            </div>
            <span>{Math.round(overlayOpacity * 100)}%</span>
          </div>
          
          <div className="flex space-x-2 ml-4">
            <Button 
              variant="outline" 
              onClick={resetRankings}
              disabled={rankings.size === 0}
            >
              Reinit
            </Button>
            <Button 
              onClick={handleValidate}
              disabled={!allMasksRanked}
            >
              Validate
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {imageSet.masks.map((mask) => (
          <ImageCard 
            key={mask.id} 
            mask={mask} 
            rank={getRank(mask.id)}
            onClick={() => handleMaskClick(mask)}
            showOverlay={showOverlay}
            overlayOpacity={overlayOpacity}
            originalImage={imageSet.originalImage}
            hideLabel={true}
          />
        ))}
      </div>
      
      {rankings.size > 0 && (
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Current Ranking:</h3>
          <div className="space-y-1">
            {Array.from(rankings.entries())
              .sort((a, b) => a[1] - b[1])
              .map(([maskId, rank]) => {
                const mask = imageSet.masks.find(m => m.id === maskId);
                return (
                  <div key={maskId} className="flex items-center">
                    <span className="w-6 h-6 rounded-full bg-primary-foreground text-primary flex items-center justify-center mr-2">
                      {rank}
                    </span>
                    <span>{mask?.name}</span>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};