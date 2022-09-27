/*
Parses type definitions

Example:

myDataType {
    myId:string

    myOtherValue:number[]

    test:myDataType[]

    subType: {
        subId:string
        multiSub: [{
            entryId:string
        }]
        afterMultiSub:boolean
    }

    betweenTypes:string

    secondSubType: {
        otherId:number
    }

    lastFieldValue:Date
}

EmptyType {}

SimplerType {
    firstName:string
    lastName:string
    age:number
}

*/

{

  function extractList(list, index) {
    return list.map(function(element) { return element[index]; });
  }

  function buildList(head, tail, index) {
    return [head].concat(extractList(tail, index));
  }

}

datatypes = head:datatype tail:( _ datatype )* { return buildList(head, tail, 1) }

datatype = name:id _ body:dataTypeBody { 
	return {name, ...body} 
}

dataTypeBody = pStart _ fields:fields? _ pEnd { return {properties: fields ? fields : {}} }

dataTypeBodyList = '[' _ body:dataTypeBody _ ']' { return body }

fields =
	head:field tail:(_ field)* { return buildList(head, tail, 1) }

field = name:id _ ':' _ type:fieldType { return {name, ...type} }

fieldType
	= type:id _ list:(_ '[' _ ']')? { return {type, list: !!list} }
    / body:dataTypeBody { return {type:'object', list: false,...body} }
    / body:dataTypeBodyList { return {type:'object', list: true,...body} }

nmstart = [_a-z]i

nmchar = [_a-z0-9-]i

char
  = .
  
doubleChar
	 = !('"' / "\\" / nl) char { return text() } 

singleChar
	 = !("'" / "\\" / nl) char { return text() } 

noQuoteChar
	 = !("'" / '"' / ')'  / ']' / "\\" / nl) char { return text() } 


string
	= '"' char:doubleChar* '"' { return char.join('') }
    / "'" char:singleChar* "'" { return char.join('') }
	

id = start:nmstart chars:nmchar* {
      return start + chars.join("");
    }


nl
  = "\n"
  / "\r\n"
  / "\r"
  / "\f"

pStart = '{'

pEnd = '}'

colon = ':'

__ "required space"
  = [ \n\r\f\t]
  
_ "whitespace"
  = [ \n\r\f\t]*