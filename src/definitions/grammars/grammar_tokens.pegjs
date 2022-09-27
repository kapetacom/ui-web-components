/*
Parses tokens to be used for syntax highlighing
*/

{
  function extractList(list, index) {
    return list.map(function(element) { return element[index]; });
  }
  function buildList(head, tail, index) {
    return [head].concat(extractList(tail, index));
  }

  function flatten(array) {
		return array.flatMap(a => {
             if (Array.isArray(a)) {
             	return flatten(a);
             } else {
                return a;
             }
        }).filter(a => !!a)
  }

  function appendWS(out, ws) {
	if (ws) {
    	out.push(...ws);
	}
  }

}

program = expr:expression* {
	return flatten(expr)
}

expression
	= comment
    / annotation
    / datatype
    / variable_definition
    / field_definition
    / method
    / id
    / name
    / path
    / string
    / number
    / _
    / char


square_brackets_start
    = '[' { return {type: 'special_start', value: text()} }

square_brackets_end
    = ']' { return {type: 'special_end', value: text()} }

brackets_start
    = '{' { return {type: 'special_start', value: text()} }

brackets_end
    = '}' { return {type: 'special_end', value: text()} }

parenthesis_start
    = '(' { return {type: 'special_start', value: text()} }

parenthesis_end
    = ')' { return {type: 'special_end', value: text()} }

colon
    = ':' { return {type: 'special_colon', value: text()} }

comma
    = ',' { return {type: 'special_comma', value: text()} }

number
	= [0-9]+ ( '.' [0-9]+ )?   { return {type: 'number', value: parseFloat(text())} }

char
	= [<{\[] { return {type: 'special_start', value: text()} }
    / [>}\]] { return {type: 'special_end', value: text()} }
    / colon
    / comma
    / '-' { return {type: 'special_dash', value: text()} }
	/ . { return {type: 'special_other', value: text()} }

path_char = [_a-z0-9-{}/]i
path = "/" path_char* { return {type: 'path', value: text()} }

comment_char
	= !nl char

comment
	= '//' chars:comment_char* { return {type: 'comment', value: text()} }
    / '#' chars:comment_char* { return {type: 'comment', value: text()} }

annotation_type = "@" type:id {
	return {type: 'annotation_type', value: text()};
}

argument_value
	= string
    / number
	/ name

argument
    = a:_* b:parenthesis_start c:_* d:argument_value e:_* f:parenthesis_end

annotation
	= annotation_type argument?

variable_type
	= type:id (_* square_brackets_start _* square_brackets_end)? {
	return {type: 'type', value: text()};
}

variable_definition
	= name:id ws1:_* colon:colon ws2:_* type:variable_type {
    	const out = [
        	{type: 'variable', value: name.value}
        ];
        appendWS(out,ws1);
        out.push(colon);
        appendWS(out,ws2);
        out.push({type: 'type', value: type.value})
		return out;
	}

parameter_definition
	= (annotation _)* variable_definition

parameters
	= head:parameter_definition tail:(_? comma _?parameter_definition)*

method = name:id ws1:_*
		start:parenthesis_start ws2:_*
        parameters:parameters? ws3:_*
        end:parenthesis_end ws4:_*
        colon:colon ws5:_* type:id {
    	const out = [
        	{type: 'method_name', value: name.value}
        ];
		out.push(ws1);
        out.push(start);
		out.push(ws2);
        out.push(parameters)
    	out.push(ws3);
		out.push(end);
        out.push(ws4);
		out.push(colon);
        out.push(ws5);
        out.push({type: 'return_type', value: type.value});
		return out;
	}

datatype
	= name:id ws:_* body:datatype_body {
       return [
          {type: 'datatype_name', value: name.value},
          ws,
          body
       ]
    }

datatype_body
	= brackets_start _* (field_definition _)* brackets_end

datatype_body_list
	= square_brackets_start _* datatype_body _* square_brackets_end

field_definition
	= variable_definition
	/ name:id ws1:_* colon:colon ws2:_* type:(datatype_body/datatype_body_list) {
    	const out = [
        	{type: 'variable', value: name.value}
        ];
        out.push(ws1);
        out.push(colon);
        out.push(ws2);
        out.push(type)
		return out;
	}


double_char
	 = !('"' / "\\" / nl) char { return text() }

single_char
	 = !("'" / "\\" / nl) char { return text() }

string
	= '"' char:double_char* '"' { return {type: 'string', value: text()} }
    / "'" char:single_char* "'" { return {type: 'string', value: text()} }

id_start = [_a-z]i
id_char = [_a-z0-9]i
id = start:id_start chars:id_char* {
      return {type: 'id', value: text()};
    }

name_start = [_a-z]i
name_char = [_a-z0-9]i
name = start:name_start chars:name_char* {
      return {type: 'name', value: text()};
    }


nl
  = "\n"
  / "\r\n"
  / "\r"
  / "\f"


_ "whitespace"
  = [ \n\r\f\t]+ { return {type: 'whitespace', value: text()} }