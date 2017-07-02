/**
 * Created by um_brella on 2017/5/11.
 */
//1.获取元素

var oDiv = document.getElementById("imgMain");
var oUl = oDiv.getElementsByTagName("ul")[0];
//2.获取数据

var xhr = new XMLHttpRequest();
xhr.open("GET", "http://qiminghaonan.com/photos/JS/index.json?_=" + Math.random(), false);
//为了防止请求的时候出现缓存问题
// xhr.open("GET","data.txt?_="+(new Date()).getTime(),false);
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
        window.data = public.toJsonObj(xhr.responseText);
    }
};
xhr.send(null);

//3.绑定数据
if (window.data && window.data.length) {
    var str = ``;
    for (var i = data.length - 1; i >= 0; i--) {
        str += `
    <li>
        <h2><span>${data[i].year}</span> ${data[i].month}月${data[i].day}</h2>
        <img src="" photo="${data[i].img}" alt="">
        <p>${data[i].title}</p>
        <div>
            <span>设备:${data[i].equipment}</span>
            <span>地点:${data[i].place}</span>
        </div>
    </li> `
    }
    oUl.innerHTML = str;
}
//4.图片延迟加载
var oLis=oUl.getElementsByTagName("li");
// var oImgs=oUl.getElementsByTagName("img");
function imgDelayLoad() {
    for (var i=0;i<oLis.length;i++){
        var oImg=oLis[i].getElementsByTagName("img")[0];

        if(public.win("clientWidth")<692){
            var H=public.win("clientHeight")+public.win("scrollTop");
            //当前img还没有图，不能用他的高，可以求他父级元素的高
            //var h=oLis[i].offsetHeight+public.offset(oLis[i]).top;
            var h=oLis[i].offsetHeight+public.offset(oLis[i]).top;
            if(H>=h){
                imgLoad(oImg);
                fadeIn(oImg);
            }
        }
        else {
            imgLoad(oImg);
            fadeIn(oImg);
        }
    }
}

//将photo自定义属性中的链接添加到图片src属性中，同时判断了链接是否有效
function imgLoad(img) {
    var curImg = document.createElement("img");
    curImg.src = img.getAttribute("photo");
    curImg.onload = function () {
        img.src = this.src;
    };
    curImg = null;
}
imgDelayLoad();
window.onscroll = imgDelayLoad;

//设置定时器，让图片淡入

function fadeIn(ele) {
    ele.timer = window.setInterval(function () {
        var opacity = public.getCss(ele, "opacity");
        if (opacity >= 1) {
            window.clearInterval(ele.timer);
            return;
        }
        opacity += 0.01;
        public.setCss(ele, "opacity", opacity);
    }, 20)
}

//改变li样式
for (var i=0;i<oLis.length;i++){
    // public.css(oLis[i],"list-style","none");
    // console.log(window.getComputedStyle(oLis[i], "before").content);
    window.getComputedStyle(oLis[i],"before").width=0;
    window.getComputedStyle(oLis[i],"before").border="0 solid black";
    window.getComputedStyle(oLis[i],"before").marginRigh=0;
}
//更改样式
var article=document.getElementById("post-photos");
public .addClass(article,"article_bg");
/*var article_title=article.getElementsByClassName("artitle-title")[0];
public .addClass(article_title,"art_tit");*/


