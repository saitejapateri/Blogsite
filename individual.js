



document.addEventListener('DOMContentLoaded', function () {

    var toggleSwitch = document.getElementById('toggleMode');
    var currentMode = localStorage.getItem('mode');
    if (currentMode) {
        document.body.classList.add(currentMode);
        toggleSwitch.checked = currentMode === 'dark-mode';
    }

    function toggleMode() {
        document.body.classList.toggle('dark-mode');
        var newMode = document.body.classList.contains('dark-mode') ? 'dark-mode' : 'light-mode';
        localStorage.setItem('mode', newMode);
    }

    toggleSwitch.addEventListener('change', toggleMode);

    // Function to get query parameters from the URL
    function getQueryParam(parameterName) {
        var queryString = window.location.search;
        var urlParams = new URLSearchParams(queryString);
        return urlParams.get(parameterName);
    }

    // Get the blog ID from the query parameter
    var blogId = getQueryParam("id");

    // Fetch blog content based on the blog ID
    fetch('blogs.json')
        .then(response => response.json())
        .then(blogDataList => {
            var individualBlog = blogDataList.find(blog => blog.id == blogId);

            if (individualBlog) {
                displayIndividualBlog(individualBlog);
                // Highlight the link based on the category
                highlightLink(individualBlog.category);

                // Fetching relatedBlogs
                var relatedBlogs = blogDataList.filter(blog => blog.category === individualBlog.category && blog.id !== individualBlog.id);

                // Display related blogs
                displayRelatedBlogs(relatedBlogs.slice(0,2));
            } else {
                console.error('Blog not found for ID:', blogId);
            }
        })
        .catch(error => console.error('Error fetching blogs:', error));

    // Function to display individual blog
    function displayIndividualBlog(blog) {
        var individualContainer = document.getElementById('individualContainer');


        // Create elements to display individual blog
        var cardDiv = document.createElement('div');
        cardDiv.classList.add('card', 'h-100', 'mb-3', 'border-0');

        console.log(cardDiv)

        var itemsDiv=document.createElement('div')
        itemsDiv.classList.add('flex-wrap')

        var backButtonDiv=document.createElement('div');
        backButtonDiv.classList.add('d-flex','border-4');
        backButtonDiv.addEventListener('click',()=>{
            window.location.href='index.html';
        })

        var backButton=document.createElement('img');
        backButton.src="./images/Vector.svg";
        backButton.style.width="20px";
        backButton.style.height="20px";
        backButton.classList.add('border-0','mt-1')
        backButtonDiv.appendChild(backButton);

        var backButtonName=document.createElement('p');
        backButtonName.textContent="Back";
        backButtonName.classList.add('mx-2','rounded','border-0')
        backButtonDiv.appendChild(backButtonName);


        var headingEl=document.createElement('h1');
        headingEl.textContent="Anima Introduces : Hotspot hints";
        headingEl.classList.add('mt-1')
        headingEl.style.fontFamily="'Epilogue', sans-serif";
        headingEl.style.fontWeight="600";

        // addition row for items
        var rowEle = document.createElement('div');
        rowEle.classList.add('row','mt-4','mb-2');
        
        //column
        var col1Div = document.createElement('div');
        col1Div.style.position="relative";
        col1Div.classList.add('col-sm-6','col-lg-8','p-0');

        var profilePic=document.createElement('img');
        profilePic.src="./images/author.jpg"
        profilePic.style.width="50px";
        profilePic.style.height="50px";
        profilePic.style.borderRadius="50%"
        profilePic.style.float="left";
        profilePic.classList.add('mx-3','my-2')
        col1Div.appendChild(profilePic);

        var p1Ele=document.createElement('p');
        p1Ele.textContent=blog.author + " | " + blog.role;
        var p2Ele=document.createElement('p');
        p2Ele.textContent=blog.date + " | " + blog.readTime;
        col1Div.appendChild(p1Ele);
        col1Div.appendChild(p2Ele);

        var shareButton=document.createElement('img');
        shareButton.src="https://cdn.icon-icons.com/icons2/878/PNG/512/share-symbol_icon-icons.com_68493.png";
        shareButton.style.width="30px"
        shareButton.style.position="absolute";
        shareButton.style.top="20px"
        shareButton.style.left="280px";
        shareButton.classList.add();
        col1Div.appendChild(shareButton);
    
        var dropdownMenu = document.createElement('div');
        dropdownMenu.classList.add('dropdown-menu');
        dropdownMenu.style.display = 'none';
        // dropdownMenu.style.position='absolute'
        col1Div.appendChild(dropdownMenu);
        
        // Add items to the dropdown menu
        var whatsappItem = createDropdownItem('WhatsApp', 'https://whatsapp.com/link');
        var facebookItem = createDropdownItem('Facebook', 'https://facebook.com/link');
        var twitterItem = createDropdownItem('Twitter', 'https://twitter.com/link');
        var instagramItem = createDropdownItem('Instagram', 'https://instagram.com/link');
        
        dropdownMenu.appendChild(whatsappItem);
        dropdownMenu.appendChild(facebookItem);
        dropdownMenu.appendChild(twitterItem);
        dropdownMenu.appendChild(instagramItem);

        
        
        function createDropdownItem(text, link) {
            var item = document.createElement('a');
            item.href = link;
            item.textContent = text;
            item.style.display = 'block';
            item.style.padding = '5px';
            item.style.textDecoration = 'none';
            item.style.color = '#333'; 
        
            //hover effect
            item.addEventListener('mouseover', function () {
                item.style.backgroundColor = '#eee';
            });
        
            item.addEventListener('mouseout', function () {
                item.style.backgroundColor = 'transparent';
            });
        
            if (text === 'Facebook') {
                item.addEventListener('click', function (event) {
                    event.preventDefault();
                    var blogImgSrc=cardDiv.querySelector('.card-img-top').getAttribute('src');
                    shareOnFacebook(blogImgSrc);
                });
            }
            else if(text === 'Twitter'){
                item.addEventListener('click', function (event) {
                    event.preventDefault();
                    var blogImgSrc=cardDiv.querySelector('.card-img-top').getAttribute('src');
                    shareOnTwitter(blogImgSrc);
                });
            }
            else if(text === 'WhatsApp'){
                item.addEventListener('click',function(event){
                    event.preventDefault();
                    var blogImgSrc=cardDiv.querySelector('.card-img-top').getAttribute('src');
                    shareOnWhatsapp(blogImgSrc);
                })
            }
            else if(text === 'Instagram'){
                item.addEventListener('click',function(event){
                    event.preventDefault();
                    var blogImgSrc=cardDiv.querySelector('.card-img-top').getAttribute('src');
                    shareOnInsta(blogImgSrc);
                })
            }
            return item;
        }

        function shareOnFacebook(imgSrc) {
            const facebookSharerUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + imgSrc;
            window.open(facebookSharerUrl, '_blank');
        }

        function shareOnTwitter(imgSrc) {
            const twitterIntentUrl =
                'https://twitter.com/intent/tweet?text=' + imgSrc;
            window.open(twitterIntentUrl, '_blank');
        }

        function shareOnWhatsapp(imgSrc) {
            url='whatsapp://send?text='+encodeURIComponent(imgSrc);
            window.open(url,'_blank');
        }

        function shareOnInsta(imageSrc) {
            window.open('instagram://library?AssetPath=' + encodeURIComponent(imageSrc), '_blank');
        }
        
        shareButton.addEventListener('click', function () {
            if (dropdownMenu.style.display === 'none') {
                dropdownMenu.style.display = 'block';
            } else {
                dropdownMenu.style.display = 'none';
            }
        });
        
        dropdownMenu.style.position = 'absolute';
        dropdownMenu.style.top = '40px';
        dropdownMenu.style.left = '0';
        dropdownMenu.style.backgroundColor = 'white';
        dropdownMenu.style.border = '1px solid #ccc';
        dropdownMenu.style.padding = '5px';
        dropdownMenu.style.zIndex = '1';


        var fontSizeSlider=document.createElement('div');
        fontSizeSlider.classList.add('slider-container');
        fontSizeSlider.style.position="absolute";
        fontSizeSlider.style.top="10px";
        fontSizeSlider.style.right="400px";

        var labelContainer=document.createElement('div');
        labelContainer.classList.add('label-container');

        var inputRange = document.createElement('input');
        inputRange.type = 'range';
        inputRange.id = 'fontSizeSlider';
        inputRange.min = '1';
        inputRange.max = '5';
        inputRange.step = '1';
        inputRange.value = '3';
        inputRange.classList.add('custom-range', 'thin-slider','mt-0');
        inputRange.setAttribute('list', 'tickmarks');
        
        // Create the datalist for fixed points
        var dataList = document.createElement('datalist');
        dataList.id = 'tickmarks';
        var options = ['1', '2', '3', '4', '5'];
        
        options.forEach(function (value) {
            var option = document.createElement('option');
            option.value = value;
            dataList.appendChild(option);
        });

        // var span1=document.createElement('span');
        // span1.classList.add('mx-1')
        // span1.textContent='aA';
        // span1.style.fontSize="12px";
        // var span2=document.createElement('span');
        // span2.classList.add('mx-1')
        // span2.textContent='aA';
        // span2.style.fontSize="14px";
        // var span3=document.createElement('span');
        // span3.classList.add('mx-1')
        // span3.textContent='aA';
        // span3.style.fontSize="17px";
        // var span4=document.createElement('span');
        // span4.classList.add('mx-1')
        // span4.textContent='aA';
        // span4.style.fontSize="20px";
        // var span5=document.createElement('span');
        // span5.classList.add('mx-1')
        // span5.textContent='aA';
        // span5.style.fontSize="22px";
        var span1 = createSpan('14px');
        var span2 = createSpan('16px');
        var span3 = createSpan('18px');
        var span4 = createSpan('20px');
        var span5 = createSpan('22px');

        labelContainer.appendChild(span1);
        labelContainer.appendChild(span2);
        labelContainer.appendChild(span3);
        labelContainer.appendChild(span4);
        labelContainer.appendChild(span5);
        
        

        fontSizeSlider.appendChild(labelContainer);
        fontSizeSlider.appendChild(inputRange);
        col1Div.appendChild(fontSizeSlider);
        inputRange.addEventListener('input', function () {
            var fontSize;
            switch (parseInt(this.value)) {
                case 1:
                    fontSize = '14px';
                    break;
                case 2:
                    fontSize = '16px';
                    break;
                case 3:
                    fontSize = '18px';
                    break;
                case 4:
                    fontSize = '20px';
                    break;
                case 5:
                    fontSize = '22px';
                    break;
                default:
                    fontSize = '18px'; 
            }
        
            // Change the font size of the entire webpage
            desElement.style.fontSize = fontSize;
        });
        
        function createSpan(fontSize) {
            var span = document.createElement('span');
            span.classList.add('mx-1');
            span.textContent = 'aA';
            span.style.fontSize = fontSize;
            return span;
        }


        rowEle.appendChild(col1Div);
        itemsDiv.appendChild(backButtonDiv);
        itemsDiv.appendChild(headingEl);
        itemsDiv.appendChild(rowEle);


        var img = document.createElement('img');
        img.classList.add('card-img-top', 'img-fluid', 'h-100');
        img.src = blog.imageSrc;
        img.alt = 'Blog Image';

        var cardBodyDiv = document.createElement('div');
        cardBodyDiv.classList.add('card-body');

        var categoryButton = document.createElement('button');
        categoryButton.classList.add('text-primary', 'border-primary', 'mb-3');
        categoryButton.style.float="right";
        categoryButton.textContent = blog.category;

        var cardContentItemsDiv = document.createElement('div');
        cardContentItemsDiv.classList.add('card-content-items');

        var cardContentDiv = document.createElement('div');
        cardContentDiv.classList.add('card-content');

        var cardTitleDiv = document.createElement('div');
        cardTitleDiv.classList.add('card-title');

        var h4 = document.createElement('h4');
        h4.textContent = blog.title;

        var p = document.createElement('p');
        p.textContent = blog.content;

        // Empty div element
        var emptyDiv = document.createElement('div');
        emptyDiv.classList.add('mt-5');
        emptyDiv.setAttribute('id', 'item');
        var titleElement = document.createElement("h4");
        titleElement.textContent = blog.heading;
        var desElement = document.createElement('p');
        desElement.classList.add('mt-3');
        desElement.textContent = blog.description;

        emptyDiv.appendChild(titleElement);
        emptyDiv.appendChild(desElement);

        // Append elements to the DOM
        cardTitleDiv.appendChild(h4);
        cardTitleDiv.appendChild(p);
        cardTitleDiv.appendChild(emptyDiv);
        cardContentDiv.appendChild(cardTitleDiv);
        cardBodyDiv.appendChild(categoryButton);
        cardBodyDiv.appendChild(cardContentItemsDiv);
        cardBodyDiv.appendChild(cardContentDiv);
        cardDiv.appendChild(itemsDiv);
        cardDiv.appendChild(img);
        cardDiv.appendChild(cardBodyDiv);

        individualContainer.appendChild(cardDiv);
    }



    // Function to display related blogs
    function displayRelatedBlogs(relatedBlogs) {
        var individualContainer = document.getElementById('individualContainer');

        var relatedHeading=document.createElement('h3');
        relatedHeading.textContent="Related posts";
        relatedHeading.style.marginBottom="30px";
        relatedHeading.style.opacity="0.9"
        relatedHeading.classList.add('text-center');

        var hrLine=document.createElement('hr');
        hrLine.classList.add('border-3','border-dark');
        hrLine.style.margin="80px 0px 80px 0px";
        individualContainer.appendChild(hrLine);
        individualContainer.appendChild(relatedHeading)

        // Create a row for related blogs
        var relatedRowDiv = document.createElement('div');
        relatedRowDiv.classList.add('row', 'g-4');
        individualContainer.appendChild(relatedRowDiv);

        relatedBlogs.forEach(blog => {

            var relatedBlogDiv=document.createElement('div')
            relatedBlogDiv.classList.add('col','col-12','col-sm-12','col-lg-6')

            // Create elements for related blogs
            var relatedCardDiv = document.createElement('div');
            relatedCardDiv.classList.add('card','h-100','mb-3','border-0'); 

            var relatedImg = document.createElement('img');
            relatedImg.classList.add('card-img-top', 'img-fluid', 'h-100');
            relatedImg.src = blog.imageSrc;
            relatedImg.alt = 'Blog Image';

            var relatedCardBodyDiv = document.createElement('div');
            relatedCardBodyDiv.classList.add('card-body');

            var relatedCategoryButton = document.createElement('button');
            relatedCategoryButton.classList.add('text-primary', 'border-primary', 'mb-3');
            relatedCategoryButton.textContent = blog.category;

            var relatedCardContentItemsDiv = document.createElement('div');
            relatedCardContentItemsDiv.classList.add('card-content-items');

            var relatedUl = document.createElement('ul');
            relatedUl.classList.add('list-unstyled');

            ['author', 'role', 'readTime'].forEach(property => {
                var relatedLi = document.createElement('li');
                relatedLi.textContent = blog[property];
                relatedUl.appendChild(relatedLi);
            });

            var relatedCardContentDiv = document.createElement('div');
            relatedCardContentDiv.classList.add('card-content');

            var relatedCardTitleDiv = document.createElement('div');
            relatedCardTitleDiv.classList.add('card-title');

            var relatedH4 = document.createElement('h4');
            relatedH4.textContent = blog.heading;

            var relatedP = document.createElement('p');
            relatedP.textContent = blog.content;

            // Append elements for related blogs to the DOM
            relatedCardContentItemsDiv.appendChild(relatedUl);
            relatedCardTitleDiv.appendChild(relatedH4);
            relatedCardTitleDiv.appendChild(relatedP);
            relatedCardContentDiv.appendChild(relatedCardTitleDiv);

            relatedCardBodyDiv.appendChild(relatedCategoryButton);
            relatedCardBodyDiv.appendChild(relatedCardContentItemsDiv);
            relatedCardBodyDiv.appendChild(relatedCardContentDiv);

            relatedCardDiv.appendChild(relatedImg);
            relatedCardDiv.appendChild(relatedCardBodyDiv);
            relatedBlogDiv.appendChild(relatedCardDiv);

            relatedRowDiv.appendChild(relatedBlogDiv);
        });
    }





    // Function to highlight the link based on the category
    function highlightLink(category) {
        var navLinks = document.querySelectorAll('.navbar-nav a');
        navLinks.forEach(link => {
            if (link.dataset.category === category) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
});
