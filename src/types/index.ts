export type MaskType = 
  | "Occlusion" 
  | "Saliency" 
  | "LayerGradcam" 
  | "IntegratedGradients" 
  | "GuidedGradcam" 
  | "GradientShap";

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