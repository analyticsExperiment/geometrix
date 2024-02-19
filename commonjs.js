window.digitalData = {
    "page": {
      "pageInfo": {
        "name": "",
        "pageType": "",
        "siteSection": "",
        "url": window.location.href ,
        "fullPageUrl": window.location.href,
        "siteSubsection" : "",
        "server" : "Geometrixx Clothiers Site"
      },
      "previousPageInfo": {
        "name": "",
        "pageType": "",
        "siteSection": "",
        "siteSubsection" : "",
        "url": "",
        "fullPageUrl": "",
        "server" : "Geometrixx Clothiers Site"
      }
    },
    "user": {
      "customerIdentifierHash": "",
      "loginStatus": "",
      "profileID": "",
      "userType": "Guest",
      "deviceType": "Desktop"
    },
    "event" : {
      'eventCategory' : "",
      'eventAction' : "",
      'eventLabel' : "",
      'eventParameter1' : ""
    }
   };

//Generic Functions
window.genericFunctions = {
    'cookieSetter' : function cookieSetter(name,value,days) {
                        var expires = "";
                        if (days) {
                            var date = new Date();
                            date.setTime(date.getTime() + (days*24*60*60*1000));
                            expires = "; expires=" + date.toUTCString();
                        }
                        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
                    },
    'cookieRemover' : function cookieRemover(name) {   
                            document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                    },
    'cookieExtractor' : function cookieExtractor(name) {
                            var nameEQ = name + "=";
                            var ca = document.cookie.split(';');
                            for(var i=0;i < ca.length;i++) {
                                var c = ca[i];
                                while (c.charAt(0)==' ') c = c.substring(1,c.length);
                                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
                            }
                            return null;
                        },
    'pagePathLastValue' : function pagePathLastValue(){
                            var urls = window.location.pathname.split('/');
                            if(urls.length > 0){
                              return urls[urls.length - 1];
                            }
                            else{
                              return undefined;
                            }
                        },
    'eventPush' : function eventPush(category, action, label, parameter1){
                     digitalData.event.eventCategory = category ? category : 'Category not defined';
                     digitalData.event.eventAction = action ? action : 'Action not defined';
                     digitalData.event.eventLabel = label ? label : 'Label not defined';
                     digitalData.event.eventParameter1 = parameter1 ? parameter1 : 'Parameter1 not defined';
                     _satellite.track('customEvent');
                  }
};


//Global variables setup
window.globalVariablesSetup = function globalVariablesSetup(){
  //Page Name Setter - Dynamic
  var lastValue = window.genericFunctions['pagePathLastValue']();
  if(lastValue){
    if(lastValue.indexOf('index') > -1){
        //Home Page
        window.digitalData.page.pageInfo.name = 'home';
        window.digitalData.page.pageInfo.pageType = 'home';
        window.digitalData.page.pageInfo.siteSection = 'home';
    }
    else{
        window.digitalData.page.pageInfo.name = lastValue.replace('.html','').replace('#','').trim();
    }
  }

  //Previous Page details capturer
  //Using Session Storage to get the information - PreviousPageInfo
  var previousPageInfo = sessionStorage.getItem('previousPageInfo') ? JSON.parse(sessionStorage.getItem('previousPageInfo')) : '';
  if(previousPageInfo){
    //Already a page is viewed before
    window.digitalData.page.previousPageInfo = previousPageInfo;
    var pageInfo = window.digitalData.page ? window.digitalData.page.pageInfo : '';
    //Setting up the previousPageInfo object with present page information which can be used in next page as previous page info
    if(pageInfo){
        sessionStorage.setItem('previousPageInfo',JSON.stringify(pageInfo));
    }
  }
  else{
    //landing page
    var pageInfo = window.digitalData.page ? window.digitalData.page.pageInfo : '';
    if(pageInfo){
        sessionStorage.setItem('previousPageInfo',JSON.stringify(pageInfo));
    }
  }
};

//Calling the Variables Setup
window.globalVariablesSetup();

//DataLayer - On Page Load - Page Info
window.dataLayer = [];
window.dataLayer.push({
  'event' : 'Page Details',
  'data' : window.digitalData
});

//Launch Injection
var script = document.createElement('script');
script.src = "https://assets.adobedtm.com/6d07e8369d1a/eddfb18269bf/launch-192d54330977-development.min.js";
script.async = true;
document.head.appendChild(script);

//GTM Injection
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NM6N9BRD');

//Global Components - Tracking
//Header Tracking
var headerLinks = document.querySelectorAll('.head_tabs_bar a');
for(var i = 0; i < headerLinks.length; i++){
  headerLinks[i].addEventListener('click',function(e){
    var clickText = e.target.innerText,
        subMenu = '';
    if(e.target.closest('.sub_menu')){
      //The Submenu link is interacted
      subMenu = e.target.closest('.sub_menu').parentNode.querySelector('.menu').innerText;
      window.genericFunctions.eventPush('HeaderInteraction',subMenu, clickText, 'SubMenu_Interaction');
    }
    window.genericFunctions.eventPush('HeaderInteraction','click',clickText, 'Menu_Interaction');
  });
}
