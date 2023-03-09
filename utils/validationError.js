class ValidationError{

    constructor(messages,statusCode){
        this.messages = messages;
        this.statusCode = statusCode;
    }
}

module.exports = ValidationError