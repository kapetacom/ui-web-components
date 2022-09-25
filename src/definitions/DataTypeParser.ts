import {Parser, ParserResult} from "./Parser"

enum ParseState {
    TYPE_NAME = 'TYPE_NAME',
    FIELD_NAME = 'FIELD_NAME',
    FIELD_TYPE = 'FIELD_TYPE',
    SUB_TYPE_START = 'SUB_TYPE_START',
    SUB_TYPE_END = 'SUB_TYPE_END',
    TYPE_END = 'TYPE_END'
}

export interface Field {
    name:string
    type:string|FieldType
    list:boolean
}

export interface Type {
    type:string
    fields:Field[]
}

export interface RootType extends Type {
    name: string
    fields:Field[]
    definition:string
}

export interface FieldType extends Type {
    parent:Type
    field:Field
}

interface Result extends ParserResult {
    types: RootType[]
}

export class DataTypeParser extends Parser<Result> {

    private currentRootType:RootType = null;

    private currentSubType:FieldType = null;

    private currentType:Type = null;
    
    private currentField:Field = null;

    private state:ParseState = ParseState.TYPE_NAME;

    private types: Type[] = [];


    private wasLastParsed(chr) {
        const text = this.currentRootType?.definition.trim();
        return text[text.length - 1] === chr;
    }

    private appendToDefinition(chr) {
        this.currentRootType.definition += chr;
    }

    protected reset() {
        super.reset();
        this.types = [];
        this.currentType = null;
        this.currentRootType = null;
        this.currentField = null;
        this.state = ParseState.TYPE_NAME;
    }

    private parseTypeName() {
        if (!this.currentRootType?.name &&
            this.isWhitespace()) {
            return;
        }

        if (!this.currentRootType) {
            this.currentType = this.currentRootType = {
                name: '',
                type: 'root',
                definition: '',
                fields: []
            };
            this.types.push(this.currentRootType);
        }

        if (this.currentRootType?.name &&
            this.isWhitespace() &&
            this.isNextChar('{')) {
            //Ignore whitespace after
            return;
        }

        if (this.currentRootType?.name &&
            this.currentChr === '{') {
            ///Ends method name
            this.currentRootType.definition += this.currentChr;
            this.state = ParseState.FIELD_NAME;
            return;
        }

        if (!this.currentRootType?.name && !this.isAlpha()) {
            //First char is not alpha
            this.raiseParseError('Type must begin with alpha characters');
            return;
        }

        this.requireAlphanumeric('Type name');

        this.currentRootType.name += this.currentChr;
        this.currentRootType.definition += this.currentChr;
    }

    private parseFieldName() {
        if (!this.currentField?.name &&
            this.isWhitespace()) {
            return;
        }

        if (this.currentField?.name &&
            this.isWhitespace() &&
            this.isNextChar(':')) {
            return;
        }

        if (this.currentChr === '}') {
            this.state = this.currentSubType ? ParseState.SUB_TYPE_END : ParseState.TYPE_END;
            if (this.currentSubType) {
                this.parseSubTypeEnd();
            } else {
                this.parseTypeEnd();
            }
            return;
        }

        if (!this.currentField) {
            this.currentField = {
                name: '',
                type: '',
                list: false
            };
            this.currentType.fields.push(this.currentField);
        }

        this.requireStartsWithAlpha(this.currentField?.name, 'Field name');

        if (this.currentField?.name &&
            this.currentChr === ':') {
            this.currentRootType.definition += this.currentChr;
            this.state = ParseState.FIELD_TYPE;
            return;
        }

        this.requireAlphanumeric('Field name');

        this.currentField.name += this.currentChr;
        this.currentRootType.definition += this.currentChr;
    }

    private parseFieldType() {
        if (!this.currentField?.type &&
            this.isWhitespace()) {
            return;
        }

        if (!this.currentField?.type &&
            this.currentChr === '{') {
            //Type is an object
            this.currentRootType.definition += this.currentChr;
            this.state = ParseState.SUB_TYPE_START;
            return;
        }

        if (!this.currentField?.type &&
            this.currentChr === '[') {
            //Type is an array of object
            this.currentRootType.definition += this.currentChr;
            this.currentField.list = true;
            this.state = ParseState.SUB_TYPE_START;
            return;
        }

        if (!this.currentField?.type && !this.isAlpha()) {
            //First char is not alpha
            this.raiseParseError('Field type must begin with alpha characters');
            return;
        }

        if (this.currentField?.type &&
            this.isWhitespace()) {
            this.currentRootType.definition += '\n';
            this.currentField = null;
            this.state = ParseState.FIELD_NAME;
            return;
        }

        if (this.currentChr === '[' &&
            this.isNextChar(']')) {
            //Type is array
            this.currentField.list = true;
            this.currentRootType.definition += '[]';
            this.next(); //Move one ahead
            return;
        }

        this.requireAlphanumeric('Field type');

        this.currentField.type += this.currentChr;
        this.currentRootType.definition += this.currentChr;
    }

    private parseSubTypeStart() {

        if (this.wasLastParsed('[')) {
            //We want to wait for {
            this.currentRootType.definition += this.currentChr;
            return;
        }

        this.currentRootType.definition += this.currentChr;
        const parent = this.currentSubType ? this.currentSubType : this.currentRootType;
        this.currentType = this.currentSubType = {
            type: 'sub',
            fields: [],
            field: this.currentField,
            parent
        };

        this.currentField.type = this.currentSubType;
        this.currentField = null;
        this.state = ParseState.FIELD_NAME;

    }

    private parseSubTypeEnd() {
        const typeField = this.currentSubType.field;
        switch (this.currentChr) {
            case '}':
                if (typeField.list &&
                    !this.isNextChar(']')) {
                    this.raiseParseError('Missing end ] for array type');
                }

                if (typeField.list) {
                    //All good - we want the next char ]
                    this.currentRootType.definition += this.currentChr;
                    return;
                }
                break;
            case ']':
                if (!typeField.list) {
                    this.raiseParseError('Unexpected ] for non-array type');
                }
                break;
        }

        this.currentRootType.definition += this.currentChr;

        const lastType = this.currentSubType;
        this.currentType = lastType.parent;
        if (lastType.parent?.type === 'sub') {
            this.currentSubType = <FieldType>lastType.parent;
        } else {
            this.currentSubType = null;
        }

        delete lastType.parent;
        delete lastType.field;

        this.state = ParseState.FIELD_NAME

    }

    private parseTypeEnd() {
        this.currentRootType = null;
        this.currentSubType = null;
        this.currentField = null;
        this.state = ParseState.TYPE_NAME;
    }

    protected toResult() {
        return {
            types: this.types
        };
    }

    protected parseState() {
        switch (this.state) {
            case ParseState.TYPE_NAME:
                this.parseTypeName();
                break;
            case ParseState.FIELD_NAME:
                this.parseFieldName();
                break;
            case ParseState.FIELD_TYPE:
                this.parseFieldType();
                break;
            case ParseState.SUB_TYPE_START:
                this.parseSubTypeStart();
                break;
            case ParseState.SUB_TYPE_END:
                this.parseSubTypeEnd();
                break;
            case ParseState.TYPE_END:
                this.parseTypeEnd();
                break;
        }
    }
}