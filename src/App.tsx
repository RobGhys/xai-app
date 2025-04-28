import { useState, useEffect } from 'react';
import { MaskRanking } from './components/mask-ranking';
import { fetchImageSets, fetchImageSetDetails } from './services/api';
import { ImageSet } from './types';

function App() {
  const [imageSets, setImageSets] = useState<ImageSet[]>([]);
  const [currentImageSet, setCurrentImageSet] = useState<ImageSet | null>(null);
  const [currentImageSetIndex, setCurrentImageSetIndex] = useState(0);
  const [results, setResults] = useState<Record<string, Array<{ maskId: string; rank: number }>>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log("Fetching image sets...");
      const sets = await fetchImageSets();
      console.log("Received image sets:", sets);
      
      if (sets.length === 0) {
        setError("Could not find any image from the API.");
        setIsLoading(false);
        return;
      }
      
      setImageSets(sets);
      
      console.log("Fetching details for first image set...");
      const details = await fetchImageSetDetails(sets[0].id);
      console.log("Received image set details:", details);
      
      setCurrentImageSet(details);
    } catch (err) {
      console.error("Error loading data:", err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (imageSets.length === 0 || currentImageSetIndex >= imageSets.length) return;
    
    const loadCurrentImageSet = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log(`Loading image set at index ${currentImageSetIndex}...`);
        const details = await fetchImageSetDetails(imageSets[currentImageSetIndex].id);
        console.log("Loaded image set details:", details);
        setCurrentImageSet(details);
      } catch (err) {
        console.error("Error loading image set details:", err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCurrentImageSet();
  }, [currentImageSetIndex, imageSets]);

  const handleValidate = (rankedMasks: Array<{ maskId: string; rank: number }>) => {
    if (!currentImageSet) return;
    
    setResults(prev => ({
      ...prev,
      [currentImageSet.id]: rankedMasks
    }));
    
    if (currentImageSetIndex < imageSets.length - 1) {
      setCurrentImageSetIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleRetry = () => {
    loadData();
  };

  if (isLoading && !currentImageSet) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Loading data...</h1>
        <p>Connecting to the API...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-16 px-4">
        <h1 className="text-2xl font-bold mb-4 text-red-600">An error occured</h1>
        <p className="mb-4">{error}</p>
        <button 
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          onClick={handleRetry}
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="container mx-auto py-16 px-4">
        <h1 className="text-3xl font-bold mb-8">Finished!</h1>
        <div className="bg-muted p-6 rounded-md">
          <h2 className="text-xl font-semibold mb-4">Results:</h2>
          <pre className="bg-black text-white p-4 rounded-md overflow-auto">
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  if (!currentImageSet) {
    return (
      <div className="container mx-auto py-16 px-4">
        <h1 className="text-2xl font-bold mb-4 text-red-600">No Image Set is available.</h1>
        <button 
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          onClick={handleRetry}
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      <header className="bg-primary text-primary-foreground py-4 mb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">Saliency Maps Evaluation</h1>
          <p className="text-sm opacity-80">
            Set of Images {currentImageSetIndex + 1} of {imageSets.length}
          </p>
        </div>
      </header>
      
      <MaskRanking 
        imageSet={currentImageSet}
        onValidate={handleValidate}
      />
    </div>
  );
}

export default App;