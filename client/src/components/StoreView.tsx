import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProductCard, { Product } from "./ProductCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Filter } from "lucide-react";

interface StoreViewProps {
  products: Product[];
  categories: string[];
  onBuy?: (link: string) => void;
}

export default function StoreView({ 
  products = [], 
  categories = [],
  onBuy 
}: StoreViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [selectedTerms, setSelectedTerms] = useState("");
  const [selectedProductName, setSelectedProductName] = useState("");

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchTerm || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    
    return product.isActive && matchesSearch && matchesCategory;
  });

  // Group products by category
  const productsByCategory = filteredProducts.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  const handleCategoryFilter = (category: string | null) => {
    setSelectedCategory(category);
  };

  const handleViewTerms = (terms: string, productName: string) => {
    setSelectedTerms(terms);
    setSelectedProductName(productName);
    setTermsModalOpen(true);
  };

  const handleBuy = (link: string) => {
    onBuy?.(link);
    // In a real app, this would open the external link
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-primary mb-4">
            Corsinha Store
          </h1>
          
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              data-testid="input-search-products"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar produtos..."
              className="pl-10"
            />
          </div>
        </div>
      </header>

      {/* Category Filters */}
      {categories.length > 0 && (
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-2 mb-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filtrar por categoria:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryFilter(null)}
              data-testid="button-filter-all"
            >
              Todas
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryFilter(category)}
                data-testid={`button-filter-${category.toLowerCase()}`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Products by Category */}
      <main className="container mx-auto px-6 py-6">
        {Object.keys(productsByCategory).length > 0 ? (
          <div className="space-y-12">
            {Object.entries(productsByCategory)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([categoryName, categoryProducts]) => (
              <div key={categoryName} className="space-y-6">
                {/* Category Header */}
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-primary mb-2">
                    {categoryName}
                  </h2>
                  <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {categoryProducts.length} produto{categoryProducts.length !== 1 ? 's' : ''}
                  </p>
                </div>
                
                {/* Products Grid for this category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {categoryProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isAdmin={false}
                      onBuy={handleBuy}
                      onViewTerms={(terms) => handleViewTerms(terms, product.name)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-2">
              {searchTerm || selectedCategory 
                ? "Nenhum produto encontrado" 
                : "Nenhum produto disponível"
              }
            </p>
            {(searchTerm || selectedCategory) && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory(null);
                }}
                data-testid="button-clear-filters"
              >
                Limpar Filtros
              </Button>
            )}
          </div>
        )}
      </main>

      {/* Terms Modal */}
      <Dialog open={termsModalOpen} onOpenChange={setTermsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Termos de Uso - {selectedProductName}
            </DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="max-h-[60vh] p-4">
            <div className="prose prose-sm max-w-none">
              {selectedTerms ? (
                <div className="whitespace-pre-wrap text-sm">
                  {selectedTerms}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <p>Nenhum termo específico foi definido para este produto.</p>
                  <p className="text-xs mt-2">
                    Aplicam-se os termos gerais da loja.
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setTermsModalOpen(false)}
              data-testid="button-close-terms"
            >
              Fechar
            </Button>
            <Button 
              onClick={() => setTermsModalOpen(false)}
              data-testid="button-accept-terms"
            >
              Aceito os Termos
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}