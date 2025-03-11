const { Alert, Card, Button, Table, Form, Row, Col, Container } = ReactBootstrap;

const firebaseConfig = {
    apiKey: "AIzaSyDPfU2pqROLqgf5Fo4gekzY0-ycyG_3iI0",
    authDomain: "mobliewebproject.firebaseapp.com",
    projectId: "mobliewebproject",
    storageBucket: "mobliewebproject.appspot.com",
    messagingSenderId: "16500471511",
    appId: "1:16500471511:web:eed3142ca86deaf3ce6292",
    measurementId: "G-5SEG550KEX"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Landing Page Component
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

// Edit Profile Component
function EditProfile({ user, app }) {
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
            await userRef.set({ name, photoURL }, { merge: true });
            await firebase.auth().currentUser.updateProfile({ displayName: name, photoURL: photoURL || "" });

            const updatedDoc = await userRef.get();
            const updatedUserData = updatedDoc.data();
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

// All Courses Component
function AllCourses({ data, app }) {
    return (
        <Container>
            <Row>
                {data.length > 0 ? (
                    data.map((course) => (
                        <Col key={course.id} md={4} className="mb-4">
                            <Card className="h-100 shadow-sm">
                                <Card.Img variant="top" src={course.info.photo} alt="Subject" />
                                <Card.Body>
                                    <Card.Title>{course.info.name}</Card.Title>
                                    <Card.Text>
                                        <strong>รหัสวิชา:</strong> {course.info.code} <br />
                                        <strong>ห้องเรียน:</strong> {course.info.room}
                                    </Card.Text>
                                </Card.Body>
                                <Card.Footer className="text-center">
                                    <Button variant="warning" onClick={() => app.manageCourse(course)} className="me-2">จัดการ</Button>
                                    <Button variant="danger" onClick={() => app.delete(course)}>ลบ</Button>
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

// Add Subject Component
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
        app.readData();
    };

    return (
        <Card>
            <Card.Header><h4>เพิ่มวิชา</h4></Card.Header>
            <Card.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>รหัสวิชา</Form.Label>
                        <Form.Control type="text" value={subjectCode} onChange={(e) => setSubjectCode(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>ชื่อวิชา</Form.Label>
                        <Form.Control type="text" value={subjectName} onChange={(e) => setSubjectName(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>ห้องที่สอน</Form.Label>
                        <Form.Control type="text" value={roomName} onChange={(e) => setRoomName(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>รูปภาพ</Form.Label>
                        <Form.Control type="text" value={photoURL} onChange={(e) => setPhotoURL(e.target.value)} />
                    </Form.Group>

                    <Button variant="success" onClick={handleSave} className="mt-3">บันทึกวิชา</Button>{' '}
                    <Button variant="secondary" onClick={() => app.setState({ scene: "dashboard" })} className="mt-3">ยกเลิก</Button>
                </Form>
            </Card.Body>
        </Card>
    );
}

// Add Classroom Function
async function addClassroom(uid, code, name, room, photoURL) {
    const cid = db.collection("classroom").doc().id;
    const classroomData = {
        owner: uid,
        info: { code, name, room, photo: photoURL || "" }
    };
    await db.collection("classroom").doc(cid).set(classroomData);
    await db.collection(`users/${uid}/classroom`).doc(cid).set({ status: 1 });
    return cid;
}

// Manage Course Component
function ManageCourse({ course, app }) {
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
                    <a className={`nav-link ${tab === "checkinList" ? "active" : ""}`} onClick={() => setTab("checkinList")}>เช็คชื่อ</a>
                </nav>

                <div className="mt-3">
                    {tab === "details" && <CourseDetails course={course} />}
                    {tab === "qrcode" && <CourseQRCode cid={course.id} />}
                    {tab === "students" && <StudentList cid={course.id} />}
                    {tab === "checkinList" && <CheckinList cid={course.id} />}
                </div>
            </Card.Body>
        </Card>
    );
}

// Course Details Component
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

// Course QR Code Component
function CourseQRCode({ cid }) {
    return (
        <div className="text-center">
            <h5>QR Code สำหรับเข้าร่วม</h5>
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${cid}`} alt="QR Code" />
        </div>
    );
}

// Student List Component
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
                </tr>
            </thead>
            <tbody>
                {students.map((student, index) => (
                    <tr key={student.id}>
                        <td>{index + 1}</td>
                        <td>{student.stdid}</td>
                        <td>{student.name}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}

// Checkin List Component
function CheckinList({ cid }) {
    const [tableData, setTableData] = React.useState([]);
    const [showAddCheckinForm, setShowAddCheckinForm] = React.useState(false);
    const [manageCheckinCno, setManageCheckinCno] = React.useState(null);

    React.useEffect(() => {
        const checkinRef = db.collection(`classroom/${cid}/checkin`);
        const unsubscribe = checkinRef.onSnapshot(async (snapshot) => {
            const data = [];

            for (const doc of snapshot.docs) {
                const checkinData = doc.data();
                const cno = parseInt(doc.id);

                const studentsSnapshot = await db.collection(`classroom/${cid}/checkin/${cno}/students`).get();
                const totalStudents = studentsSnapshot.size;
                const checkedInCount = studentsSnapshot.docs.filter(doc => doc.data().status === 1).length;
                let status = checkinData.status || 0;

                data.push({ cno, totalStudents, status, code: checkinData.code, date: checkinData.date });
            }

            data.sort((a, b) => a.cno - b.cno);
            setTableData(data);
        });

        return () => unsubscribe();
    }, [cid]);

    const handleManageCheckin = async (cid, cno) => {
        const checkinRef = db.collection(`classroom/${cid}/checkin`).doc(cno.toString());
        await checkinRef.update({ status: 1 });
        setManageCheckinCno(cno);
    };

    return (
        <div>
            <Button variant="success" onClick={() => setShowAddCheckinForm(true)}>เพิ่มการเช็คชื่อ</Button>
            {showAddCheckinForm && (
                <AddCheckinForm
                    cid={cid}
                    fetchCheckinData={() => { }}
                    onCancel={() => setShowAddCheckinForm(false)}
                />
            )}

            {manageCheckinCno !== null && (
                <ManageCheckin
                    cid={cid}
                    cno={manageCheckinCno}
                    onClose={() => setManageCheckinCno(null)}
                />
            )}

            <h5>ประวัติการเช็คชื่อ</h5>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ลำดับ</th>
                        <th>วันเวลาที่เรียน</th>
                        <th>จำนวนคนเข้าเรียน</th>
                        <th>สถานะ</th>
                        <th>จัดการ</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((c) => (
                        <tr key={c.cno}>
                            <td>{c.cno}</td>
                            <td>{c.date}</td>
                            <td>{c.totalStudents}</td>
                            <td>
                                {(() => {
                                    if (c.status === 0) {
                                        return "ยังไม่เริ่ม";
                                    } else if (c.status === 1) {
                                        return "กำลังเช็คชื่อ";
                                    } else if (c.status === 2) {
                                        return "เสร็จแล้ว";
                                    } else {
                                        return "ไม่ทราบสถานะ";
                                    }
                                })()}
                            </td>
                            <td>
                                <Button variant="info" onClick={() => handleManageCheckin(cid, c.cno)}>เช็คชื่อ</Button>{' '}
                                <Button variant="danger" onClick={() => deleteCheckin(cid, c.cno)}>ลบ</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}

// Add Checkin Form Component
function AddCheckinForm({ cid, fetchCheckinData, onCancel }) {
    const [code, setCode] = React.useState("");
    const [date, setDate] = React.useState("");

    const handleSave = async () => {
        if (!code.trim() || !date.trim()) {
            alert("กรุณากรอกข้อมูลให้ครบถ้วน");
            return;
        }

        try {
            const checkinSnapshot = await db.collection(`classroom/${cid}/checkin`).get();
            const cno = checkinSnapshot.size + 1;

            const studentsSnapshot = await db.collection(`classroom/${cid}/students`).get();

            const checkinData = {
                cno,
                code,
                date,
                timestamp: new Date(),
                status: 0
            };

            await db.collection(`classroom/${cid}/checkin`).doc(cno.toString()).set(checkinData);

            const studentsCollectionRef = db.collection(`classroom/${cid}/checkin/${cno}/students`);
            studentsSnapshot.forEach(async (doc) => {
                const studentData = doc.data();
                await studentsCollectionRef.doc(doc.id).set({
                    stdid: studentData.stdid,
                    name: studentData.name,
                    status: 0
                });
            });

            fetchCheckinData();
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

// Manage Checkin Component
function ManageCheckin({ cid, cno, onClose }) {
    const [students, setStudents] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [code, setCode] = React.useState("");
    const [tab, setTab] = React.useState("checkin");
    const [showQuestionForm, setShowQuestionForm] = React.useState(false);

    React.useEffect(() => {
        const studentsRef = db.collection(`classroom/${cid}/checkin/${cno}/students`);
        const unsubscribeStudents = studentsRef.onSnapshot((snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setStudents(data);
            setIsLoading(false);
        });

        const checkinRef = db.collection(`classroom/${cid}/checkin`).doc(cno.toString());
        const unsubscribeCheckin = checkinRef.onSnapshot((doc) => {
            if (doc.exists) {
                setCode(doc.data().code || "");
            }
        });

        return () => {
            unsubscribeStudents();
            unsubscribeCheckin();
        };
    }, [cid, cno]);

    const handleDeleteStudent = async (studentId) => {
        if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบนักเรียนนี้?")) {
            await db.collection(`classroom/${cid}/checkin/${cno}/students`).doc(studentId).delete();
        }
    };

    const handleSaveCheckinStatus = async () => {
        try {
            const checkinRef = db.collection(`classroom/${cid}/checkin`).doc(cno.toString());
            await checkinRef.update({ status: 2 });
            alert("บันทึกการเช็คชื่อสำเร็จ");
            onClose(); //ปิดแบบฟอร์มเมื่อบึนทึกข้อมูล
        } catch (error) {
            console.error("เกิดข้อผิดพลาด:", error);
            alert("เกิดข้อผิดพลาดในการบันทึกการเช็คชื่อ");
        }
    };

    const handleSaveStudents = async () => {
        try {
            const scoresRef = db.collection(`classroom/${cid}/checkin/${cno}/scores`);
            const batch = db.batch();

            students.forEach((student) => {
                const scoreDocRef = scoresRef.doc(student.id);
                batch.set(scoreDocRef, {
                    stdid: student.stdid,
                    name: student.name,
                    remark: student.remark || "",
                    score: student.score || 0,
                    date: student.date,
                    status: student.status || 1,
                }, { merge: true });
            });

            await batch.commit();
            alert("บันทึกข้อมูลสำเร็จ");
        } catch (error) {
            console.error("เกิดข้อผิดพลาด:", error);
            alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        }
    };

    const handleChange = (id, field, value) => {
        setStudents((prevStudents) =>
            prevStudents.map((student) =>
                student.id === id ? { ...student, [field]: field === "score" ? parseFloat(value || 0) : value } : student
            )
        );
    };

    return (
        <Card>
            <Card.Header>
                <h4>จัดการการเช็คชื่อ: ลำดับเช็คชื่อ : {cno} | โค้ดเช็คชื่อ : {code}</h4>
                <div className="d-flex justify-content-between align-items-center">
                    <Button variant="secondary" onClick={onClose}>ย้อนกลับ</Button>
                    <Button variant="primary" onClick={() => setShowQuestionForm(true)}> + สร้างคำถาม</Button>
                </div>
                <nav className="nav nav-tabs">
                    <a className={`nav-link ${tab === "checkin" ? "active" : ""}`} onClick={() => setTab("checkin")}>เช็คชื่อ</a>
                    <a className={`nav-link ${tab === "scores" ? "active" : ""}`} onClick={() => setTab("scores")}>แสดงคะแนน</a>
                </nav>
            </Card.Header>
            <Card.Body>
                {isLoading ? (
                    <p>กำลังโหลดข้อมูล...</p>
                ) : (
                    <>
                        {tab === "checkin" && (
                            <>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>ลำดับ</th>
                                            <th>รหัส</th>
                                            <th>ชื่อ</th>
                                            <th>หมายเหตุ</th>
                                            <th>วันเวลา</th>
                                            <th>จัดการ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.map((student, index) => (
                                            <tr key={student.id}>
                                                <td>{index + 1}</td>
                                                <td>{student.stdid}</td>
                                                <td>{student.name}</td>
                                                <td>{student.remark}</td>
                                                <td>{student.date}</td>
                                                <td>
                                                    <Button variant="danger" onClick={() => handleDeleteStudent(student.id)}>ลบ</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                                <Button variant="success" onClick={handleSaveCheckinStatus}>บันทึกการเช็คชื่อ</Button>
                            </>
                        )}

                        {tab === "scores" && (
                            <>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>ลำดับ</th>
                                            <th>รหัส</th>
                                            <th>ชื่อ</th>
                                            <th>หมายเหตุ</th>
                                            <th>วันเวลา</th>
                                            <th>คะแนน</th>
                                            <th>สถานะ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.map((student, index) => (
                                            <tr key={student.id}>
                                                <td>{index + 1}</td>
                                                <td>{student.stdid}</td>
                                                <td>{student.name}</td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        value={student.remark || ""}
                                                        onChange={(e) => handleChange(student.id, "remark", e.target.value)}
                                                    />
                                                </td>
                                                <td>{student.date}</td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        value={student.score || 0}
                                                        onChange={(e) => handleChange(student.id, "score", e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    <select
                                                        value={student.status || 1}
                                                        onChange={(e) => handleChange(student.id, "status", parseInt(e.target.value))}
                                                    >
                                                        <option value={0}>ไม่มา</option>
                                                        <option value={1}>มาเรียน</option>
                                                        <option value={2}>มาสาย</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                                <Button variant="success" onClick={handleSaveStudents}>บันทึกข้อมูล</Button>
                            </>
                        )}

                        {showQuestionForm && (
                            <QuestionForm
                                cid={cid}
                                cno={cno}
                                onCancel={() => setShowQuestionForm(false)}
                            />
                        )}
                    </>
                )}
            </Card.Body>
        </Card>
    );
}

// Question Form Component
function QuestionForm({ cid, cno, onCancel }) {
    const [questionNo, setQuestionNo] = React.useState("");
    const [questionText, setQuestionText] = React.useState("");
    const [answers, setAnswers] = React.useState([]);

    React.useEffect(() => {
        if (!questionNo) return;

        const answersRef = db.collection(`classroom/${cid}/checkin/${cno}/answers/${questionNo}/students`);
        const unsubscribe = answersRef.onSnapshot((snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setAnswers(data);
        });

        return () => unsubscribe();
    }, [cid, cno, questionNo]);

    const handleSaveQuestion = async () => {
        if (!questionNo || !questionText) {
            alert("กรุณากรอกข้อที่และข้อความคำถาม");
            return;
        }

        try {
            await db.collection(`classroom/${cid}/checkin/${cno}/question`).doc(questionNo).set({
                question_no: questionNo,
                question_text: questionText,
                question_show: true,
            });
            await db.collection(`classroom/${cid}/checkin/${cno}/answers`).doc(questionNo).set({
                question_text: questionText,
            });

            alert("บันทึกคำถามสำเร็จ");
        } catch (error) {
            console.error("เกิดข้อผิดพลาด:", error);
            alert("เกิดข้อผิดพลาดในการบันทึกคำถาม");
        }
    };

    const handleCloseQuestion = async () => {
        try {
            await db.collection(`classroom/${cid}/checkin/${cno}/question`).doc(questionNo).update({
                question_show: false,
            });

            alert("ปิดคำถามสำเร็จ");
        } catch (error) {
            console.error("เกิดข้อผิดพลาด:", error);
            alert("เกิดข้อผิดพลาดในการปิดคำถาม");
        }
    };

    return (
        <Card className="mt-3">
            <Card.Header><h4>ตั้งคำถาม</h4></Card.Header>
            <Card.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>ข้อที่</Form.Label>
                        <Form.Control
                            type="text"
                            value={questionNo}
                            onChange={(e) => setQuestionNo(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>ข้อความคำถาม</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={questionText}
                            onChange={(e) => setQuestionText(e.target.value)}
                        />
                    </Form.Group>

                    <Button variant="success" onClick={handleSaveQuestion}>บันทึกคำถาม</Button>{' '}
                    <Button variant="danger" onClick={handleCloseQuestion}>ปิดคำถาม</Button>{' '}
                    <Button variant="secondary" onClick={onCancel}>ยกเลิก</Button>
                </Form>
            </Card.Body>

            <Card.Body>
                <h5>คำตอบของนักเรียน</h5>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ลำดับ</th>
                            <th>รหัสนักเรียน</th>
                            <th>คำตอบ</th>
                            <th>เวลาส่งคำตอบ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {answers.map((answer, index) => (
                            <tr key={answer.id}>
                                <td>{index + 1}</td>
                                <td>{answer.id}</td>
                                <td>{answer.text}</td>
                                <td>{answer.time}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
    );
}

// Delete Checkin Function
async function deleteCheckin(cid, cno, fetchCheckinData) {
    if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบการเช็คชื่อนี้?")) {
        await db.collection(`classroom/${cid}/checkin`).doc(cno.toString()).delete();
        const studentsCollectionRef = db.collection(`classroom/${cid}/checkin/${cno}/students`);
        const studentsSnapshot = await studentsCollectionRef.get();
        studentsSnapshot.forEach(async (doc) => {
            await doc.ref.delete();
        });

        fetchCheckinData();
    }
}

// Main App Component
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
        provider.setCustomParameters({ prompt: "select_account" });
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
                                onMouseEnter={(e) => e.target.style.backgroundColor = "#2980b9"}
                                onMouseLeave={(e) => e.target.style.backgroundColor = "#3498db"}
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
                                    <ManageCourse course={this.state.currentCourse} app={this} />
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
