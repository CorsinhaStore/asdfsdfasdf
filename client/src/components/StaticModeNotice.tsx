import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export function StaticModeNotice() {
  if (!import.meta.env.VITE_STATIC_BUILD) {
    return null;
  }

  return (
    <Alert className="mb-4">
      <Info className="h-4 w-4" />
      <AlertTitle>Versão de Demonstração</AlertTitle>
      <AlertDescription>
        Esta é uma versão estática hospedada no GitHub Pages. 
        Para funcionalidades completas (login, banco de dados), 
        acesse a versão completa no Replit.
      </AlertDescription>
    </Alert>
  );
}