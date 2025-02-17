const { Alert, Card, Button, Table } = ReactBootstrap;

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
        <div style={{ textAlign: "center", padding: "200px" }}>
            <h2>ระบบจัดการห้องเรียนของอาจารย์</h2>
            <p>กรุณาเข้าสู่ระบบเพื่อจัดการรายวิชา</p>
            <Button variant="primary" onClick={onLogin}>เข้าสู่ระบบด้วย Google</Button>
        </div>
    );
}

function LoginBox({ user, app }) {
    return !user ? (
        <div>
            <Button onClick={() => app.google_login()}>Google Login</Button>
        </div>
    ) : (
        <div>
            <img src={user.photoURL} alt="Profile" width="50" />
            {user.email} <button onClick={() => app.google_logout()}>Logout</button>
        </div>
    );
}

function CoursesTable({ data, app }) {
    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>รหัสวิชา</th>
                    <th>ชื่อวิชา</th>
                    <th>ภาพวิชา</th>
                    <th>ห้องที่สอน</th>
                    <th>จัดการ</th>
                </tr>
            </thead>
            <tbody>
                {data.length > 0 ? (
                    data.map((c) => (
                        <tr key={c.id}>
                            <td>{c.info.code}</td>
                            <td>{c.info.name}</td>
                            <td><img src={c.info.photo} alt="Subject" width="150" /></td>
                            <td>{c.info.room}</td>
                            <td>
                                <Button variant="warning" onClick={() => app.edit(c)}>แก้ไข</Button>{' '}
                                <Button variant="danger" onClick={() => app.delete(c)}>ลบ</Button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="5" className="text-center">ไม่มีข้อมูลรายวิชา</td>
                    </tr>
                )}
            </tbody>
        </Table>
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
    await db.collection("classroom").doc(cid).set(classroomData);
    await db.collection("users").doc(uid).collection("classroom").doc(cid).set({ status: 1 });
    return cid;
}

class App extends React.Component {
    state = {
        scene: "dashboard",
        courses: [],
        user: null,
    };

    constructor() {
        super();
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({ user: user.toJSON() });
                this.readData();
            } else {
                this.setState({ user: null, courses: [], scene: "dashboard" });
            }
        });
    }

    google_login = () => {
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider);
    };

    google_logout = () => {
        if (window.confirm("ต้องการออกจากระบบ?")) {
            firebase.auth().signOut().then(() => this.setState({ user: null }));
        }
    };

    readData = () => {
        db.collection("classroom").get().then((querySnapshot) => {
            const courseList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            this.setState({ courses: courseList });
        });
    };

    delete = (course) => {
        if (window.confirm("ต้องการลบข้อมูลนี้ใช่มั้ย")) {
            db.collection("classroom").doc(course.id).delete().then(() => {
                this.readData();
            });
        }
    };

    render() {
        if (!this.state.user) {
            return <LandingPage onLogin={this.google_login} />;
        }

        return (
            <Card>
                <LoginBox user={this.state.user} app={this} />
                <Card.Body>
                    <Button onClick={this.readData}>รีเฟรช</Button>{' '}
                    <Button onClick={() => this.setState({ scene: "addSubject" })}>เพิ่มวิชา</Button>

                    {this.state.scene === "addSubject" ? (
                        <AddSubject user={this.state.user} app={this} />
                    ) : (
                        <CoursesTable data={this.state.courses} app={this} />
                    )}
                </Card.Body>
            </Card>
        );
    }
}
const container = document.getElementById("myapp");
const root = ReactDOM.createRoot(container);
root.render(<App />); 
