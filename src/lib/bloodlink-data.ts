export const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

export type BloodGroup = (typeof bloodGroups)[number];

export const keralaDistricts = [
  { name: "Thiruvananthapuram", lat: 8.5241, lng: 76.9366 },
  { name: "Kollam", lat: 8.8932, lng: 76.6141 },
  { name: "Pathanamthitta", lat: 9.2648, lng: 76.787 },
  { name: "Alappuzha", lat: 9.4981, lng: 76.3388 },
  { name: "Kottayam", lat: 9.5916, lng: 76.5222 },
  { name: "Idukki", lat: 9.9189, lng: 77.1025 },
  { name: "Ernakulam", lat: 9.9816, lng: 76.2999 },
  { name: "Thrissur", lat: 10.5276, lng: 76.2144 },
  { name: "Palakkad", lat: 10.7867, lng: 76.6548 },
  { name: "Malappuram", lat: 11.051, lng: 76.0711 },
  { name: "Kozhikode", lat: 11.2588, lng: 75.7804 },
  { name: "Wayanad", lat: 11.6854, lng: 76.132 },
  { name: "Kannur", lat: 11.8745, lng: 75.3704 },
  { name: "Kasaragod", lat: 12.4996, lng: 74.9869 },
] as const;

export type District = (typeof keralaDistricts)[number]["name"];

export type Donor = {
  id: string;
  name: string;
  bloodGroup: BloodGroup;
  district: District;
  area: string;
  lat: number;
  lng: number;
  available: boolean;
  verified: boolean;
  distance: number;
  lastDonation: string;
};

export const sampleDonors: Donor[] = [
  {
    id: "d1",
    name: "Anand Krishnan",
    bloodGroup: "O+",
    district: "Ernakulam",
    area: "Kakkanad",
    lat: 10.0159,
    lng: 76.3419,
    available: true,
    verified: true,
    distance: 3.4,
    lastDonation: "2025-11-14",
  },
  {
    id: "d2",
    name: "Meera Nair",
    bloodGroup: "A+",
    district: "Thiruvananthapuram",
    area: "Pattom",
    lat: 8.535,
    lng: 76.944,
    available: true,
    verified: true,
    distance: 5.8,
    lastDonation: "2025-10-02",
  },
  {
    id: "d3",
    name: "Rahul P",
    bloodGroup: "B+",
    district: "Kozhikode",
    area: "Nadakkavu",
    lat: 11.274,
    lng: 75.778,
    available: false,
    verified: true,
    distance: 8.2,
    lastDonation: "2025-08-19",
  },
  {
    id: "d4",
    name: "Fathima Shirin",
    bloodGroup: "AB-",
    district: "Malappuram",
    area: "Perinthalmanna",
    lat: 10.977,
    lng: 76.225,
    available: true,
    verified: false,
    distance: 11.6,
    lastDonation: "2025-09-26",
  },
  {
    id: "d5",
    name: "Joseph Mathew",
    bloodGroup: "O-",
    district: "Kottayam",
    area: "Ettumanoor",
    lat: 9.67,
    lng: 76.56,
    available: true,
    verified: true,
    distance: 13.1,
    lastDonation: "2025-12-01",
  },
  {
    id: "d6",
    name: "Arjun Das",
    bloodGroup: "A-",
    district: "Thrissur",
    area: "Ayyanthole",
    lat: 10.529,
    lng: 76.199,
    available: true,
    verified: true,
    distance: 6.9,
    lastDonation: "2025-07-20",
  },
  {
    id: "d7",
    name: "Devika Menon",
    bloodGroup: "B-",
    district: "Kannur",
    area: "Talap",
    lat: 11.882,
    lng: 75.375,
    available: false,
    verified: false,
    distance: 18.5,
    lastDonation: "2025-06-08",
  },
  {
    id: "d8",
    name: "Suhail K",
    bloodGroup: "AB+",
    district: "Palakkad",
    area: "Kalpathy",
    lat: 10.79,
    lng: 76.65,
    available: true,
    verified: true,
    distance: 9.7,
    lastDonation: "2025-10-28",
  },
];

export const hospitals = [
  {
    id: "h1",
    name: "Government Medical College",
    district: "Thiruvananthapuram",
    lat: 8.5247,
    lng: 76.9284,
  },
  { id: "h2", name: "Aster Medcity", district: "Ernakulam", lat: 10.0427, lng: 76.2772 },
  { id: "h3", name: "Government Medical College", district: "Kozhikode", lat: 11.271, lng: 75.837 },
  {
    id: "h4",
    name: "Jubilee Mission Medical College",
    district: "Thrissur",
    lat: 10.516,
    lng: 76.214,
  },
] as const;

export const bloodBanks = [
  {
    id: "b1",
    name: "Kerala State Blood Transfusion Council",
    district: "Thiruvananthapuram",
    lat: 8.508,
    lng: 76.957,
  },
  { id: "b2", name: "IMA Blood Bank", district: "Ernakulam", lat: 9.989, lng: 76.287 },
  { id: "b3", name: "District Blood Bank", district: "Kozhikode", lat: 11.259, lng: 75.786 },
  { id: "b4", name: "Malabar Blood Bank", district: "Kannur", lat: 11.874, lng: 75.37 },
] as const;
