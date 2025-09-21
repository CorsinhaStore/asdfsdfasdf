import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import ProductCard, { Product } from "./ProductCard";
import ProductForm from "./ProductForm";
import { Plus, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProductManagerProps {
  products: Product[];
  categories: string[];
  onProductsChange?: (products: Product[]) => void;
}

export default function ProductManager({ 
  products = [], 
  categories = [],
  onProductsChange 
}: ProductManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateProduct = (productData: Partial<Product>) => {
    const newProduct: Product = {
      ...productData as Product,
      id: Date.now().toString(),
    };
    
    const updatedProducts = [...products, newProduct];
    onProductsChange?.(updatedProducts);
    setIsCreating(false);
    
    console.log("Created product:", newProduct);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
  };

  const handleUpdateProduct = (productData: Partial<Product>) => {
    if (!editingProduct) return;
    
    const updatedProducts = products.map(p => 
      p.id === editingProduct.id 
        ? { ...editingProduct, ...productData }
        : p
    );
    
    onProductsChange?.(updatedProducts);
    setEditingProduct(null);
    
    console.log("Updated product:", productData);
  };

  const handleDeleteProduct = (id: string) => {
    const updatedProducts = products.filter(p => p.id !== id);
    onProductsChange?.(updatedProducts);
    
    console.log("Deleted product:", id);
  };

  const handleToggleActive = (id: string, isActive: boolean) => {
    const updatedProducts = products.map(p =>
      p.id === id ? { ...p, isActive } : p
    );
    
    onProductsChange?.(updatedProducts);
    
    console.log("Toggled product:", id, isActive);
  };

  // Show form when creating or editing
  if (isCreating) {
    return (
      <ProductForm
        categories={categories}
        onSave={handleCreateProduct}
        onCancel={() => setIsCreating(false)}
      />
    );
  }

  if (editingProduct) {
    return (
      <ProductForm
        product={editingProduct}
        categories={categories}
        onSave={handleUpdateProduct}
        onCancel={() => setEditingProduct(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Gerenciar Produtos</CardTitle>
            <Button 
              onClick={() => setIsCreating(true)}
              data-testid="button-create-product"
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar Produto
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              data-testid="input-search-products-admin"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar produtos por nome ou categoria..."
              className="pl-10"
            />
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <>
              <div className="text-sm text-muted-foreground mb-4">
                {filteredProducts.length} produto(s) encontrado(s)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isAdmin={true}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct}
                    onToggleActive={handleToggleActive}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground mb-2">
                {searchTerm 
                  ? "Nenhum produto encontrado"
                  : "Nenhum produto criado ainda"
                }
              </p>
              {searchTerm ? (
                <Button 
                  variant="outline"
                  onClick={() => setSearchTerm("")}
                  data-testid="button-clear-search"
                >
                  Limpar Busca
                </Button>
              ) : (
                <Button 
                  onClick={() => setIsCreating(true)}
                  data-testid="button-create-first-product"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Produto
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}