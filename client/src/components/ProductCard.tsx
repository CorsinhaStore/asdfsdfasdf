import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Edit, Trash2, MoreHorizontal, Eye, EyeOff, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  purchaseLink: string;
  terms: string;
  isActive: boolean;
}

interface ProductCardProps {
  product: Product;
  isAdmin?: boolean;
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => void;
  onToggleActive?: (id: string, isActive: boolean) => void;
  onBuy?: (link: string) => void;
  onViewTerms?: (terms: string) => void;
}

export default function ProductCard({ 
  product, 
  isAdmin = false,
  onEdit,
  onDelete,
  onToggleActive,
  onBuy,
  onViewTerms
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const { toast } = useToast();

  const handleEdit = () => {
    onEdit?.(product);
    console.log("Edit product:", product.id);
  };

  const handleDelete = () => {
    if (confirm(`Tem certeza que deseja excluir "${product.name}"?`)) {
      onDelete?.(product.id);
      toast({
        title: "Produto excluído",
        description: `${product.name} foi removido com sucesso.`,
      });
    }
  };

  const handleToggleActive = () => {
    onToggleActive?.(product.id, !product.isActive);
    toast({
      title: product.isActive ? "Produto desativado" : "Produto ativado",
      description: `${product.name} foi ${product.isActive ? 'desativado' : 'ativado'}.`,
    });
  };

  const handleBuy = () => {
    onBuy?.(product.purchaseLink);
    // In a real app, this would open the external link
    console.log("Opening purchase link:", product.purchaseLink);
  };

  const handleViewTerms = () => {
    onViewTerms?.(product.terms);
    console.log("Viewing terms for:", product.name);
  };

  return (
    <Card className={`hover-elevate ${!product.isActive && isAdmin ? 'opacity-60' : ''}`}>
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 
              className="font-semibold text-lg line-clamp-2" 
              data-testid={`text-product-name-${product.id}`}
            >
              {product.name}
            </h3>
            <Badge 
              variant="secondary" 
              className="mt-1"
              data-testid={`badge-category-${product.id}`}
            >
              {product.category}
            </Badge>
          </div>
          {isAdmin && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  data-testid={`button-menu-${product.id}`}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleToggleActive}>
                  {product.isActive ? (
                    <><EyeOff className="h-4 w-4 mr-2" />Desativar</>
                  ) : (
                    <><Eye className="h-4 w-4 mr-2" />Ativar</>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        <div className="aspect-square bg-muted rounded-md mb-4 overflow-hidden">
          {product.images.length > 0 && !imageError ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover hover-elevate"
              onError={() => setImageError(true)}
              data-testid={`img-product-${product.id}`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              Sem imagem
            </div>
          )}
        </div>
        
        <p 
          className="text-sm text-muted-foreground line-clamp-3 mb-3"
          data-testid={`text-description-${product.id}`}
        >
          {product.description}
        </p>
        
        <div 
          className="text-xl font-bold text-primary mb-3"
          data-testid={`text-price-${product.id}`}
        >
          R$ {product.price.toFixed(2)}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        {!isAdmin && (
          <>
            <Button 
              className="flex-1"
              onClick={handleBuy}
              data-testid={`button-buy-${product.id}`}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Comprar
            </Button>
            <Button 
              variant="outline" 
              onClick={handleViewTerms}
              data-testid={`button-terms-${product.id}`}
            >
              Ver Termos
            </Button>
          </>
        )}
        {isAdmin && (
          <div className="text-xs text-muted-foreground">
            Status: {product.isActive ? 'Ativo' : 'Inativo'}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}