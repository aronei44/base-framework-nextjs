import Modal from "./modal"
import Header from "./header"
import { Button } from "../form";

type ModalProps = {
    children: React.ReactNode;
    isOpen: boolean;
    setOpen: (isOpen: boolean) => void;
    title: string;
}

const FormModal = (props: ModalProps) => {
    return (
        <Modal isOpen={props.isOpen}>
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