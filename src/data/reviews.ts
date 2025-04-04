export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    userName: 'Efe B.',
    rating: 5,
    comment: 'Müthiş.',
    date: '2 days ago',
  },
  {
    id: '2',
    userName: 'Burak I.',
    rating: 4,
    comment: 'Harika.',
    date: '1 week ago',
  },
  {
    id: '3',
    userName: 'Bengü K.',
    rating: 5,
    comment: 'Tshirt istedim kot geldi',
    date: '2 weeks ago',
  },
]; 