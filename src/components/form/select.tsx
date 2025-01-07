import { DefaultFormProps, SelectProps } from "./types";
import Label from "./label";
import ReactSelect from "react-select";

const Select = (props: SelectProps & DefaultFormProps) => {
    return (
        <div className="mb-5">
            <Label
                label={props.label}
                name={props.name}
                required={props.required}
            />
            <ReactSelect 
                options={props.options}
                isSearchable
                onChange={(newValue)=> {
                    const e = {
                        target: {
                            value: newValue?.value,
                            name: props.name
                        }
                    } as React.ChangeEvent<HTMLInputElement>;
                    props.onChange(e);
                }}
                name={props.name}
                id={props.name}
                value={props.options.find(option => option.value === props.value)}
            />
            {props.error && <p className="text-red-500 text-sm mt-1">{props.error}</p>}
        </div>
    )
}

export default Select;