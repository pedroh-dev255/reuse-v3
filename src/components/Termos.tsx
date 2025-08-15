//@/src/components/Termos.tsx
import React from "react";
import { useAlert } from "./AlertProvider";


export default function Termos({ onClose }: { onClose: () => void }) {


    const { showAlert } = useAlert();

    const handleAccept = () => {
        showAlert("Termos aceitos!", "success");
        // Aqui você pode adicionar a lógica para salvar a aceitação dos termos
    }

    return (
        <>
        <h2 className={styles.h2}>Termos de Serviço</h2>
            <div className={styles.termosContent}>
                    <p style={{ fontWeight: 'bold' }}>
                        1. Introdução Bem-vindo ao ReUse. Ao utilizar nossos serviços, você concorda com estes Termos de Uso. Caso não concorde, não utilize o Aplicativo.<br/><br/>
                        2. Uso do Aplicativo<br/>
                    </p>
                        2.1. O Aplicativo é destinado para Troca de itens entre os usuarios.<br/>
                        2.2. Você é responsável pelo uso adequado do Aplicativo e deve seguir todas as leis aplicáveis.<br/>
                        2.3. É proibido o uso do Aplicativo para fins ilícitos, fraudulentos ou que violem direitos de terceiros.<br/><br/>
                    <p style={{ fontWeight: 'bold' }}>
                        3. Cadastro e Conta<br/>
                    </p>
                        3.1. Para acessar determinados recursos, pode ser necessário criar uma conta.<br/>
                        3.2. Você deve fornecer informações verdadeiras e mantê-las atualizadas.<br/>
                        3.3. A segurança da conta é de sua responsabilidade, e qualquer atividade realizada com suas credenciais será considerada de sua autoria.<br/><br/>
                    <p style={{ fontWeight: 'bold' }}>
                    4. Privacidade e Dados<br/>
                    </p>
                        4.1. Os dados coletados serão tratados conforme nossa Política de Privacidade.<br/>
                        4.2. O usuário concorda com a coleta e uso de dados para melhoria dos serviços.<br/><br/>
                    <p style={{ fontWeight: 'bold' }}>
                    5. Propriedade Intelectual<br/>
                    </p>
                        5.1. Todo o conteúdo do Aplicativo, incluindo pos, imagens e marcas, é protegido por direitos autorais e de propriedade intelectual.<br/>
                        5.2. O usuário não pode copiar, modificar ou distribuir qualquer parte do Aplicativo sem autorização.<br/><br/>
                    <p style={{ fontWeight: 'bold' }}>
                    6. Limitação de Responsabilidade<br/>
                    </p>
                        6.1. O Aplicativo é oferecido "como está" e não garantimos que estará sempre disponível ou livre de erros.<br/>
                        6.2. Não nos responsabilizamos por danos diretos ou indiretos resultantes do uso do Aplicativo.<br/><br/>
                    <p style={{ fontWeight: 'bold' }}>
                    7. Rescisão<br/>
                    </p>
                        7.1. Podemos suspender ou encerrar seu acesso ao Aplicativo caso viole estes Termos.<br/>
                        7.2. Você pode excluir sua conta a qualquer momento.<br/><br/>
                    <p style={{ fontWeight: 'bold' }}>
                    8. Alterações nos Termos<br/>
                    </p>
                        8.1. Podemos modificar estes Termos a qualquer momento, e o uso contínuo do Aplicativo indica sua aceitação das mudanças.<br/>
                    <p style={{ fontWeight: 'bold' }}><br/><br/>
                    9. Contato Se tiver dúvidas, entre em contato pelo e-mail suporte@reuse.com.<br/><br/>
                    </p>
                    <p style={{ font: 'italic', fontSize: '0.8rem', textAlign: 'right' }}>
                        Última atualização: 21/03/2025
                    </p>

            </div>
            <div className={styles.termosFooter}>
                <button className={styles.closeButton} onClick={onClose}>Fechar</button>
            </div>
        </>
    );
}

const styles = {
    h2: "p-2xl font-bold mb-4",
    termosContent: "max-h-96 overflow-y-auto mb-4",
    closeButton: "bg-red-500 p-white px-4 py-2 rounded hover:bg-red-600",
    termosFooter: "flex justify-end gap-4",
};