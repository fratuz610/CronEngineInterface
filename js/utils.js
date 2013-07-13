/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

utils = {};

utils.simpleFormatDate = function(ts) {
  return utils.formatDate(ts, "%Y-%M-%d %H:%m:%s");
};

utils.formatDate = function(ts, format) {

  var date = new Date(ts);

  function pad(value) {
      return (value.toString().length < 2) ? '0' + value : value;
  }
  return format.replace(/%([a-zA-Z])/g, function (_, fmtCode) {
      switch (fmtCode) {
        case 'Y':
            return date.getFullYear();
        case 'M':
            return pad(date.getMonth() + 1);
        case 'd':
            return pad(date.getDate());
        case 'H':
            return pad(date.getHours());
        case 'm':
            return pad(date.getMinutes());
        case 's':
            return pad(date.getSeconds());
        default:
            throw new Error('Unsupported format code: ' + fmtCode);
      }
  });
}

utils.isValidEmailAddress  = function(emailAddress) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(emailAddress);
}
