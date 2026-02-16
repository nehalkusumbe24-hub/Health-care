import { supabase } from './supabase';
import type {
  Profile,
  DoctorProfile,
  Assessment,
  Prescription,
  DietPlan,
  ExercisePlan,
  HabitTracking,
  ChatMessage,
  DoctorStatus,
  UserRole,
} from '@/types';

export const api = {
  profiles: {
    async getCurrent() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data as Profile | null;
    },

    async update(id: string, updates: Partial<Profile>) {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .maybeSingle();
      
      if (error) throw error;
      return data as Profile;
    },

    async getById(id: string) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data as Profile | null;
    },

    async updateRole(userId: string, role: UserRole) {
      const { data, error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId)
        .select()
        .maybeSingle();
      
      if (error) throw error;
      return data as Profile;
    },

    async list(limit = 50, offset = 0) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (error) throw error;
      return Array.isArray(data) ? data as Profile[] : [];
    },
  },

  doctorProfiles: {
    async create(doctorData: {
      id: string;
      registration_number: string;
      credentials_url?: string;
      specialization?: string;
      experience_years?: number;
    }) {
      const { data, error } = await supabase
        .from('doctor_profiles')
        .insert(doctorData)
        .select()
        .maybeSingle();
      
      if (error) throw error;
      return data as DoctorProfile;
    },

    async getById(id: string) {
      const { data, error } = await supabase
        .from('doctor_profiles')
        .select('*, profile:profiles(*)')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data as DoctorProfile | null;
    },

    async listPending(limit = 50) {
      const { data, error } = await supabase
        .from('doctor_profiles')
        .select('*, profile:profiles(*)')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return Array.isArray(data) ? data as DoctorProfile[] : [];
    },

    async listApproved(limit = 50) {
      const { data, error } = await supabase
        .from('doctor_profiles')
        .select('*, profile:profiles(*)')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return Array.isArray(data) ? data as DoctorProfile[] : [];
    },

    async updateStatus(id: string, status: DoctorStatus, approvedBy: string) {
      const { data, error } = await supabase
        .from('doctor_profiles')
        .update({
          status,
          approved_by: approvedBy,
          approved_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .maybeSingle();
      
      if (error) throw error;
      return data as DoctorProfile;
    },
  },

  assessments: {
    async create(assessmentData: Partial<Assessment>) {
      const { data, error } = await supabase
        .from('assessments')
        .insert(assessmentData)
        .select()
        .maybeSingle();
      
      if (error) throw error;
      return data as Assessment;
    },

    async getById(id: string) {
      const { data, error } = await supabase
        .from('assessments')
        .select('*, user:profiles!user_id(*), reviewer:doctor_profiles!reviewed_by(*)')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data as Assessment | null;
    },

    async listByUser(userId: string, limit = 50) {
      const { data, error } = await supabase
        .from('assessments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return Array.isArray(data) ? data as Assessment[] : [];
    },

    async listAll(limit = 50, offset = 0) {
      const { data, error } = await supabase
        .from('assessments')
        .select('*, user:profiles!user_id(*)')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (error) throw error;
      return Array.isArray(data) ? data as Assessment[] : [];
    },

    async update(id: string, updates: Partial<Assessment>) {
      const { data, error } = await supabase
        .from('assessments')
        .update(updates)
        .eq('id', id)
        .select()
        .maybeSingle();
      
      if (error) throw error;
      return data as Assessment;
    },
  },

  prescriptions: {
    async create(prescriptionData: Partial<Prescription>) {
      const { data, error } = await supabase
        .from('prescriptions')
        .insert(prescriptionData)
        .select()
        .maybeSingle();
      
      if (error) throw error;
      return data as Prescription;
    },

    async getById(id: string) {
      const { data, error } = await supabase
        .from('prescriptions')
        .select('*, assessment:assessments(*), doctor:doctor_profiles!doctor_id(*), user:profiles!user_id(*)')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data as Prescription | null;
    },

    async listByUser(userId: string, limit = 50) {
      const { data, error } = await supabase
        .from('prescriptions')
        .select('*, doctor:doctor_profiles!doctor_id(*, profile:profiles(*))')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return Array.isArray(data) ? data as Prescription[] : [];
    },

    async listByDoctor(doctorId: string, limit = 50) {
      const { data, error } = await supabase
        .from('prescriptions')
        .select('*, user:profiles!user_id(*), assessment:assessments(*)')
        .eq('doctor_id', doctorId)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return Array.isArray(data) ? data as Prescription[] : [];
    },

    async update(id: string, updates: Partial<Prescription>) {
      const { data, error } = await supabase
        .from('prescriptions')
        .update(updates)
        .eq('id', id)
        .select()
        .maybeSingle();
      
      if (error) throw error;
      return data as Prescription;
    },
  },

  dietPlans: {
    async create(dietPlanData: Partial<DietPlan>) {
      const { data, error } = await supabase
        .from('diet_plans')
        .insert(dietPlanData)
        .select()
        .maybeSingle();
      
      if (error) throw error;
      return data as DietPlan;
    },

    async getActiveByUser(userId: string) {
      const { data, error } = await supabase
        .from('diet_plans')
        .select('*, creator:doctor_profiles!created_by(*, profile:profiles(*))')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data as DietPlan | null;
    },

    async listByUser(userId: string, limit = 50) {
      const { data, error } = await supabase
        .from('diet_plans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return Array.isArray(data) ? data as DietPlan[] : [];
    },

    async update(id: string, updates: Partial<DietPlan>) {
      const { data, error } = await supabase
        .from('diet_plans')
        .update(updates)
        .eq('id', id)
        .select()
        .maybeSingle();
      
      if (error) throw error;
      return data as DietPlan;
    },
  },

  exercisePlans: {
    async create(exercisePlanData: Partial<ExercisePlan>) {
      const { data, error } = await supabase
        .from('exercise_plans')
        .insert(exercisePlanData)
        .select()
        .maybeSingle();
      
      if (error) throw error;
      return data as ExercisePlan;
    },

    async getActiveByUser(userId: string) {
      const { data, error } = await supabase
        .from('exercise_plans')
        .select('*, creator:doctor_profiles!created_by(*, profile:profiles(*))')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data as ExercisePlan | null;
    },

    async listByUser(userId: string, limit = 50) {
      const { data, error } = await supabase
        .from('exercise_plans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return Array.isArray(data) ? data as ExercisePlan[] : [];
    },

    async update(id: string, updates: Partial<ExercisePlan>) {
      const { data, error } = await supabase
        .from('exercise_plans')
        .update(updates)
        .eq('id', id)
        .select()
        .maybeSingle();
      
      if (error) throw error;
      return data as ExercisePlan;
    },
  },

  habitTracking: {
    async create(habitData: Partial<HabitTracking>) {
      const { data, error } = await supabase
        .from('habit_tracking')
        .insert(habitData)
        .select()
        .maybeSingle();
      
      if (error) throw error;
      return data as HabitTracking;
    },

    async listByUser(userId: string, limit = 100) {
      const { data, error } = await supabase
        .from('habit_tracking')
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return Array.isArray(data) ? data as HabitTracking[] : [];
    },

    async getRecentByType(userId: string, habitType: string, days = 7) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const { data, error } = await supabase
        .from('habit_tracking')
        .select('*')
        .eq('user_id', userId)
        .eq('habit_type', habitType)
        .gte('completed_at', startDate.toISOString())
        .order('completed_at', { ascending: false });
      
      if (error) throw error;
      return Array.isArray(data) ? data as HabitTracking[] : [];
    },
  },

  chatMessages: {
    async create(messageData: { user_id: string; message: string }) {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert(messageData)
        .select()
        .maybeSingle();
      
      if (error) throw error;
      return data as ChatMessage;
    },

    async updateResponse(id: string, response: string) {
      const { data, error } = await supabase
        .from('chat_messages')
        .update({ response })
        .eq('id', id)
        .select()
        .maybeSingle();
      
      if (error) throw error;
      return data as ChatMessage;
    },

    async escalate(id: string, doctorId: string) {
      const { data, error } = await supabase
        .from('chat_messages')
        .update({ is_escalated: true, escalated_to: doctorId })
        .eq('id', id)
        .select()
        .maybeSingle();
      
      if (error) throw error;
      return data as ChatMessage;
    },

    async listByUser(userId: string, limit = 100) {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return Array.isArray(data) ? data as ChatMessage[] : [];
    },

    async listEscalated(doctorId: string, limit = 50) {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*, user:profiles!user_id(*)')
        .eq('escalated_to', doctorId)
        .eq('is_escalated', true)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return Array.isArray(data) ? data as ChatMessage[] : [];
    },
  },
};
