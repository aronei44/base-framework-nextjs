import { CheckboxProps, DefaultFormProps } from "./types";

const Checkbox = (props: CheckboxProps &DefaultFormProps) => {
    return (
        <>
            <div className="flex items-center">
                <input 
                    type="checkbox"
                    id={props.name}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    checked={props.checked}
                    onChange={props.onChange}
                    disabled={props.disabled}
                    name={props.name}
                />
                <label 
                    htmlFor={props.name}
                    className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                    {props.label}
                </label>
            </div>
            {props.error && <p className="text-red-500 text-sm mt-1">{props.error}</p>}
        </>
    )
}

export default Checkbox;