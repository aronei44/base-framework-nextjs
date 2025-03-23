import { DefaultFormProps, AsyncSelectProps } from "./types";
import Label from "./label";
import ReactSelect from "react-select";
import { useEffect, useState } from "react";

const AsyncSelect = (props: AsyncSelectProps & DefaultFormProps) => {
    const [options, setOptions] = useState<{ label: string, value: string | number | boolean }[]>([]);
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
                onChange={(newValue)=> {
                    const e = {
                        target: {
                            value: newValue?.value,
                            name: props.name
                        }
                    } as React.ChangeEvent<HTMLInputElement>;
                    props.onChange(e);
                }}
                onInputChange={(value) => {
                    setInval(value);
                }}
                inputValue={inval}
                name={props.name}
                id={props.name}
                value={options.find(option => option.value === props.value)}
            />
            {props.error && <p className="text-red-500 text-sm mt-1">{props.error}</p>}
        </div>
    )
}

export default AsyncSelect;