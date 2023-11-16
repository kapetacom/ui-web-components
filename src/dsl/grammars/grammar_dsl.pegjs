/*
Parses kapeta DSL

Example:
myDataType {
    myId:string
}

//More things related to token
@POST('/some/{else}')
test2(@Path id:string, @Path(more) other:number ):void

*/

{

    function extractList(list, index) {
        return list.map(function(element) { return element[index]; });
    }

    function buildList(head, tail, index) {
        return [head].concat(extractList(tail, index));
    }

    const GLOBAL_IDS = {};

    function checkUnique(name) {
        if (options.ignoreSemantics) {
            return;
        }

        if (GLOBAL_IDS[name]) {
            softError(`An ${GLOBAL_IDS[name]} with the name "${name}" already exists`);
        }
    }

    function _softError(type, message, loc) {
        if (!options.softErrorHandler) {
            error(message);
            return;
        }

        if (!loc) {
            loc = location();
        }

        options.softErrorHandler({
            message,
            type,
            startColumn: loc.start.column,
            startLineNumber: loc.start.line,
            endColumn: loc.end.column,
            endLineNumber: loc.end.line
        });
    }

    function warning(message, loc) {
        _softError('warning', message, loc);
    }

    function softError(message, loc) {
        _softError('error', message, loc);
    }

    function checkType(type, isReturn) {
        if (options.ignoreSemantics) {
            return;
        }

        let isList = false;
        let generics = [];
        if (typeof type !== 'string') {
            isList = type.list;
            generics = type.generics ?? [];
            type = type.name;
        }
        if (!isReturn && type === 'void') {
            softError(`Void not allowed here`);
        }

        if (isList && type === 'void') {
            softError(`Void can not be list`);
        }


        if (generics.length > 0) {
            const typeWithGenerics = type + '<' + generics.map(() => '*').join(',') + '>';
            if (options.validTypes.indexOf(type) > -1) {
                warning(`Generic arguments not supported for type: "${type}"`);
            } else if (options.validTypes.indexOf(typeWithGenerics) === -1) {
                warning(`Invalid number of generic arguments: "${type}"`);
            }
        } else if (options.validTypes.indexOf(type) === -1) {
            warning(`Type not found: "${type}"`);
        }
    }

    //Reports error but trims whitespace off the end to not include that in location info
    function _error(message, loc) {
        if (!loc) {
            loc = location();
        }
        const val = input.substring(loc.start.offset, loc.end.offset);
        const leadingWhitespaceCount = /^\s*/.exec(val)[0].length;
        if (leadingWhitespaceCount < 1) {
            //If there is leading whitespace - the expression should be fixed
            const length = val.trim().length + leadingWhitespaceCount;
            loc.end.line = loc.start.line;
            loc.end.column = loc.start.column + length;
            loc.end.offset = loc.end.offset + length;
        }
        softError(message, loc);
    }


    function validate(entry) {
        if (!options.validator) {
            return;
        }
        try {
            options.validator(entry);
        } catch(e) {
            softError(e.message, e.location);
        }
    }

}

program = _ expressions:expression* _ { return expressions }

expression
	= enum_type:enum_type _ { return enum_type }
	/ type:datatype _ { return type }
    / method:method _ { return method }
    / comment:comments { return {type:'comment', text:comment} }

type_name
    = name:id {
    //Need this to add data type as its being defined
    options.validTypes.push(name);
    return name;
}

datatype
	= description:comments?
	  annotations:type_annotation*
      name:type_name _
      body:dataTypeBody {

    if (!options.ignoreSemantics) {
        if (!options.types) {
            softError(`Data type definitions not allowed`);
        }

        if (options.typeAnnotations.length === 0 && annotations.length > 0) {
            _error(`Annotations not allowed on data types`, annotations[0].location);
        }
    }

    checkUnique(name);
    GLOBAL_IDS[name] = 'datatype'

	return {
    	type:'datatype',
        name,
        description: description,
        annotations: annotations.map(a => { return {type:a.type, arguments:a.arguments} }),
        ...body
	}
}

dataTypeBody = bracket_start _ fields:fields? _ bracket_end { return {properties: fields ? fields : []} }

dataTypeBodyList = '[' _ body:dataTypeBody _ ']' { return body }

fields =
	head:field tail:(_ field)* { return buildList(head, tail, 1) }

number = value:('-'? [0-9]+ ('.' [0-9]+)?) { return parseFloat(text()) }
variable_name = value:([a-zA-Z][_a-zA-Z0-9]*) { return value }
literal = value:(number / string_quotes / 'true' / 'false' / 'null') {
    let val = value;
    if (value === 'true') {
        val = true;
    } else if (value === 'false') {
        val = false;
    } else if (value === 'null') {
        val = null;
    }
    return {type: 'literal', value: val}
}
reference_value = value:(variable_name '.' variable_name) { return {type: 'reference', value: text()} }

default_value = _ '=' _ value:(literal / reference_value) { return value }

field = description:comments? annotations:field_annotation* name:id _ ':' _ type:fieldType defaultValue:default_value? {

    const out = {name,annotations,description, ...type, defaultValue};

    validate({
         type:'field',
         location: location(),
         data: out
    });

    return out;
}

fieldType
	= body:variable_type { return {type: body} }
    / body:dataTypeBody { return {type:'object' ,...body} }
    / body:dataTypeBodyList { return {type:{name:'object', list: true},...body} }
    / '[' _ ']' _ type:id {
        _error(`Invalid array syntax. Did you mean ${type}[]?`);
      }

enum_type
	= description:comments?
	  annotations:type_annotation*
      'enum' _ name:type_name _
      body:enumBody {

    if (!options.ignoreSemantics) {
        if (!options.types) {
            softError(`Enum definitions not allowed`);
        }

        if (options.typeAnnotations.length === 0 && annotations.length > 0) {
            _error(`Annotations not allowed on enum types`, annotations[0].location);
        }
    }

    checkUnique(name);
    GLOBAL_IDS[name] = 'enum'

	return {
    	type:'enum',
        name,
        description: description,
        annotations: annotations.map(a => { return {type:a.type, arguments:a.arguments} }),
        ...body
	}
}

enumValues = head:id tail:(_ comma _ id)* { return buildList(head, tail, 3) }
enumBody = bracket_start _ values:enumValues? _ bracket_end {
    const enumValues = values ? values : [];
    if (!options.ignoreSemantics) {
        const duplicateValue = enumValues.find((element, index) => {
            return enumValues.indexOf(element) !== index;
        });

        if (duplicateValue) {
            softError(`Found duplicate value in enum definition: ${duplicateValue}`);
        }
    }
    return {
        values: enumValues
    }
}

comma = ','

bracket_start = '{'

bracket_end = '}'

method_name
    = name:id {
        checkUnique(name);
        return {value:name, location: location()};
    }

method "method"
    = 	description:comments?
    	annotations:method_annotation*
    	name:method_name _ parenthesis_start _ args:parameters? parenthesis_end _ colon _ returnType:return_type {

    GLOBAL_IDS[name] = 'method'

    if (!options.ignoreSemantics) {
        if (!options.methods) {
            softError(`Method definitions not allowed`);
        }

        if (options.rest &&
            annotations.length !== 1) {
            const msg = `REST Methods should have exactly one of these annotations: ${options.methodAnnotations.join(', ')}`;
            const last = annotations.length > 0 ? annotations[annotations.length -1] : null;
            if (last) {
                _error(msg, last.location);
            } else {
                softError(msg, name.location);
            }
        }

        if (!options.rest && annotations.length > 0) {
            _error(`Annotations not allowed on methods`, annotations[0].location);
        }
    }

    const out = {
        type:'method',
        name: name.value,
        description: description,
        parameters: args,
        returnType,
        annotations
    };

    validate({
         type:'method',
         location: location(),
         data: out
    });

    args && args.forEach(data => delete data.location);
    annotations && annotations.forEach(data => delete data.location);

	return {
    	type:'method',
        name: name.value,
        description: description,
        parameters: args,
        returnType,
        annotations
	}
}

forward_slash = '/'

lower_than = '<'

greater_than = '>'

comment_char
	= [^\n\r\f] { return text() }

comment_line
	= forward_slash forward_slash chars:comment_char* { return chars.join('') }
    / '#' chars:comment_char* { return chars.join('') }

comment = head:comment_line { return head }

comments = head:comment tail:(nl comment)* _ { return buildList(head, tail, 1).join('\n') }

name_start "character"
    = [_a-z]i

name_char "character"
    = [_a-z0-9-]i

char "character"
    = .

quote_double_char "character"
    = !('"' / "\\" / nl) char { return text() }

quote_single_char "character"
    = !("'" / "\\" / nl) char { return text() }

quote_none_char "character"
    = !("'" / '"' / ')'  / ']' / "\\" / nl) char { return text() }

string_quotes "string"
	= '"' char:quote_double_char* '"' { return text() }
    / "'" char:quote_single_char* "'" { return text() }

string "string"
	= '"' char:quote_double_char* '"' { return char.join('') }
    / "'" char:quote_single_char* "'" { return char.join('') }

id
    = start:name_start chars:name_char* {
      return start + chars.join("");
    }


generic_type
    = name:id {
        checkType(name, false)
      return name
    }

generic_types
    = _ lower_than _ first_type:generic_type types:(_ comma _ generic_type)* _ greater_than {
        let out = [first_type];
        if (types) {
            out.push(...types.map(type => {
                return type[3];
            }));
        }
        return out;
    }


full_type
    = type:id generics:generic_types? list:(_ '[' _ ']')? {
        return {name:type, generics: generics ?? [], list: !!list};
    }
    / '[' _ ']' _ type:id {
        _error(`Invalid array syntax. Did you mean ${type}[]?`);
      }

variable_type
    = out:full_type {
        out && checkType(out, false);
        if (!out.list && out.generics.length < 1) {
            return out.name;
        }

        if (out.generics.length < 1) {
            delete out.generics;
        }

        if (!out.list) {
            delete out.list;
        }
        return out;
    }

return_type
    = out:full_type {
        out && checkType(out, true);
        if (!out.list && out.generics.length < 1) {
            return out.name;
        }

        if (out.generics.length < 1) {
            delete out.generics;
        }

        if (!out.list) {
            delete out.list;
        }
        return out;
    }

annotationType
    = "@" name_start name_char* {
      return text()
    }

method_annotation
  = type:annotationType _ name:argument? _ {
        let usedName = name ? name[3] : null;
        if (!options.ignoreSemantics) {
            if (options.methodAnnotations.length > 0 &&
                options.methodAnnotations.indexOf(type) === -1) {
                _error(`Invalid method annotation - must be one of ${options.methodAnnotations.join(', ')}`);
            } else if (options.rest && !usedName) {
                _error(`Annotation ${type} requires 1 argument: path`);
            } else if (options.rest && usedName &&
                !/^\/([a-z0-9_\-~\.{}%]+(\/[a-z0-9_\-~\.{}%]+)*)?$/i.test(usedName)) {
                _error(`Invalid URL path specified. Must start with "/" and not end with "/"`);
            }
        }

        return { type, arguments: usedName ? [usedName] : [], location: location() };
    }

type_annotation
  = type:annotationType _ name:argument? _ {
        let usedName = name ? name[3] : null;
        if (!options.ignoreSemantics) {
            if (options.typeAnnotations.length > 0 &&
                options.typeAnnotations.indexOf(type) === -1) {
                _error(`Invalid type annotation - must be one of ${options.typeAnnotations.join(', ')}`);
            }
        }

        return { type, arguments: usedName ? [usedName] : [], location: location() };
    }


field_annotation
  = type:annotationType _ name:argument? _ {
        let usedName = name ? name[3] : null;
        if (!options.ignoreSemantics) {
            if (options.fieldAnnotations.length === 0) {
                _error(`Annotations not allowed on field`);
            } else if (options.fieldAnnotations.length > 0 &&
                options.fieldAnnotations.indexOf(type) === -1) {
                _error(`Invalid field annotation - must be one of ${options.fieldAnnotations.join(', ')}`);
            }
        }

        return { type, arguments: usedName ? [usedName] : [] };
    }

parameter_annotation
  = type:annotationType _ name:argument? _ {
        let usedName = name ? name[3] : null;
        if (!options.ignoreSemantics) {
            if (!options.rest) {
                _error(`Annotations not allowed on parameters`);
            } else if (options.parameterAnnotations.indexOf(type) === -1) {
                _error(`Invalid parameter annotation - must be one of ${options.parameterAnnotations.join(', ')}`);
            } else if (usedName &&
                !/^[a-z_][a-z0-9_-]*$/i.test(usedName)) {
                _error(`Invalid variable name. Must start with an alpha character ([a-z]) and only contain alphanumeric characters, dash and underscore. ([a-z0-9_-]) "`);
            }
        }
        return { type, arguments: usedName ? [usedName] : [] };
    }


parenthesis_start "parenthesis start"
    = '('

parenthesis_end  "parenthesis end"
    = ')'

argumentValue  "parameter name"
	= string
	/ char:quote_none_char* { return char.join('') }

argument
    = _ parenthesis_start _ argumentValue _ parenthesis_end _

colon = ':'

parameter = _ annotations:parameter_annotation* _ name:id _ colon _ type:variable_type _ {

    if (!options.ignoreSemantics) {
        if (options.rest) {
            if (annotations.length > 1) {
                _error(`REST method parameters should have at most 1 annotation`);
            } else if (annotations.length < 1) {
                _error(`REST method parameter must have exactly one of these annotations:  ${options.parameterAnnotations.join(', ')}`);
            } else {
                var parmType = annotations[0].type;
                var valueType = typeof type === 'string' ? type : type?.name;
                if (valueType &&
                    options.stringableTypes &&
                    parmType.toLowerCase() === '@path' &&
                    !options.stringableTypes.includes(valueType)) {
                    _error(`Value type "${valueType}" can not be used with a ${parmType} annotation. Value must be one of these types: ${options.stringableTypes.join(', ')}`);
                }
            }
        }
    }

    return {name, type, location: location(), annotations}
}

parameters
    = head:parameter tail:(_ comma _ parameter)* { return buildList(head, tail, 3) }

__ "space"
  = " "

_ "space or line break"
  = [ \n\r\f\t]* { return text() }

ws "space or tab"
  = [ \t]*

nl "line break"
  = "\n"
  / "\r\n"
  / "\r"
  / "\f"
