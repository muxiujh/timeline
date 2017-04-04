class Tool
{
    constructor() { }

    static BuildKey(arr, key) {
        return arr + "[" + key + "]";
    }

    static BuildKeyString(arr, key) {
        return arr + "." + key;
    }
}

module.exports = Tool;