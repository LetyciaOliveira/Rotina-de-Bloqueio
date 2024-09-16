import db from '../server.js';
import { setIntervalAsync} from 'set-interval-async';
import RabbitmqServer from '../config/rabbit-server.js';
import { rabbitURI } from '../config/rabbitConexao.js';
import LogMySql from '../utils/log.js';
import pc from "picocolors"


export const bloqueioTesteGratis = async () => {
            //const server = new RabbitmqServer(rabbitURI);
            //await server.start();
            const conexaoDb = new LogMySql(db)
            const timer = setIntervalAsync(async () => {
            const date = new Date();
            const seteDias = new Date(date);
                  seteDias.setDate(date.getDate() - 7);
            const dataFormatada = seteDias.toISOString().split('T')[0];
            const dataFinal = `${dataFormatada}%`


    //aqui ele faz o select dos clientes teste grátis com 7 dias a partir da data atual
            try {
                const [rows] = await db.query(
                    "SELECT cnpj, razao_social, created_at FROM companies WHERE teste_gratis = 1 AND created_at LIKE ?;",
                    [dataFinal]
                );

                if (rows.length === 0){

                    console.log(
                        pc.yellow("Sem clientes com 7 dias de teste grátis")
                    )
                    return;
                }

                const cnpjs = rows.map(row => row.cnpj);
                const razao_social = rows.map(row => row.razao_social);
                const data_criacao = rows.map(row => row.created_at)


    // aqui vai alterar o status de teste grátis pra 0
                const alteracao = await db.query(
                    "UPDATE companies SET teste_gratis = 0, block = 1, status = 0 WHERE cnpj IN (?);",
                    [cnpjs]
                );

                if (alteracao.length > 0) {
                    console.log(
                    pc.green("Alterações no banco realizadas com sucesso")
                    )
                }

                if (cnpjs.length > 0) {
                    console.log('Total de clientes alterados:', cnpjs.length);
                    
                    //const message = JSON.stringify(rows);
                    // server.envioListaBloqueados(message);

    // aqui eu vou fazer um for para que salve cada cnpj bloqueado na tabela de log para ter certeza que bloqueou aquele cliente na rotina
                    for (let i = 0; i < cnpjs.length; i++) {
                        await conexaoDb.log(cnpjs[i], razao_social[i], data_criacao[i]);
                    }
                }

                } catch (error) {
                    console.error(error)
                }
                }, 30000)

                return timer;
};

