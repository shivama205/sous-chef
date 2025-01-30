import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Profile, Recipe, Collection, UserRecipeStats } from '../types';
import { ProfileService } from '../services/profile.service';
import { RecipeService } from '../services/recipe.service';
import { CollectionService } from '../services/collection.service';
import { supabase } from '@/lib/supabase';

interface AppState {
  // Auth state
  user: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // User data
  userStats: UserRecipeStats | null;
  
  // Recipe state
  recipes: Recipe[];
  totalRecipes: number;
  selectedRecipe: Recipe | null;
  
  // Collection state
  collections: Collection[];
  totalCollections: number;
  selectedCollection: Collection | null;
  
  // Error state
  error: string | null;

  // Auth actions
  initialize: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;

  // State setters
  setUser: (user: Profile | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setUserStats: (stats: UserRecipeStats | null) => void;
  setRecipes: (recipes: Recipe[]) => void;
  setTotalRecipes: (total: number) => void;
  setSelectedRecipe: (recipe: Recipe | null) => void;
  setCollections: (collections: Collection[]) => void;
  setTotalCollections: (total: number) => void;
  setSelectedCollection: (collection: Collection | null) => void;
  setError: (error: string | null) => void;
  
  // Data fetching
  fetchProfile: () => Promise<void>;
  fetchUserStats: () => Promise<void>;
  fetchRecipes: (params?: { limit?: number }) => Promise<void>;
}

// Initialize services
const profileService = ProfileService.getInstance();
const recipeService = RecipeService.getInstance();
const collectionService = CollectionService.getInstance();

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  userStats: null,
  recipes: [],
  totalRecipes: 0,
  selectedRecipe: null,
  collections: [],
  totalCollections: 0,
  selectedCollection: null,
  error: null,
};

export const useStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Initialize auth state
        initialize: async () => {
          try {
            const { data: { session } } = await supabase.auth.getSession();
            const newUser = session?.user ?? null;
            
            if (newUser) {
              const profile: Profile = {
                id: newUser.id,
                full_name: newUser.user_metadata.full_name ?? null,
                avatar_url: newUser.user_metadata.avatar_url ?? null,
                bio: null,
                email_verified: newUser.confirmed_at !== null,
                email_notifications_enabled: true,
                created_at: newUser.created_at,
                updated_at: newUser.last_sign_in_at ?? newUser.created_at,
              };
              set({ user: profile, isAuthenticated: true });
            } else {
              set({ user: null, isAuthenticated: false });
            }
          } catch (error) {
            console.error('Error initializing auth:', error);
            set({ user: null, isAuthenticated: false });
          } finally {
            set({ isLoading: false });
          }

          // Set up auth state change listener
          supabase.auth.onAuthStateChange((_event, session) => {
            const newUser = session?.user ?? null;
            if (newUser) {
              const profile: Profile = {
                id: newUser.id,
                full_name: newUser.user_metadata.full_name ?? null,
                avatar_url: newUser.user_metadata.avatar_url ?? null,
                bio: null,
                email_verified: newUser.confirmed_at !== null,
                email_notifications_enabled: true,
                created_at: newUser.created_at,
                updated_at: newUser.last_sign_in_at ?? newUser.created_at,
              };
              set({ user: profile, isAuthenticated: true });
            } else {
              set({ user: null, isAuthenticated: false });
            }
          });
        },

        // Auth actions
        signInWithGoogle: async () => {
          const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              queryParams: {
                access_type: 'offline',
                prompt: 'consent',
              }
            }
          });
          if (error) throw error;
        },

        signOut: async () => {
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
          set({ user: null, isAuthenticated: false });
        },

        // State setters
        setUser: (user) => set({ user }),
        setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
        setIsLoading: (isLoading) => set({ isLoading }),
        setUserStats: (userStats) => set({ userStats }),
        setRecipes: (recipes) => set({ recipes }),
        setTotalRecipes: (totalRecipes) => set({ totalRecipes }),
        setSelectedRecipe: (selectedRecipe) => set({ selectedRecipe }),
        setCollections: (collections) => set({ collections }),
        setTotalCollections: (totalCollections) => set({ totalCollections }),
        setSelectedCollection: (selectedCollection) => set({ selectedCollection }),
        setError: (error) => set({ error }),

        // Data fetching
        fetchProfile: async () => {
          try {
            const { user } = get();
            if (!user) return;
            
            // Implement profile fetching logic here
            // This should fetch additional profile data from your backend
          } catch (error) {
            console.error('Error fetching profile:', error);
            set({ error: 'Failed to fetch profile' });
          }
        },

        fetchUserStats: async () => {
          try {
            const { user } = get();
            if (!user) return;
            
            // Implement user stats fetching logic here
            // This should fetch user statistics from your backend
          } catch (error) {
            console.error('Error fetching user stats:', error);
            set({ error: 'Failed to fetch user stats' });
          }
        },

        fetchRecipes: async (params = {}) => {
          try {
            const { user } = get();
            if (!user) return;
            
            // Implement recipe fetching logic here
            // This should fetch recipes from your backend
          } catch (error) {
            console.error('Error fetching recipes:', error);
            set({ error: 'Failed to fetch recipes' });
          }
        },
      }),
      {
        name: 'sous-chef-store',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    )
  )
); 