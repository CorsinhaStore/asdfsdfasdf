import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest, getQueryFn } from "@/lib/queryClient";
import { useToast } from "./use-toast";

interface User {
  id: string;
  username: string;
}

interface LoginRequest {
  username: string;
  password: string;
}

interface AuthResponse {
  user: User;
  message: string;
}

// Check current authentication status
export function useAuth() {
  // Em modo estático (GitHub Pages), retornar mock data
  if (import.meta.env.VITE_STATIC_BUILD) {
    return {
      data: null,
      isLoading: false,
      error: null,
    };
  }
  
  return useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Login mutation
export function useLogin() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (credentials: LoginRequest): Promise<AuthResponse> => {
      // Em modo estático, mostrar aviso
      if (import.meta.env.VITE_STATIC_BUILD) {
        throw new Error("Login não disponível na versão estática. Use a versão completa no Replit.");
      }
      
      const response = await apiRequest("POST", "/api/auth/login", credentials);
      return response.json();
    },
    onSuccess: (data: AuthResponse) => {
      // Update the auth cache with the new user data
      queryClient.setQueryData(["/api/auth/me"], data);
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo, ${data.user.username}`,
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Erro no login",
        description: error.message || "Credenciais inválidas",
      });
    },
  });
}

// Logout mutation
export function useLogout() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (): Promise<{ message: string }> => {
      // Em modo estático, mostrar aviso
      if (import.meta.env.VITE_STATIC_BUILD) {
        throw new Error("Logout não disponível na versão estática.");
      }
      
      const response = await apiRequest("POST", "/api/auth/logout");
      return response.json();
    },
    onSuccess: () => {
      // Clear auth cache
      queryClient.setQueryData(["/api/auth/me"], null);
      // Invalidate all queries to force re-fetch on next login
      queryClient.invalidateQueries();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Erro no logout",
        description: error.message || "Erro interno do servidor",
      });
    },
  });
}

// Helper hook to get current user
export function useCurrentUser() {
  const { data: authData } = useAuth();
  return (authData as any)?.user || null;
}

// Helper hook to check if user is authenticated
export function useIsAuthenticated() {
  const { data: authData, isLoading } = useAuth();
  const userData = authData as any;
  return {
    isAuthenticated: !!userData?.user,
    isLoading,
    user: userData?.user || null,
  };
}