import { DefaultFormProps, RadioProps } from "./types";

const Radio = (props: RadioProps & DefaultFormProps) => {
    return (
        <div className="mb-5">
            <p className="text-sm text-gray-900 dark:text-gray-300">{props.label}</p>
            <div className="mt-2">
                {props.options.map((option, index) => (
                    <div key={`${props.name}_${index}` } className="flex items-center">
                        <input 
                            type="radio"
                            id={option.value}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            value={option.value}
                            checked={props.value === option.value}
                            onChange={props.onChange}
                            disabled={props.disabled}
                            name={props.name}
                        />
                        <label 
                            htmlFor={option.value}
                            className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                            {option.label}
                        </label>
                    </div>
                ))}
            </div>
            {props.error && <p className="text-red-500 text-sm mt-1">{props.error}</p>}
        </div>
    )
}

export default Radio;