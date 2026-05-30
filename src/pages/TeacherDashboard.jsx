import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet';
import { Button } from '../components/ui/button.jsx';
import { Input } from '../components/ui/input.jsx';
import { Label } from '../components/ui/label.jsx';
import { Textarea } from '../components/ui/textarea.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import pb from '../lib/pocketbaseClient.js';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Plus, Trash2, BarChart3, BookOpen, QrCode } from 'lucide-react';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';

const TeacherDashboard = () => {
  const { currentUser } = useAuth();
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [newClass, setNewClass] = useState({ class_name: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [activeSession, setActiveSession] = useState(null);
  // State for the QR Code Modal
  const [showQR, setShowQR] = useState(false);
  const [qrClass, setQrClass] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
 

  useEffect(() => {
    if (currentUser?.id) {
      fetchClasses();
    }
  }, [currentUser]);

  useEffect(() => {
    if (selectedClass) {
      fetchAttendance();
    } else {
      setAttendance([]);
    }
  }, [selectedClass]);

  useEffect(() => {
    if (!showQR) return;

    const interval = setInterval(() => {
      setActiveSession((prev) => ({
        ...prev,
        startTime: Date.now()
      }));
    }, 10000); // refresh every 10 sec

    return () => clearInterval(interval);
  }, [showQR]);


  const fetchClasses = async () => {
    try {
      const records = await pb.collection('classes').getFullList({
        filter: `teacher_id="${currentUser.id}"`,
        sort: '-created',
        $autoCancel: false
      });
      setClasses(records);
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast.error('Failed to load classes');
    }
  };

  const fetchAttendance = async () => {
    try {
      const records = await pb.collection('attendance').getFullList({
        filter: `class_id="${selectedClass}"`,
        expand: 'student_id',
        sort: '-timestamp',
        $autoCancel: false
      });
      console.log(records);
      setAttendance(records);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      toast.error('Failed to load attendance records');
    }

  };

  const exportAttendanceToExcel = () => {
    if (!attendance.length) {
      toast.error('No attendance records to export');
      return;
    }

    const today = format(new Date(), 'yyyy-MM-dd');

    const dailyAttendance = attendance.filter((record) => {
      return format(new Date(record.timestamp), 'yyyy-MM-dd') === today;
    });

    if (!dailyAttendance.length) {
      toast.error('No attendance records found for today');
      return;
    }

    const excelData = dailyAttendance.map((record) => ({
      College_ID: record.expand?.student_id?.college_id || 'N/A',
      Student_Name:
        record.expand?.student_id?.name ||
        record.expand?.student_id?.username ||
        record.expand?.student_id?.email ||
        'Unknown Student',
      Date: format(new Date(record.timestamp), 'yyyy-MM-dd'),
      Time: format(new Date(record.timestamp), 'hh:mm a'),
      Status: record.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      'Attendance'
    );

    const className =
      classes.find((c) => c.id === selectedClass)?.class_name ||
      'Class';

    XLSX.writeFile(
      workbook,
      `${className}_Attendance_${today}.xlsx`
    );

    toast.success('Attendance Excel downloaded');
  };


  const generateClassCode = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    if (!newClass.class_name.trim()) {
      toast.error('Class name is required');
      return;
    }

    setLoading(true);

    try {
      const classCode = generateClassCode();
      await pb.collection('classes').create({
        class_name: newClass.class_name,
        class_code: classCode,
        teacher_id: currentUser.id,
        description: newClass.description
      }, { $autoCancel: false });

      toast.success('Class created successfully');
      setNewClass({ class_name: '', description: '' });
      fetchClasses();
    } catch (error) {
      console.error('Error creating class:', error);
      toast.error('Failed to create class');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClass = async (classId) => {
    if (!window.confirm('Are you sure you want to delete this class? This will also remove associated attendance records.')) return;

    try {
      await pb.collection('classes').delete(classId, { $autoCancel: false });
      toast.success('Class deleted');

      // Update local state without refetching immediately if possible, or just refetch
      fetchClasses();

      if (selectedClass === classId) {
        setSelectedClass(null);
      }
      if (qrClass?.id === classId) {
        setShowQR(false);
        setQrClass(null);
      }
    } catch (error) {
      console.error('Error deleting class:', error);
      toast.error('Failed to delete class');
    }
  };

  const downloadQRCode = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) {
      toast.error('QR Code element not found for download');
      return;
    }

    try {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width + 40; // Add padding
        canvas.height = img.height + 40;

        // Add white background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw image in center
        ctx.drawImage(img, 20, 20);

        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `${qrClass?.class_name.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'class'}-qrcode.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
        toast.success('QR Code downloaded successfully');
      };

      img.onerror = () => {
        toast.error('Failed to process QR code image');
      };

      // Handle unicode characters in SVG
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    } catch (err) {
      console.error('Download QR error:', err);
      toast.error('Failed to download QR code');
    }
  };


  const filteredAttendance = selectedDate
  ? attendance.filter(
      (record) =>
        format(
          new Date(record.timestamp),
          'yyyy-MM-dd'
        ) === selectedDate
    )
  : attendance;



  const openQRModal = (cls) => {
    const session = {
      classId: cls.id,
      classCode: cls.class_code,
      startTime: Date.now()
    };

    setActiveSession(session);
    setQrClass(cls);
    setShowQR(true);
  };
  return (
    <>
      <Helmet>
        <title>Teacher Dashboard - QR Attendance System</title>
        <meta name="description" content="Manage your classes, generate QR codes, and track student attendance" />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />

        <main className="flex-1 py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
              <h1 className="text-4xl font-bold mb-3 text-foreground tracking-tight">Teacher Dashboard</h1>
              <p className="text-xl text-muted-foreground font-medium">Welcome back, {currentUser?.name || 'Teacher'}!</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              <Card className="bg-primary/10 border-none shadow-sm rounded-2xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-bold text-primary">Total Classes</CardTitle>
                  <div className="bg-primary/20 p-2 rounded-xl">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-primary">{classes.length}</div>
                </CardContent>
              </Card>

              <Card className="bg-secondary/20 border-none shadow-sm rounded-2xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-bold text-secondary-foreground">Recent Attendance</CardTitle>
                  <div className="bg-secondary/30 p-2 rounded-xl">
                    <BarChart3 className="h-5 w-5 text-secondary-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-secondary-foreground">{attendance.length}</div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

              {/* Left Column: Classes Management */}
              <div className="lg:col-span-5 space-y-8">

                {/* Create Class Form */}
                <Card className="rounded-2xl shadow-sm border-border/50">
                  <CardHeader>
                    <CardTitle className="text-xl">Create New Class</CardTitle>
                    <CardDescription>Add a new class to start tracking attendance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCreateClass} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="class_name" className="text-sm font-semibold">Class Name</Label>
                        <Input
                          id="class_name"
                          value={newClass.class_name}
                          onChange={(e) => setNewClass({ ...newClass, class_name: e.target.value })}
                          required
                          className="bg-muted/50 focus:bg-background transition-colors"
                          placeholder="e.g., Introduction to Computer Science"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-semibold">Description (Optional)</Label>
                        <Textarea
                          id="description"
                          value={newClass.description}
                          onChange={(e) => setNewClass({ ...newClass, description: e.target.value })}
                          className="bg-muted/50 focus:bg-background transition-colors resize-none"
                          rows={3}
                          placeholder="Brief description of the course..."
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full font-semibold"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        {loading ? 'Creating...' : 'Create Class'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Class List */}
                <Card className="rounded-2xl shadow-sm border-border/50">
                  <CardHeader>
                    <CardTitle className="text-xl">Your Classes</CardTitle>
                    <CardDescription>Manage and generate QR codes for your classes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {classes.length === 0 ? (
                      <div className="text-center py-8 bg-muted/30 rounded-xl border border-dashed border-border">
                        <BookOpen className="w-8 h-8 text-muted-foreground/50 mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground font-medium">No classes found.<br />Create one to get started.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {classes.map((cls) => (
                          <div
                            key={cls.id}
                            className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-all ${selectedClass === cls.id ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'border-border/50 bg-card hover:border-primary/30'
                              }`}
                          >
                            <div
                              className="flex-1 cursor-pointer mb-3 sm:mb-0"
                              onClick={() => setSelectedClass(cls.id)}
                            >
                              <h3 className="font-semibold text-foreground line-clamp-1">{cls.class_name}</h3>
                              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                                Code: <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">{cls.class_code}</span>
                              </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <Button
                                size="sm"
                                variant="secondary"
                                className="font-medium shadow-sm w-full sm:w-auto"
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent selecting the class row if clicked
                                  openQRModal(cls);
                                }}
                              >
                                <QrCode className="w-4 h-4 mr-2" />
                                Generate QR
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteClass(cls.id);
                                }}
                                aria-label="Delete class"
                                title="Delete class"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column: Attendance Tracking */}
              <div className="lg:col-span-7">
                <Card className="rounded-2xl shadow-sm border-border/50 h-full flex flex-col">
                  <CardHeader className="border-b border-border/40 pb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <CardTitle className="text-xl">Attendance Records</CardTitle>
                        <CardDescription>
                          View and manage student check-ins
                        </CardDescription>
                      </div>

                      <Button
                        variant="outline"
                        onClick={exportAttendanceToExcel}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export Excel
                      </Button>
                      <div className="flex flex-col sm:flex-row gap-3">

                        <Input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-full sm:w-auto"
                        />

                        <div className="w-full sm:w-64">
                          <Select onValueChange={setSelectedClass} value={selectedClass || ''}>
                            <SelectTrigger className="w-full bg-muted/50">
                              <SelectValue placeholder="Select a class..." />
                            </SelectTrigger>

                            <SelectContent>
                              {classes.map((cls) => (
                                <SelectItem key={cls.id} value={cls.id}>
                                  {cls.class_name}
                                </SelectItem>
                              ))}
                            </SelectContent>

                          </Select>
                        </div>

                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 p-0">
                    {!selectedClass ? (
                      <div className="flex flex-col items-center justify-center h-64 text-center px-4">
                        <div className="bg-muted/50 p-4 rounded-full mb-4">
                          <BarChart3 className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="font-semibold text-lg text-foreground mb-1">No Class Selected</h3>
                        <p className="text-muted-foreground max-w-sm">Select a class from the dropdown or click on a class card to view its attendance history.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader className="bg-muted/30">
                            <TableRow className="hover:bg-transparent border-border/40">
                              <TableHead className="font-semibold text-foreground py-4 px-6">College ID</TableHead>
                              <TableHead className="font-semibold text-foreground py-4 px-6">Student Name</TableHead>
                              <TableHead className="font-semibold text-foreground py-4 px-6">Date & Time</TableHead>
                              <TableHead className="font-semibold text-foreground py-4 px-6 text-right">Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {attendance.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={4} className="h-48 text-center">
                                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                                    <p className="font-medium">No records found</p>
                                    <p className="text-sm mt-1">Students haven't checked into this class yet.</p>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ) : (
                              filteredAttendance.map((record) => (
                                <TableRow key={record.id} className="border-border/40">
                                  <TableCell className="py-4 px-6 font-medium text-foreground">
                                    {record.expand?.student_id?.college_id || 'N/A'}
                                  </TableCell>
                                  <TableCell className="py-4 px-6 font-medium text-foreground">
                                    {
                                      record.expand?.student_id?.name ||
                                      record.expand?.student_id?.username ||
                                      record.expand?.student_id?.email ||
                                      'Unknown Student'
                                    }
                                  </TableCell>
                                  <TableCell className="py-4 px-6 text-muted-foreground text-sm">
                                    {format(new Date(record.timestamp), 'MMM dd, yyyy • hh:mm a')}
                                  </TableCell>
                                  <TableCell className="py-4 px-6 text-right">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${record.status === 'Present' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                      record.status === 'Late' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                                        'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400'
                                      }`}>
                                      {record.status}
                                    </span>
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

            </div>
          </div>
        </main>

        {/* QR Code Generation Modal */}
        <Dialog open={showQR} onOpenChange={setShowQR}>
          <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-2xl border-none">
            <div className="bg-primary/5 p-6 border-b border-border/40 text-center">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-foreground">Class QR Code</DialogTitle>
                <DialogDescription className="text-base mt-1">
                  {qrClass?.class_name}
                </DialogDescription>
              </DialogHeader>
            </div>

            {qrClass && (
              <div className="p-8 flex flex-col items-center bg-card">
                {/* QR Code Display Area */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-border/40 mb-8">
                  <QRCodeSVG
                    id="qr-code-svg"
                    value={activeSession ? JSON.stringify(activeSession) : ""}
                    size={220}
                    level="H"
                    includeMargin={false}
                    className="text-foreground"
                  />
                </div>

                {/* Fallback Code */}
                <div className="w-full text-center bg-muted/40 p-4 rounded-xl border border-border/50 mb-6">
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">Manual Entry Code</p>
                  <p className="font-mono text-3xl font-bold text-foreground tracking-widest select-all">
                    {qrClass.class_code}
                  </p>
                </div>

                <Button
                  onClick={downloadQRCode}
                  className="w-full font-semibold shadow-sm"
                  size="lg"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download QR Code Image
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Footer />
      </div>
    </>
  );
};

export default TeacherDashboard;