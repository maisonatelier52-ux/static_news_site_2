export interface Author {
  id: number;
  name: string;
  slug: string;
  photo: string;
  bio: string;
  twitter?: string;
  medium?: string;
  quora?: string;
  reddit?: string;
}

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  keywords: string[];
  date: string;
  image: string;
  authorId: number;
  published: boolean;
}

export interface Data {
  authors: Author[];
  articles: Article[];
}
