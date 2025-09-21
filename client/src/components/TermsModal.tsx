import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  terms: string;
  productName: string;
}

export default function TermsModal({ 
  isOpen, 
  onClose, 
  terms, 
  productName 
}: TermsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Termos de Uso - {productName}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] p-4">
          <div className="prose prose-sm max-w-none">
            {terms ? (
              <div className="whitespace-pre-wrap text-sm">
                {terms}
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
            onClick={onClose}
            data-testid="button-close-terms"
          >
            Fechar
          </Button>
          <Button 
            onClick={onClose}
            data-testid="button-accept-terms"
          >
            Aceito os Termos
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}