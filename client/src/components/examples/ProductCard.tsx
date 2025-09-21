import ProductCard, { Product } from '../ProductCard';

// todo: remove mock functionality 
const mockProduct: Product = {
  id: "1",
  name: "Smartphone Premium XZ",
  description: "Smartphone de última geração com câmera profissional, tela AMOLED e processador ultra-rápido. Ideal para fotografia e games.",
  price: 899.99,
  images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400"],
  category: "Eletrônicos",
  purchaseLink: "https://wa.me/5511999999999",
  terms: "Este produto possui garantia de 12 meses. Aceitamos trocas em até 7 dias.",
  isActive: true
};

export default function ProductCardExample() {
  return (
    <div className="grid grid-cols-2 gap-4 p-4 max-w-2xl">
      <ProductCard 
        product={mockProduct}
        isAdmin={true}
        onEdit={(product) => console.log('Edit:', product.name)}
        onDelete={(id) => console.log('Delete:', id)}
        onToggleActive={(id, isActive) => console.log('Toggle:', id, isActive)}
      />
      <ProductCard 
        product={mockProduct}
        isAdmin={false}
        onBuy={(link) => console.log('Buy:', link)}
        onViewTerms={(terms) => console.log('Terms:', terms)}
      />
    </div>
  );
}