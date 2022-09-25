export interface ParserResult {
    definition: string
    error?: string
    offset: number
}

export abstract class Parser<T extends ParserResult> {

    protected readonly definition:string;

    protected parsedDefinition:string;

    protected currentChr:string = '';

    protected nextChr:string = '';

    protected offset:number = 0;

    constructor(definition) {
        this.definition = definition.replace(/[\t ]+/g,' ');
    }


    protected isNextChar(chars) {
        if (typeof chars === 'string') {
            chars = [chars];
        }

        for(let i = this.offset; i < this.definition.length; i++) {
            const nextChr = this.definition[i].trim();
            if (chars.indexOf(nextChr) > -1) {
                return true;
            }

            if (nextChr) {
                //Ignores whitespace
                return false;
            }
        }
    }

    protected reset() {
        this.offset = 0;
        this.currentChr = '';
        this.nextChr = '';
    }

    protected isWhitespace() {
        return /\s/.test(this.currentChr);
    }


    protected skipWhitespace() {
        while(this.isWhitespace()) {
            this.next();
        }
    }

    protected next() {
        if (this.offset < this.definition.length) {
            this.currentChr = this.definition[this.offset];
            this.nextChr = this.definition[this.offset + 1];
        }

        this.offset++;
    }



    protected raiseParseError(error: string) {
        const err:any = new Error(error);
        err.parseError = true;
        err.offset = this.offset;
        throw err;
    }

    protected doesMatch(regex) {
        return regex.test(this.currentChr);
    }

    protected isAlpha() {
        return /[a-z]/i.test(this.currentChr);
    }

    protected isAlphanumeric() {
        return /[a-z0-9_]/i.test(this.currentChr);
    }

    protected requireAlpha(valueName) {
        if (!this.isAlpha()) {
            this.raiseParseError(`${valueName} must only contain alpha characters`);
            return;
        }
    }

    protected requireStartsWithAlpha(value, valueName) {
        if (!value && !this.isAlpha()) {
            //First char is not alpha
            this.raiseParseError(`${valueName} must begin with alpha characters. Found char "${this.currentChr}" [${this.currentChr.charCodeAt(0)}]`);
            return;
        }
    }

    protected requireAlphanumeric(valueName) {
        if (!this.isAlphanumeric()) {
            this.raiseParseError(`${valueName} must only contain alphanumeric characters. Found char "${this.currentChr}" [${this.currentChr.charCodeAt(0)}]`);
            return;
        }
    }

    protected abstract parseState();

    protected abstract toResult();

    parse():T {
        this.reset();

        let error = null;
        try {
            while(this.offset < this.definition.length) {
                this.next();

                //console.log('this.currentChr', this.state, this.currentChr, this.offset )
                this.parseState();
            }
        } catch (err) {
            if (err.parseError) {
                error = err.message
            } else {
                throw err;
            }

        }

        return {
            ... this.toResult(),
            definition: this.parsedDefinition,
            error,
            offset: this.offset
        }
    }
}