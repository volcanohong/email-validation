export const PATTERN_DOMAIN = "^(([a-zA-Z]{1})|([a-zA-Z]{1}[a-zA-Z]{1})|([a-zA-Z]{1}[0-9]{1})|([0-9]{1}[a-zA-Z]{1})|([a-zA-Z0-9][a-zA-Z0-9-_]{1,61}[a-zA-Z0-9])).([a-zA-Z]{2,6}|[a-zA-Z0-9-]{2,30}.[a-zA-Z]{2,3})$";
export const PATTERN_NAME = "^[-a-z0-9~!$%^&*_=+}{'?]+(.[-a-z0-9~!$%^&*_=+}{'?]+)*$";

export const KEYCODE_PROTECTED = [8, 9, 17, 18, 35, 36, 37, 38, 39, 40, 45];

//popular email domains for test
export const EMAIL_PROVIDERS = ["gmail.com", "yahoo.com", "hotmail.com", "aol.com", "msn.com", "outlook.com", "live.com", "icloud.com", "sina.com"];

//Errors
export const INVALID_EMAIL = "Invalid email";
export const INVALID_DOMAIN = "Invalid domain";
export const ERR_NOT_EMPTY = "cannot be empty";
export const ERR_MISSING_AT = "missing '@'";
export const ERR_MISSING_DOT = "missing '.'";
export const ERR_MISSING_NAME = "missing name";
export const ERR_IS_TYPO = "is it a typo?";

