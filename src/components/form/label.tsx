import { LabelProps } from "./types";

const Label = (props: LabelProps) => {
    return (
        <label
            htmlFor={props.name}
            className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
            {props.label} {props.required && props.label && <span className="text-red-500">*</span>}
        </label>
    )
}

export default Label;