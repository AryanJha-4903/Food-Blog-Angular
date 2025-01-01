// src/app/models/category.model.ts
export interface Category {
strCategory: any;
idCategory: any|string;
  id: string;                     // Unique identifier for the category
  name: string;                   // Name of the category
  image?: string;                 // Optional image URL for the category (if available)
}
