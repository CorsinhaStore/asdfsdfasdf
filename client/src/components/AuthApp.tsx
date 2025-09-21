import { useState, useEffect } from "react";
import { useIsAuthenticated, useLogout } from "@/hooks/useAuth";
import { useStoreProducts, useStoreCategories, transformProduct, extractCategoryNames } from "@/hooks/useStore";
import LoadingScreen from "./LoadingScreen";
import LoginForm from "./LoginForm";
import AdminLayout from "./AdminLayout";
import StoreView from "./StoreView";
import ProductManager from "./ProductManager";
import CategoryManager from "./CategoryManager";
import CodeEditor from "./CodeEditor";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import type { Product } from "./ProductCard";

// Mock data - todo: remove mock functionality and connect to real API
const initialProducts: Product[] = [
  {
    id: "1",
    name: "Smartphone Premium XZ",
    description: "Smartphone de última geração com câmera profissional, tela AMOLED de 6.7 polegadas e processador ultra-rápido. Ideal para fotografia profissional e jogos.",
    price: 899.99,
    images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400"],
    category: "Eletrônicos",
    purchaseLink: "https://wa.me/5511999999999?text=Olá!%20Tenho%20interesse%20no%20Smartphone%20Premium%20XZ",
    terms: "Este produto possui garantia de 12 meses contra defeitos de fabricação. Trocas aceitas em até 7 dias corridos com produto lacrado. Não cobrimos danos causados por líquidos ou quedas.",
    isActive: true
  },
  {
    id: "2",
    name: "Tênis Esportivo Pro Runner",
    description: "Tênis profissional para corrida e treinos intensos, com tecnologia de amortecimento avançado e design respirável.",
    price: 299.99,
    images: ["https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400"],
    category: "Esportes",
    purchaseLink: "https://wa.me/5511999999999?text=Olá!%20Tenho%20interesse%20no%20Tênis%20Esportivo%20Pro%20Runner",
    terms: "Produto com garantia de 6 meses contra defeitos de fabricação. Trocas por numeração aceitas em até 15 dias.",
    isActive: true
  },
  {
    id: "3",
    name: "Camiseta Casual Premium",
    description: "Camiseta 100% algodão premium, corte moderno e confortável para o dia a dia. Disponível em várias cores.",
    price: 49.99,
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400"],
    category: "Roupas",
    purchaseLink: "https://wa.me/5511999999999?text=Olá!%20Tenho%20interesse%20na%20Camiseta%20Casual%20Premium",
    terms: "Trocas por tamanho aceitas em até 15 dias. Produto deve estar sem uso e com etiquetas.",
    isActive: true
  },
  {
    id: "4",
    name: "Livro: Desenvolvimento Web Moderno",
    description: "Guia completo sobre desenvolvimento web moderno com JavaScript, React, Node.js e muito mais. Para iniciantes e avançados.",
    price: 79.99,
    images: ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400"],
    category: "Livros",
    purchaseLink: "https://wa.me/5511999999999?text=Olá!%20Tenho%20interesse%20no%20Livro%20de%20Desenvolvimento%20Web",
    terms: "Produto digital enviado por email. Sem trocas após o envio. Formato PDF compatível com todos os dispositivos.",
    isActive: true
  }
];

const initialCategories = ["Eletrônicos", "Roupas", "Esportes", "Livros", "Casa", "Beleza"];

const mockCodeFiles = [
  {
    name: "App.tsx",
    path: "/client/src/App.tsx",
    language: "tsx",
    content: `import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}`
  },
  {
    name: "index.css",
    path: "/client/src/index.css",
    language: "css",
    content: `:root {
  --background: 0 0% 98%;
  --foreground: 0 0% 8%;
  --primary: 0 85% 45%;
  --primary-foreground: 0 0% 98%;
}

body {
  font-family: Inter, sans-serif;
  background: hsl(var(--background));
  color: hsl(var(--foreground));
}

.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}`
  },
  {
    name: "tailwind.config.ts",
    path: "/tailwind.config.ts",
    language: "typescript",
    content: `import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "hsl(var(--primary) / <alpha-value>)",
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
} satisfies Config;`
  }
];

type AppState = 'store' | 'login' | 'admin';

export default function AuthApp() {
  const { isAuthenticated, isLoading } = useIsAuthenticated();
  const logoutMutation = useLogout();
  const [appState, setAppState] = useState<AppState>('store');
  const [activeSection, setActiveSection] = useState('products');
  
  // Load real data from API
  const { data: storeProducts = [], isLoading: productsLoading } = useStoreProducts();
  const { data: storeCategories = [], isLoading: categoriesLoading } = useStoreCategories();
  
  // Transform API data to frontend format
  const products = storeProducts.map(transformProduct);
  const categories = extractCategoryNames(storeCategories);
  
  // For admin functions (mock for now, will be connected to real API later)
  const [adminProducts, setAdminProducts] = useState<Product[]>(initialProducts);
  const [adminCategories, setAdminCategories] = useState<string[]>(initialCategories);

  // Show loading while checking authentication or loading store data
  if (isLoading || (appState === 'store' && (productsLoading || categoriesLoading))) {
    return <LoadingScreen />;
  }

  // If authenticated but not in admin state, switch to admin
  if (isAuthenticated && appState !== 'admin') {
    setAppState('admin');
  }

  // If not authenticated but in admin state, switch to store
  if (!isAuthenticated && appState === 'admin') {
    setAppState('store');
  }

  const handleLoginSuccess = () => {
    setAppState('admin');
  };

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      setAppState('store');
      setActiveSection('products');
    } catch (error) {
      // Error already handled in mutation
    }
  };

  const handleShowLogin = () => {
    setAppState('login');
  };

  const handleBackToStore = () => {
    setAppState('store');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'products':
        return (
          <ProductManager
            products={adminProducts}
            categories={adminCategories}
            onProductsChange={setAdminProducts}
          />
        );
      case 'categories':
        return (
          <CategoryManager
            categories={adminCategories}
            onCategoriesChange={setAdminCategories}
          />
        );
      case 'store':
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Visualizar Loja</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Aqui você pode ver como sua loja aparece para os clientes.
                </p>
                <button
                  onClick={handleBackToStore}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
                  data-testid="button-view-store"
                >
                  Ver Loja Completa
                </button>
              </CardContent>
            </Card>
          </div>
        );
      case 'code':
        return (
          <CodeEditor
            files={mockCodeFiles}
            onSaveFile={(file) => console.log('Arquivo salvo:', file.name)}
            onPreview={() => console.log('Visualização do código')}
          />
        );
      case 'settings':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Sistema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Informações da Conta</h3>
                <p className="text-sm text-muted-foreground">
                  Email: corsinhastore@gmail.com
                </p>
                <p className="text-sm text-muted-foreground">
                  Tipo: Administrador
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Estatísticas</h3>
                <p className="text-sm text-muted-foreground">
                  Total de produtos: {products.length}
                </p>
                <p className="text-sm text-muted-foreground">
                  Produtos ativos: {products.filter(p => p.isActive).length}
                </p>
                <p className="text-sm text-muted-foreground">
                  Total de categorias: {categories.length}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return <div>Seção não encontrada</div>;
    }
  };

  // Login Screen
  if (appState === 'login') {
    return (
      <LoginForm 
        onLoginSuccess={handleLoginSuccess} 
        onCancel={handleBackToStore}
      />
    );
  }

  // Admin Panel (only if authenticated)
  if (appState === 'admin' && isAuthenticated) {
    return (
      <AdminLayout
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onLogout={handleLogout}
      >
        {renderContent()}
      </AdminLayout>
    );
  }

  // Customer Store View (Default)
  return (
    <div>
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={handleShowLogin}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium shadow-lg"
          data-testid="button-admin-login"
        >
          Admin Login
        </button>
      </div>
      <StoreView
        products={products.filter(p => p.isActive)}
        categories={categories}
        onBuy={(link) => window.open(link, '_blank')}
      />
    </div>
  );
}