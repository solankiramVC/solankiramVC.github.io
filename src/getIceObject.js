const $ = require('jquery');

function getIceObject(cb) {
    $.ajax({
        url: "https://global.xirsys.net/_turn/viitorwebrtc/",
        type: "PUT",
        async: false,
        headers: {
            "Authorization": "Basic " + btoa("solanki:6c4610aa-cd53-11e8-b5ee-0242ac110004")
        },
        success: function (res) {
            res = JSON.parse(res);
            cb(res.v);
            costomConfig = res.v;
        }
    });
}
module.exports = getIceObject;