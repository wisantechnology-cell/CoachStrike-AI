import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, loginWithGoogle, logoutUser, updateUserPlanInCloud, subscribeToUserProfile } from '../lib/firebase';
import { PlanType } from '../types';

export interface CustomUserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  role?: 'coach' | 'player';
  clubName?: string;
  isCustomProfile?: boolean;
}

interface AuthContextType {
  user: User | CustomUserProfile | null;
  loading: boolean;
  login: () => Promise<void>;
  loginAsGuestProfile: (name: string, email: string, role?: 'coach' | 'player', clubName?: string) => void;
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
  const [user, setUser] = useState<User | CustomUserProfile | null>(() => {
    try {
      const stored = localStorage.getItem('coachstrike_custom_user');
      if (stored) return JSON.parse(stored);
    } catch {}
    return null;
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlanState] = useState<PlanType>('free');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          localStorage.removeItem('coachstrike_custom_user');
        } catch {}
      } else {
        // If not logged in via Firebase Auth, check if there was a custom saved user
        try {
          const stored = localStorage.getItem('coachstrike_custom_user');
          if (stored) {
            setUser(JSON.parse(stored));
          } else {
            setUser(null);
            setPlanState('free');
            localStorage.removeItem('coachstrike_plan');
          }
        } catch {
          setUser(null);
          setPlanState('free');
        }
      }
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
    if (!user) {
      setPlanState('free');
      try {
        localStorage.removeItem('coachstrike_plan');
      } catch {}
      return;
    }

    const unsub = subscribeToUserProfile(user.uid, (profile) => {
      if (profile.plan) {
        setPlanState(profile.plan);
        try {
          localStorage.setItem('coachstrike_plan', profile.plan);
        } catch {}
      } else {
        // If user document has no plan, check local storage for this specific user
        try {
          const cached = localStorage.getItem(`coachstrike_plan_${user.uid}`);
          if (cached === 'pro' || cached === 'academy' || cached === 'academy_basic' || cached === 'academy_elite') {
            setPlanState(cached as PlanType);
          } else {
            setPlanState('free');
          }
        } catch {
          setPlanState('free');
        }
      }
    });
    return () => {
      if (unsub) unsub();
    };
  }, [user]);

  const updatePlan = async (newPlan: PlanType) => {
    if (!user) {
      setPlanState('free');
      return;
    }

    setPlanState(newPlan);
    try {
      localStorage.setItem('coachstrike_plan', newPlan);
      localStorage.setItem(`coachstrike_plan_${user.uid}`, newPlan);
    } catch {}

    try {
      await updateUserPlanInCloud(user.uid, newPlan);
    } catch (err) {
      console.error('Failed to sync plan to cloud:', err);
    }
  };

  const login = async () => {
    setError(null);
    try {
      const u = await loginWithGoogle();
      if (u) {
        setUser(u);
        try {
          localStorage.removeItem('coachstrike_custom_user');
        } catch {}
      }
    } catch (err: any) {
      console.error('Google Sign-in failed:', err);
      setError(err.message || 'Error al iniciar sesión con Google');
      throw err;
    }
  };

  const loginAsGuestProfile = (name: string, email: string, role: 'coach' | 'player' = 'coach', clubName?: string) => {
    const customUser: CustomUserProfile = {
      uid: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      displayName: name,
      email,
      photoURL: null,
      role,
      clubName,
      isCustomProfile: true
    };
    setUser(customUser);
    try {
      localStorage.setItem('coachstrike_custom_user', JSON.stringify(customUser));
    } catch {}
    setError(null);
  };

  const logout = async () => {
    setError(null);
    try {
      await logoutUser();
    } catch (err: any) {
      console.error('Logout failed:', err);
    } finally {
      setUser(null);
      setPlanState('free');
      try {
        localStorage.removeItem('coachstrike_custom_user');
        localStorage.removeItem('coachstrike_plan');
      } catch {}
    }
  };

  // Strictly require authenticated user for paid plans
  const effectivePlan: PlanType = user ? plan : 'free';
  const isPro = Boolean(user && (effectivePlan === 'pro' || effectivePlan === 'academy' || effectivePlan === 'academy_basic' || effectivePlan === 'academy_elite'));
  const isAcademy = Boolean(user && (effectivePlan === 'academy' || effectivePlan === 'academy_basic' || effectivePlan === 'academy_elite'));
  const isAcademyElite = Boolean(user && effectivePlan === 'academy_elite');

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginAsGuestProfile,
        logout,
        isCloudActive: true,
        error,
        plan: effectivePlan,
        isPro,
        isAcademy,
        isAcademyElite,
        maxStudentsLimit: isAcademyElite ? 200 : isAcademy ? 30 : 0,
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
