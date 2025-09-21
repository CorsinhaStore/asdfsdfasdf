import AdminLayout from '../AdminLayout';
import { useState } from 'react';

export default function AdminLayoutExample() {
  const [activeSection, setActiveSection] = useState('products');
  
  return (
    <AdminLayout 
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      onLogout={() => console.log('Logout triggered')}
    >
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Seção: {activeSection}</h1>
        <p className="text-muted-foreground">
          Conteúdo da seção {activeSection} apareceria aqui.
        </p>
      </div>
    </AdminLayout>
  );
}