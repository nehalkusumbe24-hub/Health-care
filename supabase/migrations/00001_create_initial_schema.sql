-- Create user role enum
CREATE TYPE public.user_role AS ENUM ('user', 'doctor', 'admin');

-- Create doctor status enum
CREATE TYPE public.doctor_status AS ENUM ('pending', 'approved', 'rejected');

-- Create dosha type enum
CREATE TYPE public.dosha_type AS ENUM ('vata', 'pitta', 'kapha');

-- Create assessment status enum
CREATE TYPE public.assessment_status AS ENUM ('pending', 'completed', 'reviewed');

-- Create profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  phone text,
  role public.user_role NOT NULL DEFAULT 'user'::public.user_role,
  full_name text,
  age integer,
  gender text,
  weight numeric,
  height numeric,
  lifestyle_info jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create doctor_profiles table
CREATE TABLE public.doctor_profiles (
  id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  registration_number text UNIQUE NOT NULL,
  credentials_url text,
  specialization text,
  experience_years integer,
  status public.doctor_status DEFAULT 'pending'::public.doctor_status,
  approved_by uuid REFERENCES public.profiles(id),
  approved_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create assessments table
CREATE TABLE public.assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  symptoms jsonb DEFAULT '[]'::jsonb,
  daily_habits jsonb DEFAULT '{}'::jsonb,
  physical_attributes jsonb DEFAULT '{}'::jsonb,
  mental_patterns jsonb DEFAULT '{}'::jsonb,
  dosha_results jsonb DEFAULT '{}'::jsonb,
  primary_dosha public.dosha_type,
  secondary_dosha public.dosha_type,
  imbalance_severity text,
  health_conditions text[],
  status public.assessment_status DEFAULT 'pending'::public.assessment_status,
  reviewed_by uuid REFERENCES public.doctor_profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create prescriptions table
CREATE TABLE public.prescriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  doctor_id uuid NOT NULL REFERENCES public.doctor_profiles(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  herbal_medicines jsonb DEFAULT '[]'::jsonb,
  panchakarma_recommendations text[],
  lifestyle_adjustments text[],
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create diet_plans table
CREATE TABLE public.diet_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  assessment_id uuid REFERENCES public.assessments(id) ON DELETE SET NULL,
  created_by uuid REFERENCES public.doctor_profiles(id),
  title text NOT NULL,
  description text,
  primary_dosha public.dosha_type,
  daily_menu jsonb DEFAULT '{}'::jsonb,
  weekly_menu jsonb DEFAULT '{}'::jsonb,
  food_restrictions text[],
  seasonal_recommendations jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create exercise_plans table
CREATE TABLE public.exercise_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  assessment_id uuid REFERENCES public.assessments(id) ON DELETE SET NULL,
  created_by uuid REFERENCES public.doctor_profiles(id),
  title text NOT NULL,
  description text,
  yoga_poses jsonb DEFAULT '[]'::jsonb,
  pranayama_exercises jsonb DEFAULT '[]'::jsonb,
  daily_routine jsonb DEFAULT '{}'::jsonb,
  duration_minutes integer,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create habit_tracking table
CREATE TABLE public.habit_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  habit_type text NOT NULL,
  habit_name text NOT NULL,
  completed_at timestamptz DEFAULT now(),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create chat_messages table
CREATE TABLE public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message text NOT NULL,
  response text,
  is_escalated boolean DEFAULT false,
  escalated_to uuid REFERENCES public.doctor_profiles(id),
  created_at timestamptz DEFAULT now()
);

-- Create storage bucket for doctor credentials
INSERT INTO storage.buckets (id, name, public)
VALUES ('mdpzmmvsonjershziahr_doctor_credentials', 'mdpzmmvsonjershziahr_doctor_credentials', false)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diet_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Create helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(uid uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = uid AND p.role = 'admin'::user_role
  );
$$;

-- Create helper function to check if user is doctor
CREATE OR REPLACE FUNCTION is_doctor(uid uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = uid AND p.role = 'doctor'::user_role
  );
$$;

-- Profiles policies
CREATE POLICY "Admins have full access to profiles" ON profiles
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id)
  WITH CHECK (role IS NOT DISTINCT FROM (SELECT role FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Doctors can view user profiles" ON profiles
  FOR SELECT TO authenticated USING (is_doctor(auth.uid()));

-- Doctor profiles policies
CREATE POLICY "Anyone can insert doctor profile" ON doctor_profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE POLICY "Doctors can view their own profile" ON doctor_profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Admins can view all doctor profiles" ON doctor_profiles
  FOR SELECT TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Admins can update doctor profiles" ON doctor_profiles
  FOR UPDATE TO authenticated USING (is_admin(auth.uid()));

-- Assessments policies
CREATE POLICY "Users can create their own assessments" ON assessments
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own assessments" ON assessments
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own assessments" ON assessments
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Doctors can view all assessments" ON assessments
  FOR SELECT TO authenticated USING (is_doctor(auth.uid()) OR is_admin(auth.uid()));

CREATE POLICY "Doctors can update assessments" ON assessments
  FOR UPDATE TO authenticated USING (is_doctor(auth.uid()) OR is_admin(auth.uid()));

-- Prescriptions policies
CREATE POLICY "Doctors can create prescriptions" ON prescriptions
  FOR INSERT TO authenticated WITH CHECK (is_doctor(auth.uid()) AND auth.uid() = doctor_id);

CREATE POLICY "Users can view their own prescriptions" ON prescriptions
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Doctors can view prescriptions they created" ON prescriptions
  FOR SELECT TO authenticated USING (auth.uid() = doctor_id);

CREATE POLICY "Doctors can update their prescriptions" ON prescriptions
  FOR UPDATE TO authenticated USING (auth.uid() = doctor_id);

-- Diet plans policies
CREATE POLICY "Users can view their own diet plans" ON diet_plans
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Doctors can create diet plans" ON diet_plans
  FOR INSERT TO authenticated WITH CHECK (is_doctor(auth.uid()));

CREATE POLICY "Doctors can view all diet plans" ON diet_plans
  FOR SELECT TO authenticated USING (is_doctor(auth.uid()) OR is_admin(auth.uid()));

CREATE POLICY "Doctors can update diet plans" ON diet_plans
  FOR UPDATE TO authenticated USING (is_doctor(auth.uid()) OR is_admin(auth.uid()));

-- Exercise plans policies
CREATE POLICY "Users can view their own exercise plans" ON exercise_plans
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Doctors can create exercise plans" ON exercise_plans
  FOR INSERT TO authenticated WITH CHECK (is_doctor(auth.uid()));

CREATE POLICY "Doctors can view all exercise plans" ON exercise_plans
  FOR SELECT TO authenticated USING (is_doctor(auth.uid()) OR is_admin(auth.uid()));

CREATE POLICY "Doctors can update exercise plans" ON exercise_plans
  FOR UPDATE TO authenticated USING (is_doctor(auth.uid()) OR is_admin(auth.uid()));

-- Habit tracking policies
CREATE POLICY "Users can manage their own habits" ON habit_tracking
  FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Chat messages policies
CREATE POLICY "Users can create their own messages" ON chat_messages
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own messages" ON chat_messages
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Doctors can view escalated messages" ON chat_messages
  FOR SELECT TO authenticated USING (is_doctor(auth.uid()) AND (is_escalated = true OR escalated_to = auth.uid()));

CREATE POLICY "Doctors can update escalated messages" ON chat_messages
  FOR UPDATE TO authenticated USING (is_doctor(auth.uid()) AND escalated_to = auth.uid());

-- Storage policies for doctor credentials
CREATE POLICY "Authenticated users can upload credentials" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'mdpzmmvsonjershziahr_doctor_credentials');

CREATE POLICY "Users can view their own credentials" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'mdpzmmvsonjershziahr_doctor_credentials' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can view all credentials" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'mdpzmmvsonjershziahr_doctor_credentials' AND is_admin(auth.uid()));

-- Create function to handle new user
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count int;
BEGIN
  SELECT COUNT(*) INTO user_count FROM profiles;
  INSERT INTO public.profiles (id, email, phone, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.phone,
    CASE WHEN user_count = 0 THEN 'admin'::public.user_role ELSE 'user'::public.user_role END
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.confirmed_at IS NULL AND NEW.confirmed_at IS NOT NULL)
  EXECUTE FUNCTION handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_assessments_user_id ON assessments(user_id);
CREATE INDEX idx_assessments_status ON assessments(status);
CREATE INDEX idx_prescriptions_user_id ON prescriptions(user_id);
CREATE INDEX idx_prescriptions_doctor_id ON prescriptions(doctor_id);
CREATE INDEX idx_diet_plans_user_id ON diet_plans(user_id);
CREATE INDEX idx_exercise_plans_user_id ON exercise_plans(user_id);
CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX idx_doctor_profiles_status ON doctor_profiles(status);