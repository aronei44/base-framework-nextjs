import { DefaultFormProps, SelectProps } from "./types";
import Label from "./label";
import ReactSelect from "react-select";

const SelectMultiple = (props: SelectProps & DefaultFormProps) => {
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
                isMulti
                onChange={(newValue)=> {
                    const newValues = newValue.map((value) => value.value).join(',');
                    const e = {
                        target: {
                            value: newValues,
                            name: props.name
                        }
                    } as React.ChangeEvent<HTMLInputElement>;
                    props.onChange(e);
                }}
                name={props.name}
                id={props.name}
                value={props.options.filter(option => props.value?.split(',').includes(option.value))}
            />
            {props.error && <p className="text-red-500 text-sm mt-1">{props.error}</p>}
        </div>
    )
}

export default SelectMultiple;