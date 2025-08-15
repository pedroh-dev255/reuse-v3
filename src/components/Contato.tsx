//@/src/components/Contato.tsx
import React from "react";

export default function Contato({ onClose }: { onClose: () => void }) {
  return (
    <div>
        <h2 className={styles.h2}>Contato</h2>

        <p>Email: <a href="mailto:suporte@reuse.com.br">suporte@reuse.com.br</a></p>
        <p>Telefone: (11) 1234-5678</p>

      
        <div className={styles.termosFooter}>
            <button onClick={onClose} className={styles.closeButton}>Fechar</button>
        </div>
    </div>
  );
}

const styles = {
    h2: "p-2xl font-bold mb-4",
    termosContent: "max-h-96 overflow-y-auto mb-4",
    closeButton: "bg-red-500 p-white px-4 py-2 rounded hover:bg-red-600",
    termosFooter: "flex justify-end gap-4",
};