"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./Register.module.css";
import logo from "@/src/app/logo.png";
import { useAlert } from "@/src/components/AlertProvider";

import Termos from "@/src/components/Termos";
import Contato from "@/src/components/Contato";

export default function RegisterPage() {
  const { showAlert } = useAlert();
  const router = useRouter();
  const [formData, setFormData] = useState({
    profilePicture: null as File | null,
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showTermos, setShowTermos] = useState(false);
  const [showContato, setShowContato] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;

    if (name === "profilePicture" && files && files[0]) {
      setFormData(prev => ({ ...prev, profilePicture: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (!formData.profilePicture) {
        showAlert("Por favor, selecione uma foto para o perfil", "error");
        return;
      }

      if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
        showAlert("Por favor, preencha todos os campos", "error");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        showAlert("As senhas não coincidem", "error");
        return;
      }

      if (formData.password.length < 6) {
        showAlert("A senha deve ter pelo menos 6 caracteres", "error");
        return;
      }

      const data = new FormData();
      data.append("profilePicture", formData.profilePicture);
      data.append("name", formData.username);
      data.append("email", formData.email);
      data.append("password", formData.password);

      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: data
      });

      if (res.ok) {
        showAlert("Conta criada com sucesso!", "success");
        setSuccess("Conta criada com sucesso! Redirecionando...");

        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        const err = await res.json();
        showAlert(`Erro: ${err.error}`, "error");
        setError(err.error || "Erro ao criar conta");
      }
    } catch (err) {
      console.error("Register error:", err);
      showAlert("Erro ao conectar ao servidor", "error");
      setError("Erro ao conectar ao servidor");
    }
  };

  const goToLogin = () => router.push("/login");

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* lado esquerdo */}
        <div className={styles.leftPanel}>
          <img src={logo.src} alt="Logo" />
          <h2 className={styles.existingUserTitle}>Já é um usuário REUSE?</h2>
          <button onClick={goToLogin} className={styles.loginButton}>
            Clique aqui para logar
          </button>
        </div>

        {/* lado direito */}
        <div className={styles.rightPanel}>
          <div className={styles.formContainer}>
            <h1 className={styles.registerTitle}>Crie sua conta, rapidinho.</h1>
            <form onSubmit={handleRegister}>
              <div className={styles.inputGroup}>
                <label>Selecione uma Foto para o seu perfil:</label>
                <input
                  name="profilePicture"
                  type="file"
                  className={styles.inputProfilePicture}
                  accept="image/*"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Usuário</label>
                <input className={styles.input} name="username" type="text" value={formData.username} onChange={handleInputChange} required />
              </div>
              <div className={styles.inputGroup}>
                <label>Email</label>
                <input className={styles.input} name="email" type="email" value={formData.email} onChange={handleInputChange} required />
              </div>
              <div className={styles.inputGroup}>
                <label>Senha</label>
                <input className={styles.input} name="password" type="password" value={formData.password} onChange={handleInputChange} required />
              </div>
              <div className={styles.inputGroup}>
                <label>Confirmar Senha</label>
                <input className={styles.input} name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleInputChange} required />
              </div>

              {error && <div className={styles.errorMessage}>{error}</div>}
              {success && <div className={styles.successMessage}>{success}</div>}

              <button type="submit" className={styles.registerButton}>
                CRIAR CONTA
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
