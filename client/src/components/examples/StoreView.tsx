import StoreView from '../StoreView';
import { Product } from '../ProductCard';

// todo: remove mock functionality 
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Smartphone Premium XZ",
    description: "Smartphone de última geração com câmera profissional, tela AMOLED e processador ultra-rápido.",
    price: 899.99,
    images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400"],
    category: "Eletrônicos",
    purchaseLink: "https://wa.me/5511999999999",
    terms: "Garantia de 12 meses contra defeitos de fabricação. Trocas aceitas em até 7 dias.",
    isActive: true
  },
  {
    id: "2", 
    name: "Tênis Esportivo Pro",
    description: "Tênis profissional para corrida e treinos, com tecnologia de amortecimento avançado.",
    price: 299.99,
    images: ["https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400"],
    category: "Esportes",
    purchaseLink: "https://wa.me/5511999999999",
    terms: "Produto com garantia de 6 meses. Trocas por defeito aceitas.",
    isActive: true
  },
  {
    id: "3",
    name: "Camiseta Casual",
    description: "Camiseta 100% algodão, confortável e estilosa para o dia a dia.",
    price: 49.99,
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400"],
    category: "Roupas",
    purchaseLink: "https://wa.me/5511999999999",
    terms: "Trocas por tamanho aceitas em até 15 dias.",
    isActive: true
  },
  {
    id: "4",
    name: "Livro de Programação",
    description: "Guia completo sobre desenvolvimento web moderno com JavaScript e React.",
    price: 79.99,
    images: ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400"],
    category: "Livros",
    purchaseLink: "https://wa.me/5511999999999",
    terms: "Produto digital. Sem trocas após o download.",
    isActive: true
  }
];

const mockCategories = ["Eletrônicos", "Roupas", "Esportes", "Livros", "Casa"];

export default function StoreViewExample() {
  return (
    <StoreView 
      products={mockProducts}
      categories={mockCategories}
      onBuy={(link) => console.log('Buy clicked:', link)}
    />
  );
}