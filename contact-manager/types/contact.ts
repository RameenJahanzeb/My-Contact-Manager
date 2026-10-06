export interface Contact {
  id: string;
  name: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactInput {
  name: string;
  phone: string;
}

export interface ApiError {
  error: string;
}
