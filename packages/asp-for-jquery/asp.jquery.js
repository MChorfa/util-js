
// Include this function before you use any selectors that rely on it
jQuery.expr[':'].asp = function(e, i, m) {
    return (e.id && e.id.match('_' + m[3] + '$'));
};
 
// Now all of these are valid selectors
// They show why this method has more functionality than the previous $asp() function.
$(":asp(txtPhoneNumber)")
$("input:asp(txtPhoneNumber):visible")
$(":asp(txtPhoneNumber), :asp(txtAddress)")
$("ul:asp(listTodos) li")
$("#content").find("ul:asp(listTodos)")