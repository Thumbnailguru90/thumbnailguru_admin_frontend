import React, { useState } from "react";
// import { useAuth } from '../../context/AuthContext';
import { Dialog } from "@headlessui/react";
import { LogIn, UserPlus, X } from "lucide-react";
import "./Header.css";

const AuthModal = ({ isOpen, onClose, type }) => {
  // const { login, signup } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (type === "login") {
      login(email, password);
    } else {
      signup(email, password);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="auth-modal-container">
      <div className="auth-modal-overlay" />
      <Dialog.Panel className="auth-modal">
        <div className="modal-header">
          <Dialog.Title>
            {type === "login" ? "Sign In" : "Create Account"}
          </Dialog.Title>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-button">
            {type === "login" ? "Sign In" : "Sign Up"}
          </button>
        </form>
      </Dialog.Panel>
    </Dialog>
  );
};

const Header = () => {
  const [modalType, setModalType] = useState(null);
  // const { isAuthenticated } = useAuth();

  const openModal = (type) => setModalType(type);
  const closeModal = () => setModalType(null);

  return (
    <>
      <header className="app-header">
        <div className="header-content">
          <h1 className="header-title">
            <span className="gradient-text">Thumbnail Guru</span>
          </h1>
          <div className="header-actions">
            <button
              className="header-button login"
              onClick={() => openModal("login")}
            >
              <LogIn size={18} />
              <span>Sign In</span>
            </button>
            <button
              className="header-button signup"
              onClick={() => openModal("signup")}
            >
              <UserPlus size={18} />
              <span>Sign Up</span>
            </button>
          </div>
        </div>
      </header>
      <AuthModal
        isOpen={modalType !== null}
        onClose={closeModal}
        type={modalType}
      />
    </>
  );
};

export default Header;
