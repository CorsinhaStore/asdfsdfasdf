import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema } from "@shared/schema";
import { z } from "zod";
import rateLimit from "express-rate-limit";
import "./types"; // Import session types

// Rate limiting for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Maximum 5 attempts per window
  message: {
    error: "Too many login attempts, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Login request schema
const loginSchema = z.object({
  username: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication Routes
  
  // POST /api/auth/login
  app.post("/api/auth/login", authLimiter, async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      
      // Validate credentials
      const user = await storage.validateUserCredentials(username, password);
      if (!user) {
        return res.status(401).json({
          error: "Invalid credentials",
        });
      }

      // Create session
      req.session.userId = user.id;
      req.session.username = user.username;

      // Return user info (without password)
      res.json({
        user: {
          id: user.id,
          username: user.username,
        },
        message: "Login successful",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Invalid input",
          details: error.errors,
        });
      }
      
      console.error("Login error:", error);
      res.status(500).json({
        error: "Internal server error",
      });
    }
  });

  // POST /api/auth/logout
  app.post("/api/auth/logout", async (req, res) => {
    try {
      req.session.destroy((err: any) => {
        if (err) {
          console.error("Logout error:", err);
          return res.status(500).json({
            error: "Failed to logout",
          });
        }
        
        res.clearCookie("connect.sid"); // Clear session cookie
        res.json({
          message: "Logout successful",
        });
      });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({
        error: "Internal server error",
      });
    }
  });

  // GET /api/auth/me - Check current user session
  app.get("/api/auth/me", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({
          error: "Not authenticated",
        });
      }

      const user = await storage.getUser(req.session.userId);
      if (!user) {
        // Session exists but user doesn't - clear session
        req.session.destroy(() => {});
        return res.status(401).json({
          error: "User not found",
        });
      }

      res.json({
        user: {
          id: user.id,
          username: user.username,
        },
      });
    } catch (error) {
      console.error("Auth check error:", error);
      res.status(500).json({
        error: "Internal server error",
      });
    }
  });

  // Middleware to check authentication for protected routes
  const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.userId) {
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user) {
      req.session.destroy(() => {});
      return res.status(401).json({
        error: "Invalid session",
      });
    }

    (req as any).user = user;
    next();
  };

  // Categories Routes (protected)
  
  // GET /api/categories
  app.get("/api/categories", requireAuth, async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Get categories error:", error);
      res.status(500).json({
        error: "Internal server error",
      });
    }
  });

  // Products Routes (protected)
  
  // GET /api/products
  app.get("/api/products", requireAuth, async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      console.error("Get products error:", error);
      res.status(500).json({
        error: "Internal server error",
      });
    }
  });

  // Public store route for customers (no auth required)
  // GET /api/store/products
  app.get("/api/store/products", async (req, res) => {
    try {
      const allProducts = await storage.getProducts();
      // Only return active products for the store
      const activeProducts = allProducts.filter(product => product.isActive);
      res.json(activeProducts);
    } catch (error) {
      console.error("Get store products error:", error);
      res.status(500).json({
        error: "Internal server error",
      });
    }
  });

  // GET /api/store/categories (public)
  app.get("/api/store/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Get store categories error:", error);
      res.status(500).json({
        error: "Internal server error",
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
