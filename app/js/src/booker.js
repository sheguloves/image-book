var urls = ["app/styles/images/001.jpg", "app/styles/images/002.jpg", "app/styles/images/003.jpg", "app/styles/images/004.jpg",
            "app/styles/images/005.jpg", "app/styles/images/006.jpg", "app/styles/images/007.jpg", "app/styles/images/008.jpg",
            "app/styles/images/001.jpg", "app/styles/images/002.jpg", "app/styles/images/003.jpg", "app/styles/images/004.jpg",
            "app/styles/images/005.jpg", "app/styles/images/006.jpg", "app/styles/images/007.jpg", "app/styles/images/008.jpg"];

$.fn.hasScrollBar = function() {
    return this.get(0).scrollHeight > this.height();
};

var mouseEnter = false;
var pendding = false;
var movement = 0;
var key = 0;

var coverPage = <div style={{padding: '20px'}}>
                    <ul>
                        <li>LOGO的位置可以看页面左上角</li>
                        <li>可以给每个页面加链接，比如： <a href="https://wwww.baidu.com" target="_blank">百度</a></li>
                        <li>每个页面实际上是一个网页，所以如果要制作出一本书，实际上每个页面都必须用作网页的方法做，当然
                            每个页面可以直接拷贝到一个地方，简单的加一些东西就可以生成一个独立的网页。现在我只是简单的在每个
                            页面上放置了图片，如果你的样本都是图片，可以直接导入图片，就可以作为一本书预览</li>
                        <li>关于一共多少页当然可以加，不过我已经加上可预览，也可以通过下面的预览滚动条操作，知道一共有多少页
                            如果要做成你发的那个样子，可以做到，需要时间</li>
                        <li>关于时间限制，可以加，有个很简单的方式，但是破解起来应该也很简单，复杂的方法也是可以做的</li>
                        <li>关于分类按钮，跟链接是一样的，都是很容易就可以加的</li>
                        <li>关于夸平台，当前的这个东西只仅限于桌面应用，windows、mac、linux，移动设备暂时还不支持，以后能不能支持，不知道</li>
                    </ul>
                </div>;

function getSize() {
    if (window.matchMedia("(min-width: 1200px) and (min-height: 1100px)").matches) {
        return {
            width: 980,
            height: 700,
            itemwidth: 105
        };
    } else if (window.matchMedia("(min-width: 992px) and (min-height: 990px)").matches) {
        return {
            width: 840,
            height: 600,
            itemwidth: 84
        }
    } else if (window.matchMedia("(min-width: 768px) and (min-height: 800px)").matches) {
        return {
            width: 630,
            height: 450,
            itemwidth: 70
        }
    } else {
        return {
            width: 630,
            height: 450,
            itemwidth: 70
        }
    }
}

var currentSize = getSize();

function addBrowserBehavior() {
    $('a[target=_blank]').on('click', function(){
       require('nw.gui').Shell.openExternal(this.href);
       return false;
    });
}

function galleryScroll() {
    var $gallery = $('.gallery');
    pendding = false;
    $gallery.scrollLeft(movement);
    movement = 0;
}

function bookletChangeHandler(event, data) {
    var $gallery = $('.gallery');
    if (!$gallery.hasScrollBar()) {
        return;
    }
    var size = getSize();
    var index = data.index + 1;
    movement = index * size.itemwidth - (size.width / 2)
    if (mouseEnter) {
        pendding = true;
    } else {
        galleryScroll();
    }
}

var InfoArea = React.createClass({
    render: function() {
        return (
            <div className="header">
                <label style={{lineHeight: "5rem", backgroundColor: "#fff"}}>LOGO位置</label>
            </div>
        );
    }
});

var NarBar = React.createClass({
    handleFiles: function(event) {
        var files = event.target.files;
        if (files.length === 0) {
            return null;
        } else {
            var imagelist = [];
            var src;
            for (var i = 0; i < files.length; i++) {
                src = window.URL.createObjectURL(files[i]);
                imagelist.push(src);
            }
            this.props.onImageSelected(imagelist);
        }
    },
    render: function() {
        return (
            <nav className="navbar navbar-default">
                <div className="container">
                    <div className="btn-group">
                        <input id="fileSelectionIpt" type="file" multiple onChange={this.handleFiles} accept="image/*"/>
                        <label htmlFor="fileSelectionIpt" title="导入图片">导入</label>
                        <label className="separater"> | </label>
                        <label>关于</label>
                    </div>
                </div>
            </nav>
        );
    }
});

var Gallery = React.createClass({
    componentDidMount: function() {
        var $gallery = $(this.refs.gallery);
        $gallery
        .mouseenter(function(event) {
            mouseEnter = true;
        })
        .mouseleave(function(event) {
            mouseEnter = false;
            if (pendding) {
                // scroll gallery after hover animation finish
                setTimeout(galleryScroll, 500);
            }
        });
        $(this.refs.scrollnext)
        .click(function(event) {
            if (!$gallery.hasScrollBar()) {
                return;
            }
            var size = getSize();
            movement = $gallery.scrollLeft() + size.itemwidth;
            galleryScroll();
        });
        $(this.refs.scrollprev)
        .click(function(event) {
            if (!$gallery.hasScrollBar()) {
                return;
            }
            var size = getSize();
            movement = $gallery.scrollLeft() - size.itemwidth;
            galleryScroll();
        });
    },
    render: function() {
        var temp;
        var images = this.props.images;
        if (images && images.length > 0) {
            temp = [];
            for (var i = 0; i < images.length; i ++) {
                key++;
                temp.push(<GalleryItem key={key} pageindex={i} imagesrc={images[i]} />);
            }
        } else {
            temp = <div> No image selected </div>
        }
        return (
            <div className="gallery_wrapper">
                <i ref="scrollprev" className="fa fa-chevron-left"></i>
                <i ref="scrollnext" className="fa fa-chevron-right"></i>
                <div ref="gallery" className="gallery">
                    <ul>
                        {temp}
                    </ul>
                </div>
            </div>
        );
    }
});

var GalleryItem = React.createClass({
    loadHandler: function() {
        window.URL.revokeObjectURL(this.src);
    },
    clickHandler: function() {
        //TODO: Replaced this function with Flux
        var $mybook = $('#mybook');
        $mybook.booklet("gotopage", this.props.pageindex);
    },
    render: function() {
        return (
            <li>
                <div className="galleryItem" onClick={this.clickHandler}>
                    <img src={this.props.imagesrc} onLoad={this.loadHandler}/>
                    <div className="g-counter">{this.props.pageindex + 1}</div>
                </div>
            </li>
        );
    }
});

var Book = React.createClass({
    removeBooklet: function() {
        var $mybook = $(this.refs.mybook);
        $mybook.booklet("destroy");
    },
    addBooklet: function() {
        var $loading = $(this.refs.loading);
        var $bttn_next = $(this.refs.next_page_button);
        var $bttn_prev = $(this.refs.prev_page_button);
        var $mybook = $(this.refs.mybook);
        $loading.hide();
        $bttn_next.show();
        $bttn_prev.show();
        var size = getSize();
        $mybook.show().booklet({
            width: size.width, // container width
            height: size.height, // container height
            speed: 300, // speed of the transition between pages
            startingPage: 0, // index of the first page to be displayed

            closed: false,   // start with the book "closed", will add empty pages to beginning and end of book

            pagePadding: 0, // padding for each page wrapper
            pageNumbers: true, // display page numbers on each page

            keyboard: true, // enables navigation with arrow keys (left: previous, right: next)
            next: $bttn_next, // selector for element to use as click trigger for next page
            prev: $bttn_prev, // selector for element to use as click trigger for previous page

            shadows: false, // display shadows on page animations
            change: bookletChangeHandler
        });
    },
    componentWillUnmount: function() {
        // remove previous booklet before new images loading
        this.removeBooklet();
        var $loading = $(this.refs.loading);
        var $bttn_next = $(this.refs.next_page_button);
        var $bttn_prev = $(this.refs.prev_page_button);
        var $mybook = $(this.refs.mybook);
        $loading.show();
        $bttn_next.hide();
        $bttn_prev.hide();
        $mybook.hide();
    },
    componentDidUpdate: function() {
        // add booklet immediately after new images loading
        this.addBooklet();
    },
    componentDidMount: function() {
        // add booklet immediately after initial images loading
        this.addBooklet();
        var $mybook = $(this.refs.mybook);
        $(window).resize(function() {
            var temp = getSize();
            if (temp.width !== currentSize.width) {
                currentSize = temp;
                delete currentSize.itemwidth;
                $mybook.booklet('option', currentSize);
            }
        });
        addBrowserBehavior();
    },
    render: function() {
        var temp;
        var images = this.props.images;
        if (images && images.length > 0) {
            temp = [];
            temp.push(coverPage);
            images.forEach(function(item) {
                key++;
                temp.push(<ImageItem key={key} imagesrc={item} />);
            });
        }
        return (
            <div className="book_wrapper">
                <i className="fa fa-chevron-left" ref="next_page_button"></i>
                <i className="fa fa-chevron-right" ref="prev_page_button"></i>
                <div ref="loading" className="loading">Loading pages...</div>
                <div id="mybook" ref="mybook" style={{display: 'none'}}>
                    {temp}
                </div>
            </div>
        );
    }
});

var ImageItem = React.createClass({
    loadHandler: function() {
        window.URL.revokeObjectURL(this.src);
    },
    render: function() {
        return (
            <div className="image_box">
                <img src={this.props.imagesrc} onLoad={this.loadHandler}/>
            </div>
        );
    }
});

var Booker = React.createClass({
    render: function() {
        return (
            <div className="container">
                <Book images={this.props.images} />
                <Gallery images={this.props.images} />
            </div>
        );
    }
});

var Footer = React.createClass({
    render: function() {
        return (
            <footer>
                <p>Copyright © 2015 All rights reserved. Build by Felix Xi</p>
            </footer>
        );
    }
});

var App = React.createClass({
    getInitialState: function() {
        return {
            images: urls
        };
    },
    handleImageSelected: function(imageslist) {
        this.setState({images: imageslist});
    },
    render: function() {
        return (
            <div style={{width: '100%', height: '100%'}}>
                <InfoArea />
                <NarBar onImageSelected={this.handleImageSelected} />
                <Booker images={this.state.images}/>
                <Footer />
            </div>
        );
    }
})

ReactDOM.render(
    <App />,
    document.getElementById('root')
);