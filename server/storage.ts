import { 
  type User, 
  type InsertUser, 
  type Category, 
  type InsertCategory,
  type Product, 
  type InsertProduct,
  type ProductWithCategory 
} from "@shared/schema";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";

// Storage interface with all CRUD operations needed
export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  validateUserCredentials(username: string, password: string): Promise<User | null>;

  // Categories
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: string): Promise<boolean>;

  // Products
  getProducts(): Promise<ProductWithCategory[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private categories: Map<string, Category>;
  private products: Map<string, Product>;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.products = new Map();

    // Initialize with default admin user and sample data
    this.initializeDefaults();
  }

  private initializeDefaults() {
    // Create admin user with hashed password 
    bcrypt.hash("01042011", 12).then((hashedPassword) => {
      const adminUser: User = {
        id: randomUUID(),
        username: "corsinhastore@gmail.com",
        password: hashedPassword,
      };
      this.users.set(adminUser.id, adminUser);
    });

    // Create categories that match the database
    const categoryData = [
      { name: "Casa e Jardim" },
      { name: "Eletrônicos" },
      { name: "Roupas" }
    ];

    const categoryMap = new Map();
    for (const catData of categoryData) {
      const category: Category = {
        id: randomUUID(),
        name: catData.name,
        createdAt: new Date(),
      };
      this.categories.set(category.id, category);
      categoryMap.set(catData.name, category.id);
    }

    // Create products that match the database
    const productsData = [
      {
        name: "Smartphone Galaxy",
        description: "Celular moderno com câmera de alta qualidade",
        price: "899.99",
        images: ["https://via.placeholder.com/300x300?text=Smartphone"],
        categoryName: "Eletrônicos",
        purchaseLink: "https://wa.me/5511999999999?text=Quero%20comprar%20smartphone",
        isActive: true
      },
      {
        name: "Notebook Dell",
        description: "Laptop para trabalho e estudos",
        price: "1299.99",
        images: ["https://via.placeholder.com/300x300?text=Notebook"],
        categoryName: "Eletrônicos",
        purchaseLink: "https://wa.me/5511999999999?text=Quero%20comprar%20notebook",
        isActive: true
      },
      {
        name: "Camiseta Básica",
        description: "Camiseta 100% algodão, várias cores",
        price: "29.99",
        images: ["https://via.placeholder.com/300x300?text=Camiseta"],
        categoryName: "Roupas",
        purchaseLink: "https://wa.me/5511999999999?text=Quero%20comprar%20camiseta",
        isActive: true
      },
      {
        name: "Calça Jeans",
        description: "Calça jeans azul tradicional",
        price: "89.99",
        images: ["https://via.placeholder.com/300x300?text=Calca"],
        categoryName: "Roupas",
        purchaseLink: "https://wa.me/5511999999999?text=Quero%20comprar%20calca",
        isActive: true
      },
      {
        name: "Vaso Decorativo",
        description: "Vaso de cerâmica para plantas",
        price: "45.99",
        images: ["https://via.placeholder.com/300x300?text=Vaso"],
        categoryName: "Casa e Jardim",
        purchaseLink: "https://wa.me/5511999999999?text=Quero%20comprar%20vaso",
        isActive: true
      },
      {
        name: "Kit Jardinagem",
        description: "Ferramentas básicas para jardinagem",
        price: "79.99",
        images: ["https://via.placeholder.com/300x300?text=Kit"],
        categoryName: "Casa e Jardim",
        purchaseLink: "https://wa.me/5511999999999?text=Quero%20comprar%20kit",
        isActive: true
      }
    ];

    // Create products with proper category references
    for (const prodData of productsData) {
      const categoryId = categoryMap.get(prodData.categoryName);
      if (categoryId) {
        const product: Product = {
          id: randomUUID(),
          name: prodData.name,
          description: prodData.description,
          price: prodData.price,
          images: prodData.images,
          categoryId: categoryId,
          purchaseLink: prodData.purchaseLink,
          terms: null,
          isActive: prodData.isActive,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        this.products.set(product.id, product);
      }
    }
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Check if username already exists
    const existingUser = await this.getUserByUsername(insertUser.username);
    if (existingUser) {
      throw new Error("Username already exists");
    }

    const id = randomUUID();
    const hashedPassword = await bcrypt.hash(insertUser.password, 12);
    const user: User = { 
      ...insertUser, 
      id,
      password: hashedPassword 
    };
    this.users.set(id, user);
    return user;
  }

  async validateUserCredentials(username: string, password: string): Promise<User | null> {
    const user = await this.getUserByUsername(username);
    if (!user) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return null;
    }

    return user;
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values()).sort((a, b) => 
      a.name.localeCompare(b.name)
    );
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const category: Category = {
      ...insertCategory,
      id,
      createdAt: new Date(),
    };
    this.categories.set(id, category);
    return category;
  }

  async updateCategory(id: string, updateData: Partial<InsertCategory>): Promise<Category | undefined> {
    const existing = this.categories.get(id);
    if (!existing) return undefined;

    const updated: Category = { ...existing, ...updateData };
    this.categories.set(id, updated);
    return updated;
  }

  async deleteCategory(id: string): Promise<boolean> {
    // Check if any products use this category
    const productsUsingCategory = Array.from(this.products.values()).filter(
      p => p.categoryId === id
    );
    
    if (productsUsingCategory.length > 0) {
      return false; // Cannot delete category with products
    }

    return this.categories.delete(id);
  }

  // Product methods
  async getProducts(): Promise<ProductWithCategory[]> {
    const productsWithCategories: ProductWithCategory[] = [];
    const productList = Array.from(this.products.values());
    
    for (const product of productList) {
      const category = this.categories.get(product.categoryId);
      if (category) {
        productsWithCategories.push({
          ...product,
          categoryName: category.name,
        });
      }
    }
    
    return productsWithCategories.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const now = new Date();
    const product: Product = {
      id,
      name: insertProduct.name,
      description: insertProduct.description || null,
      price: insertProduct.price,
      images: insertProduct.images || [],
      categoryId: insertProduct.categoryId,
      purchaseLink: insertProduct.purchaseLink || null,
      terms: insertProduct.terms || null,
      isActive: insertProduct.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, updateData: Partial<InsertProduct>): Promise<Product | undefined> {
    const existing = this.products.get(id);
    if (!existing) return undefined;

    const updated: Product = {
      ...existing,
      ...updateData,
      updatedAt: new Date(),
    };
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }
}

export const storage = new MemStorage();
