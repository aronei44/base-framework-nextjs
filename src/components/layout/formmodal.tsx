import Modal from "./modal"
import Header from "./header"
import { Button, RenderForm } from "../form";
import { FormModalProps } from "./types";
import { getActionButton } from "@/data/actionbutton";
import { useEffect, useState } from "react";
import { ActionButton } from "@/data/types";
import { useAuth } from "@/extras/authcontext";


const FormModal = (props: FormModalProps) => {
    const auth = useAuth();
    const {state} = auth;

    const [actionButton, setActionButton] = useState<ActionButton[]>([]);
    const [globalDisabled, setGlobalDisabled] = useState<boolean>(false);

    const getActionButtonList = async (state: string, action_id: string, role_id: string) => {
        const button = await getActionButton(state, action_id, role_id);
        setActionButton(button);
        if (button.length === 0) {
            setGlobalDisabled(true);
        } else {
            setGlobalDisabled(button[0].is_readonly);
        }
    }

    useEffect(() => {
        if (state.user) {
            getActionButtonList(props.form?.state ?? "", props.form?.mode ?? "", state.user.role?.role_id ?? "");
        }
    }, [props.form?.state, props.form?.mode, state.user]);


    return (
        <Modal isOpen={true}>
            <Header
                title={props.title}
                rightComponent={
                    <p 
                        className="py-2 px-4 bg-slate-50 rounded-md cursor-pointer hover:bg-slate-100"
                        onClick={() => props.setOpen(false)}
                    >
                        X
                    </p>
                }
            />
            {props.children}

            {props.form && (
                <RenderForm
                    {...props.form}
                    disabled={globalDisabled || props.form.disabled}
                />
            )}

            <hr />
            <div className="py-4 flex justify-between">
                <div>
                    <Button
                        label="Batalkan"
                        color="red-outline"
                        onClick={() => props.setOpen(false)}
                    />
                </div>
                <div className="flex justify-end space-x-2">
                    {actionButton.map((action, index) => (
                        <Button
                            key={'action_' + index}
                            label={action.description}
                            color={action.button_style}
                            onClick={() => {
                                props.submitForm(action);
                            }}
                        />
                    ))}
                </div>

            </div>
        </Modal>
            
    )
}

export default FormModal;