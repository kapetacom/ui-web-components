import React, { useState } from 'react';
import { State, Store } from '@sambego/storybook-state';

import {
    FormSelect,
    FormButtons,
    FormContainer,
    FormTextarea,
    FormInput,
    Type,
    DefaultFormLayout,
    FormField,
    FormFieldType,
} from '../src';
import { Checkbox } from '../src/form/Checkbox';
import { FormAutocomplete } from '../src/form/inputs/FormAutocomplete';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import { Button, Typography } from '@mui/material';

let dropdownState = new Store({
    test1: [],
    test2: [],
    test3: ['DK', 'RO'],
    test4: ['GR'],
});

export default {
    title: 'Form Elements',
};

export const SimpleCheckbox = () => {
    const [value, setValue] = useState(false);

    return (
        <div>
            <div style={{ padding: '10px' }}>
                <Checkbox onChange={(value) => setValue(value)} value={value} />
            </div>
        </div>
    );
};

export const FormInputs = () => {
    const helpText = 'This is some help text';

    return (
        <div style={{ padding: '15px' }}>
            <FormContainer>
                <DefaultFormLayout sx={{ mt: 2 }} gap={2}>
                    <FormInput help={helpText} name={'text'} label={'Text Value'} type={Type.TEXT} />
                    <FormInput help={helpText} name={'email'} label={'Email Value'} type={Type.EMAIL} />
                    <FormInput help={helpText} name={'num'} label={'Number Value'} type={Type.NUMBER} />
                    <FormInput help={helpText} name={'pw'} label={'Password Value'} type={Type.PASSWORD} />
                    <FormInput help={helpText} name={'date'} label={'Date Value'} type={Type.DATE} />
                </DefaultFormLayout>
            </FormContainer>
        </div>
    );
};

export const FormFieldsWithCallbacks = () => {
    const onFocus = () => console.log("I'm focused!");
    const onBlur = () => console.log("I'm blurred!");

    return (
        <div style={{ padding: '15px' }}>
            <Typography variant="body1">Focus and blur events are logged in the console</Typography>
            <FormContainer>
                <FormField
                    onFocus={onFocus}
                    onBlur={onBlur}
                    name={'text'}
                    label={'Text Value'}
                    type={FormFieldType.STRING}
                />
            </FormContainer>
        </div>
    );
};

export const FormFieldWithAutoFocus = () => {
    return (
        <div style={{ padding: '15px' }}>
            <Typography variant="body1">Form field is automatically focused</Typography>
            <FormContainer>
                <FormField name={'text'} label={'Text Value'} type={FormFieldType.STRING} autoFocus />
            </FormContainer>
        </div>
    );
};

export const FormTextareas = () => {
    const helpText = 'This is some help text';

    return (
        <div style={{ padding: '15px' }}>
            <FormContainer>
                <FormInput help={helpText} name={'text'} label={'Text Value'} type={Type.TEXT} />
                <FormTextarea help={helpText} name={'multi'} label={'Multi line'} validation={['required']} />
                <FormInput help={helpText} name={'text'} label={'Text Value'} type={Type.TEXT} />
            </FormContainer>
        </div>
    );
};

export const FormSelects = () => {
    const helpText = 'This is some help text';
    const options = {
        blue: 'Blue',
        red: 'Red',
        white: 'White',
        black: 'Black',
    };

    return (
        <div style={{ padding: '15px' }}>
            <FormContainer>
                <FormInput help={helpText} name={'text'} label={'Text Value'} type={Type.TEXT} />
                <FormSelect help={helpText} name={'multi'} label={'Multi line'} options={options} />
                <FormInput help={helpText} name={'text'} label={'Text Value'} type={Type.TEXT} />
            </FormContainer>
        </div>
    );
};

export const MixedInputs = () => {
    let inputReturnCallback = (inputReturn) => {};

    let handleSubmit = (event) => {
        event.preventDefault();
    };
    return (
        <div
            style={{
                padding: '15px',
            }}
        >
            <form onSubmit={handleSubmit}>
                <FormInput
                    name={'SingleInput1'}
                    value={'Test value'}
                    label={'Single line input'}
                    validation={['required']}
                    help={'Specify the name of your block.'}
                    onChange={inputReturnCallback}
                />

                <FormInput
                    name={'SingleInput2'}
                    value={''}
                    label={'Single line input'}
                    validation={['required']}
                    help={'Specify the name of your block.'}
                    onChange={inputReturnCallback}
                />

                <FormInput
                    name={'SingleInput3'}
                    value={''}
                    label={'Single line input type number'}
                    validation={['required']}
                    help={'Specify the ID of your block.'}
                    type={Type.NUMBER}
                    onChange={inputReturnCallback}
                />

                <FormTextarea
                    name={'MultiLineInput1'}
                    value={''}
                    label={'Multiline line input disabled'}
                    validation={['required']}
                    help={'Specify the description of your block.'}
                    onChange={inputReturnCallback}
                    disabled={true}
                />
                <FormTextarea
                    name={'MultiLineInput2'}
                    value={''}
                    label={'Multiline line input'}
                    validation={['required']}
                    help={'Specify the description of your block.'}
                    onChange={inputReturnCallback}
                />
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
};

export const CountrySelects = () => {
    const countryList = [
        'Algeria',
        'American Samoa',
        'Andorra',
        'Angola',
        'Anguilla',
        'antarctica',
        'Antigua and Barbuda',
        'argentina',
        'Armenia',
        'Aruba',
        'australia',
        'Austria',
        'Azerbaijan',
        'bahamas (the)',
        'bahrain',
        'Bangladesh',
        'Barbados',
        'Belarus',
        'Belgium',
    ];

    let countryCodeList2 = {
        DK: 'Denmark',
        RO: 'Romania',
        GR: 'Greece',
    };

    return (
        <div
            style={{
                width: '600px',
                padding: '10px',
            }}
        >
            <form onSubmit={() => {}}>
                <State store={dropdownState}>
                    {(state) => [
                        <FormSelect
                            name="test1"
                            value={dropdownState.get('test1')}
                            label={'Single Selection '}
                            validation={['required']}
                            help={'this is another message'}
                            options={countryList}
                            onChange={(name: string, valueIn: string | string[]) =>
                                dropdownState.set({ [name]: valueIn })
                            }
                        />,

                        <br></br>,

                        <FormSelect
                            name="test2"
                            value={dropdownState.get('test2')}
                            label={'Multi Selection '}
                            validation={['required']}
                            help={'this is another message'}
                            options={countryList}
                            onChange={(name: string, valueIn: string | string[]) =>
                                dropdownState.set({ [name]: valueIn })
                            }
                            multi={true}
                        />,

                        <br></br>,

                        <FormSelect
                            name="test3"
                            value={dropdownState.get('test3')}
                            label={'Multi Selection '}
                            validation={['required']}
                            help={'this is another message'}
                            options={countryCodeList2}
                            onChange={(name: string, valueIn: string | string[]) =>
                                dropdownState.set({ [name]: valueIn })
                            }
                            multi={true}
                        />,

                        <br></br>,

                        <FormSelect
                            name="test4"
                            value={dropdownState.get('test4')}
                            label={'Single Selection '}
                            validation={['required']}
                            help={'this is another message'}
                            options={countryCodeList2}
                            onChange={(name: string, valueIn: string | string[]) =>
                                dropdownState.set({ [name]: valueIn })
                            }
                        />,

                        <br></br>,

                        <FormSelect
                            name="test5"
                            value={''}
                            label={'Single Selection disabled'}
                            validation={['required']}
                            help={'this is another message'}
                            disabled={true}
                            options={countryList}
                            onChange={(name, input) => {}}
                        />,
                        <br></br>,
                        <br></br>,
                    ]}
                </State>

                <input type="submit" value="Submit" />
            </form>
        </div>
    );
};

export const FormButton = () => {
    return (
        <div style={{ width: 500 }}>
            <FormContainer
                onSubmit={() => {
                    console.log('Submitted the form');
                }}
            >
                <FormInput
                    onChange={() => {
                        console.log('lalalala');
                    }}
                    label="Test"
                    name=""
                    value=""
                    validation={['required']}
                    type={Type.TEXT}
                />

                <FormButtons>
                    <Button
                        color={'error'}
                        variant={'contained'}
                        onClick={() => {
                            console.log('Clicked cancel!');
                        }}
                    >
                        Test
                    </Button>

                    <Button color={'primary'} variant={'contained'} type={'submit'}>
                        Test
                    </Button>
                </FormButtons>
            </FormContainer>
        </div>
    );
};

export const FormAutocompletes = () => {
    const [formData, setFormData] = useState({});
    const [apiMovies, setApiMovies] = useState<Movie[]>([]);
    const [isLoadingMovies, setIsLoadingMovies] = useState(false);

    return (
        <div style={{ width: 500 }}>
            <FormContainer
                onSubmitData={async (data) => {
                    setFormData(data);
                }}
            >
                <FormAutocomplete
                    name="best_movie_of_all_time"
                    label="Best movie of all time"
                    onChange={(name, value) => {
                        console.log(name, value);
                    }}
                    options={top100Movies}
                    getOptionLabel={(option) => {
                        const isMovieOption = typeof option === 'object' && 'name' in option;
                        return isMovieOption ? option.name : option;
                    }}
                    isOptionEqualToValue={(option, value) => value?.name === option.name}
                    autoHighlight // Highlight first match in the listbox
                    autoFocus
                />

                <FormAutocomplete
                    name="top_3_movies"
                    label="Top 3 movies"
                    onChange={(name, value) => {
                        console.log(name, value);
                    }}
                    options={top100Movies}
                    getOptionLabel={(option) => {
                        const isMovieOption = typeof option === 'object' && 'name' in option;
                        return isMovieOption ? option.name : option;
                    }}
                    isOptionEqualToValue={(option, value) => value?.name === option.name}
                    hidePopupIndicator
                    multiple
                    limitTags={3} // Max tags to show when multiple
                    filterSelectedOptions // Hide selected options
                    autoHighlight // Highlight first match
                    freeSolo // Allow free text
                    // Example of how to render the options
                    renderOption={(props, option, state) => {
                        return (
                            <li {...props}>
                                <span>
                                    <strong>{option.name}</strong> ({option.year})
                                </span>
                            </li>
                        );
                    }}
                    // Example of how to render tags
                    renderTags={(value, getTagProps, ownerState) => {
                        return value.map((option, index) => {
                            const isMovieOption = typeof option === 'object' && 'name' in option;
                            return (
                                <Chip
                                    avatar={
                                        <Avatar>
                                            {isMovieOption ? option.name.charAt(0) : (option as string).charAt(0)}
                                        </Avatar>
                                    }
                                    label={isMovieOption ? option.name : option}
                                    {...getTagProps({ index })}
                                    style={{ marginRight: 5 }}
                                    variant="outlined"
                                    color="primary"
                                />
                            );
                        });
                    }}
                />

                <FormAutocomplete
                    name="search_for_a_movie"
                    label="Search for a movie (API)"
                    onChange={(name, value) => {
                        console.log('onChange', { name, value });
                    }}
                    onInputChange={async (event, value, reason) => {
                        console.log('onInputChange', { event, value, reason });

                        // Simulate API call
                        setIsLoadingMovies(true);
                        await new Promise((resolve) => setTimeout(resolve, 500));
                        const filteredMovies =
                            value === ''
                                ? []
                                : top100Movies.filter((movie) =>
                                      movie.name.toLowerCase().includes(value.toLowerCase())
                                  );
                        setApiMovies(filteredMovies);
                        setIsLoadingMovies(false);
                    }}
                    loading={isLoadingMovies}
                    options={apiMovies}
                    getOptionLabel={(option) => {
                        const isMovieOption = typeof option === 'object' && 'name' in option;
                        return isMovieOption ? option.name : option;
                    }}
                    isOptionEqualToValue={(option, value) => value?.name === option.name}
                    autoHighlight // Highlight first match
                    freeSolo // Allow free text
                />

                <FormButtons>
                    <Button type={'submit'} color="primary" variant="contained">
                        Save
                    </Button>
                </FormButtons>
            </FormContainer>

            <b>Submitted data</b>
            <pre>{JSON.stringify(formData, null, 2)}</pre>
        </div>
    );
};

type Movie = { name: string; year: number };

// Example data to use in the Autocomplete
const top100Movies: Movie[] = [
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
