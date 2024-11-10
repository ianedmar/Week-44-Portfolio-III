function appendToEnd(source, count, char) {
    let output = source;
    for (let i = 0; i < count; i++) {
        output += char;
    }
    return output;
}

String.prototype.appendToEnd = function (count, char) {
    return appendToEnd(this, count, char)
}




export default appendToEnd;