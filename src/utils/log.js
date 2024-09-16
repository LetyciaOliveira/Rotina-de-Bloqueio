import db from '../server.js';
import { v4 as uuidv4 } from 'uuid';
import { DateTime } from 'luxon';



export default class LogMySql{

    async log(cnpjs, razao_social, data_criacao) {

        const token = uuidv4()
        const data_bloqueio = DateTime.now().toISO()

        const result = await db.query(
            "INSERT INTO bloqueios_teste_gratis (token, cnpj, razao_social, criacao_cliente, data_bloqueio) VALUES (?, ?, ?, ?, ?)",
            [token, cnpjs, razao_social, data_criacao, data_bloqueio]
            );

        return result;
    }
}