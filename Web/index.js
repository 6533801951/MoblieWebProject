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

function LoginBox(props) {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const u = props.user;
    const app = props.app;

    const handleEmailLogin = () => {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(userCredential => {
                alert("เข้าสู่ระบบสำเร็จ");
            })
            .catch(error => alert("เกิดข้อผิดพลาด: " + error.message));
    };

    const handleEmailRegister = () => {
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(userCredential => {
                const user = userCredential.user;
                db.collection("users").doc(user.uid).set({
                    email: user.email,
                    role: email.startsWith("t") ? "T01" : "S01" // แยกระหว่างนักเรียนและอาจารย์
                });
                alert("สมัครสมาชิกสำเร็จ");
            })
            .catch(error => alert("เกิดข้อผิดพลาด: " + error.message));
    };

    if (!u) {
        return (
            <div>
                <h4>เข้าสู่ระบบ</h4>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button onClick={handleEmailLogin}>เข้าสู่ระบบ</button>
                <button onClick={handleEmailRegister}>สมัครสมาชิก</button>
            </div>
        );
    } else {
        return (
            <div>
                <img src={u.photoURL} alt="Profile" />
                {u.email} <button onClick={() => app.google_logout()}>Logout</button>
            </div>
        );
    }
}


function CoursesTable({ data, app }) {
    return (
        <table className="table">
            <thead>
                <tr>
                    <th>รหัสวิชา</th>
                    <th>ชื่อวิชา</th>
                    <th>ภาพวิชา</th>
                    <th>ห้องเรียน</th>
                </tr>
            </thead>
            <tbody>
                {data && data.length > 0 ? (
                    data.map((c) => (
                        <tr key={c.id}>
                            <td>{c.info.code}</td>
                            <td>{c.info.name}</td>
                            <td><img src={c.info.photo} alt="Subject Picture" width="50" /></td>
                            <td>{c.info.room}</td>
                            <td><EditButton course={c} app={app} /></td>
                            <td><DeleteButton course={c} app={app} /></td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="6" style={{ textAlign: "center" }}>ไม่มีข้อมูลรายวิชา</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}


function EditButton({ course, app }) {
    return <button onClick={() => app.edit(course)}>แก้ไข</button>
}
function DeleteButton({ course, app }) {
    return <button onClick={() => app.delete(course)}>ลบ</button>
}
function EditProfile({ user }) {
    const [displayName, setDisplayName] = React.useState(user?.displayName || "");
    const [email, setEmail] = React.useState(user?.email || "");
    const [photoURL, setPhotoURL] = React.useState(user?.photoURL || "");

    const handleUpdateProfile = async () => {
        const currentUser = firebase.auth().currentUser;
        if (currentUser) {
            try {
                await currentUser.updateProfile({
                    displayName: displayName,
                    photoURL: photoURL
                });

                if (email !== currentUser.email) {
                    await currentUser.updateEmail(email);
                }

                alert("โปรไฟล์อัปเดตสำเร็จ!");
                window.location.reload(); // รีเฟรชเพื่ออัปเดตข้อมูลใหม่
            } catch (error) {
                alert("เกิดข้อผิดพลาด: " + error.message);
            }
        }
    };

    return (
        <div>
            <h2>แก้ไขโปรไฟล์</h2>
            <div>
                <label>ชื่อ:</label>
                <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
            </div>
            <div>
                <label>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
                <label>รูปภาพ URL:</label>
                <input type="text" value={photoURL} onChange={(e) => setPhotoURL(e.target.value)} />
            </div>
            <button onClick={handleUpdateProfile}>บันทึก</button>
        </div>
    );
}

class App extends React.Component {
    title = (
        <Alert variant="info">
            <b>หน้าต่าง </b> แก้ไขรายวิชา
        </Alert>
    );

    state = {
        scene: 0,
        courses: [],
        classCode: "",
        className: "",
        classPhoto: "",
        classRoom: "",
        classOwner: "",
        user: null,
    }
    constructor() {
        super();
        firebase.auth().onAuthStateChanged((user) => {
            this.setState({ user: user ? user.toJSON() : null });
        });
    }
    google_login() {
        // Using a popup.
        var provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope("profile");
        provider.addScope("email");
        firebase.auth().signInWithPopup(provider);
    }
    google_logout() {
        if (window.confirm("Are you sure you want to logout?")) {
            firebase.auth().signOut().then(() => {
                this.setState({ user: null });
            })
        }
    }
    render() {
        return (
            <Card>
                <Card.Header>{this.title}</Card.Header>
                <LoginBox user={this.state.user} app={this}></LoginBox>
                <Card.Body>
                    <Button onClick={() => this.readData()}>Read Data</Button>
                    <Button onClick={() => this.readData()}>Add Subject</Button>

                    {this.state.scene === "editProfile" ? (
                        <EditProfile user={this.state.user} />
                    ) : (
                        <>
                            <Button onClick={() => this.setState({ scene: "editProfile" })}>Edit Profile</Button>
                        </>
                    )}
                    <div>
                        <CoursesTable data={this.state.courses} app={this} />
                    </div>
                </Card.Body>
                <Card.Footer>{this.footer}</Card.Footer>
            </Card>
        );
    }
    // สำหรับรายวิชาที่มี
    readData() {
        db.collection("classroom").get().then((querySnapshot) => {
            var courseList = [];
            querySnapshot.forEach((doc) => {
                courseList.push({ id: doc.id, ...doc.data() });
            });
            this.setState({ courses: courseList });
        });
    }
    edit(course) {
        this.setState({
            classCode: course.info.code,
            className: course.info.name,
            classPhoto: course.info.photo,
            classRoom: course.info.room,
        })
    }
    delete(course) {
        if (confirm("ต้องการลบข้อมูล")) {
            db.collection("classroom").doc(course.id).delete();
        }
    }
}

const container = document.getElementById("myapp");
const root = ReactDOM.createRoot(container);
root.render(<App />); 