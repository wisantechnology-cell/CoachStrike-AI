import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  deleteDoc, 
  collection, 
  onSnapshot, 
  getDocFromServer,
  query,
  orderBy
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { AssessmentResult, PlanType, PaymentRecord, AcademyStudent, ClubBrandConfig, AcademyClass, UserTestimonial } from '../types';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// CRITICAL: Initialize Firestore with the exact databaseId from config
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Error Handling Infrastructure as required by Firebase skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.warn('Firestore Operation Info: ', JSON.stringify(errInfo));
  return errInfo;
}

// Connection test on boot (guarded with timeout race to avoid hanging offline warnings)
async function testConnection() {
  try {
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Connection check timeout')), 3000));
    await Promise.race([
      getDocFromServer(doc(db, 'test', 'connection')),
      timeoutPromise
    ]);
  } catch (error) {
    // Client operates seamlessly in offline cache / localStorage mode
  }
}
testConnection();

// Helper to check if current Firebase Auth user matches the target userId
export function isFirebaseAuthActive(userId?: string): boolean {
  if (!auth.currentUser) return false;
  if (userId && auth.currentUser.uid !== userId) return false;
  return true;
}

// User Profile Syncer in Firestore
export async function syncUserProfile(user: User) {
  try {
    const userRef = doc(db, 'users', user.uid);
    const nowIso = new Date().toISOString();
    await setDoc(userRef, {
      id: user.uid,
      displayName: user.displayName || 'Director Técnico / Jugador',
      email: user.email || '',
      photoURL: user.photoURL || '',
      createdAt: user.metadata?.creationTime ? new Date(user.metadata.creationTime).toISOString() : nowIso,
      updatedAt: nowIso
    }, { merge: true });
  } catch (error) {
    console.warn('Profile sync notice:', error);
  }
}

// Auth Helpers
export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    if (result.user) {
      await syncUserProfile(result.user);
    }
    return result.user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function loginWithGoogleRedirect() {
  try {
    await signInWithRedirect(auth, googleProvider);
  } catch (error) {
    console.error('Redirect sign-in error:', error);
    throw error;
  }
}

export async function checkRedirectAuthResult(): Promise<User | null> {
  try {
    const result = await getRedirectResult(auth);
    if (result && result.user) {
      await syncUserProfile(result.user);
      return result.user;
    }
    return null;
  } catch (error) {
    console.warn('Redirect auth result notice:', error);
    return null;
  }
}

export async function logoutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}

// Save Assessment to Firestore
export async function saveEvaluationToCloud(userId: string, result: AssessmentResult) {
  if (!isFirebaseAuthActive(userId)) {
    return;
  }
  const path = `users/${userId}/evaluations/${result.id}`;
  try {
    const evalRef = doc(db, 'users', userId, 'evaluations', result.id);
    await setDoc(evalRef, {
      id: result.id,
      userId,
      playerName: result.playerName,
      preferredFoot: result.preferredFoot,
      primaryPositionTitle: result.primaryPosition.title,
      primaryPositionCode: result.primaryPosition.code,
      matchPercentage: result.primaryPosition.matchPercentage,
      proPlayerName: result.proComparison.player.name,
      dataJson: JSON.stringify(result),
      createdAt: result.createdAt || new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

// Delete Assessment from Firestore
export async function deleteEvaluationFromCloud(userId: string, evaluationId: string) {
  if (!isFirebaseAuthActive(userId)) {
    return;
  }
  const path = `users/${userId}/evaluations/${evaluationId}`;
  try {
    const evalRef = doc(db, 'users', userId, 'evaluations', evaluationId);
    await deleteDoc(evalRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Subscribe to User's Evaluations
export function subscribeToUserEvaluations(
  userId: string,
  onUpdate: (evaluations: AssessmentResult[]) => void,
  onError?: (err: any) => void
) {
  if (!isFirebaseAuthActive(userId)) {
    return () => {};
  }
  const path = `users/${userId}/evaluations`;
  try {
    const evalsRef = collection(db, 'users', userId, 'evaluations');
    const q = query(evalsRef);
    
    return onSnapshot(q, (snapshot) => {
      const results: AssessmentResult[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.dataJson) {
          try {
            results.push(JSON.parse(data.dataJson));
          } catch (e) {
            console.error('Failed to parse evaluation payload:', e);
          }
        }
      });
      onUpdate(results);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
      if (onError) onError(error);
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return () => {};
  }
}

// Update User Plan in Firestore
export async function updateUserPlanInCloud(userId: string, plan: PlanType) {
  if (!isFirebaseAuthActive(userId)) {
    return;
  }
  const path = `users/${userId}`;
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      plan,
      planUpdatedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// Subscribe to User Profile data (including membership plan)
export function subscribeToUserProfile(
  userId: string,
  onUpdate: (data: { plan?: PlanType; displayName?: string; email?: string }) => void
) {
  if (!isFirebaseAuthActive(userId)) {
    return () => {};
  }
  const path = `users/${userId}`;
  try {
    const userRef = doc(db, 'users', userId);
    return onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        onUpdate({
          plan: (data.plan as PlanType) || 'free',
          displayName: data.displayName,
          email: data.email
        });
      }
    }, (error) => {
      console.warn('Profile sync warning:', error);
    });
  } catch (error) {
    return () => {};
  }
}

// Save Payment Transaction Receipt to Firestore
export async function savePaymentToCloud(userId: string, payment: PaymentRecord) {
  if (!isFirebaseAuthActive(userId)) {
    return;
  }
  const path = `users/${userId}/payments/${payment.id}`;
  try {
    const paymentRef = doc(db, 'users', userId, 'payments', payment.id);
    await setDoc(paymentRef, {
      id: payment.id,
      userId,
      transactionId: payment.transactionId,
      provider: payment.provider,
      plan: payment.plan,
      billingCycle: payment.billingCycle,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      createdAt: payment.createdAt || new Date().toISOString()
    });

    // Also update plan on the user profile document
    await updateUserPlanInCloud(userId, payment.plan);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

// Subscribe to User's Payment History
export function subscribeToUserPayments(
  userId: string,
  onUpdate: (payments: PaymentRecord[]) => void,
  onError?: (err: any) => void
) {
  if (!isFirebaseAuthActive(userId)) {
    return () => {};
  }
  const path = `users/${userId}/payments`;
  try {
    const paymentsRef = collection(db, 'users', userId, 'payments');
    return onSnapshot(paymentsRef, (snapshot) => {
      const records: PaymentRecord[] = [];
      snapshot.forEach((doc) => {
        records.push(doc.data() as PaymentRecord);
      });
      // Sort newest first
      records.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onUpdate(records);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
      if (onError) onError(error);
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return () => {};
  }
}

// Save or Update Academy Student in Firestore
export async function saveStudentToCloud(userId: string, student: AcademyStudent) {
  if (!isFirebaseAuthActive(userId)) {
    return;
  }
  const path = `users/${userId}/academy_students/${student.id}`;
  try {
    const studentRef = doc(db, 'users', userId, 'academy_students', student.id);
    await setDoc(studentRef, {
      id: student.id,
      userId,
      name: student.name,
      age: Number(student.age) || 15,
      category: student.category,
      dorsal: Number(student.dorsal) || 10,
      preferredFoot: student.preferredFoot,
      primaryPosition: student.primaryPosition,
      secondaryPosition: student.secondaryPosition || '',
      matchPercentage: Number(student.matchPercentage) || 85,
      coachNotes: student.coachNotes || '',
      lastExamDate: student.lastExamDate || '',
      dataJson: JSON.stringify({
        skills: student.skills,
        tasks: student.tasks || [],
        attendance: student.attendance || [],
        skillHistory: student.skillHistory || [],
        classCode: student.classCode || '',
        pinCode: student.pinCode || '1010',
        avatarUrl: student.avatarUrl || ''
      }),
      createdAt: student.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Delete Academy Student from Firestore
export async function deleteStudentFromCloud(userId: string, studentId: string) {
  if (!isFirebaseAuthActive(userId)) {
    return;
  }
  const path = `users/${userId}/academy_students/${studentId}`;
  try {
    const studentRef = doc(db, 'users', userId, 'academy_students', studentId);
    await deleteDoc(studentRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Subscribe to Academy Students in Firestore
export function subscribeToAcademyStudents(
  userId: string,
  onUpdate: (students: AcademyStudent[]) => void,
  onError?: (err: any) => void
) {
  if (!isFirebaseAuthActive(userId)) {
    return () => {};
  }
  const path = `users/${userId}/academy_students`;
  try {
    const studentsRef = collection(db, 'users', userId, 'academy_students');
    return onSnapshot(studentsRef, (snapshot) => {
      const list: AcademyStudent[] = [];
      snapshot.forEach((docSnap) => {
        const d = docSnap.data();
        let parsedData: any = {};
        if (d.dataJson) {
          try {
            parsedData = JSON.parse(d.dataJson);
          } catch (e) {
            console.error('Failed to parse student dataJson:', e);
          }
        }
        list.push({
          id: d.id,
          name: d.name,
          age: d.age,
          category: d.category,
          dorsal: d.dorsal,
          preferredFoot: d.preferredFoot,
          primaryPosition: d.primaryPosition,
          secondaryPosition: d.secondaryPosition || undefined,
          matchPercentage: d.matchPercentage,
          coachNotes: d.coachNotes || '',
          lastExamDate: d.lastExamDate || undefined,
          skills: parsedData.skills || {
            speed: 75, technique: 75, finishing: 70, passing: 75,
            defending: 70, physical: 75, tacticalIQ: 75, mental: 75
          },
          tasks: parsedData.tasks || [],
          attendance: parsedData.attendance || [],
          skillHistory: parsedData.skillHistory || [],
          classCode: parsedData.classCode || undefined,
          pinCode: parsedData.pinCode || '1010',
          avatarUrl: parsedData.avatarUrl,
          createdAt: d.createdAt
        });
      });
      onUpdate(list);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
      if (onError) onError(error);
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return () => {};
  }
}

// Save Academy Lineup in Firestore
export async function saveLineupToCloud(
  userId: string,
  lineup: { id?: string; formation: string; slots: any[] }
) {
  if (!isFirebaseAuthActive(userId)) {
    return;
  }
  const lineupId = lineup.id || 'main';
  const path = `users/${userId}/academy_lineups/${lineupId}`;
  try {
    const lineupRef = doc(db, 'users', userId, 'academy_lineups', lineupId);
    await setDoc(lineupRef, {
      id: lineupId,
      userId,
      formation: lineup.formation,
      slotsJson: JSON.stringify(lineup.slots),
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Subscribe to Academy Lineup in Firestore
export function subscribeToAcademyLineup(
  userId: string,
  onUpdate: (data: { formation: string; slots: any[] } | null) => void,
  lineupId: string = 'main'
) {
  if (!isFirebaseAuthActive(userId)) {
    return () => {};
  }
  const path = `users/${userId}/academy_lineups/${lineupId}`;
  try {
    const lineupRef = doc(db, 'users', userId, 'academy_lineups', lineupId);
    return onSnapshot(lineupRef, (docSnap) => {
      if (docSnap.exists()) {
        const d = docSnap.data();
        let slots = [];
        if (d.slotsJson) {
          try {
            slots = JSON.parse(d.slotsJson);
          } catch {}
        }
        onUpdate({
          formation: d.formation,
          slots
        });
      } else {
        onUpdate(null);
      }
    }, (error) => {
      console.warn('Lineup sync error:', error);
    });
  } catch (error) {
    return () => {};
  }
}

// Save Tactical Board Plan to Firestore
export async function saveTacticalPlanToCloud(
  userId: string,
  plan: { id: string; title: string; pieces: any[]; drawings: any[]; notes?: string }
) {
  if (!isFirebaseAuthActive(userId)) {
    return plan.id || `tac-${Date.now()}`;
  }
  const planId = plan.id || `tac-${Date.now()}`;
  const path = `users/${userId}/academy_tactics/${planId}`;
  try {
    const planRef = doc(db, 'users', userId, 'academy_tactics', planId);
    await setDoc(planRef, {
      id: planId,
      userId,
      title: plan.title || 'Estrategia Táctica',
      dataJson: JSON.stringify({
        pieces: plan.pieces,
        drawings: plan.drawings,
        notes: plan.notes || ''
      }),
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return planId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return null;
  }
}

// Delete Tactical Board Plan from Firestore
export async function deleteTacticalPlanFromCloud(userId: string, planId: string) {
  if (!isFirebaseAuthActive(userId)) {
    return;
  }
  const path = `users/${userId}/academy_tactics/${planId}`;
  try {
    const planRef = doc(db, 'users', userId, 'academy_tactics', planId);
    await deleteDoc(planRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Subscribe to Academy Tactics in Firestore
export function subscribeToAcademyTactics(
  userId: string,
  onUpdate: (plans: Array<{ id: string; title: string; pieces: any[]; drawings: any[]; notes?: string; updatedAt: string }>) => void
) {
  if (!isFirebaseAuthActive(userId)) {
    return () => {};
  }
  const path = `users/${userId}/academy_tactics`;
  try {
    const q = query(collection(db, 'users', userId, 'academy_tactics'), orderBy('updatedAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const plans: any[] = [];
      snapshot.forEach((docSnap) => {
        const d = docSnap.data();
        let parsed = { pieces: [], drawings: [], notes: '' };
        if (d.dataJson) {
          try {
            parsed = JSON.parse(d.dataJson);
          } catch {}
        }
        plans.push({
          id: d.id,
          title: d.title,
          pieces: parsed.pieces || [],
          drawings: parsed.drawings || [],
          notes: parsed.notes || '',
          updatedAt: d.updatedAt
        });
      });
      onUpdate(plans);
    }, (error) => {
      console.warn('Tactics subscription error:', error);
    });
  } catch (error) {
    return () => {};
  }
}

// Save Club Brand Configuration to Firestore (White-Label)
export async function saveClubBrandToCloud(userId: string, brand: ClubBrandConfig) {
  if (!isFirebaseAuthActive(userId)) {
    return;
  }
  const path = `users/${userId}/academy_branding/config`;
  try {
    const brandRef = doc(db, 'users', userId, 'academy_branding', 'config');
    await setDoc(brandRef, {
      ...brand,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Subscribe to Club Brand Configuration in Firestore
export function subscribeToClubBrand(
  userId: string,
  onUpdate: (brand: ClubBrandConfig | null) => void
) {
  if (!isFirebaseAuthActive(userId)) {
    return () => {};
  }
  const path = `users/${userId}/academy_branding/config`;
  try {
    const brandRef = doc(db, 'users', userId, 'academy_branding', 'config');
    return onSnapshot(brandRef, (docSnap) => {
      if (docSnap.exists()) {
        onUpdate(docSnap.data() as ClubBrandConfig);
      } else {
        onUpdate(null);
      }
    }, (error) => {
      console.warn('Club branding sync notice:', error);
    });
  } catch (error) {
    return () => {};
  }
}

// Save Academy Class (Classroom) to Firestore
export async function saveAcademyClassToCloud(userId: string, cls: AcademyClass) {
  if (!isFirebaseAuthActive(userId)) {
    return;
  }
  const path = `users/${userId}/academy_classes/${cls.id}`;
  try {
    const classRef = doc(db, 'users', userId, 'academy_classes', cls.id);
    await setDoc(classRef, {
      id: cls.id,
      userId,
      name: cls.name,
      category: cls.category,
      inviteCode: cls.inviteCode,
      studentCount: Number(cls.studentCount) || 0,
      createdAt: cls.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Delete Academy Class from Firestore
export async function deleteAcademyClassFromCloud(userId: string, classId: string) {
  if (!isFirebaseAuthActive(userId)) {
    return;
  }
  const path = `users/${userId}/academy_classes/${classId}`;
  try {
    const classRef = doc(db, 'users', userId, 'academy_classes', classId);
    await deleteDoc(classRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Subscribe to Academy Classes in Firestore
export function subscribeToAcademyClasses(
  userId: string,
  onUpdate: (classes: AcademyClass[]) => void
) {
  if (!isFirebaseAuthActive(userId)) {
    return () => {};
  }
  const path = `users/${userId}/academy_classes`;
  try {
    const classesRef = collection(db, 'users', userId, 'academy_classes');
    return onSnapshot(classesRef, (snapshot) => {
      const list: AcademyClass[] = [];
      snapshot.forEach((docSnap) => {
        const d = docSnap.data();
        list.push({
          id: d.id,
          name: d.name,
          category: d.category,
          inviteCode: d.inviteCode,
          studentCount: Number(d.studentCount) || 0,
          createdAt: d.createdAt
        });
      });
      onUpdate(list);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });
  } catch (error) {
    return () => {};
  }
}

// ============================================================================
// REAL COMMUNITY TESTIMONIALS & 50% SINGLE-EVALUATION PRO UNLOCK REWARD
// ============================================================================

const LOCAL_TESTIMONIALS_KEY = 'coachstrike_real_testimonials_v1';
const TESTIMONIAL_REWARD_KEY = 'coachstrike_testimonial_reward_v1';

export interface TestimonialRewardState {
  hasSubmittedReview: boolean;
  unlockedEvaluationId: string | null; // Bound strictly to 1 single evaluation ID (or 'PENDING_NEXT_EVAL' until bound)
  testimonialId?: string;
  claimedAt?: string;
}

export function getTestimonialRewardState(): TestimonialRewardState {
  if (typeof window === 'undefined') {
    return { hasSubmittedReview: false, unlockedEvaluationId: null };
  }
  try {
    const raw = localStorage.getItem(TESTIMONIAL_REWARD_KEY);
    if (!raw) return { hasSubmittedReview: false, unlockedEvaluationId: null };
    const parsed = JSON.parse(raw);
    return {
      hasSubmittedReview: Boolean(parsed.hasSubmittedReview),
      unlockedEvaluationId: parsed.unlockedEvaluationId || null,
      testimonialId: parsed.testimonialId,
      claimedAt: parsed.claimedAt
    };
  } catch {
    return { hasSubmittedReview: false, unlockedEvaluationId: null };
  }
}

export function grantTestimonialSingleEvalReward(targetEvaluationId?: string | null, testimonialId?: string): TestimonialRewardState {
  const current = getTestimonialRewardState();
  // Explicitly enforce 1 evaluation per review: if already bound to a concrete evaluation ID, keep it
  const evalToUnlock =
    current.unlockedEvaluationId && current.unlockedEvaluationId !== 'PENDING_NEXT_EVAL'
      ? current.unlockedEvaluationId
      : targetEvaluationId || 'PENDING_NEXT_EVAL';

  const nextState: TestimonialRewardState = {
    hasSubmittedReview: true,
    unlockedEvaluationId: evalToUnlock,
    testimonialId: testimonialId || current.testimonialId,
    claimedAt: current.claimedAt || new Date().toISOString()
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(TESTIMONIAL_REWARD_KEY, JSON.stringify(nextState));
      window.dispatchEvent(new CustomEvent('coachstrike_testimonial_updated'));
    } catch (e) {
      console.warn('Could not save testimonial reward state:', e);
    }
  }
  return nextState;
}

export function bindPendingRewardToEvaluation(evaluationId: string): TestimonialRewardState {
  const current = getTestimonialRewardState();
  if (current.hasSubmittedReview && current.unlockedEvaluationId === 'PENDING_NEXT_EVAL' && evaluationId) {
    const updated: TestimonialRewardState = {
      ...current,
      unlockedEvaluationId: evaluationId
    };
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(TESTIMONIAL_REWARD_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not bind evaluation reward:', e);
      }
    }
    return updated;
  }
  return current;
}

export function getLocalTestimonials(): UserTestimonial[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_TESTIMONIALS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function submitRealTestimonial(
  testimonial: Omit<UserTestimonial, 'id' | 'createdAt' | 'userId'>,
  targetEvaluationId?: string | null
): Promise<UserTestimonial> {
  const currentUserId = auth.currentUser?.uid || 'guest_local_user';
  const newReview: UserTestimonial = {
    id: `rev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    userId: currentUserId,
    authorName: testimonial.authorName.trim(),
    authorRole: testimonial.authorRole.trim(),
    rating: Math.min(5, Math.max(1, Number(testimonial.rating) || 5)),
    comment: testimonial.comment.trim(),
    ...(targetEvaluationId ? { rewardEvalId: targetEvaluationId } : {}),
    createdAt: new Date().toISOString()
  };

  // Always save locally so the user sees their review immediately even if guest
  if (typeof window !== 'undefined') {
    try {
      const existing = getLocalTestimonials();
      const updated = [newReview, ...existing.filter((r) => r.id !== newReview.id)];
      localStorage.setItem(LOCAL_TESTIMONIALS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not store local testimonial:', e);
    }
  }

  // Grant the 50% unlock reward strictly for 1 evaluation
  grantTestimonialSingleEvalReward(targetEvaluationId, newReview.id);

  // Sync to Firestore if signed in with Firebase Auth
  if (auth.currentUser) {
    const path = `testimonials/${newReview.id}`;
    try {
      const reviewRef = doc(db, 'testimonials', newReview.id);
      await setDoc(reviewRef, newReview);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('coachstrike_testimonial_updated'));
  }

  return newReview;
}

export function subscribeToRealTestimonials(
  onUpdate: (testimonials: UserTestimonial[]) => void
) {
  const mergeAndEmit = (cloudList: UserTestimonial[]) => {
    const localList = getLocalTestimonials();
    const byId = new Map<string, UserTestimonial>();
    for (const item of [...cloudList, ...localList]) {
      if (item && item.id && item.comment) {
        byId.set(item.id, item);
      }
    }
    const merged = Array.from(byId.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    onUpdate(merged);
  };

  // Initial local emit
  mergeAndEmit([]);

  let latestCloud: UserTestimonial[] = [];
  const handleLocalEvent = () => mergeAndEmit(latestCloud);
  if (typeof window !== 'undefined') {
    window.addEventListener('coachstrike_testimonial_updated', handleLocalEvent);
  }

  let unsubFirestore = () => {};
  try {
    const testimonialsRef = collection(db, 'testimonials');
    unsubFirestore = onSnapshot(
      testimonialsRef,
      (snapshot) => {
        const list: UserTestimonial[] = [];
        snapshot.forEach((docSnap) => {
          const d = docSnap.data();
          if (d && d.id && d.comment) {
            list.push({
              id: d.id,
              userId: d.userId,
              authorName: d.authorName,
              authorRole: d.authorRole,
              rating: Number(d.rating) || 5,
              comment: d.comment,
              rewardEvalId: d.rewardEvalId,
              createdAt: d.createdAt
            });
          }
        });
        latestCloud = list;
        mergeAndEmit(latestCloud);
      },
      (error) => {
        console.warn('Testimonials listener notice:', error);
        mergeAndEmit([]);
      }
    );
  } catch {
    mergeAndEmit([]);
  }

  return () => {
    unsubFirestore();
    if (typeof window !== 'undefined') {
      window.removeEventListener('coachstrike_testimonial_updated', handleLocalEvent);
    }
  };
}

// ============================================================================
// ACADEMY PUBLIC SELF-ASSESSMENT / QR TRYOUT AUTO-INGESTION
// ============================================================================

export function inferCategoryFromInviteCode(code: string, fallbackAge = 16): AcademyStudent['category'] {
  const upper = (code || '').toUpperCase();
  if (upper.includes('SUB-12') || upper.includes('SUB12') || upper.includes('U12')) return 'Sub-12';
  if (upper.includes('SUB-14') || upper.includes('SUB14') || upper.includes('U14')) return 'Sub-14';
  if (upper.includes('SUB-16') || upper.includes('SUB16') || upper.includes('U16')) return 'Sub-16';
  if (upper.includes('SUB-18') || upper.includes('SUB18') || upper.includes('U18')) return 'Sub-18';
  if (upper.includes('SENIOR') || upper.includes('PRO') || upper.includes('1ER')) return 'Senior';
  if (fallbackAge <= 12) return 'Sub-12';
  if (fallbackAge <= 14) return 'Sub-14';
  if (fallbackAge <= 16) return 'Sub-16';
  if (fallbackAge <= 18) return 'Sub-18';
  return 'Senior';
}

export async function publishAcademyTryoutSubmission(student: AcademyStudent): Promise<void> {
  if (!student.classCode) return;
  const submissionId = student.id.replace(/[^a-zA-Z0-9_-]/g, '_');
  const payload = {
    id: submissionId,
    inviteCode: student.classCode.trim().toUpperCase(),
    playerName: student.name.trim(),
    category: student.category || 'Sub-16',
    dorsal: Number(student.dorsal) || 10,
    age: Number(student.age) || 16,
    preferredFoot: student.preferredFoot || 'Diestro',
    primaryPosition: student.primaryPosition,
    ...(student.secondaryPosition ? { secondaryPosition: student.secondaryPosition } : {}),
    matchPercentage: Number(student.matchPercentage) || 85,
    skillsJson: JSON.stringify(student.skills),
    ...(student.assessmentResultId ? { assessmentResultId: student.assessmentResultId } : {}),
    createdAt: student.createdAt || new Date().toISOString()
  };

  try {
    const subRef = doc(db, 'academy_tryout_submissions', submissionId);
    await setDoc(subRef, payload, { merge: true });
  } catch (err) {
    console.warn('Notice publishing academy tryout submission to cloud:', err);
  }
}

export function subscribeToAcademyTryoutSubmissions(
  activeInviteCodes: string[],
  onNewStudents: (incoming: AcademyStudent[]) => void
) {
  const normalizedCodes = new Set(
    (activeInviteCodes || []).map((c) => c.trim().toUpperCase()).filter(Boolean)
  );
  if (normalizedCodes.size === 0) return () => {};

  try {
    const submissionsRef = collection(db, 'academy_tryout_submissions');
    return onSnapshot(
      submissionsRef,
      (snapshot) => {
        const matched: AcademyStudent[] = [];
        snapshot.forEach((docSnap) => {
          const d = docSnap.data();
          const code = String(d?.inviteCode || '').trim().toUpperCase();
          if (d && d.id && code && normalizedCodes.has(code)) {
            let parsedSkills = {
              speed: 75,
              technique: 75,
              finishing: 72,
              passing: 75,
              defending: 70,
              physical: 75,
              tacticalIQ: 78,
              mental: 78
            };
            try {
              if (d.skillsJson) {
                parsedSkills = JSON.parse(d.skillsJson);
              }
            } catch {}

            const todayStr = (d.createdAt || new Date().toISOString()).slice(0, 10);
            matched.push({
              id: d.id,
              name: d.playerName,
              age: Number(d.age) || 16,
              category: (d.category as AcademyStudent['category']) || 'Sub-16',
              dorsal: Number(d.dorsal) || 10,
              preferredFoot: (d.preferredFoot as AcademyStudent['preferredFoot']) || 'Diestro',
              primaryPosition: d.primaryPosition,
              secondaryPosition: d.secondaryPosition,
              matchPercentage: Number(d.matchPercentage) || 85,
              skills: parsedSkills,
              classCode: code,
              lastExamDate: todayStr,
              assessmentResultId: d.assessmentResultId,
              pinCode: '1010',
              skillHistory: [
                {
                  id: `snap-tryout-${d.id}`,
                  date: todayStr,
                  label: 'Auto-Diagnóstico QR',
                  skills: parsedSkills,
                  matchPercentage: Number(d.matchPercentage) || 85,
                  primaryPosition: d.primaryPosition
                }
              ],
              coachNotes: `Incorporado automáticamente vía Enlace/Código de Invitación (${code}).`,
              createdAt: d.createdAt || new Date().toISOString()
            });
          }
        });
        if (matched.length > 0) {
          onNewStudents(matched);
        }
      },
      (err) => {
        console.warn('Tryout submissions listener notice:', err);
      }
    );
  } catch {
    return () => {};
  }
}


