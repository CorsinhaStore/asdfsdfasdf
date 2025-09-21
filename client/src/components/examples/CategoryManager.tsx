import CategoryManager from '../CategoryManager';
import { useState } from 'react';

export default function CategoryManagerExample() {
  // todo: remove mock functionality 
  const [categories, setCategories] = useState([
    "Eletrônicos",
    "Roupas", 
    "Casa",
    "Esportes",
    "Livros"
  ]);

  return (
    <div className="p-4 max-w-2xl">
      <CategoryManager 
        categories={categories}
        onCategoriesChange={setCategories}
      />
    </div>
  );
}