/*
Parses wrap_method definitions with optional rest declaration

Example:

#Do something with the token
#and describe on multiple lines
@GET('/some/{token_path}')
@More
@Annotations ( "TEST" )
test(@Path("test") @More('castle') @third('test') token_id:string,@Path('token_id') other:number ):void

//More things related to token
@POST('/some/{else}')
test2(@Path token_id:string, @Path(more) other:number ):void

*/

{
  function extractList(list, index) {
    return list.map(function(element) { return element[index]; });
  }
  function buildList(head, tail, index) {
    return [head].concat(extractList(tail, index));
  }
}

methods = _ head:wrap_method tail:( _ wrap_method )* _ { return buildList(head, tail, 1) }

rest_method = "GET"i / "POST"i / "PUT"i / "HEAD"i / "DELETE"i / "PATCH"i

path_char = [_a-z0-9-{}/]i

token_path = "/" path_char* { return text() }

rest_definition = rest:annotation { return rest }

wrap_method "method"
    = 	description:comment*
    	annotations:annotation*
    	name:token_id _ parenthesis_start _ args:parameters? parenthesis_end _ colon _ returnType:token_id {
	return {name, description: description.join('\n'), parameters:args, returnType, annotations }
}

forward_slash = '/'

comment_char
	= !newline char { return text() }

comment_line
	= forward_slash forward_slash chars:comment_char* { return chars.join('') }
    / '#' chars:comment_char* { return chars.join('') }

comment = head:comment_line newline _ { return head }

name_start "character"
    = [_a-z]i

name_char "character"
    = [_a-z0-9-]i

char "character"
    = .

quote_double_char "character"
    = !('"' / "\\" / newline) char { return text() }

quote_single_char "character"
    = !("'" / "\\" / newline) char { return text() }

quote_none_char "character"
    = !("'" / '"' / ')'  / ']' / "\\" / newline) char { return text() }

string "string"
	= '"' char:quote_double_char* '"' { return char.join('') }
    / "'" char:quote_single_char* "'" { return char.join('') }

token_type
    = start:name_start chars:name_char* {
      return start + chars.join("");
    }

token_id
    = start:name_start chars:name_char* {
      return start + chars.join("");
    }

token_annotationType
    = "@" name_start name_char* {
      return text()
    }

annotation "annotation"
  = type:token_annotationType _ name:argument? _ {
      return { type, name: name ? name[3] : null };
    }

newline "new line"
  = "\n"
  / "\r\n"
  / "\r"
  / "\f"

parenthesis_start "parenthesis start"
    = '('

parenthesis_end  "parenthesis end"
    = ')'

token_argumentValue  "wrap_parameter name"
	= string
	/ char:quote_none_char* { return char.join('') }

argument
    = _ parenthesis_start _ token_argumentValue _ parenthesis_end _

colon = ':'

parameter = _ annotations:annotation* _ name:token_id _ colon _ type:token_type _ { return {name, type, annotations} }

parameters
    = head:parameter tail:(_ ',' _ parameter)* { return buildList(head, tail, 3) }

__ "space"
  = " "

_ "space"
  = [ \n\r\f\t]* { return text() }