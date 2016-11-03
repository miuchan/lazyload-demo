var lazyload = (function() {
    var data = getData('data.json'),
        $ = function(selector) {
            return document.querySelector(selector)
        }

    // function addEventListener(ele, event, handler) {
    //     var addEventListener
    //
    //     if (ele.addEventListener) {
    //         addEventListener = ele.addEventListener(event, handler)
    //     } else if (ele.attachEvent) {
    //         addEventListener = ele.attachEvent('on' + event, handler)
    //     } else {
    //         ele['on' + event] = handler
    //     }
    //
    //     return addEventListener
    // }

    function setAttributes(node, attrs) {
        for (var attrName in attrs) {
            if (attrs.hasOwnProperty(attrName)) {
                node.setAttribute(attrName, attrs[attrName])
            }
        }
    }

    function isInViewport(node) {
        var rect = node.getBoundingClientRect()

        return (
            rect.bottom >= -200 &&
            rect.right >= 0

            &&
            rect.top <= (window.innerHeight || document.documentElement.clientHeight)

            &&
            rect.left <= (window.innerWidth || document.documentElement.clientWidth))
    }

    function getData(url) {
        var xhr = new XMLHttpRequest()

        xhr.open('GET', url, false)
        xhr.overrideMimeType('application/json')
        xhr.send()
        if (xhr.status === 200) {
            console.log(xhr.status)
        }

        return JSON.parse(xhr.responseText)
    }

    var rander = function(count) {
        var container = $('div.img-wrapper'),
            dataToLoad = Array.prototype.concat.call(data.splice(0, count))

        for (var imgSrc of dataToLoad) {
            var imgItemDiv = document.createElement('div'),
                imgTag = document.createElement('img')
            setAttributes(imgItemDiv, {
                'class': 'img-item'
            })
            setAttributes(imgTag, {
                'class': 'lazyload',
                'src': imgSrc
            })
            imgItemDiv.appendChild(imgTag)
            container.appendChild(imgItemDiv)
        }

        dataToLoad = []
    }

    var load = (function() {

        return function() {

            if (isInViewport($('.img-wrapper').lastElementChild)) {
              rander(8)
            }
        }

    }())

    var init = function () {
      window.addEventListener('load', lazyload.rander(12))
      window.addEventListener('scroll', lazyload.load)
    }

    return {
      init: init,
      rander: rander,
      load: load
    }
}())
