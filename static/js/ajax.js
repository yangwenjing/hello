/**
 * Created by ywj on 15/7/22.
 */
function createXmlHTTPReq() {
    var xmlHttp;
    try {
        xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
        try {
            xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (e) {
            xmlHttp = new XMLHttpRequest();
        }
    }
    return xmlHttp;
}

