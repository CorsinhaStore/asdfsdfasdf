import ProductManager from '../ProductManager';
import { useState } from 'react';
import { Product } from '../ProductCard';

export default function ProductManagerExample() {
  // todo: remove mock functionality 
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "Smartphone Premium XZ",
      description: "Smartphone de última geração com câmera profissional",
      price: 899.99,
      images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400"],
      category: "Eletrônicos",
      purchaseLink: "https://wa.me/5511999999999",
      terms: "Garantia de 12 meses contra defeitos de fabricação.",
      isActive: true
    },
    {
      id: "2",
      name: "Tênis Esportivo Pro",
      description: "Tênis profissional para corrida e treinos",
      price: 299.99,
      images: ["https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400"],
      category: "Esportes", 
      purchaseLink: "https://wa.me/5511999999999",
      terms: "Produto com garantia de 6 meses.",
      isActive: false
    }
  ]);

  const mockCategories = ["Eletrônicos", "Roupas", "Esportes", "Casa", "Livros"];

  return (
    <div className="p-6">
      <ProductManager 
        products={products}
        categories={mockCategories}
        onProductsChange={setProducts}
      />
    </div>
  );
}