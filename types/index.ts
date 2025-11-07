export interface Program {
  _id?: string;
  name: string;
  description?: string;
  startDate?: string;
  status?: string;
}

export interface User {
  _id?: string;
  fullName: string;
  email: string;
  programId?: string;
}