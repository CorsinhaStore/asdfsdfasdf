import ProductForm from '../ProductForm';
import type { Product } from '../ProductCard';

// todo: remove mock functionality 
const mockCategories = ["Eletrônicos", "Roupas", "Casa", "Esportes", "Livros"];

const mockProduct: Product = {
  id: "1",
  name: "Smartphone Premium",
  description: "Smartphone de última geração",
  price: 899.99,
  images: ["https://example.com/image1.jpg"],
  category: "Eletrônicos",
  purchaseLink: "https://wa.me/5511999999999",
  terms: "Garantia de 12 meses",
  isActive: true
};

export default function ProductFormExample() {
  return (
    <div className="p-4">
      <ProductForm 
        product={mockProduct}
        categories={mockCategories}
        onSave={(product) => console.log('Save product:', product)}
        onCancel={() => console.log('Cancel')}
      />
    </div>
  );
}