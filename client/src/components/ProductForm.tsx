import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { X, Upload, Plus, Image as ImageIcon } from "lucide-react";
import type { Product } from "./ProductCard";

interface ProductFormProps {
  product?: Product;
  categories: string[];
  onSave?: (product: Partial<Product>) => void;
  onCancel?: () => void;
}

export default function ProductForm({ 
  product, 
  categories = [],
  onSave,
  onCancel 
}: ProductFormProps) {
  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [price, setPrice] = useState(product?.price?.toString() || "");
  const [category, setCategory] = useState(product?.category || "");
  const [purchaseLink, setPurchaseLink] = useState(product?.purchaseLink || "");
  const [terms, setTerms] = useState(product?.terms || "");
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl("");
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      // Verificar se é uma imagem
      if (!file.type.startsWith('image/')) {
        toast({
          variant: "destructive",
          title: "Arquivo inválido",
          description: `${file.name} não é uma imagem válida.`,
        });
        return;
      }

      // Verificar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "Arquivo muito grande",
          description: `${file.name} é maior que 5MB. Escolha uma imagem menor.`,
        });
        return;
      }

      // Converter para base64
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          setImages(prev => [...prev, result]);
        }
      };
      reader.readAsDataURL(file);
    });

    // Limpar o input para permitir selecionar o mesmo arquivo novamente
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!name.trim() || !price || !category) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha nome, preço e categoria.",
      });
      setIsLoading(false);
      return;
    }

    const productData: Partial<Product> = {
      ...(product && { id: product.id }),
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
      category,
      purchaseLink: purchaseLink.trim(),
      terms: terms.trim(),
      images,
      isActive: product?.isActive ?? true
    };

    onSave?.(productData);
    toast({
      title: product ? "Produto atualizado!" : "Produto criado!",
      description: `${name} foi ${product ? 'atualizado' : 'criado'} com sucesso.`,
    });
    
    setIsLoading(false);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {product ? "Editar Produto" : "Criar Novo Produto"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Produto *</Label>
              <Input
                id="name"
                data-testid="input-product-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Smartphone Premium"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Preço (R$) *</Label>
              <Input
                id="price"
                data-testid="input-product-price"
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0,00"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger data-testid="select-category">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              data-testid="textarea-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o produto..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="purchaseLink">Link de Compra</Label>
            <Input
              id="purchaseLink"
              data-testid="input-purchase-link"
              value={purchaseLink}
              onChange={(e) => setPurchaseLink(e.target.value)}
              placeholder="https://wa.me/5511999999999 ou outro link"
            />
          </div>

          <div className="space-y-2">
            <Label>Imagens do Produto</Label>
            
            {/* Botão para selecionar arquivos do dispositivo */}
            <div className="flex gap-2 mb-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleFileSelect}
                className="flex-1"
                data-testid="button-select-files"
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Selecionar do Dispositivo
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                multiple
                className="hidden"
                data-testid="file-input"
              />
            </div>

            {/* Campo para URL da imagem */}
            <div className="flex gap-2">
              <Input
                data-testid="input-image-url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Ou cole a URL da imagem"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddImage}
                data-testid="button-add-image"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Preview das imagens */}
            {images.length > 0 && (
              <div className="space-y-3 mt-4">
                <Label className="text-sm text-muted-foreground">
                  Imagens adicionadas ({images.length})
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {images.map((img, index) => (
                    <div 
                      key={index} 
                      className="relative group border rounded-lg overflow-hidden aspect-square"
                    >
                      <img
                        src={img}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Se a imagem falhar ao carregar, mostrar um placeholder
                          const target = e.target as HTMLImageElement;
                          target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjZjFmNWY5Ii8+CjxwYXRoIGQ9Im0xNSAxM2ExIDEgMCAwIDEtMSAxSDEwYTEgMSAwIDAgMS0xLTFWMTBhMSAxIDAgMCAxIDEtMWg0YTEgMSAwIDAgMSAxIDF2M1oiIGZpbGw9IiNkMWQ1ZGIiLz4KPC9zdmc+';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveImage(index)}
                          data-testid={`button-remove-image-${index}`}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/75 text-white text-xs p-1 text-center">
                        Imagem {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="terms">Termos de Uso</Label>
            <Textarea
              id="terms"
              data-testid="textarea-terms"
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              placeholder="Termos específicos para este produto..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              data-testid="button-cancel"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              data-testid="button-save-product"
            >
              {isLoading 
                ? "Salvando..." 
                : product 
                  ? "Atualizar Produto" 
                  : "Criar Produto"
              }
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}