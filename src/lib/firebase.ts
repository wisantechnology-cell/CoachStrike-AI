import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
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
import { AssessmentResult, PlanType, PaymentRecord, AcademyStudent } from '../types';

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
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection test on boot (as required by Firebase skill)
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline. Please check network or configuration.');
    }
  }
}
testConnection();

// Auth Helpers
export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    if (result.user) {
      // Sync user profile to Firestore
      const userRef = doc(db, 'users', result.user.uid);
      await setDoc(userRef, {
        id: result.user.uid,
        displayName: result.user.displayName || 'Jugador',
        email: result.user.email || '',
        photoURL: result.user.photoURL || '',
        createdAt: new Date().toISOString()
      }, { merge: true });
    }
    return result.user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
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
      console.warn('Profile sync warn:', error);
    });
  } catch (error) {
    return () => {};
  }
}

// Save Payment Transaction Receipt to Firestore
export async function savePaymentToCloud(userId: string, payment: PaymentRecord) {
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
