import Modal from "./modal"
import Header from "./header"
import { Button, RenderForm } from "../form";
import { FormModalProps } from "./types";


const FormModal = (props: FormModalProps) => {
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
                />
            )}

            <hr />
            <div className="py-4 flex justify-between">
                <div className="flex space-x-2">
                    <Button
                        label="Batalkan"
                        color="red-outline"
                        onClick={() => props.setOpen(false)}
                    />
                    <Button
                        label="Simpan Draft"
                        color="yellow-outline"
                        onClick={() => props.setOpen(false)}
                    />
                </div>

            </div>
        </Modal>
            
    )
}

export default FormModal;