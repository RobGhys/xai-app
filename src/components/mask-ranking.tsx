import React, { useState } from 'react';
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
  };
  
  // Obtenir le rang d'un masque
  const getRank = (maskId: string): number | null => {
    return rankings.has(maskId) ? rankings.get(maskId)! : null;
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Évaluation des cartes de saillance</h2>
        <div className="space-x-2">
          <Button 
            variant="outline" 
            onClick={resetRankings}
            disabled={rankings.size === 0}
          >
            Réinitialiser
          </Button>
          <Button 
            onClick={handleValidate}
            disabled={!allMasksRanked}
          >
            Valider
          </Button>
        </div>
      </div>
      
      {/* Contrôles de superposition */}
      <div className="mb-6 p-4 bg-muted rounded-lg">
        <div className="flex items-center gap-4 mb-2">
          <h3 className="text-lg font-semibold">Superposition avec l'image originale</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowOverlay(!showOverlay)}
          >
            {showOverlay ? "Masquer l'original" : "Montrer l'original"}
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <span>Transparence:</span>
          <div className="w-64">
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
      </div>
      
      <p className="text-lg mb-4">
        Cliquez sur les images pour les classer par ordre de préférence (1 = préférée, {imageSet.masks.length} = moins préférée)
      </p>
      
      {/* Grille de masques 3x2 */}
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
          />
        ))}
      </div>
      
      {rankings.size > 0 && (
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Votre classement actuel:</h3>
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