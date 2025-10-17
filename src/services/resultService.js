import { supabase } from './supabaseClient';

export async function getResultsByRegNumber(reg_number) {
  const { data: student, error } = await supabase
    .from('students')
    .select('id')
    .eq('reg_number', reg_number)
    .single();

  if (error || !student) return [];

  const { data: results } = await supabase
    .from('results')
    .select('*')
    .eq('student_id', student.id);

  return results || [];
}

export async function addResult(reg_number, course_code, grade) {
  const { data: student, error } = await supabase
    .from('students')
    .select('id')
    .eq('reg_number', reg_number)
    .single();

  if (error || !student) throw new Error('Student not found');

  const { error: resultError } = await supabase
    .from('results')
    .insert([{ student_id: student.id, course_code, grade }]);

  if (resultError) throw resultError;
}
