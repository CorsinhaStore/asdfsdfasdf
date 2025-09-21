import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import type { Product } from "@/components/ProductCard";

// Interface for categories from API
interface Category {
  id: string;
  name: string;
  createdAt: string;
}

// Interface for products with category relation
interface ProductWithCategory {
  id: string;
  name: string;
  description: string | null;
  price: string;
  images: string[];
  categoryId: string;
  purchaseLink: string | null;
  terms: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  categoryName: string;
}

// Hook to fetch store products (active products for customers)
export function useStoreProducts() {
  return useQuery<ProductWithCategory[]>({
    queryKey: ["/api/store/products"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Hook to fetch store categories
export function useStoreCategories() {
  return useQuery<Category[]>({
    queryKey: ["/api/store/categories"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Transform backend product data to frontend Product interface
export function transformProduct(apiProduct: ProductWithCategory): Product {
  return {
    id: apiProduct.id,
    name: apiProduct.name,
    description: apiProduct.description || "",
    price: parseFloat(apiProduct.price),
    images: apiProduct.images || [],
    category: apiProduct.categoryName,
    purchaseLink: apiProduct.purchaseLink || "",
    terms: apiProduct.terms || "",
    isActive: apiProduct.isActive,
  };
}

// Helper function to extract category names from API data
export function extractCategoryNames(categories: Category[]): string[] {
  return categories.map(cat => cat.name);
}