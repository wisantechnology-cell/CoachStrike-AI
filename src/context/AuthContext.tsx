import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, loginWithGoogle, logoutUser, updateUserPlanInCloud, subscribeToUserProfile } from '../lib/firebase';
import { PlanType } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isCloudActive: boolean;
  error: string | null;
  plan: PlanType;
  isPro: boolean;
  isAcademy: boolean;
  isAcademyElite: boolean;
  maxStudentsLimit: number;
  updatePlan: (newPlan: PlanType) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlanState] = useState<PlanType>(() => {
    try {
      const cached = localStorage.getItem('coachstrike_plan');
      if (
        cached === 'pro' ||
        cached === 'academy' ||
        cached === 'academy_basic' ||
        cached === 'academy_elite'
      ) {
        return cached as PlanType;
      }
    } catch {
      // fallback
    }
    return 'free';
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    }, (err) => {
      console.error('Auth state error:', err);
      setError(err.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sync plan with cloud when user is logged in
  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToUserProfile(user.uid, (profile) => {
      if (profile.plan) {
        setPlanState(profile.plan);
        try {
          localStorage.setItem('coachstrike_plan', profile.plan);
        } catch {}
      }
    });
    return () => {
      if (unsub) unsub();
    };
  }, [user]);

  const updatePlan = async (newPlan: PlanType) => {
    setPlanState(newPlan);
    try {
      localStorage.setItem('coachstrike_plan', newPlan);
    } catch {}

    if (user) {
      try {
        await updateUserPlanInCloud(user.uid, newPlan);
      } catch (err) {
        console.error('Failed to sync plan to cloud:', err);
      }
    }
  };

  const login = async () => {
    setError(null);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      console.error('Google Sign-in failed:', err);
      setError(err.message || 'Error al iniciar sesión con Google');
    }
  };

  const logout = async () => {
    setError(null);
    try {
      await logoutUser();
    } catch (err: any) {
      console.error('Logout failed:', err);
      setError(err.message || 'Error al cerrar sesión');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isCloudActive: true,
        error,
        plan,
        isPro: plan === 'pro' || plan === 'academy' || plan === 'academy_basic' || plan === 'academy_elite',
        isAcademy: plan === 'academy' || plan === 'academy_basic' || plan === 'academy_elite',
        isAcademyElite: plan === 'academy_elite',
        maxStudentsLimit: plan === 'academy_elite' ? 200 : (plan === 'academy' || plan === 'academy_basic') ? 30 : 0,
        updatePlan
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
