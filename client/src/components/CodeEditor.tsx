import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Save, RotateCcw, Code2, Eye } from "lucide-react";

interface CodeFile {
  name: string;
  path: string;
  content: string;
  language: string;
}

interface CodeEditorProps {
  files?: CodeFile[];
  onSaveFile?: (file: CodeFile) => void;
  onPreview?: () => void;
}

export default function CodeEditor({ 
  files = [],
  onSaveFile,
  onPreview 
}: CodeEditorProps) {
  const [selectedFile, setSelectedFile] = useState<CodeFile | null>(files[0] || null);
  const [content, setContent] = useState(selectedFile?.content || "");
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (filePath: string) => {
    const file = files.find(f => f.path === filePath);
    if (file) {
      setSelectedFile(file);
      setContent(file.content);
      setHasChanges(false);
    }
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setHasChanges(newContent !== selectedFile?.content);
  };

  const handleSave = () => {
    if (!selectedFile) return;
    
    const updatedFile: CodeFile = {
      ...selectedFile,
      content
    };
    
    onSaveFile?.(updatedFile);
    setHasChanges(false);
    
    toast({
      title: "Arquivo salvo!",
      description: `${selectedFile.name} foi atualizado com sucesso.`,
    });
    
    console.log("Saved file:", updatedFile);
  };

  const handleReset = () => {
    if (!selectedFile) return;
    
    if (hasChanges && !confirm("Descartar todas as alterações?")) {
      return;
    }
    
    setContent(selectedFile.content);
    setHasChanges(false);
    
    toast({
      title: "Alterações descartadas",
      description: "O arquivo foi revertido para a versão salva.",
    });
  };

  const handlePreview = () => {
    onPreview?.();
    toast({
      title: "Visualizando alterações",
      description: "Abrindo prévia do site com as alterações.",
    });
    console.log("Preview triggered");
  };

  return (
    <div className="h-full flex flex-col gap-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Code2 className="h-5 w-5" />
              Editor de Código
            </CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePreview}
                data-testid="button-preview"
              >
                <Eye className="h-4 w-4 mr-2" />
                Visualizar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* File Selector */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <Select 
                value={selectedFile?.path || ""} 
                onValueChange={handleFileSelect}
              >
                <SelectTrigger data-testid="select-file">
                  <SelectValue placeholder="Selecione um arquivo para editar" />
                </SelectTrigger>
                <SelectContent>
                  {files.map((file) => (
                    <SelectItem key={file.path} value={file.path}>
                      <div className="flex items-center gap-2">
                        <span>{file.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {file.language}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {hasChanges && (
              <Badge variant="secondary" className="text-orange-600">
                Não salvo
              </Badge>
            )}
          </div>

          {/* Code Editor */}
          {selectedFile ? (
            <div className="space-y-4">
              <div className="border rounded-md">
                <Textarea
                  data-testid="textarea-code"
                  value={content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  placeholder="Cole ou edite o código aqui..."
                  className="font-mono text-sm min-h-[400px] resize-none border-0 focus-visible:ring-0"
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  disabled={!hasChanges}
                  data-testid="button-reset"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Desfazer
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!hasChanges}
                  data-testid="button-save-code"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Arquivo
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-12">
              <Code2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">Nenhum arquivo selecionado</p>
              <p className="text-sm">
                Selecione um arquivo acima para começar a editar o código do site.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}