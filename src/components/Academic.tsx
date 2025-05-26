import { Calendar, Clock, BookOpen, TrendingUp, FileText, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const Academic = () => {
  const mockSchedule = [
    {
      id: 1,
      course: 'Calculus II',
      time: '9:00 AM - 10:30 AM',
      location: 'Math Building 201',
      professor: 'Dr. Smith',
      type: 'Lecture',
    },
    {
      id: 2,
      course: 'Computer Science',
      time: '11:00 AM - 12:30 PM',
      location: 'CS Lab 105',
      professor: 'Prof. Johnson',
      type: 'Lab',
    },
    {
      id: 3,
      course: 'Physics Lab',
      time: '2:00 PM - 4:00 PM',
      location: 'Physics Building',
      professor: 'Dr. Wilson',
      type: 'Laboratory',
    },
  ];

  const mockGrades = [
    { course: 'Calculus II', grade: 'A-', percentage: 88, credits: 4 },
    { course: 'Computer Science', grade: 'B+', percentage: 85, credits: 3 },
    { course: 'Physics', grade: 'A', percentage: 92, credits: 4 },
    { course: 'English Literature', grade: 'B', percentage: 82, credits: 3 },
  ];

  const currentGPA = 8.67;

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
            <div className="text-2xl font-bold text-green-600">14</div>
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
          {mockSchedule.map((class_item) => (
            <div key={class_item.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <Clock size={16} className="text-gray-500 mt-1" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">{class_item.course}</h3>
                  <Badge variant={class_item.type === 'Lecture' ? 'default' : 
                               class_item.type === 'Lab' ? 'secondary' : 'outline'}>
                    {class_item.type}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{class_item.time}</p>
                <p className="text-sm text-gray-500">{class_item.location} • {class_item.professor}</p>
              </div>
            </div>
          ))}
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
          {mockGrades.map((grade, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{grade.course}</span>
                <div className="text-right">
                  <span className="font-bold text-lg">{grade.grade}</span>
                  <span className="text-sm text-gray-500 ml-2">({grade.percentage}%)</span>
                </div>
              </div>
              <Progress value={grade.percentage} className="h-2" />
              <div className="text-xs text-gray-500">{grade.credits} credits</div>
            </div>
          ))}
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

      {/* API Integration Placeholder */}
      <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
        <h3 className="font-semibold text-orange-800 mb-2">📚 Academic API Ready</h3>
        <p className="text-sm text-orange-700">
          College timetable and grading system APIs can be integrated for real-time data synchronization.
        </p>
      </div>
    </div>
  );
};

export default Academic;
