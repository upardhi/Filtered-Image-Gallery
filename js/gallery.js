(function($) {

    $.fn.imageGallery = function(options) {
        debugger;
        if (this.length == 0) return this;
        var el = this;
		var imageNode='<div><img src="imageSrc" class="img" data-image-id=imageId><span>imageCaption</span></div>';
		var categoryNode='<a href="javascript:void(0)" class="sortLink" data-category="categoryId">categoryName</>';
		var imageNode ='<a href="imageSrc" class="thumb-image fancybox"  title="imageCaption" rel="group"><img src="imageSrc" alt="imageCaption" /> <span>imageCaption</span></a>'
		
        var settings = $.extend({
            imageCategory: [],
            categoryImages: [],
            serverUrl: '',
            defaultImages: [],
            isLocalImage: true,
            perPageCount: 10
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
        }
        var renderCategoryList = function() {
			 var catList = getCategoryList();
			if(catList && catList.length > 1){
				
				var catListHTML = [];
				for (var i = 0; i < catList.length; i++) {
					var catDetails = catList[i];
					catListHTML.push(replaceAll(categoryNode, {categoryId:catDetails.ImageCatId,categoryName:catDetails.ImageCatName}))
				}
				var div = $('<div>', {
					'class': 'cat-wrapper filter'
				})
				el.append(div);
				$(el.selector + '> div').html(catListHTML);
				$('.cat-wrapper [data-category]').bind('click',refreshCatImages)
				
			}
           
        }
		var renderImageUI = function(imageList){
			$('.image-gal-img-wrapper').remove();
            var imageNodeList = [];
            for (var i = 0; i < imageList.length; i++) {
                var imageDetails = imageList[i];
                imageNodeList.push(replaceAll(imageNode, {imageSrc:imageDetails.ImageUrl,imageId:imageDetails.ImageId,imageCaption:imageDetails.ImageName}))
            }
            var div = $('<div>', {
                'class': 'image-gal-img-wrapper'
            })
            el.append(div);

            $(el.selector + '> div.image-gal-img-wrapper').html(imageNodeList);
			
			
		}
		
        var getCategoryList = function() {
            return settings.imageCategory;

        }
        var renderCategoryImageList = function() {
            var defaultCateforyId = getDefaultCategory()
            getCategoryImage(defaultCateforyId,function(categoryImage){
				 renderImageUI(categoryImage);
				
			});
           

        }
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

        }
        var getCategoryImage = function(categoryId,callback) {
            if (categoryId && callback) {
                if (settings.isLocalImage) {
                    callback(getCategoryImageFromLocal(categoryId));
                } else {
                    getCategoryImageFromServer(categoryId,function(images){
						callback(images)
					});
                }

            }

        }
        var getCategoryImageFromLocal = function(categoryId) {
            if (categoryId) {
                var categoryImages = settings.categoryImages;
                if (categoryImages) {
                    for (var i = 0; i < categoryImages.length; i++) {
                        var categoryImage = categoryImages[i];
                        if (categoryImage.categoryId == categoryId || categoryImage.CategoryId == categoryId) {
                            return categoryImage.ImageList;

                        }

                    }
                }
            }


        }
		/* Function for getting Images from server
		   @param {categoryId} {Number} Category Id for geeting list of images using this categoryId
		   @param {callback} {function} Callback funtion call once image received froms server.
		   
		
		*/
        var getCategoryImageFromServer = function(categoryId, callback) {
            if (categoryId) {
                $.get("demo_test.asp", function(data, status) {
					callback(data);
                    alert("Data: " + data + "\nStatus: " + status);
                });
            }


        }
		/* Helper function for replacing perticular keys from string and use for generating Image Node and Category Node
		   @param {str}{String} String containing the list of variables
		   @param {mapObj} {Object} List of values that need to replace from base string 
		   @return replaced String.
		*/
		var replaceAll =function(str,mapObj){
			var re = new RegExp(Object.keys(mapObj).join("|"),"gi");
			return str.replace(re, function(matched){
				return mapObj[matched];
			});
		}
		/* Function use for refressing images according to the selected category. 
		   @param {Object}{e} Event object 
		   
		*/
		var refreshCatImages = function(e){
			var categoryId= $(this).attr('data-category');	
			getCategoryImage(categoryId,function(categoryImage){
				  renderImageUI(categoryImage);
			});
          
			
		}
        init();
    }


}(jQuery));


(function() {

    var thumbsSpacing = 15;

    $('.filter').css('margin-bottom', thumbsSpacing + 'px');
    $('.thumbnail').addClass('showThumb').addClass('fancybox').attr('rel', 'group');

    $('a.sortLink').on('click', function(e) {
        e.preventDefault();
        $('a.sortLink').removeClass('selected');
        $(this).addClass('selected');

        var category = $(this).data('category');
        filterThumbs(category);
    });

    positionThumbs();
    setInterval(checkViewport, 750);

    function checkViewport() {

        var photosWidth = $('.photos').width(),
            thumbsContainerWidth = $('.thumbnail_wrap').width(),
            thumbnailWidth = $('a.thumbnail:first-child').outerWidth();

        if (photosWidth < thumbsContainerWidth) {
            positionThumbs();
        }

        if ((photosWidth - thumbnailWidth) > thumbsContainerWidth) {
            positionThumbs();
        }
    }

    function filterThumbs(category) {

        $('a.thumbnail').each(function() {
            var thumbCategory = $(this).data('categories');

            if (category === 'all') {
                $(this).addClass('showThumb').removeClass('hideThumb').attr('rel', 'group');
            } else {
                if (thumbCategory.indexOf(category) !== -1) {
                    $(this).addClass('showThumb').removeClass('hideThumb').attr('rel', 'group');
                } else {
                    $(this).addClass('hideThumb').removeClass('showThumb').attr('rel', 'none');
                }
            }
        });

        positionThumbs();

    }

    function positionThumbs() {

        $('a.thumbnail.hideThumb').animate({
            'opacity': 0
        }, 500, function() {
            $(this).css({
                'display': 'none',
                'top': '0px',
                'left': '0px'
            });
        });

        var containerWidth = $('.photos').width(),
            thumbRow = 0,
            thumbColumn = 0,
            thumbWidth = $('.thumbnail img:first-child').outerWidth() + thumbsSpacing,
            thumbHeight = $('.thumbnail img:first-child').outerHeight() + thumbsSpacing,
            maxColumns = Math.floor(containerWidth / thumbWidth);

        $('a.thumbnail.showThumb').each(function(index) {
            var remainder = (index % maxColumns) / 100,
                maxIndex = 0;

            if (remainder === 0) {
                if (index !== 0) {
                    thumbRow += thumbHeight;
                }
                thumbColumn = 0;
            } else {
                thumbColumn += thumbWidth;
            }

            $(this).css('display', 'block').animate({
                'opacity': 1,
                'top': thumbRow + 'px',
                'left': thumbColumn + 'px'
            }, 500);

            var newWidth = thumbColumn + thumbWidth,
                newHeight = thumbRow + thumbHeight;
            $('.thumbnail_wrap').css({
                'width': newWidth + 'px',
                'height': newHeight + 'px'
            });
        });

        findFancyBoxLinks();
    }

    function findFancyBoxLinks() {

        $('a.fancybox[rel="group"]').fancybox({
            'transitionIn': 'elastic',
            'transitionOut': 'elastic',
            'titlePosition': 'over',
            'speedIn': 500,
            'overlayColor': '#000',
            'padding': 0,
            'overlayOpacity': .75
        });
    }

})();