export interface Program {
  _id?: string;
  name: string;
  description?: string;
  startDate?: string;
  status?: 'draft' | 'published' | 'archived';
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  _id?: string;
  fullName: string;
  email: string;
  programId?: string;
  role?: 'admin' | 'user';
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
}

type ProgramStatus = 'draft' | 'published' | 'archived';