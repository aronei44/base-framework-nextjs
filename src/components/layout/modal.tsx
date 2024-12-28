type ModalProps = {
    children: React.ReactNode;
    isOpen: boolean;
}

const Modal = (props: ModalProps) => {
    return (
        <div 
            className={`fixed inset-0 z-50 w-full flex justify-center items-start pt-20 overflow-auto max-h-screen ${props.isOpen ? '' : 'hidden'}`}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <div className="bg-white p-4 rounded-lg shadow-md z-50 w-4/5">
                {props.children}
            </div>
        </div>
    );
}

export default Modal;