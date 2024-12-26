import { useState } from "react";
import Label from "./label";
import { DefaultFormProps, InputProps } from "./types";

const className = (error?: string) => {
    const defaultStyle = 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5';
    if (error) {
        return `${defaultStyle} border-red-500`;
    }
    return defaultStyle;
}

const Input = (props: InputProps & DefaultFormProps) => {
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
    return (
        <div className="mb-5">
            <Label 
                label={props.label} 
                name={props.name} 
                required={props.required}
            />
            <input 
                type={props.type === 'password' && passwordVisible ? 'text' : props.type}
                id={props.name} 
                className={className(props.error)} 
                placeholder={props.placeholder}
                value={props.value || ''}
                onChange={props.onChange}
                name={props.name}
                disabled={props.disabled}
            />
            {props.error && <p className="text-red-500 text-sm mt-1">{props.error}</p>}
            {props.type === 'password' && (
                <div>
                    <input
                        type="checkbox"
                        className="mt-2 mr-2"
                        onChange={() => setPasswordVisible(!passwordVisible)}
                        id="show-password"
                    />
                    <Label 
                        label="Show Password" 
                        name="show-password"
                    />
                </div>
            )}
        </div>
    )
}

export default Input;