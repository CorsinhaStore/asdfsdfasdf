import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";

interface CategoryManagerProps {
  categories: string[];
  onCategoriesChange?: (categories: string[]) => void;
}

export default function CategoryManager({ 
  categories = [], 
  onCategoriesChange 
}: CategoryManagerProps) {
  const [newCategory, setNewCategory] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const { toast } = useToast();

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      toast({
        variant: "destructive",
        title: "Categoria vazia",
        description: "Por favor, digite um nome para a categoria.",
      });
      return;
    }

    if (categories.includes(newCategory.trim())) {
      toast({
        variant: "destructive",
        title: "Categoria já existe",
        description: "Esta categoria já foi adicionada.",
      });
      return;
    }

    const updatedCategories = [...categories, newCategory.trim()];
    onCategoriesChange?.(updatedCategories);
    setNewCategory("");
    toast({
      title: "Categoria adicionada!",
      description: `"${newCategory.trim()}" foi criada com sucesso.`,
    });
  };

  const handleDeleteCategory = (index: number) => {
    const categoryName = categories[index];
    if (confirm(`Tem certeza que deseja excluir a categoria "${categoryName}"?`)) {
      const updatedCategories = categories.filter((_, i) => i !== index);
      onCategoriesChange?.(updatedCategories);
      toast({
        title: "Categoria excluída",
        description: `"${categoryName}" foi removida.`,
      });
    }
  };

  const handleStartEdit = (index: number) => {
    setEditingId(index);
    setEditingValue(categories[index]);
  };

  const handleSaveEdit = () => {
    if (!editingValue.trim() || editingId === null) return;

    if (categories.includes(editingValue.trim()) && editingValue.trim() !== categories[editingId]) {
      toast({
        variant: "destructive",
        title: "Categoria já existe",
        description: "Esta categoria já foi adicionada.",
      });
      return;
    }

    const updatedCategories = [...categories];
    updatedCategories[editingId] = editingValue.trim();
    onCategoriesChange?.(updatedCategories);
    setEditingId(null);
    setEditingValue("");
    toast({
      title: "Categoria atualizada!",
      description: "A categoria foi renomeada com sucesso.",
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingValue("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciar Categorias</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add new category */}
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="new-category" className="sr-only">
              Nova categoria
            </Label>
            <Input
              id="new-category"
              data-testid="input-new-category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Nome da nova categoria"
              onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
            />
          </div>
          <Button 
            onClick={handleAddCategory}
            data-testid="button-add-category"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </div>

        {/* Categories list */}
        {categories.length > 0 ? (
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Categorias Existentes ({categories.length})
            </Label>
            <div className="grid gap-2">
              {categories.map((category, index) => (
                <div 
                  key={`${category}-${index}`}
                  className="flex items-center justify-between p-3 bg-muted rounded-md hover-elevate"
                  data-testid={`category-item-${index}`}
                >
                  {editingId === index ? (
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        className="flex-1"
                        data-testid={`input-edit-category-${index}`}
                        onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleSaveEdit}
                        data-testid={`button-save-edit-${index}`}
                      >
                        <Check className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleCancelEdit}
                        data-testid={`button-cancel-edit-${index}`}
                      >
                        <X className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Badge 
                        variant="secondary" 
                        className="text-sm"
                        data-testid={`badge-category-${index}`}
                      >
                        {category}
                      </Badge>
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleStartEdit(index)}
                          data-testid={`button-edit-category-${index}`}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDeleteCategory(index)}
                          className="text-destructive hover:text-destructive"
                          data-testid={`button-delete-category-${index}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            <p>Nenhuma categoria criada ainda.</p>
            <p className="text-sm">Adicione uma categoria acima para começar.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}