export type MaskType = 
  | "occlusion" 
  | "saliency" 
  | "layer_gradcam" 
  | "integrated_gradients" 
  | "guided_gradcam" 
  | "gradient_shap";

export interface ImageSet {
  id: string;
  originalImage: string;
  masks: MaskImage[];
}

export interface MaskImage {
  id: string;
  type: MaskType;
  imageUrl: string;
  name: string;
}

export interface RankedMask extends MaskImage {
  rank: number;
}