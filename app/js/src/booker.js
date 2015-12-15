var urls = ["app/styles/images/001.jpg", "app/styles/images/002.jpg", "app/styles/images/003.jpg", "app/styles/images/004.jpg",
            "app/styles/images/005.jpg", "app/styles/images/006.jpg", "app/styles/images/007.jpg", "app/styles/images/008.jpg"];

$.fn.hasScrollBar = function() {
    return this.get(0).scrollHeight > this.height();
};

var mouseEnter = false;
var pendding = false;
var movement = 0;

var GALLERY_WIDTH = 900;
var GALLERY_ITEM_WIDTH = 116;

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
    var index = data.index + 1;
    movement = index * GALLERY_ITEM_WIDTH - (GALLERY_WIDTH / 2)
    if (mouseEnter) {
        pendding = true;
    } else {
        galleryScroll();
    }
}

var Gallery = React.createClass({
    componentDidMount: function() {
        var $gallery = $('.gallery');
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
    },
    render: function() {
        var temp;
        var images = this.props.images;
        if (images && images.length > 0) {
            temp = [];
            for (var i = 0; i < images.length; i ++) {
                temp.push(<GalleryItem key={images[i] + i} pageindex={i} imagesrc={images[i]} />);
            }
        } else {
            temp = <div> No image selected </div>
        }
        return (
            <div className="gallery">
                <ul>
                    {temp}
                </ul>
            </div>
        )
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
            <li><div className="galleryItem" onClick={this.clickHandler}>
                <img src={this.props.imagesrc} onLoad={this.loadHandler}/>
            </div></li>
        )
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
        $mybook.show().booklet({
            width: 800, // container width
            height: 500, // container height
            speed: 300, // speed of the transition between pages
            startingPage: 0, // index of the first page to be displayed

            closed: false,   // start with the book "closed", will add empty pages to beginning and end of book

            pagePadding: 10, // padding for each page wrapper
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
    },
    render: function() {
        var temp;
        var images = this.props.images;
        if (images && images.length > 0) {
            temp = [];
            images.forEach(function(item) {
                temp.push(<ImageItem key={item} imagesrc={item} />);
            });
        } else {
            temp = <div> No image selected </div>
        }
        return (
            <div className="book_wrapper">
                <a id="next_page_button" ref="next_page_button"></a>
                <a id="prev_page_button" ref="prev_page_button"></a>
                <div id="loading" ref="loading" className="loading">Loading pages...</div>
                <div id="mybook" ref="mybook" style={{display: 'none'}}>
                    {temp}
                </div>
            </div>
        )
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
        )
    }
});

var Files = React.createClass({
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
            <footer>
                <input id="fileDialog" type="file" multiple onChange={this.handleFiles} accept="image/*" style={{display:'none'}}/>
                <label style={{cursor: 'pointer'}} htmlFor="fileDialog" className="open-button">Select Images</label>
            </footer>
        )
    }
});

var Booker = React.createClass({
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
            <div>
                <Book images={this.state.images} />
                <Files onImageSelected={this.handleImageSelected} />
                <Gallery images={this.state.images} />
            </div>
        );
    }
});

ReactDOM.render(
    <Booker />,
    document.getElementById('booker')
);