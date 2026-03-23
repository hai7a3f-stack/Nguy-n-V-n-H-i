import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = "vietnam-journals-secret-key-123";

// Mock Database
const users = [
  { id: 1, email: "admin@vietnamjournals.com", password: "", role: "admin", name: "Admin" },
  { id: 2, email: "customer@gmail.com", password: "", role: "customer", name: "Khách hàng" }
];

// Hash passwords for mock users (in a real app, these would be hashed in DB)
const salt = bcrypt.genSaltSync(10);
users[0].password = bcrypt.hashSync("admin123", salt);
users[1].password = bcrypt.hashSync("user123", salt);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());

  // Auth API
  app.post("/api/auth/register", async (req, res) => {
    const { email, password, name, role } = req.body;
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: users.length + 1, email, password: hashedPassword, name, role: role || "customer" };
    users.push(newUser);
    const token = jwt.sign({ id: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: "1d" });
    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" });
    res.json({ user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role } });
  });

  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1d" });
    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" });
    res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  });

  app.get("/api/auth/me", (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Chưa đăng nhập" });
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: number; role: string };
      const user = users.find(u => u.id === decoded.id);
      if (!user) return res.status(401).json({ message: "Người dùng không tồn tại" });
      res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } catch (e) {
      res.status(401).json({ message: "Token không hợp lệ" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Đã đăng xuất" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
