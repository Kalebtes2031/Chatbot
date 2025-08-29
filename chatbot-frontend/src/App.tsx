// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
// import ConversationsPage from "./pages/Coversations";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChatPage />} /> {/* anonymous or logged-in chat */}
        <Route path="/*" element={<ChatPage />} /> {/* anonymous or logged-in chat */}
        <Route path="/chat" element={<ChatPage />} /> {/* anonymous or logged-in chat */}
        {/* <Route path="/conversations" element={<ConversationsPage />} /> */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </Router>
  );
}

export default App;
