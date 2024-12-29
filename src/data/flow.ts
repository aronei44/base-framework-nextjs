'use server';
import { AllType } from "@/extras/types";
import { ActionButton } from "./types";
import { checkSession } from "@/extras/security";
import dbconn from "./connection";
import safecall from "@/extras/safecall";
import { checkRole, saveRole } from "./role";
import { checkUser, saveUser } from "./user";

const validationFunction : Record<string, (data: Record<string, AllType>, action_id: string) => Promise<{success:boolean, message: string}>> = {
    'mnuADMUser': checkUser,
    'mnuADMRole': checkRole
}

const saveFunction: Record<string, (data: Record<string, AllType>, action_id: string) => Promise<string>> = {
    'mnuADMUser': saveUser,
    'mnuADMRole': saveRole
}

const saveData = async (data: Record<string, AllType>, flow_data: ActionButton, menu_id: string, action_id: string, app_id: string, remark: string, flow_id?: number) => {
    return await safecall({
        name: 'saveData',
        fn: async (tracer) => {
            
            const {data: session, error} = await checkSession()
            if (error || !session.success) {
                return {
                    success: false,
                    message: "Session expired"
                } as {
                    success: boolean,
                    message: string
                }
            }
            if (!flow_data.is_readonly) { // check if data is save to draft
                const valid = await validationFunction[menu_id](data, action_id)
                if (!valid.success) {
                    return {
                        success: false,
                        message: valid.message
                    } as {
                        success: boolean,
                        message: string
                    }
                }
            }
        
            let query = 'BEGIN;';
        
            if (flow_id) {
                query += `
                    WITH updated_flow AS (
                        UPDATE flow SET 
                            data = '${JSON.stringify(data)}',
                            state_name = '${flow_data.state_name}',
                            next_state = '${flow_data.next_state || ''}'
                        WHERE id = ${flow_id}
                        RETURNING id
                    ),
                    closed_histories AS (
                        UPDATE flow.flow_histories SET
                            closed_at = NOW(),
                            is_closed = true
                        WHERE flow_data_id = ${flow_id} AND is_closed = false
                    )
                    INSERT INTO flow.flow_histories (
                        flow_data_id,
                        user_id,
                        state_name,
                        remark,
                        created_at,
                        closed_at,
                        is_closed,
                        data
                    ) VALUES (
                        ${flow_id},
                        '${session.data?.username}',
                        '${flow_data.state_name}',
                        '${remark}',
                        NOW(),
                        NULL,
                        ${flow_data.is_final},
                        '${JSON.stringify(data)}'
                    );
                `
            } else {
                query += `
                    WITH inserted_flow AS (
                        INSERT INTO flow.flow_data (
                            menu_id,
                            action_id,
                            state_name,
                            next_state,
                            app_id,
                            description,
                            data,
                            created_at,
                            final_state_at
                        ) VALUES (
                            '${menu_id}',
                            '${action_id}',
                            '${flow_data.state_name}',
                            '${flow_data.next_state || ''}',
                            '${app_id}',
                            '${flow_data.description}',
                            '${JSON.stringify(data)}',
                            NOW(),
                            NULL
                        ) RETURNING id
                    )
                    INSERT INTO flow.flow_histories (
                        flow_data_id,
                        user_id,
                        state_name,
                        remark,
                        created_at,
                        closed_at,
                        is_closed,
                        data
                    ) VALUES (
                        (SELECT id FROM inserted_flow),
                        '${session.data?.username}',
                        '${flow_data.state_name}',
                        '${remark}',
                        NOW(),
                        NULL,
                        false,
                        '${JSON.stringify(data)}'
                    );
                `
            }
        
            if (flow_data.is_final) {
                query += await saveFunction[menu_id](data, action_id)
                query += `
                    UPDATE flow.flow_data SET
                        final_state_at = NOW()
                    WHERE id = (SELECT id FROM inserted_flow)
                `
            }
        
            query += 'COMMIT;'
        
            const { error: errorSql } = await dbconn(query, tracer);
            if (errorSql) {
                return {
                    success: false,
                    message: "Failed to save data"
                } as {
                    success: boolean,
                    message: string
                }
            }
            return {
                success: true,
                message: "Data saved"
            } as {
                success: boolean,
                message: string
            }
        },
    })

}

export {
    saveData
}