import { ImageSet } from "../types";

const API_URL = ""

function formatMaskName(name: string): string {
    return name.charAt(0).toUpperCase() + 
    name.slice(1);
}

export async function fetchImageSets(): Promise<ImageSet[]> {
    try {
    const response = await fetch(`${API_URL}/images`);
    
    if (!response.ok) {
        throw new Error(`Error fetching image sets: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.map((img: any) => ({
        id: img.id.toString(),
        originalImage: `${API_URL}/file/${img.patient_nb}/${img.filename}`,
        masks: [] 
    }));
    } catch (error) {
        console.error('Failed to fetch image sets:', error);
        throw error;
    }
}

export async function fetchImageSetDetails(imageId: string): Promise<ImageSet> {
    try {
        const response = await fetch(`${API_URL}/images/${imageId}/set`);
        
        if (!response.ok) {
            throw new Error(`Error fetching image set details: ${response.status}`);
        }
    
    const data = await response.json();
    
    return {
        id: imageId,
        originalImage: data.original_image.startsWith('/') 
            ? `${API_URL}${data.original_image}` 
            : data.original_image,
        masks: data.masks.map((mask: any) => {
            return {
                id: mask.id,
                type: mask.type,
                name: formatMaskName(mask.type),
                imageUrl: mask.image_url.startsWith('/') 
                    ? `${API_URL}${mask.image_url}` 
                    : mask.image_url
            };
        })
    };
    } catch (error) {
        console.error(`Failed to fetch image set ${imageId}:`, error);
        throw error;
    }
}