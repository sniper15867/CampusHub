
import { useState, useEffect } from 'react';
import { Calendar, Clock, BookOpen, TrendingUp, FileText, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface TimetableEntry {
  id: string;
  course_name: string;
  course_code?: string;
  instructor?: string;
  location?: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
}

interface Grade {
  id: string;
  course_name: string;
  course_code?: string;
  grade?: string;
  percentage?: number;
  credits: number;
}

const Academic = () => {
  const { user } = useAuth();
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAcademicData();
    }
  }, [user]);

  const fetchAcademicData = async () => {
    if (!user) return;

    try {
      // Fetch today's schedule (assuming today is Monday = 1)
      const today = new Date().getDay();
      const { data: timetableData } = await supabase
        .from('timetable_entries')
        .select('*')
        .eq('user_id', user.id)
        .eq('day_of_week', today)
        .order('start_time');

      // Fetch grades
      const { data: gradesData } = await supabase
        .from('grades')
        .select('*')
        .eq('user_id', user.id)
        .order('course_name');

      setTimetable(timetableData || []);
      setGrades(gradesData || []);
    } catch (error) {
      console.error('Error fetching academic data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateGPA = () => {
    if (grades.length === 0) return 0;
    
    const totalPoints = grades.reduce((sum, grade) => {
      const percentage = grade.percentage || 0;
      const gpaPoint = (percentage / 100) * 10; // Convert to 10-point scale
      return sum + (gpaPoint * grade.credits);
    }, 0);
    
    const totalCredits = grades.reduce((sum, grade) => sum + grade.credits, 0);
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
  };

  const totalCredits = grades.reduce((sum, grade) => sum + grade.credits, 0);
  const currentGPA = calculateGPA();

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{currentGPA}</div>
            <div className="text-sm text-gray-600">Current GPA</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{totalCredits}</div>
            <div className="text-sm text-gray-600">Total Credits</div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2" size={20} />
            Today's Schedule
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {timetable.length > 0 ? (
            timetable.map((entry) => (
              <div key={entry.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <Clock size={16} className="text-gray-500 mt-1" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">{entry.course_name}</h3>
                    {entry.course_code && (
                      <Badge variant="outline">{entry.course_code}</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{entry.start_time} - {entry.end_time}</p>
                  <p className="text-sm text-gray-500">
                    {entry.location} {entry.instructor && `• ${entry.instructor}`}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar size={48} className="mx-auto mb-4 opacity-50" />
              <p>No classes scheduled for today</p>
              <p className="text-sm">Add your timetable to see your schedule</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* API Integration Banner */}
      <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-lg border border-blue-200">
        <div className="flex items-center space-x-3">
          <Bell className="text-blue-600" size={24} />
          <div>
            <h3 className="font-semibold text-blue-800">Live College API Integration</h3>
            <p className="text-sm text-blue-600">Real-time schedule and grade updates will sync here</p>
          </div>
        </div>
      </div>

      {/* Grades Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2" size={20} />
            Current Grades
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {grades.length > 0 ? (
            grades.map((grade) => (
              <div key={grade.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{grade.course_name}</span>
                  <div className="text-right">
                    {grade.grade && <span className="font-bold text-lg">{grade.grade}</span>}
                    {grade.percentage && (
                      <span className="text-sm text-gray-500 ml-2">({grade.percentage}%)</span>
                    )}
                  </div>
                </div>
                {grade.percentage && <Progress value={grade.percentage} className="h-2" />}
                <div className="text-xs text-gray-500">{grade.credits} credits</div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <TrendingUp size={48} className="mx-auto mb-4 opacity-50" />
              <p>No grades available</p>
              <p className="text-sm">Your grades will appear here once added</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" className="h-16 flex flex-col">
          <FileText size={20} className="mb-1" />
          <span className="text-sm">Assignments</span>
        </Button>
        <Button variant="outline" className="h-16 flex flex-col">
          <BookOpen size={20} className="mb-1" />
          <span className="text-sm">Resources</span>
        </Button>
      </div>
    </div>
  );
};

export default Academic;
