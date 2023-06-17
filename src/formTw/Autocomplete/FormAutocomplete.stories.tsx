import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import FormAutocomplete from './FormAutocomplete';
import { z } from 'zod';
import { useForm } from '../useForm';
import { FormState } from 'react-hook-form';

const meta: Meta<typeof FormAutocomplete> = {
    title: 'Form Tailwind/FormAutocomplete',
    component: FormAutocomplete,
};

export default meta;

type Story = StoryObj<typeof FormAutocomplete>;

const createStory = (
    title: string,
    description: string,
    useFormProps?: Pick<Parameters<typeof useForm>[0], 'defaultValues'>
) => {
    const { control, getValues, formState, onSubmit } = useForm({
        schema: z.object({
            movie: z.object({
                name: z.string(),
                year: z.number(),
            }),
        }),
        onSubmit: ({ movie }) => alert(`You submitted ${movie.name} (${movie.year})`),
        ...useFormProps,
    });

    return (
        <>
            <h3 className="font-bold">{title}</h3>
            <p className="mb-4 text-xs">{description}</p>
            <form
                onSubmit={onSubmit}
                className="relative my-8 w-96 border border-dashed p-8 pb-6 before:absolute before:left-0 before:top-0 before:z-[-1] before:translate-y-[-100%] before:transform before:font-mono before:text-[10px] before:text-gray-500 before:opacity-50 before:content-['<form>']"
            >
                <FormAutocomplete
                    label="Best movie"
                    control={control}
                    name="movie"
                    options={top100Movies}
                    getOptionLabel={(option) => option.name}
                    isOptionEqualToValue={(option, value) => option.name === value.name}
                />
                {/* Help text */}
                <p className="mt-4 text-right text-xs text-gray-500">Press enter to submit the form</p>
            </form>
            <FormDebug formState={formState} formValues={getValues()} />
        </>
    );
};

function FormDebug({ formState, formValues }: { formState: FormState<any>; formValues: any }) {
    const codeBlockClasses = 'block py-4 rounded-md whitespace-pre text-[10px] text-gray-500';

    return (
        <>
            <p className="text-xs font-medium">Form state</p>
            <code className={codeBlockClasses}>
                {JSON.stringify(
                    {
                        isDirty: formState.isDirty,
                        dirtyFields: formState.dirtyFields,
                        touchedFields: formState.touchedFields,
                        defaultValues: formState.defaultValues,
                        isSubmitted: formState.isSubmitted,
                        isSubmitSuccessful: formState.isSubmitSuccessful,
                        isSubmitting: formState.isSubmitting,
                        isLoading: formState.isLoading,
                        submitCount: formState.submitCount,
                        isValid: formState.isValid,
                        isValidating: formState.isValidating,
                        errors: formState.errors,
                    },
                    null,
                    4
                )}
            </code>

            <p className="text-xs font-medium">Form values</p>
            <code className={codeBlockClasses}>{JSON.stringify(formValues, null, 4)}</code>
        </>
    );
}

export const Empty: Story = {
    render: () => createStory('Autocomplete with no value', 'The form has no default value for the Autocomplete'),
};

export const WithDefaultValue: Story = {
    render: () =>
        createStory('Autocomplete with default value', 'The form has a default value for the Autocomplete', {
            defaultValues: {
                movie: top100Movies[0],
            },
        }),
};

// Example data to use in the Autocomplete
const top100Movies = [
    { name: 'The Shawshank Redemption', year: 1994 },
    { name: 'The Godfather', year: 1972 },
    { name: 'The Godfather: Part II', year: 1974 },
    { name: 'The Dark Knight', year: 2008 },
    { name: '12 Angry Men', year: 1957 },
    { name: "Schindler's List", year: 1993 },
    { name: 'Pulp Fiction', year: 1994 },
    { name: 'The Lord of the Rings: The Return of the King', year: 2003 },
    { name: 'The Good, the Bad and the Ugly', year: 1966 },
    { name: 'Fight Club', year: 1999 },
    { name: 'The Lord of the Rings: The Fellowship of the Ring', year: 2001 },
    { name: 'Star Wars: Episode V - The Empire Strikes Back', year: 1980 },
    { name: 'Forrest Gump', year: 1994 },
    { name: 'Inception', year: 2010 },
    { name: 'The Lord of the Rings: The Two Towers', year: 2002 },
    { name: "One Flew Over the Cuckoo's Nest", year: 1975 },
    { name: 'Goodfellas', year: 1990 },
    { name: 'The Matrix', year: 1999 },
    { name: 'Seven Samurai', year: 1954 },
    { name: 'Star Wars: Episode IV - A New Hope', year: 1977 },
    { name: 'City of God', year: 2002 },
    { name: 'Se7en', year: 1995 },
    { name: 'The Silence of the Lambs', year: 1991 },
    { name: "It's a Wonderful Life", year: 1946 },
    { name: 'Life Is Beautiful', year: 1997 },
    { name: 'The Usual Suspects', year: 1995 },
    { name: 'Léon: The Professional', year: 1994 },
    { name: 'Spirited Away', year: 2001 },
    { name: 'Saving Private Ryan', year: 1998 },
    { name: 'Once Upon a Time in the West', year: 1968 },
    { name: 'American History X', year: 1998 },
    { name: 'Interstellar', year: 2014 },
    { name: 'Casablanca', year: 1942 },
    { name: 'City Lights', year: 1931 },
    { name: 'Psycho', year: 1960 },
    { name: 'The Green Mile', year: 1999 },
    { name: 'The Intouchables', year: 2011 },
    { name: 'Modern Times', year: 1936 },
    { name: 'Raiders of the Lost Ark', year: 1981 },
    { name: 'Rear Window', year: 1954 },
    { name: 'The Pianist', year: 2002 },
    { name: 'The Departed', year: 2006 },
    { name: 'Terminator 2: Judgment Day', year: 1991 },
    { name: 'Back to the Future', year: 1985 },
    { name: 'Whiplash', year: 2014 },
    { name: 'Gladiator', year: 2000 },
    { name: 'Memento', year: 2000 },
    { name: 'The Prestige', year: 2006 },
    { name: 'The Lion King', year: 1994 },
    { name: 'Apocalypse Now', year: 1979 },
    { name: 'Alien', year: 1979 },
    { name: 'Sunset Boulevard', year: 1950 },
    { name: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb', year: 1964 },
    { name: 'The Great Dictator', year: 1940 },
    { name: 'Cinema Paradiso', year: 1988 },
    { name: 'The Lives of Others', year: 2006 },
    { name: 'Grave of the Fireflies', year: 1988 },
    { name: 'Paths of Glory', year: 1957 },
    { name: 'Django Unchained', year: 2012 },
    { name: 'The Shining', year: 1980 },
    { name: 'WALL·E', year: 2008 },
    { name: 'American Beauty', year: 1999 },
    { name: 'The Dark Knight Rises', year: 2012 },
    { name: 'Princess Mononoke', year: 1997 },
    { name: 'Aliens', year: 1986 },
    { name: 'Oldboy', year: 2003 },
    { name: 'Once Upon a Time in America', year: 1984 },
    { name: 'Witness for the Prosecution', year: 1957 },
    { name: 'Das Boot', year: 1981 },
    { name: 'Citizen Kane', year: 1941 },
    { name: 'North by Northwest', year: 1959 },
    { name: 'Vertigo', year: 1958 },
    { name: 'Star Wars: Episode VI - Return of the Jedi', year: 1983 },
    { name: 'Reservoir Dogs', year: 1992 },
    { name: 'Braveheart', year: 1995 },
    { name: 'M', year: 1931 },
    { name: 'Requiem for a Dream', year: 2000 },
    { name: 'Amélie', year: 2001 },
    { name: 'A Clockwork Orange', year: 1971 },
    { name: 'Like Stars on Earth', year: 2007 },
    { name: 'Taxi Driver', year: 1976 },
    { name: 'Lawrence of Arabia', year: 1962 },
    { name: 'Double Indemnity', year: 1944 },
    { name: 'Eternal Sunshine of the Spotless Mind', year: 2004 },
    { name: 'Amadeus', year: 1984 },
    { name: 'To Kill a Mockingbird', year: 1962 },
    { name: 'Toy Story 3', year: 2010 },
    { name: 'Logan', year: 2017 },
    { name: 'Full Metal Jacket', year: 1987 },
    { name: 'Dangal', year: 2016 },
    { name: 'The Sting', year: 1973 },
    { name: '2001: A Space Odyssey', year: 1968 },
    { name: "Singin' in the Rain", year: 1952 },
    { name: 'Toy Story', year: 1995 },
    { name: 'Bicycle Thieves', year: 1948 },
    { name: 'The Kid', year: 1921 },
    { name: 'Inglourious Basterds', year: 2009 },
    { name: 'Snatch', year: 2000 },
    { name: '3 Idiots', year: 2009 },
    { name: 'Monty Python and the Holy Grail', year: 1975 },
];
