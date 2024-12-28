import { ActionCellProps } from "./types";
import { AllType } from "@/extras/types";
const ActionCell = (props: ActionCellProps) => (
    <div className="relative">
        <p
            className="bg-slate-50 px-4 py-2 rounded-md border border-slate-500 hover:bg-slate-200 cursor-pointer active:bg-slate-500"
            onClick={(e) => { 
                e.stopPropagation();
                props.setShowAction(props.index);
            }}
        >...</p>
        {props.showAction === props.index && (
            <div className="border border-slate-500 py-2 px-4 fixed z-[999] bg-white rounded-md">
                {props.tableActionMenu.map((action, idx) => (
                    <p
                        key={'action_' + idx}
                        onClick={(e) => {
                            e.stopPropagation();
                            props.setModalState({
                                title: action.label,
                                show: true,
                                mode: action.action_id,
                                state: ""
                            });
                            props.getOneData(props.row as Record<string, AllType>);
                            props.setShowAction(null);
                        }}
                        className="my-2 cursor-pointer py-2 px-4 hover:bg-slate-50 rounded-md"
                    >
                        {action.label}
                    </p>
                ))}
            </div>
        )}
    </div>
);

export default ActionCell;