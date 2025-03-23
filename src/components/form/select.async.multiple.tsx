import { DefaultFormProps, AsyncSelectMultipleProps } from "./types";
import Label from "./label";
import ReactSelect from "react-select";
import { useEffect, useState } from "react";

const AsyncSelectMultiple = (props: AsyncSelectMultipleProps & DefaultFormProps) => {
    const [options, setOptions] = useState<{ label: string, value: string }[]>([]);
    const [inval, setInval] = useState<string>('');

    const getData = async (val: string) => {
        const response = await props.getData({limit: 10, page: 1}, {[props.searchKeyword]: val});
        setOptions(props.mapper(response.data));
    }

    useEffect(() => {
        getData(inval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inval]);
    return (
        <div className="mb-5">
            <Label
                label={props.label}
                name={props.name}
                required={props.required}
            />
            <ReactSelect 
                options={options}
                isSearchable
                isMulti
                onChange={(newValue)=> {
                    const newValues = newValue.map((value) => value.value);
                    const e = {
                        target: {
                            value: newValues,
                            name: props.name
                        }
                    }
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    props.onChange(e as any);
                }}
                name={props.name}
                id={props.name}
                value={options.filter(option => props.value?.includes(option.value))}
                isDisabled={props.disabled}
                onInputChange={(val) => setInval(val)}
                inputValue={inval}
            />
            {props.error && <p className="text-red-500 text-sm mt-1">{props.error}</p>}
        </div>
    )
}

export default AsyncSelectMultiple;