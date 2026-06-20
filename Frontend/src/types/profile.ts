export interface ProfileDocument {
  id: string;
  storageType: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedAt: string;
}

export interface Profile {
  id: string;
  userId: string;
  fullName: string;
  dob: string;
  email: string;
  mobile: string;
  address: string;
  documents: ProfileDocument[];
  createdAt: string;
  updatedAt: string;
}
