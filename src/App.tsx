import { useState } from 'react';
import { dummyImageSets } from './data/dummy-images';
import { MaskRanking } from './components/mask-ranking';

function App() {
  const [currentImageSetIndex, setCurrentImageSetIndex] = useState(0);
  const [results, setResults] = useState<Record<string, Array<{ maskId: string; rank: number }>>>({});
  const [isFinished, setIsFinished] = useState(false);

  const handleValidate = (rankedMasks: Array<{ maskId: string; rank: number }>) => {
    setResults(prev => ({
      ...prev,
      [dummyImageSets[currentImageSetIndex].id]: rankedMasks
    }));
    
    if (currentImageSetIndex < dummyImageSets.length - 1) {
      setCurrentImageSetIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <div className="container mx-auto py-16 px-4">
        <h1 className="text-3xl font-bold mb-8">Merci pour votre participation!</h1>
        <div className="bg-muted p-6 rounded-md">
          <h2 className="text-xl font-semibold mb-4">Résultats:</h2>
          <pre className="bg-black text-white p-4 rounded-md overflow-auto">
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      <header className="bg-primary text-primary-foreground py-4 mb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">Évaluation des cartes de saillance</h1>
          <p className="text-sm opacity-80">
            Set d'images {currentImageSetIndex + 1} sur {dummyImageSets.length}
          </p>
        </div>
      </header>
      
      <MaskRanking 
        imageSet={dummyImageSets[currentImageSetIndex]}
        onValidate={handleValidate}
      />
    </div>
  );
}

export default App;