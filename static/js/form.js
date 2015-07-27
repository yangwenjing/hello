/**
 * Created by ywj on 15/7/22.
 */
var XMLHttpReq;
function createXMLHttpRequest() {
    try {
        XMLHttpReq = new ActiveXObject("Msxml2.XMLHTTP");//IE高版本创建XMLHTTP
    }
    catch(E) {
        try {
            XMLHttpReq = new ActiveXObject("Microsoft.XMLHTTP");//IE低版本创建XMLHTTP
        }
        catch(E) {
            XMLHttpReq = new XMLHttpRequest();//兼容非IE浏览器，直接创建XMLHTTP对象
        }
    }
}
function sendAjaxRequest(url) {
    createXMLHttpRequest();                                //创建XMLHttpRequest对象
    XMLHttpReq.open("post", url, true);
    XMLHttpReq.onreadystatechange = processResponse; //指定响应函数
    XMLHttpReq.send(null);
}
//回调函数
function processResponse() {
    if (XMLHttpReq.readyState == 4) {
        if (XMLHttpReq.status == 200) {
            var text = XMLHttpReq.response;
            /**
             *实现回调
             */
            text = window.decodeURI(text);
        }
    }

}
$('.form-control').on('keyup',function(){
    var url = window.location.origin+window.location.pathname;
    sendAjaxRequest(url);
});