/*
Parses blockware DSL

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
        if (GLOBAL_IDS[name]) {
            error(`An ${GLOBAL_IDS[name]} with the name "${name}" already exists`);
        }
    }

    function checkType(type, isReturn) {
        if (!isReturn && type === 'void') {
            error(`Void not allowed here`);
        }

        if (options.validTypes.indexOf(type) === -1) {
            error(`Type not found: "${type}"`);
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
        error(message, loc);
    }

}

program = _ expressions:expression* _ { return expressions }

expression
	= type:datatype _ { return type }
    / method:method _ { return method }
    / comment:comments { return {type:'comment', text:comment} }

datatype_name
    = name:id {
    //Need this to add data type as its being defined
    options.validTypes.push(name);
    return name;
}

datatype
	= description:comments?
	  annotations:type_annotation*
      name:datatype_name _
      body:dataTypeBody {

    if (!options.types) {
        error(`Data type definitions not allowed`);
    }

    if (options.typeAnnotations.length === 0 && annotations.length > 0) {
        _error(`Annotations not allowed on data types`, annotations[0].location);
    }

    checkUnique(name);
    GLOBAL_IDS[name] = 'datatype'

	return {
    	type:'datatype',
        name,
        description: description,
        annotations: annotations.map(a => { return {name:a.name, type:a.type} }),
        ...body
	}
}

dataTypeBody = bracket_start _ fields:fields? _ bracket_end { return {properties: fields ? fields : {}} }

dataTypeBodyList = '[' _ body:dataTypeBody _ ']' { return body }

fields =
	head:field tail:(_ field)* { return buildList(head, tail, 1) }

field = description:comment* annotations:field_annotation* name:id _ ':' _ type:fieldType {
    return {name,annotations,description, ...type}
}

fieldType
	= type:id list:(_ '[' _ ']')? { checkType(type); return {type, list: !!list} }
    / body:dataTypeBody { return {type:'object', list: false,...body} }
    / body:dataTypeBodyList { return {type:'object', list: true,...body} }

bracket_start = '{'

bracket_end = '}'

method_name
    = name:id {
        checkUnique(name);
        GLOBAL_IDS[name] = 'method'
        return {value:name, location: location()};
    }

method_returnType
    = type:id {
        checkType(type, true);
        return type;
    }

method "method"
    = 	description:comments?
    	annotations:method_annotation*
    	name:method_name _ parenthesis_start _ args:parameters? parenthesis_end _ colon _ returnType:method_returnType {

    if (!options.methods) {
        error(`Method definitions not allowed`);
    }

    if (options.rest &&
        annotations.length !== 1) {
        const msg = `REST Methods should have exactly one of these annotations: ${options.methodAnnotations.join(', ')}`;
        const last = annotations.length > 0 ? annotations[annotations.length -1] : null;
        if (last) {
            _error(msg, last.location);
        } else {
            error(msg, name.location);
        }
    }

    if (!options.rest && annotations.length > 0) {
        _error(`Annotations not allowed on methods`, annotations[0].location);
    }

	return {
    	type:'method',
        name: name.value,
        description: description,
        parameters:args,
        returnType,
        annotations: annotations.map(a => { return {name:a.name, type:a.type} })
	}
}

forward_slash = '/'

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

string "string"
	= '"' char:quote_double_char* '"' { return char.join('') }
    / "'" char:quote_single_char* "'" { return char.join('') }

type
    = start:name_start chars:name_char* {
      return start + chars.join("");
    }

id
    = start:name_start chars:name_char* {
      return start + chars.join("");
    }

annotationType
    = "@" name_start name_char* {
      return text()
    }

method_annotation
  = type:annotationType _ name:argument? _ {
        let usedName = name ? name[3] : null;
        if (options.methodAnnotations.length > 0 &&
            options.methodAnnotations.indexOf(type) === -1) {
            _error(`Invalid method annotation - must be one of ${options.methodAnnotations.join(', ')}`);
        }

        if (!usedName) {
            _error(`Annotation ${type} requires 1 argument: path`);
        }

        if (usedName &&
            !/^\/([a-z_{}][a-z0-9_-{}]*(\/[a-z_{}][a-z0-9_-{}]*)*)?$/i.test(usedName)) {
            _error(`Invalid path specified. Must start with "/" and be well formed: "${usedName}"`);
        }

        return { type, name:usedName, location: location() };
    }

type_annotation
  = type:annotationType _ name:argument? _ {
        let usedName = name ? name[3] : null;
        if (options.typeAnnotations.length > 0 &&
            options.typeAnnotations.indexOf(type) === -1) {
            _error(`Invalid type annotation - must be one of ${options.typeAnnotations.join(', ')}`);
        }

        return { type, name:usedName, location: location() };
    }


field_annotation
  = type:annotationType _ name:argument? _ {
        if (options.fieldAnnotations.length === 0) {
            _error(`Annotations not allowed on field`);
        }
        let usedName = name ? name[3] : null;
        if (options.fieldAnnotations.length > 0 &&
            options.fieldAnnotations.indexOf(type) === -1) {
            _error(`Invalid field annotation - must be one of ${options.fieldAnnotations.join(', ')}`);
        }

        return { type, name:usedName };
    }

parameter_annotation
  = type:annotationType _ name:argument? _ {
        if (!options.rest) {
            _error(`Annotations not allowed on parameters`);
        }
        let usedName = name ? name[3] : null;
        if (options.parameterAnnotations.indexOf(type) === -1) {
            _error(`Invalid parameter annotation - must be one of ${options.parameterAnnotations.join(', ')}`);
        }

        if (usedName &&
            !/^[a-z_][a-z0-9_-]*$/i.test(usedName)) {
            _error(`Invalid variable name. Must start with an alpha character ([a-z]) and only contain alphanumeric characters, dash and underscore. ([a-z0-9_-]) "`);
        }
        return { type, name: usedName };
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

parameter = _ annotations:parameter_annotation* _ name:id _ colon _ type:type _ {
    if (options.rest &&
        annotations.length > 1) {
        error(`REST method parameters should have at most 1 annotation`);
    }

    checkType(type);

    return {name, type, annotations}
}

parameters
    = head:parameter tail:(_ ',' _ parameter)* { return buildList(head, tail, 3) }

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
