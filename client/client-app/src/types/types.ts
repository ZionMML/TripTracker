export interface User {
  username: string;
  knownAs: string;
  dateOfBirth: string;
  gender: string;
  city: string;
  country: string;
  role: string;
  key: React.Key;
}

export interface CreateUserDto {
  username: string;
  password: string;
  knownAs: string;
  gender: string;
  dateOfBirth: string; // should be formatted as "YYYY-MM-DD"
  city: string;
  country: string;
}
