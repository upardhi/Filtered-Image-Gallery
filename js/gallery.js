(function($) {

    $.fn.imageGallery = function(options) {
        debugger;
        if (this.length === 0) return this;
        var el = this;
        var settings = $.extend({
            imageCategory: [],
            categoryImages: [],
            isLocalImage: true,
            categoryTemplate: '<a href="javascript:void(0)" class="sortLink" data-category="categoryId">categoryName</>',
            imageTemplate: '<a href="imageSrc" class="thumb-image fancybox"  title="imageCaption" rel="group" style="opacity:0"><img src="imageSrc" alt="imageCaption" /> <span>imageCaption</span></a>'
        }, options);

        /**
         * ===================================================================================
         * = PRIVATE FUNCTIONS
         * ===================================================================================
         */

        /**
         * Initializes namespace settings to be used throughout plugin
         */
        var init = function() {
            renderCategoryList();
            renderCategoryImageList();
        };
        var renderCategoryList = function() {
            var catList = getCategoryList();
            if (catList && catList.length > 1) {

                var catListHTML = [];
                for (var i = 0; i < catList.length; i++) {
                    var catDetails = catList[i];
                    catListHTML.push(replaceAll(settings.categoryTemplate, { categoryId: catDetails.ImageCatId, categoryName: catDetails.ImageCatName }));
                }
                var div = $('<div>', {
                    'class': 'cat-wrapper filter'
                });
                el.append(div);
                $(el.selector + '> div').html(catListHTML);
                $('.cat-wrapper [data-category]').bind('click', refreshCatImages);

            }

        };
        var renderImageUI = function(imageList) {
            $('.image-gal-img-wrapper').remove();
            var imageNodeList = [];
            for (var i = 0; i < imageList.length; i++) {
                var imageDetails = imageList[i];
                imageNodeList.push(replaceAll(settings.imageTemplate, { imageSrc: imageDetails.ImageUrl, imageId: imageDetails.ImageId, imageCaption: imageDetails.ImageName }));
            }
            var div = $('<div>', {
                'class': 'image-gal-img-wrapper'
            });
            el.append(div);

            $(el.selector + '> div.image-gal-img-wrapper').html(imageNodeList);

            animateThumbs();

        };

        var getCategoryList = function() {
            return settings.imageCategory;

        };
        var renderCategoryImageList = function() {
            var defaultCategoryId = getDefaultCategory();
            getCategoryImage(defaultCategoryId, function(categoryImage) {
                renderImageUI(categoryImage);

            });


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
                $.get("demo_test.asp", function(data, status) {
                    callback(data);
                    alert("Data: " + data + "\nStatus: " + status);
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
           @param {Object}{e} Event object 
           
        */
        var refreshCatImages = function(e) {
            var categoryId = $(this).attr('data-category');
            getCategoryImage(categoryId, function(categoryImage) {
                renderImageUI(categoryImage);
            });


        };
        var animateThumbs = function() {
            $('.thumb-image').css('display', 'inline-block').animate({
                'opacity': 1
            }, 500);
        };
        init();
    };


}(jQuery));