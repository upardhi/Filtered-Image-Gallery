(function($) {

    $.fn.imageGallery = function(options) {
        debugger;
        if (this.length === 0) return this;
        var el = this;
        var settings = $.extend({
            imageCategoryWrapper: 'cat-wrapper',
            /* this is class of wrapper */
            imageListWrapper: 'image-list-wrapper',
            imageListInnerWrapper: 'image-list-inner-wrapper',
            /* this is class of wrapper */
            imageCategory: [],
            categoryImages: [],
            perPageCount: 10,
            isLocalImage: false,
            categoryTemplate: '<a href="javascript:void(0)" class="sortLink" data-category="categoryId">categoryName</>',
            imageTemplate: '<a href="imageSrc" class="thumb-image fancybox"  title="imageCaption" rel="group" style="opacity:0"><img src="imageSrc" alt="imageCaption" /> <span>imageCaption</span></a>',
            loaderImageTemplate: '<div class="overlay"></div>'
        }, options);
        var $imageCategoryContainer = '';
        var $imageListContainer = '';
        var $imageListInnerContainer = '';
        var $contentLoadTriggered = false;




        /**
         * ===================================================================================
         * = PRIVATE FUNCTIONS
         * ===================================================================================
         */

        /**
         * Initializes namespace settings to be used throughout plugin
         */
        var init = function() {
            addLoaderInitial();
            setCategoryWrapper();
            setImageListWrapper();
            setTimeout(function() {
                renderCategoryList();
                renderCategoryImageList();

            }, 3000);
            $imageCategoryContainer = $(el.selector + '> .' + settings.imageCategoryWrapper);
            $imageListContainer = $(el.selector + '> .' + settings.imageListWrapper);
            $imageListInnerContainer = $(el.selector + '> .' + settings.imageListWrapper + '> .' + settings.imageListInnerWrapper);
            $imageListContainer.bind('scroll', loadOnScroll);

        };
        /**
         * Setting Category wrapper for rendering the list if categories in that category wrapper.
         */
        var setCategoryWrapper = function() {
            var catWrapper = $('<div>', {
                'class': settings.imageCategoryWrapper
            });
            el.append(catWrapper);
        };

        /**
         * Setting Category image  wrapper for rendering the list if categories images in that wrapper.
         */
        var setImageListWrapper = function() {
            var imageListWrapper = $('<div>', {
                'class': settings.imageListWrapper
            });
            el.append(imageListWrapper);
            var div = $('<div>', {
                'class': settings.imageListInnerWrapper
            });
            $(el.selector + '> .' + settings.imageListWrapper).html(div);
        };

        /**
         * Setting loader when data is not available on the container. Appending loader into the parent element of library.
         */
        var addLoaderInitial = function() {
            el.append(settings.loaderImageTemplate);


        };

        /**
         * Generating HTML for category and render that html inside the category div.
         */
        var renderCategoryList = function() {
            var catList = getCategoryList();
            if (catList && catList.length > 1) {
                var catListHTML = [];
                for (var i = 0; i < catList.length; i++) {
                    var catDetails = catList[i];
                    catListHTML.push(replaceAll(settings.categoryTemplate, { categoryId: catDetails.ImageCatId, categoryName: catDetails.ImageCatName }));
                }

                $(el.selector + '> .' + settings.imageCategoryWrapper).html(catListHTML);
                $('.' + settings.imageCategoryWrapper + ' [data-category]').bind('click', refreshCatImages);

            }
        };

        /**
         * Returning the list of category received in settings.
         * @returns {Object} Image category listing.
         */
        var getCategoryList = function() {
            return settings.imageCategory;

        };

        var renderImageUI = function(imageList) {
            var imageNodeList = [];
            for (var i = 0; i < imageList.length; i++) {
                var imageDetails = imageList[i];
                imageNodeList.push(replaceAll(settings.imageTemplate, { imageSrc: imageDetails.ImageUrl, imageId: imageDetails.ImageId, imageCaption: imageDetails.ImageName }));
            }
            $imageListInnerContainer.html(imageNodeList);
            animateThumbs();

        };


        var appendNewImageList = function(imageList) {
            var imageNodeList = [];
            for (var i = 0; i < imageList.length; i++) {
                var imageDetails = imageList[i];
                imageNodeList.push(replaceAll(settings.imageTemplate, { imageSrc: imageDetails.ImageUrl, imageId: imageDetails.ImageId, imageCaption: imageDetails.ImageName }));
            }
            $imageListInnerContainer.append(imageNodeList);
            animateThumbs();
            $contentLoadTriggered = false;
        };


        var renderCategoryImageList = function() {
            var defaultCategoryId = getDefaultCategory();
            getCategoryImage(defaultCategoryId, function(categoryImage) {
                renderImageUI(categoryImage);

            });


        };


        var animateThumbs = function() {
            $('.thumb-image').css('display', 'inline-block').animate({
                'opacity': 1
            }, 500);
            $('.overlay').remove();
        };

        var getDefaultCategory = function() {
            var listOfCategory = settings.imageCategory;
            if (listOfCategory) {
                for (var i = 0; i < listOfCategory.length; i++) {
                    var categoryDetails = listOfCategory[i];
                    var isDefaultCat = categoryDetails.IsDefault ? categoryDetails.IsDefault : categoryDetails.isDefault;

                    if (isDefaultCat) {
                        return categoryDetails.ImageCatId;
                    }


                }
            }
            return 0;

        };


        var getCategoryImage = function(categoryId, callback) {
            if (categoryId && callback) {
                if (settings.isLocalImage) {
                    callback(getCategoryImageFromLocal(categoryId));
                } else {
                    getCategoryImageFromServer(categoryId, function(images) {
                        callback(images);
                    });
                }

            }

        };

        /**
         * This function use for getting the list of Clip arts from loacal
         * @param {String} categoryId 
         * @returns {Array} clipArtImages clipArt Images 
         */
        var getCategoryImageFromLocal = function(categoryId) {
            if (categoryId) {
                var categoryImages = settings.categoryImages;
                if (categoryImages) {
                    for (var i = 0; i < categoryImages.length; i++) {
                        var categoryImage = categoryImages[i];
                        if (categoryImage.categoryId === categoryId || categoryImage.CategoryId === categoryId) {
                            return categoryImage.ImageList;

                        }

                    }
                }
            }
        };


        /* Function for getting Images from server
          @param {categoryId} {Number} Category Id for getting list of images using this categoryId
          @param {callback} {function} Callback function call once image received from server.
        */
        var getCategoryImageFromServer = function(categoryId, callback) {
            if (categoryId) {
                $imageListInnerContainer.append(settings.loaderImageTemplate);
                $.get("js/clipart_" + categoryId + ".json", function(data) {
                    setTimeout(function() {

                        callback(data);

                    }, 3000);
                    //alert("Data: " + data + "\nStatus: " + status);
                });
            }


        };


        /* Helper function for replacing particular keys from string and use for generating Image Node and Category Node
           @param {str}{String} String containing the list of variables
           @param {mapObj} {Object} List of values that need to replace from base string 
           @return replaced String.
        */
        var replaceAll = function(str, mapObj) {
            var re = new RegExp(Object.keys(mapObj).join("|"), "gi");
            return str.replace(re, function(matched) {
                return mapObj[matched];
            });
        };

        /* Function use for refresh images according to the selected category. 
         */
        var refreshCatImages = function() {
            var categoryId = $(this).attr('data-category');
            getCategoryImage(categoryId, function(categoryImage) {
                renderImageUI(categoryImage);
            });


        };

        /**
         * Adding loader while loading images on scrolling.
         * @param {Object} container 
         */
        var addLoader = function(container) {
            container.append(settings.loaderImageTemplate);
        };


        /**
         * Loading images on scroll of div area. Here we are calculating top and height of div and send out call for loading images.
         */
        var loadOnScroll = function() {
            if ($imageListContainer.scrollTop() >= ($imageListInnerContainer.height() -
                    $imageListContainer.height()) &&
                $contentLoadTriggered === false) {
                $contentLoadTriggered = true;
                addLoader($imageListContainer);
                getCategoryImage('All', function(categoryImage) {

                    appendNewImageList(categoryImage);

                });
            }

        };

        init();
    };


}(jQuery));