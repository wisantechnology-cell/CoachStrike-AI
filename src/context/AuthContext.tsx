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
  const [plan, setPlanState] = useState<PlanType>(() => {
    try {
      const stored = localStorage.getItem('coachstrike_plan');
      if (stored === 'pro' || stored === 'academy' || stored === 'academy_basic' || stored === 'academy_elite') {
        return stored as PlanType;
      }
    } catch {}
    return 'free';
  });

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
            // Check if there is an active paid plan in localStorage
            const localPlan = localStorage.getItem('coachstrike_plan');
            if (localPlan === 'pro' || localPlan === 'academy' || localPlan === 'academy_basic' || localPlan === 'academy_elite') {
              const autoMember: CustomUserProfile = {
                uid: 'usr_local_member',
                displayName: 'Miembro VIP Strike AI',
                email: 'member@coachstrike.ai',
                photoURL: null,
                role: 'coach',
                isCustomProfile: true
              };
              setUser(autoMember);
              localStorage.setItem('coachstrike_custom_user', JSON.stringify(autoMember));
            } else {
              setUser(null);
            }
          }
        } catch {
          setUser(null);
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
      return;
    }

    const unsub = subscribeToUserProfile(user.uid, (profile) => {
      if (profile.plan) {
        setPlanState(profile.plan);
        try {
          localStorage.setItem('coachstrike_plan', profile.plan);
          localStorage.setItem(`coachstrike_plan_${user.uid}`, profile.plan);
        } catch {}
      } else {
        // If cloud profile has no plan, check local storage
        try {
          const cached = localStorage.getItem(`coachstrike_plan_${user.uid}`) || localStorage.getItem('coachstrike_plan');
          if (cached === 'pro' || cached === 'academy' || cached === 'academy_basic' || cached === 'academy_elite') {
            setPlanState(cached as PlanType);
          }
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

    let activeUser = user;
    if (!activeUser && newPlan !== 'free') {
      const memberProfile: CustomUserProfile = {
        uid: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        displayName: 'Miembro Strike AI',
        email: 'member@coachstrike.ai',
        photoURL: null,
        role: 'coach',
        isCustomProfile: true
      };
      setUser(memberProfile);
      activeUser = memberProfile;
      try {
        localStorage.setItem('coachstrike_custom_user', JSON.stringify(memberProfile));
      } catch {}
    }

    if (activeUser) {
      try {
        localStorage.setItem(`coachstrike_plan_${activeUser.uid}`, newPlan);
      } catch {}

      try {
        await updateUserPlanInCloud(activeUser.uid, newPlan);
      } catch (err) {
        console.error('Failed to sync plan to cloud:', err);
      }
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

  const effectivePlan: PlanType = plan;
  const isPro = Boolean(effectivePlan === 'pro' || effectivePlan === 'academy' || effectivePlan === 'academy_basic' || effectivePlan === 'academy_elite');
  const isAcademy = Boolean(effectivePlan === 'academy' || effectivePlan === 'academy_basic' || effectivePlan === 'academy_elite');
  const isAcademyElite = Boolean(effectivePlan === 'academy_elite');

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginAsGuestProfile,
        logout,
        isCloudActive: Boolean(auth.currentUser),
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
