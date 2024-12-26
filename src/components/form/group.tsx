import RenderElement from "./renderelement";
import { GroupProps } from "./types";

const getCols = (cols: number) => {
    switch (cols) {
        case 1:
            return 'grid-cols-1';
        case 2:
            return 'grid-cols-2';
        case 3:
            return 'grid-cols-3';
        case 4:
            return 'grid-cols-4';
        case 5:
            return 'grid-cols-5';
        case 6:
            return 'grid-cols-6';
        case 7:
            return 'grid-cols-7';
        case 8:
            return 'grid-cols-8';
        case 9:
            return 'grid-cols-9';
        case 10:
            return 'grid-cols-10';
        default:
            return 'grid-cols-1';
    }
}

const Group = (props: GroupProps) => {
    return (
        <>
            {props.title && <p className="text-sm text-gray-900 dark:text-gray-300">{props.title}</p>}
            {props.subtitle && <p className="text-xs text-gray-500 dark:text-gray-400">{props.subtitle}</p>}
            <div className={`grid gap-5 ${getCols(props.cols)}`}>
                {props.content.map((item, index) => (
                    <RenderElement
                        key={`${index + 1}`}
                        fields={props.fields}
                        setFields={props.setFields}
                        state={props.state}
                        globalDisabled={props.globalDisabled}
                        {...item}
                    />
                ))}
            </div>
        </>
    )
}

export default Group;