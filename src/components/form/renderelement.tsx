import { AllType } from "@/extras/types";
import { RenderElementProps, ValidationOptions, Fields } from "./types";
import { 
    Input, 
    Checkbox,
    Radio,
    Switch,
    Group,
    Tab,
    Select,
    SelectMultiple,
    AsyncSelect
} from '.';
import { useCallback, useEffect } from "react";
import AsyncSelectMultiple from "./select.async.multiple";

const validationFn = (value: AllType, options: ValidationOptions) => {
    if (options.required && !value) {
        return 'This field is required';
    }
    if (options.min && `${value}`.length < options.min) {
        return `This field must be at least ${options.min} characters`;
    }
    if (options.max && `${value}`.length > options.max) {
        return `This field must be at most ${options.max} characters`;
    }
    if (options.pattern && !options.pattern.test(`${value}`)) {
        return 'Invalid format';
    }
    if (options.custom) {
        return options.custom(value);
    }
    return '';
}

const RenderElement = (props: RenderElementProps) => {
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (['checkbox', 'radio', 'switch'].includes(props.type)) {
            props.setFields(prev =>{
                return {
                    ...prev,
                    data: {
                        ...prev.data,
                        [props.name]: e.target.checked
                    }
                }
            })
        } else {
            props.setFields(prev =>{
                return {
                    ...prev,
                    data: {
                        ...prev.data,
                        [props.name]: e.target.value
                    }
                }
            })
        }
        if (props.onChangeCallback) {
            props.onChangeCallback(props.name, props.fields, props.setFields);
        }
    }

    let unable = false;
    if (props.disabled !== undefined) {
        if (typeof props.disabled === 'boolean') {
            unable = props.disabled;
        } else {
            unable = props.disabled(props.fields, props.state);
        }
    }

    unable = props.globalDisabled || unable;

    let hide = false;
    if (props.hidden !== undefined) {
        if (typeof props.hidden === 'boolean') {
            hide = props.hidden;
        } else {
            hide = props.hidden(props.fields, props.state);
        }
    }

    const { fields, validation, name, setFields } = props;

    const Revalidate = useCallback(() => {
        const Validation = (value: AllType, fields: Fields, fn: (value: AllType, fields: Fields, validationFn: (value: AllType, options: ValidationOptions) => string) => string) => {
            const error = fn(value, fields, validationFn);
            setFields(prev => {
                return {
                    ...prev,
                    errors: {
                        ...prev.errors,
                        [name]: error
                    }
                }
            })
        }
        if (validation) {
            Validation(fields.data[name], fields, validation);
        }
    }, [fields, validation, name, setFields])

    useEffect(() => {
        Revalidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fields.data[name]])


    if (hide) {
        return <></>
    }


    switch (props.type) {
        case 'text':
        case 'password':
        case 'date':
            return (
                <Input
                    name={props.name}
                    type={props.type}
                    value={props.fields.data[props.name] as string}
                    onChange={onChange}
                    disabled={unable}   
                    label={props.setup.label}
                    required={props.required}
                    error={props.fields.errors[props.name]}
                />
            )
        case 'checkbox':
            return (
                <Checkbox
                    label={props.setup.label}
                    checked={props.fields.data[props.name] as boolean}
                    onChange={onChange}
                    disabled={unable}
                    value=""
                    required={props.required}
                    error={props.fields.errors[props.name]}
                />
            )
        case 'radio':
            return (
                <Radio
                    name={props.name}
                    value={props.fields.data[props.name] as string}
                    options={props.setup.options}
                    onChange={onChange}
                    disabled={unable}
                    label={props.setup.label}
                    required={props.required}
                    error={props.fields.errors[props.name]}
                />
            )
        case 'switch':
            return (
                <Switch
                    name={props.name}
                    checked={props.fields.data[props.name] as boolean}
                    onChange={onChange}
                    disabled={unable}
                    label={props.setup.label}
                    value=""
                    required={props.required}
                    error={props.fields.errors[props.name]}
                />
            )
        case 'group':
            return (
                <Group
                    cols={props.setup.cols}
                    content={props.setup.content}
                    title={props.setup.title}
                    subtitle={props.setup.subtitle}
                    fields={props.fields}
                    setFields={props.setFields}
                    state={props.state}
                    globalDisabled={props.globalDisabled}
                />
            )
        case 'tab':
            return (
               <Tab
                    cols={props.setup.cols}
                    content={props.setup.content}
                    onBeforeSwitchTab={props.setup.onBeforeSwitchTab}
                    title={props.setup.title}
                    subtitle={props.setup.subtitle}
                    fields={props.fields}
                    setFields={props.setFields}
                    state={props.state}
                    globalDisabled={props.globalDisabled}
                />
            )
        
        case 'select':
            return (
                <Select
                    label={props.setup.label}
                    onChange={onChange}
                    options={props.setup.options}
                    value={props.fields.data[props.name] as string}
                    disabled={unable}
                    error={props.fields.errors[props.name]}
                    required={props.required}
                    name={props.name}
                />
            )

        case 'select-multiple':
            return (
                <SelectMultiple
                    label={props.setup.label}
                    onChange={onChange}
                    options={props.setup.options}
                    value={props.fields.data[props.name] as string}
                    disabled={unable}
                    error={props.fields.errors[props.name]}
                    required={props.required}
                    name={props.name}
                />
            )

        case 'async-select':
            return (
                <AsyncSelect
                    label={props.setup.label}
                    onChange={onChange}
                    getData={props.setup.getData}
                    mapper={props.setup.mapper}
                    value={props.fields.data[props.name] as string}
                    disabled={unable}
                    error={props.fields.errors[props.name]}
                    required={props.required}
                    name={props.name}
                    searchKeyword={props.setup.searchKeyword}
                />
            )

        case 'async-select-multiple':
            return (
                <AsyncSelectMultiple
                    label={props.setup.label}
                    onChange={onChange}
                    getData={props.setup.getData}
                    mapper={props.setup.mapper}
                    value={props.fields.data[props.name] as string}
                    disabled={unable}
                    error={props.fields.errors[props.name]}
                    required={props.required}
                    name={props.name}
                    searchKeyword={props.setup.searchKeyword}
                />
            )

        default:
            return <>not implemented</>
    }
}

export default RenderElement;