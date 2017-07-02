/**
 * Created by um_brella on 2017/5/9.
 */
var public=(
    function () {
        var standerBrowser = "getComputedStyle" in window;
        //1. 将类数组转为数组
        function toArray(likeArray) {
            var ary=[];
            try{
                return ary.slice.call(likeArray);
            }
            catch (e){
                for(var i=0;i<likeArray.length;i++){
                    ary.push(likeArray[i]);
                }
                return ary;
            }
        }
        //2. 将JSON字符串转为JSON对象
        function toJsonObj(jsonstr) {
            try{
                return JSON.parse(jsonstr);
            }
            catch (e){
                eval("("+jsonstr+")");
            }
        }
        //3. 当前元素距离body的偏移量
        function offset(curEle) {
            var L=curEle.offsetLeft;
            var T=curEle.offsetTop;
            var P=curEle.offsetParent;
            while (P){
                if(window.navigator.userAgent.indexOf("MSIE 8")===-1){
                    L+=P.clientLeft;
                    T+=P.clientTop;
                }
                L+=P.offsetLeft;
                T+=P.offsetTop;
                P=P.offsetParent;
            }
            return{
                left:L,
                top:T
            }
        }
        //4. 当前浏览器的盒子模型
        function win(attr,value) {
            //传一个参数是获取，传一个参数是设置
            if(typeof value==="undefined"){
                return document.documentElement[attr]||document.body[attr];
            }
            else {
                document.documentElement[attr]=value;
                document.body[attr]=value;
            }
        }
        //5. 获取随机数
        function getRandom(n,m) {
            n=Number(n);
            m=Number(m);
            if(isNaN(n)||isNaN(m)){
                return Math.random();
            }
            if(n>m){
                n=n+m;
                m=n-m;
                n=n-m;
            }
            return Math.round(Math.random()*(m-n)+n);
        }
        //6. getCss获取元素的样式属性
        function getCss(curEle,attr) {
            var val=null;//val中存储的是要返回的值
            if(standerBrowser){
                //在标准浏览器中window下有"getComputedStyle"这个属性
                val=getComputedStyle(curEle)[attr];
            }
            else {
                //在IE6-8下
                //注意透明度 filter:alpha(opacity=56);
                //如果你传进来的attr=="opacity",在IE6-8下 它识别不到opacity只能识别filter，所以你要另作处理
                if(attr=="opacity"){
                    val=curEle.currentStyle['filter'];
                    //用正则匹配alpha(opacity=56)，再把里面的数字捕获出来
                    var reg=/^alpha\(opacity=(\d+(?:\.\d+)?)\)$/;
                    val=reg.test(val)?RegExp.$1/100:1;
                }
                else val=curEle.currentStyle[attr];
            }
            //val里面存着所需的属性值，但是还要把有单位的属性值变成数字
            var re=/^-?\d+(\.\d+)?(px|pt|deg|em|rem)?$/;
            if(re.test(val)){
                val=parseFloat(val);
            }
            return val;
        }
        //7. setCss设置元素的样式属性
        function setCss(curEle,attr,value) {
            //当attr是："opacity"设置两次，要兼容IE6-8
            if(attr=="opacity"){
                curEle.style.opacity=value;//标准浏览器
                curEle.style.filter="alpha(opacity="+value*100+")";//IE6-8
                return;//后续无需执行
            }
            //当浮动的时候我们需要特殊处理
            if(attr=="float"){
                curEle.style.cssFloat=value;//标准浏览器
                curEle.style.styleFloat=value;//IE6-8
                return;
            }
            //当attr是：width,height,left,top,right,bottom,margin(Top,Left,Right,Bottom),padding(Top,Left,Right,Bottom)
            //这些情况的时候，需要给value值加上单位"px"，加之前还需判断value的值是否为数字，若为数字，则向其添加"px":isNaN来判断
            var reg=/^(width|height|left|top|right|bottom|(margin|padding)(Top|Left|Right|Bottom)?)$/;
            if(reg.test(attr)&&!isNaN(value)){
                //匹配是否为以上几种属性&&判断设置的属性值是否为数字
                value+="px";
            }
            curEle.style[attr]=value;
        }
        //8. setGroupCss批量设置元素的样式属性
        function setGroupCss(curEle,obj) {
            //当obj不传参时候，让其为一个空数组，保证toString方法不会报错
            obj=obj||[];
            //只有当obj为一个对象的时候，才进行遍历
            if(obj.toString()=="[object Object]"){
                for (var key in obj){
                    //只把obj的私有属性给curEle设置样式，过滤掉从Object.prototype上继承的公有属性
                    if(obj.hasOwnProperty(key)){
                        this.setCss(curEle,key,obj[key]);
                    }
                }
            }
        }
        //9. css 根据参数的不同选择不同的方法
        function css() {
            if(arguments.length===3){
                //this.setCss(arguments[0],arguments[1],arguments[2]);
                //css中的this是public，setCss中的this是public
                setCss.apply(this,arguments);
                return;
            }
            if(arguments.length===2){
                if(arguments[1].toString()=="[object Object]"){
                    setGroupCss.apply(this,arguments);
                    return;
                }
                else {
                    return getCss.apply(this,arguments);
                }
            }
        }
        //10. prev 获取上一个哥哥元素
        function prev(curEle) {
            if(standerBrowser){
                return curEle.previousElementSibling;
            }
            var pre=curEle.previousSibling;
            while (pre&&pre.nodeType!==1){
                pre=pre.previousSibling;
            }
            return pre;
        }
        //11. next 获取下一个弟弟元素节点
        function next(curEle) {
            if(standerBrowser){
                return curEle.nextElementSibling;
            }
            var nex=curEle.nextSibling;
            while (nex&&nex.nodeType!==1){
                nex=nex.nextSibling;
            }
            return nex;
        }
        //12. prevAll 获取所有哥哥元素，返回一个数组
        function prevAll(curEle) {
            var prevAry=[];
            var pre=this.prev(curEle);
            while (pre){
                prevAry.unshift(pre);
                pre=this.prev(pre);
            }
            return prevAry;
        }
        //13. nextAll 获取所有弟弟元素，返回一个数组
        function nextAll(curEle) {
            var nextAry=[];
            var nex=this.next(curEle);
            while (nex){
                nextAry.push(nex);
                nex=this.next(nex);
            }
            return nextAry;
        }
        //14. sibling 获取当前元素的相邻两个兄弟
        function sibling(curEle) {
            var sibAry=[];
            var pre=this.prev(curEle);
            var nex=this.prev(curEle);
            pre?sibAry.push(pre):null;
            nex?sibAry.push(nex):void 0;
            return sibAry;
        }
        //15. siblings 获取当前元素所有兄弟元素
        function siblings(curEle) {
            return this.prevAll(curEle).concat(this.nextAll(curEle));
        }
        //16. index 获取当前元素的索引
        function index(curEle) {
            return this.prevAll(curEle).length;
        }
        //17. 获取当前元素制定标签名的孩子节点
        function children(curEle,tagName) {
            var kids=curEle.childNodes;//所有的子节点
            var kidsAry=[];
            for (var i=0;i<kids.length;i++){
                if(kids[i].nodeType===1){
                    if(typeof tagName!=="undefined"){
                        if(kids[i].nodeName.toUpperCase()==tagName.toUpperCase()){
                            kidsAry.push(kids[i]);
                        }
                        continue;
                    }
                    kidsAry.push(kids[i]);

                }
            }
            return kidsAry;
        }
        //18. 获取第一个孩子元素节点
        function firstChild(curEle) {
            if(standerBrowser){
                return curEle.firstElementChild;
            }
            var firstKids=curEle.firstChild;
            while (firstKids&&firstKids.nodeType!==1){
                firstKids=firstKids.nextSibling;
            }
            return firstKids;
        }
        //19. 获取最后一个孩子元素节点
        function lastChild(curEle) {
            if(standerBrowser){
                return curEle.lastElementChild;
            }
            var lastKids=curEle.lastChild;
            while (lastKids&&lastKids.nodeType!==1){
                lastKids=lastKids.previousSibling;
            }
            return lastKids;
        }
        //20. 判断当前元素有没有某个或某些class名
        function hasClass(curEle,classStr) {
            //两种正则的写法
            var reg=new RegExp("(^| +)"+classStr+"( +|$)");
            // var reg=new RegExp("\\b"+classStr+"\\b");
            return reg.test(curEle.className);
        }
        //21. 给元素添加class名，严谨版
        function addClass(curEle,classStr) {
            //1.处理参数2 classStr将其首尾空格去掉
            classStr=classStr.replace(/(^ +)|( +$)/g,"");
            //2.按照一到多个空格将其拆分成数组
            var classAry=classStr.split(/ +/g);
            //3. 循环数组，判断curEle之前的className中有没有重复项
            for(var i=0;i<classAry.length;i++){
                if(!hasClass(curEle,classAry[i])){
                    curEle.className+=(" "+classAry[i]);
                }
            }
            //4. 为了保证全部类名第一个前面没有空格，再做一次首尾空格去除
            curEle.className=curEle.className.replace(/(^ +)|( +$)/g,"");
        }
        //22. 删除class名
        function removeClass(curEle,classStr) {
            ///1.处理参数2 classStr 将其首尾空格去掉，然后按照一到多个空格拆分为数组
            var classAry=classStr.replace(/^ +| +$/g,"").split(/ +/g);
            //2.循环判读之前的class中有没有，有的话替换成空字符串
            for (var i=0;i<classAry.length;i++){
                var reg=new RegExp("(^| +)"+classAry[i]+"( +|$)");
                curEle.className=curEle.className.replace(reg," ");
            }
            //3.再做一次首尾空格去除
            curEle.className=curEle.className.replace(/(^ +)|( +$)/g,"");
        }
        //23. 根据不同情况处理标签名，有的话就删除，没有的话就增加
        function toggleClass(curEle,classStr) {
            classStr=classStr.replace(/^ +| +$/g,"");
            var classAry=classStr.split(/ +/g);
            for(var i=0;i<classAry.length;i++){
                this.hasClass(curEle,classAry[i])?this.removeClass(curEle,classAry[i]):this.addClass(curEle,classAry[i]);
            }
        }
        return{
            toArray:toArray,
            toJsonObj:toJsonObj,
            offset:offset,
            win:win,
            getRandom:getRandom,
            getCss:getCss,
            setCss:setCss,
            setGroupCss:setGroupCss,
            css:css,
            prev:prev,
            next:next,
            prevAll:prevAll,
            nextAll:nextAll,
            sibling:sibling,
            siblings:siblings,
            index:index,
            children:children,
            firstChild:firstChild,
            lastChild:lastChild,
            hasClass:hasClass,
            addClass:addClass,
            removeClass:removeClass,
            toggleClass:toggleClass
        }
})();
