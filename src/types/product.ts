export interface Product {
  id: string;
  name: string;
  brand: string;
  gender: "Erkek" | "Kadın" | "Unisex";
  price: number;
  volume: string;
  description: string;
  notes: {
    ust: string[];
    orta: string[];
    alt: string[];
  };
  imageUrl: string;
  category: string;
}
