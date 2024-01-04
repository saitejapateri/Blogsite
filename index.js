$(document).ready(function() {
    setTimeout(function(){
        $('.loader_bg').fadeToggle();
    }, 1500);
  });

//search logo
var searchLogo = document.getElementById("searchLogo");
var searchForm = document.getElementById("searchForm");
searchLogo.addEventListener('click',()=>{
    searchLogo.style.display="none";
    searchForm.classList.replace('d-none','d-flex');
})

var firstBlog=true;
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



    // Fetching the data from external json file
    fetch('blogs.json')
        .then(response => response.json())
        .then(blogDataList => {
            loadBlogs(blogDataList, 'blogContainer');

            // Add event listeners to navigation links
            var navLinks = document.querySelectorAll('.navbar-nav a');
            navLinks.forEach(link => {
                link.addEventListener('click', function (event) {
                    event.preventDefault();
                    // console.log('link is', this.dataset.category); 
                    var category = this.dataset.category;
                    // Remove active class from all links
                    navLinks.forEach(navLink => {
                        navLink.classList.remove('active');
                    });
                    // Add active class to the clicked link
                    this.classList.add('active');
                    firstBlog=true;

                    if(category === 'all')
                    {
                        loadBlogs(blogDataList,'blogContainer');
                    }
                    else{
                        loadBlogsByCategory(blogDataList, 'blogContainer', category);
                    }
                });
            });

            var allTitles = blogDataList.map(post => post.heading.toLowerCase());
            console.log(allTitles)
            var suggestionsList = document.getElementById('suggestions-list');
            console.log(suggestionsList)
    
            allTitles.forEach(title => {
                var option = document.createElement('option');
                option.value = title;
                suggestionsList.appendChild(option);
            });

            var searchInput = document.getElementById('search-item');
            searchInput.addEventListener('focus', function () {
                searchInput.setAttribute('list', 'suggestions-list');
            });

            
            searchInput.addEventListener('input', function () {
                var value = searchInput.value.toLowerCase();
                console.log(value);
                filterSuggestions(allTitles, suggestionsList, value);
            });

            searchForm.addEventListener('submit', function (event) {
                event.preventDefault();
                var value = searchInput.value.toLowerCase();
                console.log(value);
                // Search based on title
                var filteredBlogs = blogDataList.filter(blog => blog.heading.toLowerCase().includes(value));
                loadBlogs(filteredBlogs, 'blogContainer');
            });

        })
        .catch(error => console.error('Error fetching blogs:', error));
});

function filterSuggestions(allTitles, suggestionsList, inputValue) {
    suggestionsList.innerHTML = '';
    var filteredTitles = allTitles.filter(title => title.includes(inputValue));
    filteredTitles.forEach(title => {
        var option = document.createElement('option');
        option.value = title;
        suggestionsList.appendChild(option);
    });
}

function loadBlogsByCategory(blogDataList, containerId, category) {
    // console.log(category);
    const filteredBlogs = blogDataList.filter(blog => blog.category.toLowerCase() === category.toLowerCase());
    loadBlogs(filteredBlogs, containerId);
}

function loadBlogs(blogDataList, containerId) {
    var blogContainer = document.getElementById(containerId);
    if (!blogContainer) {
        console.error('Container element not found:', containerId);
        return;
    }

    //overwriting the content after every click event
    blogContainer.innerHTML='';
    var firstBlog=true;
    var thirdBlog=true;
    var blogsPerPage = 9;
    var startIndex = 0;

    // blogs container
    var blogsContentContainer = document.createElement('div');
    blogsContentContainer.classList.add('blogs-content-container');
    blogContainer.appendChild(blogsContentContainer);
    

    // Function to display blogs
    function displayBlogs(start, end) {
        // Create blog elements for each item
        var rowDiv = document.createElement('div');
        rowDiv.classList.add('row', 'g-5');
        blogsContentContainer.appendChild(rowDiv);


        for (var i = start; i < end; i++) {
            var blogData = blogDataList[i];

            if (!blogData) {
                //break if there are no blogs
                break;
            }

            var blogDiv = document.createElement('div');
            blogDiv.classList.add('col');

            var cardDiv = document.createElement('div');
            cardDiv.classList.add('card', 'h-100','m-2','border-0','hover-pointer');


            var img = document.createElement('img');
            img.classList.add('card-img-top', 'img-fluid', 'h-100');
            img.src = blogData.imageSrc;
            img.alt = 'Blog Image';

            var cardBodyDiv = document.createElement('div');
            cardBodyDiv.classList.add('card-body','p-0','mt-2');

            var categoryButton = document.createElement('button');
            categoryButton.classList.add('text-primary', 'border-primary', 'mb-3');
            categoryButton.textContent = blogData.category;

            var cardContentItemsDiv = document.createElement('div');
            cardContentItemsDiv.classList.add('card-content-items');

            var ul = document.createElement('ul');
            ul.classList.add('list-unstyled');

            ['author', 'role', 'readTime'].forEach(property => {
                var li = document.createElement('li');
                li.textContent = blogData[property];
                ul.appendChild(li);
            });

            var dateEle=document.createElement('p');
            dateEle.textContent=blogData.date;


            var cardContentDiv = document.createElement('div');
            cardContentDiv.classList.add('card-content');

            var cardTitleDiv = document.createElement('div');
            cardTitleDiv.classList.add('card-title');

            var h4 = document.createElement('h4');
            h4.textContent = blogData.heading;

            var p = document.createElement('p');
            p.textContent = blogData.content;

            // Append elements to the DOM
            cardContentItemsDiv.appendChild(ul);
            cardContentItemsDiv.appendChild(dateEle);
            cardTitleDiv.appendChild(h4);
            cardTitleDiv.appendChild(p);
            cardContentDiv.appendChild(cardTitleDiv);

            cardBodyDiv.appendChild(categoryButton);
            cardBodyDiv.appendChild(cardContentItemsDiv);
            cardBodyDiv.appendChild(cardContentDiv);

            cardDiv.appendChild(img);
            cardDiv.appendChild(cardBodyDiv);

            blogDiv.appendChild(cardDiv);

            // first card occupies 100% (i.e., 12 columns)
            if (firstBlog) {
                blogDiv.classList.add('col-12', 'col-sm-12', 'col-md-12', 'col-lg-12');
                firstBlog=false;
            } else {
                blogDiv.classList.add('col-12', 'col-sm-12', 'col-md-12', 'col-lg-6');
            }

            cardDiv.addEventListener('click', function (clickedBlogData) {
                return function () {
                    // Handle the card click event
                    console.log('Card clicked:', clickedBlogData);
                    redirectToIndividualPage(clickedBlogData);
                };
            }(blogData));

            rowDiv.appendChild(blogDiv);

            
            if (i === start + 2  && thirdBlog) {
                thirdBlog=false;
                var horizontalLine = document.createElement('hr');
                horizontalLine.style.marginTop="80px";
                rowDiv.appendChild(horizontalLine);
                var trendingHeading=document.createElement('h3');
                trendingHeading.textContent="Trending topics";
                trendingHeading.classList.add('mb-0','ms-2')
                rowDiv.appendChild(trendingHeading);
            }
        }
    }

    // first display
    displayBlogs(startIndex, startIndex + blogsPerPage);

    // Show More button
    var divButton=document.createElement('div');
    divButton.classList.add('text-center','m-5')
    var showMoreButton = document.createElement('button');
    showMoreButton.textContent = 'SHOW MORE';
    showMoreButton.classList.add('btn', 'btn-primary', 'my-5');
    showMoreButton.addEventListener('click', function () {
        startIndex += blogsPerPage;
        displayBlogs(startIndex, startIndex + blogsPerPage);

        if (startIndex >= blogDataList.length) {
            //hiding the button after rendering all blogs
            showMoreButton.style.display = 'none';
        }
    });

    divButton.appendChild(showMoreButton);
    blogContainer.appendChild(divButton);

    function redirectToIndividualPage(clickedBlogData) {
        console.log(clickedBlogData.id)
        var individualPageLink = 'individual.html?id='+clickedBlogData.id;
        window.location.href = individualPageLink;
    }
}







