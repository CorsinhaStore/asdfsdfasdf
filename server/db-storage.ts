import { 
  type User, 
  type InsertUser, 
  type Category, 
  type InsertCategory,
  type Product, 
  type InsertProduct,
  type ProductWithCategory,
  users,
  categories,
  products 
} from "@shared/schema";
import { db } from "./db";
import { eq, sql } from "drizzle-orm";
import bcrypt from "bcrypt";
import type { IStorage } from "./storage";

export class PostgreSQLStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Check if username already exists
    const existingUser = await this.getUserByUsername(insertUser.username);
    if (existingUser) {
      throw new Error("Username already exists");
    }

    const hashedPassword = await bcrypt.hash(insertUser.password, 12);
    const result = await db.insert(users).values({
      username: insertUser.username,
      password: hashedPassword,
    }).returning();
    
    return result[0];
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
    const result = await db.select().from(categories).orderBy(categories.name);
    return result;
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const result = await db.insert(categories).values(insertCategory).returning();
    return result[0];
  }

  async updateCategory(id: string, updateData: Partial<InsertCategory>): Promise<Category | undefined> {
    const result = await db.update(categories)
      .set(updateData)
      .where(eq(categories.id, id))
      .returning();
    
    return result[0];
  }

  async deleteCategory(id: string): Promise<boolean> {
    // Check if any products use this category
    const productsUsingCategory = await db.select().from(products)
      .where(eq(products.categoryId, id));
    
    if (productsUsingCategory.length > 0) {
      return false; // Cannot delete category with products
    }

    const result = await db.delete(categories).where(eq(categories.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Product methods
  async getProducts(): Promise<ProductWithCategory[]> {
    const result = await db.select({
      id: products.id,
      name: products.name,
      description: products.description,
      price: products.price,
      images: products.images,
      categoryId: products.categoryId,
      purchaseLink: products.purchaseLink,
      terms: products.terms,
      isActive: products.isActive,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
      categoryName: categories.name,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .orderBy(sql`${products.createdAt} DESC`);
    
    return result.map(row => ({
      ...row,
      categoryName: row.categoryName || 'Sem categoria'
    }));
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const result = await db.select().from(products).where(eq(products.id, id));
    return result[0];
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const result = await db.insert(products).values(insertProduct).returning();
    return result[0];
  }

  async updateProduct(id: string, updateData: Partial<InsertProduct>): Promise<Product | undefined> {
    const result = await db.update(products)
      .set({
        ...updateData,
        updatedAt: sql`NOW()`,
      })
      .where(eq(products.id, id))
      .returning();
    
    return result[0];
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}

export const dbStorage = new PostgreSQLStorage();