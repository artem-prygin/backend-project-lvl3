(self.webpackChunkflashscore=self.webpackChunkflashscore||[]).push([[1354],{17573:()=>{let e;!function(){function t(){clearTimeout(e),e=setTimeout((function(){!function(){const e=$(".menuTop__content").offset();if(e){let t=e.top;$(".menuTop__item").each((function(){let e=$(this).offset().top,i=$(this).hasClass("menuTop__item--active");o($(this).attr("data-sport-id"),t===e,i)}))}}()}),100)}function o(e,t,o){let i='body .menuMinority__item[data-sport-id="'+e+'"]',n="menuMinority__item--hidden",c=".isSportPage h2.breadcrumb",a="breadcrumb--hidden",s="body .menuMinority__title",l="menuMinority__title--active";t?($(i).addClass(n),o&&($(c).addClass(a),$(s).removeClass(l))):($(i).removeClass(n),o&&($(c).removeClass(a),$(s).addClass(l)))}$(window).on("resize",(function(){t()})),t()}(),$(".lsid__buttonClose").click((function(e){e.stopPropagation(),$(this).parents("#lsid").find(".settings-list").hide(),$(this).parents("#lsid").find("#arrow").removeClass("arrow-rotation"),$(this).parents("#lsid").find(".lsid-dropdown").removeClass("lsid-dropdown--active")})),$(".header__buttonClose").click((function(e){e.stopPropagation(),$(this).parent().removeClass("header__button--active"),$(".container__myMenu").removeClass("myMenu--active")})),function(){let e=document.querySelector("#theme-switcher");e&&cjs.Api.loader.get("util/darkMode").call(e);let t=document.querySelector("#theme-switcher-mobile");t&&cjs.Api.loader.get("util/darkMode").call(t)}(),cjs.Api.loader.get("cjs").call((function(e){let t=e.dic.get("util_browser"),o=t.isAndroid(),i=t.isIos();const n=document.querySelector(".selfPromo__app--ios"),c=document.querySelector(".selfPromo__app--android"),a=document.querySelector(".selfPromo__app--huawei");o&&n?n.classList.add("selfPromo__app--hidden"):i&&(c&&c.classList.add("selfPromo__app--hidden"),a&&a.classList.add("selfPromo__app--hidden")),$((function(){if(!e.Api.config.get("app","identity","enabled")){let t=e.dic.get("Helper_ViewportSwitcher");t.prepareClasses(),t.delegateActions()}})),l.sports_count.show_menu(),menuMinorityGenerateSportCount(),e.Api.loader.get("react").call((function(e){e.reloadOnDayChange()})),e.fromGlobalScope.lsid_init(),void 0!==e.fromGlobalScope.ls&&e.fromGlobalScope.ls.loginClient&&e.fromGlobalScope.ls.loginClient.loggedIn()&&($(".seoTop").hide().addClass("seoTopHidden"),document.body.classList.remove("seoTopWrapperHidden")),$(".header__button--switch").click((function(){e.dic.get("HighlightWindowManager").changeActive("verticalMenu")})),$(document).on("click","#livescore-settings .backButton",(function(){e.dic.get("HighlightWindowManager").changeActive("settings")})),$(document).on("click","#langBox",(function(){e.dic.get("HighlightWindowManager").changeActive("langBox")})),$(document).on("click",".langBox .backButton, .langMenu .langMenu__close",(function(){e.dic.get("HighlightWindowManager").changeActive("langBox")})),$(document).on("click",".contents__passwordChange .backButton",(function(){e.dic.get("HighlightWindowManager").changeActive("changePassword")})),$(document).on("click","#delete-account-no",(function(){e.dic.get("HighlightWindowManager").changeActive("loggedIn",!0)})),e.Api.config.get("app","odds","enable")&&e.dic.get("util_enviroment").getGeoIp((function(t,o){e.dic.get("Helper_GambleResponsibly").removeNotice(t,o,e.dic.get("util_enviroment").getBookmakersData())}))})),$(document).on("click","#privacySettings-agree",(function(){cjs.dic.get("HighlightWindowManager").changeActive("privacySettings")}))}},e=>{var t;t=17573,e(e.s=t)}]);