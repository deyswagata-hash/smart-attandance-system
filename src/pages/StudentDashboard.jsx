import jsQR from "jsqr";
import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '../components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table.jsx';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext.jsx';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import pb from '../lib/pocketbaseClient.js';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, CameraOff, User, Mail, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const StudentDashboard = () => {
  const { currentUser } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [scanner, setScanner] = useState(null);
  const scannerRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  useEffect(() => {
    fetchAttendance();
    return () => {
      if (scanner) {
        scanner.stop().catch(console.error);
      }
    };
  }, []);

  const fetchAttendance = async () => {
    try {
      const records = await pb.collection('attendance').getFullList({
        filter: `student_id="${currentUser.id}"`,
        expand: 'class_id',
        sort: '-timestamp',
        $autoCancel: false
      });
      setAttendance(records);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      toast.error('Failed to load attendance history');
    }
  };

  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });

      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      setScanning(true);
      scanQRCode();
    } catch (err) {
      console.error(err);
      toast.error("Camera error");
    }
  };
  const scanQRCode = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const interval = setInterval(() => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;

        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );

        const code = jsQR(imageData.data, canvas.width, canvas.height);

        if (code) {
          clearInterval(interval);
          onScanSuccess(code.data);
        }
      }
    }, 500);
  };
  const stopScanning = () => {
    const video = videoRef.current;
    const stream = video?.srcObject;

    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    setScanning(false);
  };

 const onScanSuccess = async (decodedText) => {
  await stopScanning();

  try {
    console.log("Scanned QR:", decodedText);

    // Convert QR string into object
    const qrData = JSON.parse(decodedText);

    console.log("Parsed QR:", qrData);

    // Extract actual class code
    const classCode = qrData.classCode.trim();

    console.log("Searching class code:", classCode);

    // Find class
    const classRecord = await pb.collection('classes').getOne(
  qrData.classId,
  { $autoCancel: false }
);

    console.log("Class found:", classRecord);

    // Mark attendance
    await pb.collection('attendance').create({
      student_id: currentUser.id,
      class_id: classRecord.id,
      timestamp: new Date().toISOString(),
      status: 'present'
    });

    toast.success(`Attendance marked for ${classRecord.class_name}`);

    fetchAttendance();

  } catch (error) {
    console.error('Error marking attendance:', error);

    if (error instanceof SyntaxError) {
      toast.error('Invalid QR format');
    } else {
      toast.error('Failed to mark attendance');
    }
  }
};

  const onScanError = (error) => {
    // Ignore scan errors (they happen frequently during scanning)
  };

  return (
    <>
      <Helmet>
        <title>Student Dashboard - QR Attendance System</title>
        <meta name="description" content="Scan QR codes and view your attendance history" />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />

        <main className="flex-1 py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
              <h1 className="text-4xl font-bold mb-3 text-foreground">Student Dashboard</h1>
              <p className="text-xl text-foreground/60 font-medium">Welcome back, {currentUser?.name}!</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-8">
                <Card className="rounded-[2rem] shadow-sm border-border/50 bg-primary/10">
                  <CardHeader>
                    <CardTitle className="text-2xl">QR code scanner</CardTitle>
                    <CardDescription className="text-base">Scan your class QR code to mark attendance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <video
                          ref={videoRef}
                          className={`w-full rounded-2xl border border-border shadow-sm bg-card ${scanning ? "block" : "hidden"
                            }`}
                        />

                        <canvas ref={canvasRef} className="hidden" />
                      </div>

                      {!scanning && (
                        <div className="bg-card rounded-2xl p-12 text-center border border-border shadow-sm">
                          <div className="bg-primary/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Camera className="w-10 h-10 text-primary-foreground" />
                          </div>
                          <p className="text-foreground/70 font-medium text-lg mb-2">Ready to check in?</p>
                          <p className="text-foreground/50 text-sm">Click the button below to start scanning</p>
                        </div>
                      )}

                      <Button
                        onClick={scanning ? stopScanning : startScanning}
                        className={`w-full py-6 text-lg font-bold rounded-xl ${scanning ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}
                      >
                        {scanning ? (
                          <>
                            <CameraOff className="w-5 h-5 mr-2" />
                            Stop scanning
                          </>
                        ) : (
                          <>
                            <Camera className="w-5 h-5 mr-2" />
                            Start scanning
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-[2rem] shadow-sm border-border/50">
                  <CardHeader>
                    <CardTitle className="text-2xl">Your profile</CardTitle>
                    <CardDescription className="text-base">Your account information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-muted rounded-2xl border border-border">
                      <div className="bg-background p-3 rounded-xl shadow-sm border border-border">
                        <User className="w-6 h-6 text-foreground/70" />
                      </div>
                      <div>
                        <p className="text-sm text-foreground/60 font-medium">Name</p>
                        <p className="font-bold text-lg">{currentUser?.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-muted rounded-2xl border border-border">
                      <div className="bg-background p-3 rounded-xl shadow-sm border border-border">
                        <Mail className="w-6 h-6 text-foreground/70" />
                      </div>
                      <div>
                        <p className="text-sm text-foreground/60 font-medium">Email</p>
                        <p className="font-bold text-lg">{currentUser?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-muted rounded-2xl border border-border">
                      <div className="bg-background p-3 rounded-xl shadow-sm border border-border">
                        <Calendar className="w-6 h-6 text-foreground/70" />
                      </div>
                      <div>
                        <p className="text-sm text-foreground/60 font-medium">Total attendance</p>
                        <p className="font-bold text-lg">{attendance.length} records</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="rounded-[2rem] shadow-sm border-border/50">
                <CardHeader>
                  <CardTitle className="text-2xl">Attendance history</CardTitle>
                  <CardDescription className="text-base">Your recent attendance records</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border border-border rounded-2xl overflow-hidden bg-card">
                    <Table>
                      <TableHeader className="bg-muted">
                        <TableRow>
                          <TableHead className="font-bold text-foreground">Class</TableHead>
                          <TableHead className="font-bold text-foreground">Date</TableHead>
                          <TableHead className="font-bold text-foreground">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {attendance.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center text-foreground/60 py-10 font-medium text-lg">
                              No attendance records yet. Scan a QR code to get started.
                            </TableCell>
                          </TableRow>
                        ) : (
                          attendance.map((record) => (
                            <TableRow key={record.id}>
                              <TableCell className="font-bold text-base">
                                {record.expand?.class_id?.class_name || 'Unknown Class'}
                              </TableCell>
                              <TableCell className="text-foreground/80 font-medium">{format(new Date(record.timestamp), 'MMM dd, yyyy HH:mm')}</TableCell>
                              <TableCell>
                                <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-bold ${record.status === 'Present' ? 'bg-muted text-muted-foreground' :
                                  record.status === 'Late' ? 'bg-secondary text-secondary-foreground' :
                                    'bg-destructive/20 text-destructive'
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
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default StudentDashboard;