import { create } from "zustand";

type Photo = {
  id: string;
  src: string;
};

type PhotoStore = {
  photoImages: Photo[];
  isPhotoClicked: boolean;
  setPhotoClicked: (value: boolean) => void;
  addPhoto: (photoSrc: string) => void;
  deletePhoto: (id: string) => void;
};

export const usePhotoStore = create<PhotoStore>((set) => ({
  photoImages: [],
  isPhotoClicked: false,
  setPhotoClicked: (value) =>
    set(() => ({
      isPhotoClicked: value
    })),
  addPhoto: (photoSrc) =>
    set((state) => ({
      photoImages: [
        ...state.photoImages,
        { id: `${Date.now()}`, src: photoSrc }
      ]
    })),
  deletePhoto: (id) =>
    set((state) => ({
      photoImages: state.photoImages.filter((photo) => photo.id !== id)
    }))
}));
