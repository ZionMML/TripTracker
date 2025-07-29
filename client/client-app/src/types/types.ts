export interface User {
  username: string;
  knownAs: string;
  dateOfBirth: string;
  gender: string;
  city: string;
  country: string;
  role: string;
  firstContactName: string;
  firstContactPhNo: string;
  secondContactName: string;
  secondContactPhNo: string;
  about: string;
  key: React.Key;
  profilePhotoUrl?: string;
  profilePhotoId?: number;
}

export interface ProfilePhoto {
  id: number;
  url: string;
}

export interface CreateUserDto {
  username: string;
  password: string;
  knownAs: string;
  gender: string;
  dateOfBirth: string; // should be formatted as "YYYY-MM-DD"
  city: string;
  country: string;
  firstContactName: string;
  firstContactPhNo: string;
  secondContactName: string;
  secondContactPhNo: string;
  about: string;
}
