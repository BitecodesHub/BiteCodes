export interface University {
  slug: string
  name: string
  location: string
  examsAccepted: string[]
  description: string
  established: number
  ranking: number
  programs: string[]
  website: string
  admissionLink: string
  image: string
}

export const universities: University[] = [
  {
    slug: 'iit-delhi',
    name: 'Indian Institute of Technology Delhi',
    location: 'New Delhi, India',
    examsAccepted: ['JEE Main', 'JEE Advanced'],
    description: 'One of the premier engineering institutes in India, known for its rigorous academic programs and cutting-edge research.',
    established: 1961,
    ranking: 1,
    programs: ['B.Tech', 'M.Tech', 'PhD'],
    website: 'https://iitd.ac.in',
    admissionLink: 'https://iitd.ac.in/admissions',
    image: '/images/iit-delhi.jpg',
  },
  {
    slug: 'aiims-delhi',
    name: 'All India Institute of Medical Sciences Delhi',
    location: 'New Delhi, India',
    examsAccepted: ['NEET'],
    description: 'A leading medical institute offering top-tier education and healthcare services with a focus on medical research.',
    established: 1956,
    ranking: 1,
    programs: ['MBBS', 'MD', 'PhD'],
    website: 'https://aiims.edu',
    admissionLink: 'https://aiims.edu/admissions',
    image: '/images/aiims-delhi.jpg',
  },
  {
    slug: 'du',
    name: 'University of Delhi',
    location: 'New Delhi, India',
    examsAccepted: ['CUET'],
    description: 'A prestigious university offering a wide range of undergraduate and postgraduate programs across various disciplines.',
    established: 1922,
    ranking: 3,
    programs: ['BA', 'BSc', 'BCom', 'MA'],
    website: 'https://du.ac.in',
    admissionLink: 'https://admission.uod.ac.in',
    image: '/images/du.jpg',
  },
  {
    slug: 'bits-pilani',
    name: 'Birla Institute of Technology and Science Pilani',
    location: 'Pilani, Rajasthan, India',
    examsAccepted: ['BITSAT'],
    description: 'A renowned private institute known for its flexible curriculum and strong industry connections.',
    established: 1964,
    ranking: 4,
    programs: ['BE', 'MSc', 'PhD'],
    website: 'https://bits-pilani.ac.in',
    admissionLink: 'https://bitsadmission.com',
    image: '/images/bits-pilani.jpg',
  },
]