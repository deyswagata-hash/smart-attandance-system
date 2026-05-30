import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '../components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs.jsx';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext.jsx';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import pb from '../lib/pocketbaseClient.js';
import { Users, BookOpen, BarChart3, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const AdminDashboard = () => {
  const { currentUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalClasses: 0, totalAttendance: 0 });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [usersData, classesData, attendanceData] = await Promise.all([
        pb.collection('app_users').getFullList({ sort: '-created' }),
        pb.collection('classes').getFullList({ expand: 'teacher_id', sort: '-created' }),
        pb.collection('attendance').getFullList({ expand: 'student_id,class_id', sort: '-timestamp' })
      ]);

      setUsers(usersData);
      setClasses(classesData);
      setAttendance(attendanceData);

      setStats({
        totalUsers: usersData.length,
        totalClasses: classesData.length,
        totalAttendance: attendanceData.length
      });

    } catch (error) {
      console.error(error);
      toast.error('Failed to load dashboard');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm('Delete this user?')) return;
    try {
      await pb.collection('app_users').delete(id);
      toast.success('User deleted');
      fetchAllData();
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleDeleteClass = async (id) => {
    if (!confirm('Delete this class?')) return;
    try {
      await pb.collection('classes').delete(id);
      toast.success('Class deleted');
      fetchAllData();
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard</title>
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />

        <main className="flex-1 py-12">
          <div className="container mx-auto px-4">

            {/* HEADER */}
            <div className="mb-10">
              <h1 className="text-4xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground text-lg">System overview & control</p>
            </div>

            {/* STATS */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">

              <Card className="rounded-2xl shadow-md bg-primary/10 backdrop-blur">
                <CardHeader className="flex justify-between">
                  <CardTitle className="text-primary font-bold">Users</CardTitle>
                  <Users className="text-primary" />
                </CardHeader>
                <CardContent>
                  <h2 className="text-3xl font-bold text-primary">{stats.totalUsers}</h2>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-md bg-secondary/20">
                <CardHeader className="flex justify-between">
                  <CardTitle className="text-secondary-foreground font-bold">Classes</CardTitle>
                  <BookOpen className="text-secondary-foreground" />
                </CardHeader>
                <CardContent>
                  <h2 className="text-3xl font-bold text-secondary-foreground">{stats.totalClasses}</h2>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-md bg-accent/20">
                <CardHeader className="flex justify-between">
                  <CardTitle className="text-accent-foreground font-bold">Attendance</CardTitle>
                  <BarChart3 className="text-accent-foreground" />
                </CardHeader>
                <CardContent>
                  <h2 className="text-3xl font-bold text-accent-foreground">{stats.totalAttendance}</h2>
                </CardContent>
              </Card>

            </div>

            {/* TABS */}
            <Tabs defaultValue="users">

              <TabsList className="bg-muted rounded-xl mb-6">
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="classes">Classes</TabsTrigger>
                <TabsTrigger value="attendance">Attendance</TabsTrigger>
              </TabsList>

              {/* USERS */}
              <TabsContent value="users">
                <Card className="rounded-2xl shadow-md">
                  <CardHeader>
                    <CardTitle>User Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {users.map(u => (
                          <TableRow key={u.id}>
                            <TableCell>{u.name}</TableCell>
                            <TableCell>{u.email}</TableCell>
                            <TableCell>{u.role}</TableCell>
                            <TableCell>
                              {u.id !== currentUser.id && (
                                <Button size="sm" variant="destructive"
                                  onClick={() => handleDeleteUser(u.id)}>
                                  <Trash2 size={16} />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>

                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* CLASSES */}
              <TabsContent value="classes">
                <Card className="rounded-2xl shadow-md">
                  <CardHeader>
                    <CardTitle>Classes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Code</TableHead>
                          <TableHead>Teacher</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {classes.map(c => (
                          <TableRow key={c.id}>
                            <TableCell>{c.class_name}</TableCell>
                            <TableCell>{c.class_code}</TableCell>
                            <TableCell>{c.expand?.teacher_id?.name}</TableCell>
                            <TableCell>
                              <Button size="sm" variant="destructive"
                                onClick={() => handleDeleteClass(c.id)}>
                                <Trash2 size={16} />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>

                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ATTENDANCE */}
              <TabsContent value="attendance">
                <Card className="rounded-2xl shadow-md">
                  <CardHeader>
                    <CardTitle>Attendance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student</TableHead>
                          <TableHead>Class</TableHead>
                          <TableHead>Time</TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {attendance.slice(0, 30).map(a => (
                          <TableRow key={a.id}>
                            <TableCell>{a.expand?.student_id?.name}</TableCell>
                            <TableCell>{a.expand?.class_id?.class_name}</TableCell>
                            <TableCell>{format(new Date(a.timestamp), 'dd MMM yyyy hh:mm')}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>

                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

            </Tabs>

          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default AdminDashboard;