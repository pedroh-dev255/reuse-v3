"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./Login.module.css";
import logo from "@/src/app/logo.png";
import { useAlert } from "@/src/components/AlertProvider";

import Termos from "@/src/components/Termos";
import Contato from "@/src/components/Contato";


export default function LoginPage() {
  const { showAlert } = useAlert();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [showTermos, setShowTermos] = useState(false);
  const [showContato, setShowContato] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      if (!email || !password) {
        showAlert("Por favor, preencha todos os campos", "error");
        return;
      }

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, password: password }),
        credentials: "include",
      });

      if (res.ok && res.status === 200) {
        const data = await res.json();
        if (!data.token) {
          showAlert("Token não encontrado na resposta", "error");
          return;
        }
        showAlert("Login realizado com sucesso!", "success");

        
        router.replace("/dashboard");
      } else {
        const data = await res.json();
        showAlert(`Erro ao fazer login: ${data.error}`, "error");
        setError(data.error || "Erro ao fazer login");
      }
    } catch (err) {
      console.error("Login error:", err);
      showAlert("Erro ao conectar ao servidor", "error");
      setError("Erro ao conectar ao servidor");
    }
  };

  const goToRegister = () => {
    router.push("/register");
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Lado esquerdo - Boas vindas */}
        <div className={styles.leftPanel}>
          <img src={logo.src} alt="" />
          
          <h1 className={styles.welcomeTitle}>
            Bem vindo(a) ao RE USE
          </h1>
          
          <p className={styles.welcomeSubtitle}>
            transforme objetos parados em novas oportunidades!
          </p>
          
          <h2 className={styles.questionTitle}>
            É sua primeira vez na plataforma?
          </h2>
          
          <button onClick={goToRegister} className={styles.registerButton}>
            Realize seu cadastro agora mesmo!
          </button>
          
          <p className={styles.tagline}>Fácil e rápido!</p>
        </div>

        {/* Lado direito - Formulário de login */}
        <div className={styles.rightPanel}>
          <h2 className={styles.loginTitle}>
            Realize o login na plataforma!
          </h2>

          <form onSubmit={handleLogin}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Digite seu Usuário</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="text"
                className={styles.input}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Digite sua Senha</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className={styles.input}
                required
              />
            </div>

            <div className={styles.forgotPassword}>
              Esqueci minha senha
            </div>

            {error && (
              <div className={styles.errorMessage}>
                {error}
              </div>
            )}

            <button type="submit" className={styles.loginButton}>
              ENTRAR
            </button>
          </form>

          <div className={styles.footer}>
            <span onClick={() => setShowTermos(true)}  className={styles.footerLink}>Termos de uso</span>
            <span onClick={() => setShowContato(true)} className={styles.footerLink}>Contato</span>
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