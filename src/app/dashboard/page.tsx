"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import logo from "@/src/app/logo.png";


export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [produtos, setProdutos] = useState<any>(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then(res => {
        if (!res.ok) router.push("/login");
        return res.json();
      })
      .then(data => {
        setUser(data.user);
        setProdutos(data.produtos);
      })
      .catch(() => router.push("/login"));
  }, [router]);

  const logout = async () => {
    console.log("Logging out...");
    //delete cookies
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    router.push("/login");
  };

  return (
    <div style={styles.container}>
      <img style={{ display: "flex", position: "absolute", width: "30px", left: "20px", top: "20px" }} src={logo.src} alt="Logo" className="mb-4" />
      <div className="flex flex-col items-center">
        {user && (
          <a style={styles.userInfo}>
            <p>
              <b>{user.name}</b> <br/>
              Ver Perfil
            </p>
            <img style={styles.profilePicture} src={`/uploads/profile/${user.profile_picture}`} alt="Foto do usuario" />
          </a>
        )}
      </div>

      <button
        onClick={logout}
        style={styles.logoutButton}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Sair
      </button>
    </div>
  );
}



const styles: {
  container: React.CSSProperties;
  title: React.CSSProperties;
  userInfo: React.CSSProperties;
  logoutButton: React.CSSProperties;
  profilePicture: React.CSSProperties;
} = {
  container: {
    background: "linear-gradient(135deg, #5B84B8 0%, #4A73A7 100%)",
    padding: "2rem",
    /* Ocupar todo o espaço da tela*/
    height: "100vh",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#4A6B96",
    marginBottom: "1rem",
  },
  userInfo: {
    display: "flex",
    position: "absolute",
    flexDirection: "row",
    color: "#fdfdfdff",
    fontStyle: "normal",
    marginBottom: "1rem",
    right: "20px",
    top: "20px",

  },
  logoutButton: {
    backgroundColor: "#E53E3E",
    color: "#fff",
    padding: "0.5rem 1rem",
  },
  profilePicture: {
    width: "60px",
    borderRadius: "40%",
  }
};