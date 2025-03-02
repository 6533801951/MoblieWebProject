const { Alert, Card, Button, Table, Form, Row, Col, Container } = ReactBootstrap;

const firebaseConfig = {
    apiKey: "AIzaSyDPfU2pqROLqgf5Fo4gekzY0-ycyG_3iI0",
    authDomain: "mobliewebproject.firebaseapp.com",
    projectId: "mobliewebproject",
    storageBucket: "mobliewebproject.firebasestorage.app",
    messagingSenderId: "16500471511",
    appId: "1:16500471511:web:eed3142ca86deaf3ce6292",
    measurementId: "G-5SEG550KEX"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function LandingPage({ onLogin }) {
    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            backgroundColor: "#8fd4f9"
        }}>
            <div style={{
                background: "white",
                padding: "40px",
                borderRadius: "12px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                textAlign: "center",
                maxWidth: "400px"
            }}>
                <h2 style={{ color: "#333", marginBottom: "15px" }}>ระบบจัดการห้องเรียนของอาจารย์</h2>
                <p style={{ color: "#666", marginBottom: "20px" }}>กรุณาเข้าสู่ระบบเพื่อจัดการรายวิชา</p>
                <Button
                    variant="light"
                    onClick={onLogin}
                    style={{
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid #ddd",
                        padding: "10px 20px",
                        borderRadius: "8px",
                        fontSize: "16px",
                        fontWeight: "bold",
                        color: "#444",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = "#f0f0f0"}
                    onMouseOut={(e) => e.target.style.backgroundColor = "white"}
                >
                    <img
                        src="https://w7.pngwing.com/pngs/882/225/png-transparent-google-logo-google-logo-google-search-icon-google-text-logo-business-thumbnail.png"
                        alt="Google Logo"
                        width="24"
                        height="24"
                        style={{ marginRight: "10px" }}
                    />
                    เข้าสู่ระบบด้วย Google
                </Button>
            </div>
        </div>
    );
}

function EditProfile({ user, app }) {
    // ตรวจสอบว่ามี user หรือไม่
    if (!user) {
        return <p>กำลังโหลดข้อมูล...</p>;
    }

    const [name, setName] = React.useState(user.displayName || "");
    const [photoURL, setPhotoURL] = React.useState(user.photoURL || "");

    const handleSave = async () => {
        if (!name.trim()) {
            alert("กรุณากรอกชื่อ");
            return;
        }

        try {
            const userRef = db.collection("users").doc(user.uid);

            // อัปเดตข้อมูลใน Firestore
            await userRef.set({ name, photoURL }, { merge: true });

            // อัปเดตข้อมูลใน Firebase Authentication
            await firebase.auth().currentUser.updateProfile({ displayName: name, photoURL: photoURL || "" });

            // ดึงข้อมูลใหม่จาก Firestore
            const updatedDoc = await userRef.get();
            const updatedUserData = updatedDoc.data();

            // อัปเดต state ของ App
            app.setState({ user: { ...app.state.user, displayName: updatedUserData.name, photoURL: updatedUserData.photoURL }, scene: "dashboard" });

            alert("อัปเดตโปรไฟล์สำเร็จ!");

        } catch (error) {
            console.error("เกิดข้อผิดพลาด:", error);
            alert("เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์");
        }
    };

    return (
        <Card className="mt-3">
            <Card.Header><h4>แก้ไขโปรไฟล์</h4></Card.Header>
            <Card.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>ชื่อ</Form.Label>
                        <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" value={user.email} disabled />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>URL รูปภาพ</Form.Label>
                        <Form.Control type="text" value={photoURL} onChange={(e) => setPhotoURL(e.target.value)} />
                    </Form.Group>

                    <Button variant="success" onClick={handleSave}>บันทึก</Button>{' '}
                    <Button variant="secondary" onClick={() => app.setState({ scene: "dashboard" })}>ยกเลิก</Button>
                </Form>
            </Card.Body>
        </Card>
    );
}

function AllCourses({ data, app }) {
    console.log("Data received:", data);
    return (
        <Container>
            <Row>
                {data.length > 0 ? (
                    data.map((c) => (
                        <Col key={c.id} md={4} className="mb-4">
                            <Card className="h-100 shadow-sm">
                                <Card.Img variant="top" src={c.info.photo} alt="Subject" />
                                <Card.Body>
                                    <Card.Title>{c.info.name}</Card.Title>
                                    <Card.Text>
                                        <strong>รหัสวิชา:</strong> {c.info.code} <br />
                                        <strong>ห้องเรียน:</strong> {c.info.room}
                                    </Card.Text>
                                </Card.Body>
                                <Card.Footer className="text-center">
                                    <Button variant="warning" onClick={() => app.manageCourse(c)} className="me-2">จัดการ</Button>
                                    <Button variant="danger" onClick={() => app.delete(c)}>ลบ</Button>
                                </Card.Footer>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <Col className="text-center">
                        <p>ไม่มีข้อมูลรายวิชา</p>
                    </Col>
                )}
            </Row>
        </Container>
    );
}
function AddSubject({ user, app }) {
    const [subjectCode, setSubjectCode] = React.useState("");
    const [subjectName, setSubjectName] = React.useState("");
    const [roomName, setRoomName] = React.useState("");
    const [photoURL, setPhotoURL] = React.useState("");

    const handleSave = async () => {
        if (!subjectCode || !subjectName || !roomName) {
            alert("กรุณากรอกให้ครบทุกช่อง");
            return;
        }
        const cid = await addClassroom(user.uid, subjectCode, subjectName, roomName, photoURL);
        alert("เพิ่มรายวิชาสำเร็จ");
        app.setState({ scene: "dashboard" });
        app.readData(); // Reload course list
    };

    return (
        <Card>
            <Card.Header><h4>เพิ่มวิชา</h4></Card.Header>
            <Card.Body>
                <label>รหัสวิชา</label>
                <input type="text" value={subjectCode} onChange={(e) => setSubjectCode(e.target.value)} className="form-control" />

                <label>ชื่อวิชา</label>
                <input type="text" value={subjectName} onChange={(e) => setSubjectName(e.target.value)} className="form-control" />

                <label>ห้องที่สอน</label>
                <input type="text" value={roomName} onChange={(e) => setRoomName(e.target.value)} className="form-control" />

                <label>รูปภาพ</label>
                <input type="text" value={photoURL} onChange={(e) => setPhotoURL(e.target.value)} className="form-control" />

                <Button variant="success" onClick={handleSave} className="mt-3">บันทึกวิชา</Button>{' '}
                <Button variant="secondary" onClick={() => app.setState({ scene: "dashboard" })} className="mt-3">ยกเลิก</Button>
            </Card.Body>
        </Card>
    );
}

async function addClassroom(uid, code, name, room, photoURL) {
    const cid = db.collection("classroom").doc().id;
    const classroomData = {
        owner: uid,
        info: { code, name, room, photo: photoURL || "" }
    };
    await db.collection(`classroom`).doc(cid).set(classroomData);
    await db.collection(`users/${uid}/classroom`).doc(cid).set({ status: 1 });
    return cid;
}

function ManagaCourse({ course, app }) {
    const [tab, setTab] = React.useState("details");

    return (
        <Card>
            <Card.Header>
                <h4>จัดการรายวิชา: {course.info.name}</h4>
                <Button variant="secondary" onClick={() => app.setState({ scene: "dashboard" })}>ย้อนกลับ</Button>
            </Card.Header>

            <Card.Body>
                <nav className="nav nav-tabs">
                    <a className={`nav-link ${tab === "details" ? "active" : ""}`} onClick={() => setTab("details")}>รายละเอียด</a>
                    <a className={`nav-link ${tab === "qrcode" ? "active" : ""}`} onClick={() => setTab("qrcode")}>QR Code</a>
                    <a className={`nav-link ${tab === "students" ? "active" : ""}`} onClick={() => setTab("students")}>นักเรียน</a>
                    <a className={`nav-link ${tab === "CheckinList" ? "active" : ""}`} onClick={() => setTab("CheckinList")}>เช็คชื่อ</a>
                </nav>

                <div className="mt-3">
                    {tab === "details" && <CourseDetails course={course} />}
                    {tab === "qrcode" && <CourseQRCode cid={course.id} />}
                    {tab === "students" && <StudentList cid={course.id} />}
                    {tab === "CheckinList" && <CheckinList cid={course.id} />}
                </div>
            </Card.Body>
        </Card>
    );
}
function CourseDetails({ course }) {
    return (
        <Container className="mt-4">
            <Row className="align-items-center">
                <Col md={6}>
                    <h5>รหัสวิชา: {course.info.code}</h5>
                    <h5>ชื่อวิชา: {course.info.name}</h5>
                    <h5>ห้องที่สอน: {course.info.room}</h5>
                </Col>
                <Col md={6} className="text-center">
                    <img
                        src={course.info.photo}
                        alt="Subject Image"
                        width="100%"
                        style={{ maxWidth: "400px", borderRadius: "10px" }}
                    />
                </Col>
            </Row>
        </Container>
    );
}
function CourseQRCode({ cid }) {
    return (
        <div className="text-center">
            <h5>QR Code สำหรับเข้าร่วม</h5>
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${cid}`} alt="QR Code" />
        </div>
    );
}
function StudentList({ cid }) {
    const [students, setStudents] = React.useState([]);

    React.useEffect(() => {
        db.collection(`classroom/${cid}/students`).get().then((querySnapshot) => {
            setStudents(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
    }, [cid]);

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>ลำดับ</th>
                    <th>รหัส</th>
                    <th>ชื่อ</th>
                    <th>รูปภาพ</th>
                    <th>สถานะ</th>
                </tr>
            </thead>
            <tbody>
                {students.map((s, index) => (
                    <tr key={s.id}>
                        <td>{index + 1}</td>
                        <td>{s.stdid}</td>
                        <td>{s.name}</td>
                        <td><img src={s.photo} alt="Student" width="50" /></td>
                        <td>{s.status}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}
function CheckinList({ cid }) {
    const [tableData, setTableData] = React.useState([]);
    const [showAddCheckinForm, setShowAddCheckinForm] = React.useState(false);

    // ดึงข้อมูลการเช็คชื่อ
    const fetchCheckinData = async () => {
        const checkinSnapshot = await db.collection(`classroom/${cid}/checkin`).get();
        const data = [];

        for (const doc of checkinSnapshot.docs) {
            const checkinData = doc.data();
            const cno = parseInt(doc.id); // แปลง cno เป็นตัวเลข
            const timestamp = checkinData.timestamp.toDate().toLocaleString();

            // ดึงข้อมูลนักเรียนจาก collection students
            const studentsSnapshot = await db.collection(`classroom/${cid}/checkin/${cno}/students`).get();
            const totalStudents = studentsSnapshot.size;
            const checkedInCount = studentsSnapshot.docs.filter(doc => doc.data().status === 1).length;
            let status = 0;

            if (checkedInCount > 0 && checkedInCount < totalStudents) {
                status = 1;
            } else if (checkedInCount === totalStudents) {
                status = 2;
            }

            data.push({ cno, timestamp, totalStudents, status, code: checkinData.code, date: checkinData.date });
        }

        // เรียงลำดับข้อมูลตาม cno จากน้อยไปมาก
        data.sort((a, b) => a.cno - b.cno);
        setTableData(data);
    };

    React.useEffect(() => {
        fetchCheckinData();
    }, [cid]);

    return (
        <div>
            <Button variant="success" onClick={() => setShowAddCheckinForm(true)}>เพิ่มการเช็คชื่อ</Button>
            {showAddCheckinForm && (
                <AddCheckinForm
                    cid={cid}
                    fetchCheckinData={fetchCheckinData}
                    onCancel={() => setShowAddCheckinForm(false)}
                />
            )}

            <h5>ประวัติการเช็คชื่อ</h5>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ลำดับ</th>
                        <th>รหัสเช็คชื่อ</th>
                        <th>วันเวลาที่เรียน</th>
                        <th>วัน-เวลาที่สร้าง</th>
                        <th>จำนวนคนเข้าเรียน</th>
                        <th>สถานะ</th>
                        <th>จัดการ</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((c) => (
                        <tr key={c.cno}>
                            <td>{c.cno}</td>
                            <td>{c.code}</td>
                            <td>{c.date}</td>
                            <td>{c.timestamp}</td>
                            <td>{c.totalStudents}</td>
                            <td>
                                {c.status === 0 ? "ยังไม่เริ่ม" : 
                                 c.status === 1 ? "กำลังเช็คชื่อ" : "เสร็จแล้ว"}
                            </td>
                            <td>
                                <Button variant="info" onClick={() => viewCheckinDetails(cid, c.cno)}>ดูรายละเอียด</Button>{' '}
                                <Button variant="danger" onClick={() => deleteCheckin(cid, c.cno, fetchCheckinData)}>ลบ</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}
function AddCheckinForm({ cid, fetchCheckinData, onCancel }) {
    const [code, setCode] = React.useState(""); // รหัสเช็คชื่อ
    const [date, setDate] = React.useState(""); // วันเวลาที่เรียน

    const handleSave = async () => {
        if (!code.trim() || !date.trim()) {
            alert("กรุณากรอกข้อมูลให้ครบถ้วน");
            return;
        }

        try {
            // ดึงข้อมูลการเช็คชื่อที่มีอยู่ทั้งหมด
            const checkinSnapshot = await db.collection(`classroom/${cid}/checkin`).get();
            const cno = checkinSnapshot.size + 1; // คำนวณ cno เป็น i + 1

            // ดึงข้อมูลนักเรียนทั้งหมด
            const studentsSnapshot = await db.collection(`classroom/${cid}/students`).get();

            // สร้างข้อมูลการเช็คชื่อ
            const checkinData = {
                cno, // ลำดับการเช็คชื่อ (i + 1)
                code, // รหัสเช็คชื่อ
                date, // วันเวลาที่เรียน
                timestamp: new Date(), // เวลาที่สร้างการเช็คชื่อ
            };

            // บันทึกข้อมูลการเช็คชื่อลงใน Firestore
            await db.collection(`classroom/${cid}/checkin`).doc(cno.toString()).set(checkinData);

            // สร้าง collection students สำหรับการเช็คชื่อนี้
            const studentsCollectionRef = db.collection(`classroom/${cid}/checkin/${cno}/students`);

            // เพิ่มข้อมูลนักเรียนลงใน collection students
            studentsSnapshot.forEach(async (doc) => {
                const studentData = doc.data();
                await studentsCollectionRef.doc(doc.id).set({
                    stdid: studentData.stdid, // รหัสนักเรียน
                    name: studentData.name, // ชื่อนักเรียน
                    status: 0 // 0 = ไม่ได้เช็คชื่อ, 1 = เช็คชื่อแล้ว
                });
            });

            // อัปเดตข้อมูลการเช็คชื่อ
            fetchCheckinData();

            // ปิดฟอร์มหลังจากบันทึกสำเร็จ
            onCancel();

            alert("เพิ่มการเช็คชื่อสำเร็จ");
        } catch (error) {
            console.error("เกิดข้อผิดพลาด:", error);
            alert("เกิดข้อผิดพลาดในการเพิ่มการเช็คชื่อ");
        }
    };

    return (
        <Card>
            <Card.Header><h4>เพิ่มการเช็คชื่อ</h4></Card.Header>
            <Card.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>รหัสเช็คชื่อ</Form.Label>
                        <Form.Control
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="กรอกรหัสเช็คชื่อ เช่น ABC123"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>วันเวลาที่เรียน</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </Form.Group>

                    <Button variant="success" onClick={handleSave}>บันทึก</Button>{' '}
                    <Button variant="secondary" onClick={onCancel}>ยกเลิก</Button>
                </Form>
            </Card.Body>
        </Card>
    );
}
async function viewCheckinDetails(cid, cno) {
    const checkinDoc = await db.collection(`classroom/${cid}/checkin`).doc(cno.toString()).get();
    const checkinData = checkinDoc.data();
    console.log("รายละเอียดการเช็คชื่อ:", checkinData);
}

async function deleteCheckin(cid, cno, fetchCheckinData) {
    if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบการเช็คชื่อนี้?")) {
        await db.collection(`classroom/${cid}/checkin`).doc(cno.toString()).delete();
        const studentsCollectionRef = db.collection(`classroom/${cid}/checkin/${cno}/students`);
        const studentsSnapshot = await studentsCollectionRef.get();
        studentsSnapshot.forEach(async (doc) => {
            await doc.ref.delete();
        });

        // อัปเดตข้อมูลการเช็คชื่อ
        fetchCheckinData();
    }
}
class App extends React.Component {
    state = {
        scene: "dashboard",
        courses: [],
        user: null,
        currentCourse: null,
    };

    constructor() {
        super();
        firebase.auth().onAuthStateChanged(async (user) => {
            if (user) {
                this.setState({ user: user.toJSON() });
                const userRef = db.collection("users").doc(user.uid);
                const doc = await userRef.get();

                if (!doc.exists) {
                    // สร้างบัญชีผู้ใช้ใหม่ใน Firestore
                    await userRef.set({
                        name: user.displayName,
                        email: user.email,
                        photoURL: user.photoURL,
                    });
                }

                this.readData();
            } else {
                this.setState({ user: null, courses: [], scene: "dashboard" });
            }
        });
    }
    google_login = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" }); // บังคับเลือกบัญชีใหม่ทุกครั้ง
        firebase.auth().signInWithPopup(provider);
        this.setState({ user });
    };

    google_logout = () => {
        if (window.confirm("ต้องการออกจากระบบ?")) {
            firebase.auth().signOut().then(() => {
                this.setState({ user: null });
                window.localStorage.removeItem("firebase:authUser");
                window.sessionStorage.clear();
                window.location.reload();
            });
        }
    };
    readData = () => {
        if (!this.state.user) return;
        db.collection("classroom")
            .where("owner", "==", this.state.user.uid)
            .get()
            .then((querySnapshot) => {
                this.setState({
                    courses: querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                });
            })
            .catch((error) => {
                console.error("Error fetching courses:", error);
            });
    };
    delete = (course) => {
        if (window.confirm("ต้องการลบข้อมูลนี้ใช่มั้ย")) {
            db.collection("users").doc(this.state.user.uid).collection("classroom").doc(course.id).delete()
                .then(() => {
                    return db.collection("classroom").doc(course.id).delete();
                })
                .then(() => {
                    this.readData();
                })
                .catch(error => {
                    console.error("Error removing document: ", error);
                });
        }
    };
    manageCourse = (course) => {
        this.setState({ currentCourse: course, scene: "manageCourse" });
    };
    render() {
        if (!this.state.user) return <LandingPage onLogin={this.google_login} />;

        return (
            <Container fluid className="vh-100">
                <Row className="h-100">
                    <Col md={3} className="sidebar py-4 px-3 text-white" style={{ backgroundColor: "#8fd4f9" }}>
                        <div className="text-center mb-4 p-2 shadow rounded" style={{ backgroundColor: "white", color: "black" }}>
                            <img src={this.state.user.photoURL} alt="Profile" width="90" className="rounded-circle mb-2" />
                            <h5 className="fw-bold">{this.state.user.displayName}</h5>
                            <p>{this.state.user.email}</p>
                        </div>
                        <nav className="d-flex flex-column">
                            <div
                                className="menu-item py-3 px-4 text-white fw-bold"
                                style={{
                                    cursor: "pointer",
                                    backgroundColor: "#3498db",
                                    borderRadius: "10px",
                                    marginBottom: "10px",
                                    transition: "background-color 0.3s ease"
                                }}
                                onClick={() => this.setState({ scene: "addSubject" })}
                                onMouseEnter={(e) => e.target.style.backgroundColor = "#2980b9"}  // เปลี่ยนสีเมื่อ hover
                                onMouseLeave={(e) => e.target.style.backgroundColor = "#3498db"}  // กลับเป็นสีเดิม
                            >
                                ➕ เพิ่มวิชา
                            </div>
                            <div
                                className="menu-item py-3 px-4 text-white fw-bold"
                                style={{
                                    cursor: "pointer",
                                    backgroundColor: "#2980b9",
                                    borderRadius: "10px",
                                    marginBottom: "10px",
                                    transition: "background-color 0.3s ease"
                                }}
                                onClick={() => this.setState({ scene: "editProfile" })}
                                onMouseEnter={(e) => e.target.style.backgroundColor = "#1f6690"}
                                onMouseLeave={(e) => e.target.style.backgroundColor = "#2980b9"}
                            >
                                ✏️ แก้ไขโปรไฟล์
                            </div>
                            <div
                                className="menu-item py-3 px-4 text-white fw-bold"
                                style={{
                                    cursor: "pointer",
                                    backgroundColor: "#e74c3c",
                                    borderRadius: "10px",
                                    transition: "background-color 0.3s ease"
                                }}
                                onClick={this.google_logout}
                                onMouseEnter={(e) => e.target.style.backgroundColor = "#c0392b"}
                                onMouseLeave={(e) => e.target.style.backgroundColor = "#e74c3c"}
                            >
                                🚪 ออกจากระบบ
                            </div>
                        </nav>
                    </Col>

                    <Col md={9} className="p-4">
                        <Card className="w-100">
                            <Card.Body>
                                {this.state.scene === "addSubject" ? (
                                    <AddSubject user={this.state.user} app={this} />
                                ) : this.state.scene === "editProfile" ? (
                                    <EditProfile user={this.state.user} app={this} />
                                ) : this.state.scene === "manageCourse" ? (
                                    <ManagaCourse course={this.state.currentCourse} app={this} />
                                ) : (
                                    <AllCourses data={this.state.courses} app={this} />
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }
}

const root = ReactDOM.createRoot(document.getElementById("myapp"));
root.render(<App />); 
