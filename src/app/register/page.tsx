"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./Register.module.css";
import logo from "@/src/app/logo.png";
import { useAlert } from "@/src/components/AlertProvider";

import Termos from "@/src/components/Termos";
import Contato from "@/src/components/Contato";
import { fileURLToPath } from "url";

export default function RegisterPage() {
  const { showAlert } = useAlert();
  const router = useRouter();
  const [formData, setFormData] = useState({
    profilePicture: null,
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showTermos, setShowTermos] = useState(false);
  const [showContato, setShowContato] = useState(false);

  let fileURLToPath = null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
      // Validações
      if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
        showAlert("Por favor, preencha todos os campos", "error");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        showAlert("As senhas não coincidem", "error");
        setError("As senhas não coincidem");
        return;
      }

      if (formData.password.length < 6) {
        showAlert("A senha deve ter pelo menos 6 caracteres", "error");
        setError("A senha deve ter pelo menos 6 caracteres");
        return;
      }

      if(fileURLToPath === null || fileURLToPath === undefined) {
        showAlert("Erro ao salvar imagem, contact e o administrador", "error");
        return;
      }

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profilePicture: fileURLToPath,
          name: formData.username,
          email: formData.email,
          password: formData.password
        }),
      });

      if (res.ok && res.status === 201) {
        const data = await res.json();
        showAlert("Conta criada com sucesso!", "success");
        setSuccess("Conta criada com sucesso! Redirecionando...");
        
        // Redirecionar para login após 2 segundos
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        const data = await res.json();
        showAlert(`Erro ao criar conta: ${data.error}`, "error");
        setError(data.error || "Erro ao criar conta");
      }
    } catch (err) {
      console.error("Register error:", err);
      showAlert("Erro ao conectar ao servidor", "error");
      setError("Erro ao conectar ao servidor");
    }
  };

  const goToLogin = () => {
    router.push("/login");
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Lado esquerdo - Usuário existente */}
        <div className={styles.leftPanel}>
          <img src={logo.src} alt="Logo" />
          
          <h2 className={styles.existingUserTitle}>
            Já é um usuário REUSE?
          </h2>
          
          <button onClick={goToLogin} className={styles.loginButton}>
            Clique aqui para logar
          </button>
        </div>

        {/* Lado direito - Formulário de registro */}
        <div className={styles.rightPanel}>
          <div className={styles.formContainer}>
            <br /><br /><br /><br />
            <h1 className={styles.registerTitle}>
              Crie sua conta, rapidinho.
            </h1>

            <form onSubmit={handleRegister} >
              {/* Foto de perfil */}
              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="name">Selecione uma Foto para o seu perfil:</label>
                <input
                  name="profilePicture"
                  onChange={handleInputChange}
                  type="file"
                  accept="image/*"
                  className={styles.inputProfilePicture}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Digite seu Usuário</label>
                <input
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  type="text"
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Digite seu melhor e-mail</label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  type="email"
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Digite sua Senha</label>
                <input
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  type="password"
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Digite sua Senha novamente.</label>
                <input
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  type="password"
                  className={styles.input}
                  required
                />
              </div>

              {error && (
                <div className={styles.errorMessage}>
                  {error}
                </div>
              )}

              {success && (
                <div className={styles.successMessage}>
                  {success}
                </div>
              )}

              <button type="submit" className={styles.registerButton}>
                CRIAR CONTA
              </button>
                
            </form>
            <div className={styles.footer}>
              <span onClick={() => setShowTermos(true)}  className={styles.footerLink}>Termos de uso</span>
              <span onClick={() => setShowContato(true)} className={styles.footerLink}>Contato</span>
            </div>
          </div>

          
        </div>
      </div>
      {/* MODAIS */}
      {showTermos && (
        <div className={styles.modalOverlay} onClick={() => setShowTermos(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <Termos onClose={() => setShowTermos(false)} />
          </div>
        </div>
      )}
      {showContato && (
        <div className={styles.modalOverlay} onClick={() => setShowContato(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <Contato onClose={() => setShowContato(false)} />
          </div>
        </div>
      )}
    </div>
  );
}