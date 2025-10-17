import { supabase } from './supabaseClient';

export async function getStudents() {
  const { data, error } = await supabase.from('students').select('*');
  if (error) throw error;
  return data;
}

export async function addStudent(name, reg_number, email) {
  const { error } = await supabase
    .from('students')
    .insert([{ name, reg_number, email }]);
  if (error) throw error;
}

export async function deleteStudent(reg_number) {
  const { error } = await supabase
    .from('students')
    .delete()
    .eq('reg_number', reg_number);
  if (error) throw error;
}

export async function updateStudent(reg_number, patch) {
  const { error } = await supabase.from('students').update(patch).eq('reg_number', reg_number);
  if (error) throw error;
}
