import TermsModal from '../TermsModal';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function TermsModalExample() {
  const [isOpen, setIsOpen] = useState(false);
  
  // todo: remove mock functionality 
  const mockTerms = `
TERMOS E CONDITIONS DE USO

1. GARANTIA
Este produto possui garantia de 12 meses contra defeitos de fabricação.

2. TROCAS E DEVOLUÇÕES
- Trocas aceitas em até 7 dias após a compra
- Produto deve estar em perfeitas condições
- Embalagem original deve ser mantida

3. RESPONSABILIDADES
- O cliente é responsável pelos cuidados básicos do produto
- Danos por mau uso não são cobertos pela garantia

4. SUPORTE
Entre em contato conosco pelo WhatsApp para qualquer dúvida.
  `.trim();

  return (
    <div className="p-4">
      <Button onClick={() => setIsOpen(true)}>
        Abrir Termos do Produto
      </Button>
      
      <TermsModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        terms={mockTerms}
        productName="Smartphone Premium XZ"
      />
    </div>
  );
}