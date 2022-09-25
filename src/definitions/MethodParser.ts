import {Parser, ParserResult} from "./Parser";

const VALID_TRANSPORTS = [
    'PATH',
    'QUERY',
    'HEADER',
    'COOKIE',
    'BODY'
]

const VALID_METHODS = [
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'HEAD',
    'DELETE'
]

enum ParseState {
    METHOD_NAME = 'METHOD_NAME',
    ARGUMENTS_START = 'ARGUMENTS_START',
    ARGUMENT_TRANSPORT_TYPE = 'ARGUMENT_TRANSPORT_TYPE',
    ARGUMENT_TRANSPORT_NAME = 'ARGUMENT_TRANSPORT_NAME',
    ARGUMENT_NAME = 'ARGUMENT_NAME',
    ARGUMENT_TYPE = 'ARGUMENT_TYPE',
    ARGUMENTS_END = 'ARGUMENTS_END',
    RETURN_TYPE = 'RETURN_TYPE',
    REST_METHOD = 'REST_METHOD',
    REST_PATH = 'REST_PATH'
}

export interface Argument {
    transportType:string
    transportName:string
    name:string
    type:string
}

export interface Method {
    name: string
    returnType:string
    restMethod:string
    restPath:string
    definition:string
    arguments:Argument[]
}

export interface Result extends ParserResult {
    methods:Method[]
}

export class MethodParser extends Parser<Result> {

    private currentMethod:Method = null;
    
    private currentArgument:Argument = null;

    private state:ParseState = ParseState.METHOD_NAME;

    private methods: Method[] = [];

    private readonly restMethod: boolean;

    constructor(definition, restMethod?:boolean) {
        super(definition);
        this.restMethod = !!restMethod;
    }

    private createArgument():Argument {
        return {
            name:'',
            transportType: '',
            transportName: '',
            type: ''
        };
    }

    private wasLastParsed(chr) {
        const text = this.currentMethod?.definition.trim();
        return text[text.length - 1] === chr;
    }

    private parseMethodName() {
        if (!this.currentMethod?.name &&
            this.isWhitespace()) {
            //Ignore leading whitespace
            return;
        }

        if (!this.currentMethod) {
            this.currentMethod = {
                name: '',
                definition: '',
                arguments: [],
                restMethod: '',
                restPath: '',
                returnType: ''
            };
            this.methods.push(this.currentMethod);
        }

        if (this.currentMethod?.name &&
            this.isWhitespace()) {
            ///Ends method name
            this.state = ParseState.ARGUMENTS_START;
            return;
        }

        if (this.currentMethod?.name &&
            this.currentChr === '(') {
            ///Ends method name
            this.state = ParseState.ARGUMENTS_START;
            this.parseArgumentStart();
            return;
        }

        if (!this.currentMethod?.name && !this.isAlpha()) {
            //First char is not alpha
            this.raiseParseError('Method must begin with alpha characters');
            return;
        }

        this.requireAlphanumeric('Method name');

        this.currentMethod.name += this.currentChr;
        this.currentMethod.definition += this.currentChr;
    }


    private parseArgumentTransportType() {
        const emptyTransportType = (!this.currentArgument || !this.currentArgument.transportType);
        if (emptyTransportType &&
            this.isWhitespace()) {
            //Ignore leading whitespace
            return;
        }

        if (emptyTransportType &&
            this.currentChr === ')') {
            //End arguments
            this.currentMethod.definition += this.currentChr;
            this.state = ParseState.ARGUMENTS_END;
            return;
        }

        if (!this.currentArgument) {
            this.currentArgument = this.createArgument();
            this.currentMethod.arguments.push(this.currentArgument);
        }

        if (this.currentChr === '@') {
            //@ starts transport name
            if (!this.wasLastParsed('@')) {
                this.currentMethod.definition += this.currentChr;
                return;
            }
        }

        if (this.currentArgument.transportType &&
            ('[' === this.currentChr || this.isWhitespace())) {
            const transport = this.currentArgument.transportType.toUpperCase();
            if (VALID_TRANSPORTS.indexOf(transport) === -1) {
                this.raiseParseError(`Invalid transport type: ${transport}. Must be one of ${VALID_TRANSPORTS.join(', ')}`);
            }
            this.currentMethod.definition += this.currentChr;
            if (this.isWhitespace()) {
                //Space ends transport
                this.state = ParseState.ARGUMENT_NAME;
            } else {
                // "[" starts name
                this.state = ParseState.ARGUMENT_TRANSPORT_NAME;
            }
            return;
        }

        if (!this.currentArgument.transportType &&
            !this.wasLastParsed('@')) {
            this.raiseParseError('Transport type must start with @');
            return;
        }

        if (!this.isAlpha()) {
            //Char is not alpha
            this.raiseParseError('Transport type must only contain alpha characters');
            return;
        }


        this.currentArgument.transportType += this.currentChr;
        this.currentMethod.definition += this.currentChr;
    }

    private parseArgumentName() {
        if (!this.currentArgument) {
            this.currentArgument = this.createArgument();
            this.currentArgument.transportType = 'query'; //We default to query
            this.currentMethod.arguments.push(this.currentArgument);
        }

        if (!this.currentArgument.name &&
            this.isWhitespace()) {
            //Ignore leading whitespace
            return;
        }

        if (this.currentArgument.name &&
            this.isWhitespace() &&
            this.isNextChar(':')) {
            //Ignore whitespace between name and colon
            return;
        }

        if (this.currentArgument.name &&
            this.currentChr === ':') {
            //Colon ends name
            this.currentMethod.definition += this.currentChr;
            this.state = ParseState.ARGUMENT_TYPE;
            return;
        }

        if (!this.currentArgument.name &&
            !this.isAlpha()) {
            //First char is not alpha - ignore
            this.raiseParseError('Argument name needs to start with an alpha character');
            return;
        }

        this.requireAlphanumeric('Argument name');

        this.currentArgument.name += this.currentChr;
        this.currentMethod.definition += this.currentChr;
    }

    private parseArgumentType() {
        if (!this.currentArgument) {
            throw new Error('Invalid state - got argument type without current argument')
        }

        if (!this.currentArgument.type &&
            this.isWhitespace()) {
            //Ignore leading whitespace
            return;
        }

        if (this.currentArgument.type &&
            this.isWhitespace()) {
            if (this.isNextChar([')',','])) {
                this.skipWhitespace();
            }
        }

        if (this.currentArgument.type &&
            [')',','].indexOf(this.currentChr) > -1) {
            //Parenthesis end or comma ends type
            this.currentMethod.definition += this.currentChr;
            this.currentArgument = null;
            switch(this.currentChr) {
                case ')':
                    this.state = ParseState.ARGUMENTS_END;
                    break;
                case ',':
                    this.state = this.restMethod ? ParseState.ARGUMENT_TRANSPORT_TYPE : ParseState.ARGUMENT_NAME;
                    break;
            }
            return;
        }


        if (!this.currentArgument.type &&
            !this.isAlpha()) {
            //First char is not alpha - ignore
            this.raiseParseError('Argument type must start with alpha characters');
            return;
        }

        this.requireAlphanumeric('Argument type');

        this.currentArgument.type += this.currentChr;
        this.currentMethod.definition += this.currentChr;
    }

    private parseReturnType() {
        if (!this.currentMethod?.returnType &&
            this.isWhitespace()) {
            //Ignore leading whitespace
            return;
        }

        if (!this.currentMethod?.returnType &&
            this.currentChr === ')') {
            if (!this.wasLastParsed(')') &&
                !this.wasLastParsed(':')) {
                this.currentMethod.definition += this.currentChr;
                return;
            }
        }

        if (!this.currentMethod?.returnType &&
            this.wasLastParsed(')') &&
            this.currentChr === ':') {
            if (!this.wasLastParsed(':')) {
                this.currentMethod.definition += this.currentChr;
                return;
            }
        }

        if (!this.currentMethod?.returnType && !this.wasLastParsed(':')) {
            this.raiseParseError('Return type must be prefixed by a colon (:)');
            return;
        }

        if (!this.currentMethod?.returnType &&
            !this.isAlpha()) {
            //First char is not alpha - ignore
            this.raiseParseError('Return type must start with alpha characters');
            return;
        }

        if (this.currentChr === '\n') {
            //Ends return type
            this.currentMethod.definition += this.currentChr;
            this.state = this.restMethod ? ParseState.REST_METHOD : ParseState.METHOD_NAME
            if (!this.restMethod) {
                this.currentMethod = null;
            }
            return;
        }

        this.requireAlphanumeric('Return type');

        this.currentMethod.returnType += this.currentChr;
        this.currentMethod.definition += this.currentChr;
    }

    protected reset() {
        super.reset();
        this.methods = [];
        this.currentMethod = null;
        this.currentArgument = null;
        this.state = ParseState.METHOD_NAME;
    }

    private parseArgumentStart() {
        if (this.isWhitespace()) {
            return;
        }

        if (this.currentChr !== '(') {
            this.raiseParseError('Method requires a parenthesis start');
        }

        this.currentMethod.definition += this.currentChr;

        if (this.isNextChar(')')) {
            //No arguments
            this.state = ParseState.ARGUMENTS_END;
        } else {
            this.state = this.restMethod ? ParseState.ARGUMENT_TRANSPORT_TYPE : ParseState.ARGUMENT_NAME;
        }
    }

    private parseArgumentsEnd() {
        if (this.isWhitespace()) {
            return;
        }

        if ([')',':'].indexOf(this.currentChr)  === -1) {
            this.raiseParseError('Parenthesis must be followed by a colon ":"')
        }

        if (this.currentChr === ')') {
            if (this.wasLastParsed(')')) {
                this.raiseParseError('Parenthesis end must only appear once')
            }
            this.currentMethod.definition += this.currentChr;
            this.state = ParseState.RETURN_TYPE;
        }

        if (this.currentChr === ':') {
            this.currentMethod.definition += this.currentChr;
            this.state = ParseState.RETURN_TYPE;
        }
    }

    private parseRestMethod() {
        if (!this.currentMethod?.restMethod &&
            this.isWhitespace()) {
            return;
        }

        if (this.currentMethod?.restMethod && this.currentChr === ' ') {
            const method = this.currentMethod.restMethod.toUpperCase();
            if (VALID_METHODS.indexOf(method) === -1) {
                this.raiseParseError(`REST method is not valid: ${method}. Must be one of ${VALID_METHODS.join(', ')}`);
            }

            this.currentMethod.definition += this.currentChr;
            this.state = ParseState.REST_PATH;
            return;
        }

        this.requireAlpha('REST method');

        this.currentMethod.definition += this.currentChr;
        this.currentMethod.restMethod += this.currentChr
    }

    private parseRestPath() {
        if (!this.currentMethod?.restPath &&
            this.isWhitespace()) {
            return;
        }

        if (!this.currentMethod?.restPath && this.currentChr !== '/') {
            this.raiseParseError('REST path must start with /');
            return;
        }

        if (this.currentMethod?.restPath && this.currentChr === '\n') {
            //Ends method
            this.currentMethod.definition += this.currentChr;
            this.currentMethod = null;
            this.currentArgument = null;
            this.state = ParseState.METHOD_NAME;
            return;
        }

        if (this.currentChr === '/' && this.wasLastParsed('/')) {
            this.raiseParseError('REST path should not contain double slashes');
            return;
        }

        if (!this.doesMatch(/[a-z0-9_{}\/]/i)) {
            this.raiseParseError('REST path must only contain alphanumeric characters and forward slashes');
            return;
        }

        this.currentMethod.definition += this.currentChr;
        this.currentMethod.restPath += this.currentChr;
    }

    private parseArgumentTransportName() {
        if (!this.currentArgument.transportName &&
            this.isWhitespace()) {
            //Ignore whitespace
            return;
        }

        if (this.currentChr === ']') {
            if (!this.currentArgument.transportName) {
                this.raiseParseError('Transport name was missing');
            }
            this.currentMethod.definition += this.currentChr;
            this.state = ParseState.ARGUMENT_NAME;
            return;
        }

        if (!this.doesMatch(/[a-z0-9_-]/i)) {
            this.raiseParseError('Transport name must only contain alphanumeric characters and dashes');
            return;
        }

        this.currentMethod.definition += this.currentChr;
        this.currentArgument.transportName += this.currentChr;
    }
    

    protected parseState() {
        switch (this.state) {
            case ParseState.METHOD_NAME:
                this.parseMethodName();
                break;
            case ParseState.ARGUMENTS_START:
                this.parseArgumentStart();
                break;
            case ParseState.ARGUMENT_TRANSPORT_TYPE:
                this.parseArgumentTransportType();
                break;
            case ParseState.ARGUMENT_TRANSPORT_NAME:
                this.parseArgumentTransportName();
                break;
            case ParseState.ARGUMENT_NAME:
                this.parseArgumentName();
                break;
            case ParseState.ARGUMENT_TYPE:
                this.parseArgumentType();
                break;
            case ParseState.ARGUMENTS_END:
                this.parseArgumentsEnd();
                break;
            case ParseState.RETURN_TYPE:
                this.parseReturnType();
                break;
            case ParseState.REST_METHOD:
                this.parseRestMethod();
                break;
            case ParseState.REST_PATH:
                this.parseRestPath();
                break;
        }
    }

    protected toResult() {
        return {
            methods: this.methods
        }
    }

    validate() {
        const {methods} = this.parse();

        methods.forEach(method => {
            if (!method.name) {
                this.raiseParseError('Missing valid method name');
            }

            if (!method.returnType) {
                this.raiseParseError('Missing valid return type');
            }

            if (this.restMethod) {
                if (!method.restMethod) {
                    this.raiseParseError('Missing REST method');
                }

                if (!method.restPath) {
                    this.raiseParseError('Missing REST path');
                }
            }

            for(let i = 0; i < method.arguments.length; i++) {
                const arg = method.arguments[i];
                if (!this.restMethod) {
                    if (!arg.transportType) {
                        this.raiseParseError(`Missing transport for argument ${i + 1}`);
                    }

                    if (VALID_TRANSPORTS.indexOf(arg.transportType.toUpperCase()) === -1) {
                        this.raiseParseError(`Invalid transport for argument ${i + 1}: ${arg.transportType.toUpperCase()}`);
                    }
                }

                if (!arg.name) {
                    this.raiseParseError(`Missing name for argument ${i + 1}`);
                }

                if (!arg.type) {
                    this.raiseParseError(`Missing type for argument ${i + 1}`);
                }

            }
        })
    }
}