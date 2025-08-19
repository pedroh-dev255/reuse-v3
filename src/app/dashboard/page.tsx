"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import logo from "@/src/app/logo.png";
import { style } from "framer-motion/client";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [showCadastro, setShowCadastro] = useState(false);

  useEffect(() => {
    fetch("/api/dashboard")
      .then(res => {
        if (!res.ok) router.push("/login");
        return res.json();
      })
      .then(data => {
        setUser(data.user);
        setProdutos(data.produtos || []);
      })
      .catch(() => router.push("/login"));
  }, [router]);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    router.push("/login");
  };

  return (
    
    <div style={styles.container}>
      <style jsx global>{`
        .custom-scroll::-webkit-scrollbar {
          height: 6px; /* altura da barra horizontal */
        }

        .custom-scroll::-webkit-scrollbar-track {
          background: transparent; /* fundo invisível */
        }

        .custom-scroll::-webkit-scrollbar-thumb {
          background-color: rgba(255,255,255,0.3); /* cor da barrinha */
          border-radius: 4px;
        }

        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background-color: rgba(255,255,255,0.6); /* cor ao passar o mouse */
        }

        /* Para Firefox */
        .custom-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.3) transparent;
        }
      `}</style>
      {/* Logo canto superior */}
      <img
        src={logo.src}
        alt="Logo"
        style={{
          display: "flex",
          position: "absolute",
          width: "30px",
          left: "20px",
          top: "20px",
        }}
      />

      {/* Info do usuário */}
      {user && (
        <a style={styles.userInfo}>
          <div>
            <p>
              <b>{user.name}</b> <br />
              Ver Perfil
            </p>
          </div>
          <img
            style={styles.profilePicture}
            src={`/uploads/profile/${user.profile_picture}`}
            alt="Foto do usuario"
          />
        </a>
      )}

      {/* Botão para abrir cadastro */}
      <button
        onClick={() => setShowCadastro(!showCadastro)}
        style={styles.cadastroButton}
      >
        + Cadastrar objeto
      </button>

      {/* Formulário lateral */}
      {showCadastro && (
        <div style={styles.cadastroBox}>
          <h2>Cadastre seu objeto para troca!</h2>
          <input type="file" multiple style={styles.input} />
          <input type="text" placeholder="Escolha um título" style={styles.input} />
          <textarea placeholder="Descrição" style={styles.textarea}></textarea>
          <input type="number" placeholder="Valor do objeto" style={styles.input} />
          <button style={styles.enviarButton}>Salvar</button>
        </div>
      )}

      {/* Produtos - região */}
      <div style={{ marginTop: "120px" }}>
        <h2 style={styles.sectionTitle}>
          Conheça os itens que estão disponíveis para troca na sua região!
        </h2>
        <form style={styles.filter} action="">
          <h2>Selecione sua região:</h2>
          <select style={styles.select} name="state" id="">
            <option value="SP">São Paulo</option>
            <option value="TO">Palmas</option>
          </select>
          <select style={styles.select} name="city" id="">
            <option value="Grande Campinas">Grande Campinas</option>
          </select>
        </form>
        <div style={styles.produtosScroll}>
          {(produtos.length > 0 ? produtos : Array(18).fill(null)).map(
            (produto, idx) => (
              <div key={idx} style={styles.produtoCard}>
                <img
                  src={
                    produto?.foto
                      ? `/uploads/produtos/${produto.foto}`
                      : "/uploads/profile/piorquee.jpeg"
                  }
                  alt="Produto"
                  style={styles.produtoImagem}
                />
                <p style={{ color: "#fff", marginTop: "8px" }}>
                  {produto?.titulo || "Título do Produto"}
                </p>
              </div>
            )
          )}
        </div>
      </div>
      <div style={{ marginTop: "30px" }}>
        <h2 style={styles.sectionTitle}>
          Veja mais itens para troca no Brasil!
        </h2>

        <div style={styles.produtosGeral}>
          {(produtos.length > 0 ? produtos : Array(18).fill(null)).map(
            (produto, idx) => (
              <div key={idx} style={styles.produtoCard}>
                <img
                  src={
                    produto?.foto
                      ? `/uploads/produtos/${produto.foto}`
                      : "/uploads/profile/1755605043419-FvUMRmMWcAIqU21.jpg"
                  }
                  alt="Produto"
                  style={styles.produtoImagem}
                />
                <p style={{ color: "#fff", marginTop: "8px" }}>
                  {produto?.titulo || "Título do Produto"}
                </p>
              </div>
            )
          )}
        </div>
      </div>


      {/* Botão sair */}
      <button onClick={logout} style={styles.logoutButton}>
        Sair
      </button>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    fontFamily: "Poppins",
    background: "linear-gradient(135deg, #5B84B8 0%, #4A73A7 100%)",
    padding: "1rem",
    height: "100vh",
    overflow: "auto",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    position: "absolute",
    color: "#fdfdfdff",
    right: "20px",
    top: "20px",
  },
  profilePicture: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  cadastroButton: {
    position: "absolute",
    bottom: "80px",
    right: "20px",
    padding: "8px 12px",
    borderRadius: "8px",
    border: "none",
    background: "#fff",
    color: "#333",
    fontWeight: "bold",
    cursor: "pointer",
  },
  cadastroBox: {
    position: "absolute",
    top: "120px",
    left: "40%",
    width: "400px",
    background: "#fdfdfd",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    zIndex: 10,
  },
  input: {
    width: "100%",
    marginTop: "8px",
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  textarea: {
    width: "100%",
    marginTop: "8px",
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    minHeight: "80px",
  },
  enviarButton: {
    marginTop: "10px",
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    background: "#4A73A7",
    color: "#fff",
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
  },
  sectionTitle: {
    color: "#fff",
    marginBottom: "12px",
    fontWeight: "bold",
    fontSize: 28
  },
  produtosScroll: {
    display: "flex",
    gap: "12px",
    paddingBottom: "10px",
    overflowX: "auto"
  },
  produtosGeral: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    paddingBottom: "10px",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  produtoCard: {
    display: "block",
    width: "220px",
    height: "220px",
    background: "rgba(255, 255, 255, 0.16)",
    borderRadius: "12px",
    textAlign: "center",
    alignContent: "center",
    flexShrink: 0,
  },
  produtoImagem: {
    objectFit: "cover",
    maxWidth: "220px",
    borderRadius: "4px",
  },
  logoutButton: {
    position: "absolute",
    bottom: "20px",
    right: "20px",
    backgroundColor: "#E53E3E",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  filter: {
    color: "white",
    marginBottom: "30px",
    display: "flex",
    justifyContent: "row",
    gap: "20px"
  },
  select:{
    borderRadius: "20px",
    borderColor: "#fff",
    backgroundColor: "#ffffff2d",
  },
  
};
