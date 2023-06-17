import { DefaultValues, useForm as useReactHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

type UseFormProps<T> = {
    schema: z.ZodType<T, any, any>;
    onSubmit: (values: T) => void;
    defaultValues?: DefaultValues<T> | ((payload?: unknown) => Promise<T>);
};

export const useForm = <T extends Record<string, any>>(props: UseFormProps<T>) => {
    const { schema, defaultValues, onSubmit } = props;

    const { handleSubmit, ...rest } = useReactHookForm<T>({
        resolver: zodResolver(schema),
        defaultValues,
    });

    return {
        ...rest,
        onSubmit: handleSubmit(onSubmit),
    };
};
