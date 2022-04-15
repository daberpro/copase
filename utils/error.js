class CodecError extends SyntaxError{

    constructor(message,code,line){

        super();

        this.message = message;
        this.code = code;
        this.lineNumber = line;

    }


}


module.exports = CodecError;

