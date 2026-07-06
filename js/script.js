/*
 * @轮子的作者: 轮子哥
 * @Date: 2024-05-24 15:33:45
 * @LastEditTime: 2024-06-14 15:12:03
 */

const baseUrl = "https://ovosec.com/api"


function remoteInit() {
  //3分钟之内不重复请求
  // if (parseInt(localStorage.getItem("settingTime")) && (Date.now() - parseInt(localStorage.getItem("settingTime"))) < 1000 * 60 * 3) {
  //   requestIntit(JSON.parse(localStorage.getItem("settingAll")))
  //   return
  // }
  const xhr = new XMLHttpRequest();
  xhr.open('GET', baseUrl + '/master/settingAll', true);
  xhr.onload = function () {
    if (this.status === 200) {
      console.log("qingqiu",this.responseText)
      localStorage.setItem("settingTime", Date.now());
      localStorage.setItem("settingAll", this.responseText)
      requestIntit(JSON.parse(this.responseText))
    }
  };
  xhr.send();
}
remoteInit()

function loadSocialLinks() {
  const applyLinks = (data) => {
    // Update facebook links
    const fbLinks = document.querySelectorAll('.social-icon a .ti-facebook, .social-icon a i.ti-facebook');
    fbLinks.forEach(icon => {
      const link = icon.closest('a');
      if (link && data.facebook) {
        link.href = data.facebook;
      }
    });

    // Update twitter links
    const twitterLinks = document.querySelectorAll('.social-icon a .ti-twitter, .social-icon a i.ti-twitter, .social-icon a .ti-twitter-alt, .social-icon a i.ti-twitter-alt');
    twitterLinks.forEach(icon => {
      const link = icon.closest('a');
      if (link && data.twitter) {
        link.href = data.twitter;
      }
    });

    // Update instagram links
    const instaLinks = document.querySelectorAll('.social-icon a .ti-instagram, .social-icon a i.ti-instagram');
    instaLinks.forEach(icon => {
      const link = icon.closest('a');
      if (link && data.instagram) {
        link.href = data.instagram;
      }
    });

    const bindDownloadLink = (ids, url) => {
      ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          if (!url || url.trim() === "" || url.trim() === "#") {
            el.href = "javascript:void(0)";
            el.onclick = function(e) {
              e.preventDefault();
              if (typeof Swal !== 'undefined') {
                Swal.fire({
                  title: '提示',
                  text: '即将推出，请耐心等待',
                  icon: 'info',
                  confirmButtonText: '确定'
                });
              } else {
                alert('即将推出，请耐心等待');
              }
            };
          } else {
            el.href = url;
            el.onclick = null;
          }
        }
      });
    };

    // Update iOS links
    bindDownloadLink(['nav_ios', 'index_ios', 'index_ios_btn'], data.iosDownload);

    // Update Android links
    bindDownloadLink(['nav_android', 'index_android', 'index_android_btn'], data.androidDownload);

    // Update Windows links
    bindDownloadLink(['nav_window', 'index_window', 'index_window_btn'], data.windowDownload);

    // Update Mac links
    bindDownloadLink(['nav_mac', 'index_mac', 'index_mac_btn'], data.macDownload);

    // Update Friend login link & Nav login links
    bindDownloadLink(['friend_loginWbSize', 'nav_loginWebSize', 'influence_loginWbSize'], data.loginWebSize);
  };

  // 1. 异步拉取 social.json
  fetch('social.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.status);
      }
      return response.json();
    })
    .then(socialData => {
      console.log("social.json loaded successfully:", socialData);
      applyLinks(socialData);
    })
    .catch(error => {
      console.error("Could not fetch social.json:", error);
    });
}
loadSocialLinks();

function requestIntit(data) {

  const acc_helpWebSize = document.getElementById("acc_helpWebSize")
  acc_helpWebSize && (acc_helpWebSize.href = data.find(item => item.type === "helpWebSize")?.url)
  const parner_email = document.getElementById("parner_email")
  parner_email && (parner_email.href = data.find(item => item.type === "email")?.url)
  const parner_email2 = document.getElementById("parner_email2")
  parner_email2 && (parner_email2.href = data.find(item => item.type === "email")?.url)
  const footer_helpWebSize = document.getElementById("footer_helpWebSize")
  footer_helpWebSize && (footer_helpWebSize.href = data.find(item => item.type === "helpWebSize")?.url)
}


function supportSubmit(event) {
  event.preventDefault();
  document.getElementById('submitButton').disabled = true;
  const form = document.getElementById('support_form');
  const data = {
    name: form.querySelector('#support_name').value,
    email: form.querySelector('#support_email').value,
    device: form.querySelector('#support_device').value,
    operating: form.querySelector('#support_operating').value,
    subject: form.querySelector('#support_subject').value,
    message: form.querySelector('#support_message').value
  };
  const xhr = new XMLHttpRequest();
  xhr.open('POST', baseUrl + '/master/pushSupport', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = function () {
    document.getElementById('submitButton').disabled = false;
    if (this.status === 200) {
      Swal.fire({ title: 'Success!', text: 'Submitted successfully', icon: 'success', confirmButtonText: 'confirm' })
      form.reset()
    } else {
      Swal.fire({ title: 'Error!', text: 'Submitted failed', icon: 'error', confirmButtonText: 'confirm' })
    }
  };
  xhr.onerror = function () {
    document.getElementById('submitButton').disabled = false;
    Swal.fire({ title: 'Error!', text: 'It could be a network anomaly or a server anomaly', icon: 'error', confirmButtonText: 'confirm' })
  };
  xhr.send(JSON.stringify(data));
}

function contactSubmit(event) {
  event.preventDefault();
  const submitBtn = document.getElementById('submitButton');
  submitBtn.disabled = true;
  
  const form = document.getElementById('contact_form');
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  
  fetch(form.action, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
  .then(response => response.json())
  .then(res => {
    if (res.success === "true" || res.success === true) {
      Swal.fire({ title: 'Success!', text: 'Submitted successfully', icon: 'success', confirmButtonText: 'confirm' });
      form.reset();
    } else {
      // 抛出 FormSubmit 返回的真实错误原因
      Swal.fire({ title: 'Notice', text: res.message || 'Submission failed (Please check FormSubmit configuration)', icon: 'warning', confirmButtonText: 'confirm' });
    }
  })
  .catch(error => {
    Swal.fire({ title: 'Error!', text: 'It could be a network anomaly or a server anomaly', icon: 'error', confirmButtonText: 'confirm' });
  })
  .finally(() => {
    submitBtn.disabled = false;
  });
}


function careerSubmit(event) {
  event.preventDefault();
  const submitBtn = document.getElementById('careerSubmitButton');
  submitBtn.disabled = true;
  
  const form = document.getElementById('career_form');
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  
  fetch(form.action, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
  .then(response => response.json())
  .then(res => {
    if (res.success === "true" || res.success === true) {
      Swal.fire({ title: 'Success!', text: 'Application submitted successfully', icon: 'success', confirmButtonText: 'confirm' });
      form.reset();
      // 关闭模态框 (如果使用了 Bootstrap modal)
      $('#android-developer').modal('hide');
    } else {
      Swal.fire({ title: 'Notice', text: res.message || 'Submission failed (Please check FormSubmit configuration)', icon: 'warning', confirmButtonText: 'confirm' });
    }
  })
  .catch(error => {
    Swal.fire({ title: 'Error!', text: 'It could be a network anomaly or a server anomaly', icon: 'error', confirmButtonText: 'confirm' });
  })
  .finally(() => {
    submitBtn.disabled = false;
  });
}

function createCareer() {
  const careerList = document.getElementById("careerList")
  if (!careerList) {
    return
  }
  const xhr = new XMLHttpRequest();
  xhr.open('GET', baseUrl + '/master/jobAll', true);
  xhr.onload = function () {
    if (this.status === 200) {
      let data = JSON.parse(this.responseText)
      let innerHTML = ""

      data.forEach(element => {
        innerHTML = innerHTML +
          `            
        <div class="job">
          <div class="content">
            <h3>${element.name}</h3>
            <p>${element.location}</p>
          </div>
          <div class="apply-button">
            <a href="#" class="btn btn-main-sm" data-toggle="modal" data-target="#android-developer">View Details</a>
            <div class="modal fade jd-modal" id="android-developer" tabindex="-1">
              <div class="modal-dialog modal-lg">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title">${element.name}</h5>
                    <button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>
                  </div>
                  <div class="modal-body">
                    <div class="block-2">
                      <div class="title"><p>Location</p></div>
                      <div class="details"><p>${element.location}</p></div>
                    </div>
                    <div class="block-2">
                      <div class="title"><p>About You</p></div>
                      <div class="details"><p>${element.about}</p></div>
                    </div>
                    <div class="block-2">
                      <div class="title"><p>You will need to Have</p></div>
                      <div class="details"><p style="word-break: break-all;">${element.need}</p></div>
                    </div>
                    <div class="form-title">
                      <h3>Apply Now<span style="display:none" id="career_id">${element.id}</span></h3>
                    </div>
                    <form action="#" id="career_form" onsubmit="careerSubmit(event)">
                      <div class="row">
                        <div class="col-lg-6 col-md-12">
                          <input class="form-control main" type="text" placeholder="Name" required id="career_name">
                        </div>
                        <div class="col-lg-6 col-md-12">
                          <input class="form-control main" type="email" placeholder="Email Address" required id="career_email">
                        </div>
                        <div class="col-lg-6 col-md-12">
                          <input class="form-control main" type="text" placeholder="Portfolio Website Link" required id="career_websiteLink">
                        </div>
                        <div class="col-lg-6 col-md-12">
                          <input class="form-control main" type="text" placeholder="Github/Stackoverflow Link" required id="career_githubLink">
                        </div>
                        <div class="col-md-12">
                          <textarea class="form-control main" name="about" rows="10" placeholder="Write Something About You" id="career_aboutYou"></textarea>
                        </div>
                        <div class="col-12 text-right">
                          <button class="btn btn-main-md" id="submitButton">Apply Now</button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        `
      });
      careerList.innerHTML = `<div class="title text-center"><h2>Job Opening</h2></div>` + innerHTML
    }
  }
  xhr.send();
}
createCareer();

translate.language.setLocal('english'); 
if (localStorage.getItem("language")) {
  var storedLang = localStorage.getItem("language");
  translate.ignore.id.push('allModalCenter');
  translate.ignore.class.push('multi-language');
  translate.service.use('client.edge');
  translate.changeLanguage(storedLang === 'german' ? 'deutsch' : storedLang);
  
  // 页面加载时根据本地存储语言更新按钮文字
  var activeLi = document.querySelector('.language-ul li[data-value="' + storedLang + '"]');
  if (activeLi) {
    var langText = activeLi.textContent.trim();
    var multiLangBtn = document.querySelector('.multi-language');
    if (multiLangBtn) {
      multiLangBtn.innerHTML = '<i class="ti-world"></i> ' + langText;
    }
  }
}
var liElements = document.querySelectorAll('.language-ul li');
// 为每个<li>元素添加点击事件
for (var i = 0; i < liElements.length; i++) {
  liElements[i].addEventListener('click', function () {
    var dataValue = this.getAttribute('data-value');
    var langText = this.textContent.trim();
    
    // 点击选择语言时，实时同步更新按钮文字
    var multiLangBtn = document.querySelector('.multi-language');
    if (multiLangBtn) {
      multiLangBtn.innerHTML = '<i class="ti-world"></i> ' + langText;
    }

    translate.ignore.id.push('allModalCenter');
    translate.ignore.class.push('multi-language');
    localStorage.setItem('language', dataValue);
    translate.service.use('client.edge');
    translate.changeLanguage(dataValue === 'german' ? 'deutsch' : dataValue);
  });
}



(function ($) {
  'use strict';
  // ----------------------------
  // AOS
  // ----------------------------
  AOS.init({
    once: true
  });


  $(window).on('scroll', function () {
    //.Scroll to top show/hide
    var scrollToTop = $('.scroll-top-to'),
      scroll = $(window).scrollTop();
    if (scroll >= 200) {
      scrollToTop.fadeIn(200);
    } else {
      scrollToTop.fadeOut(100);
    }
  });
  // scroll-to-top
  $('.scroll-top-to').on('click', function () {
    $('body,html').animate({
      scrollTop: 0
    }, 500);
    return false;
  });

  $(document).ready(function () {

    // navbarDropdown
    if ($(window).width() < 992) {
      $('.main-nav .dropdown-toggle').on('click', function () {
        $(this).siblings('.dropdown-menu').animate({
          height: 'toggle'
        }, 300);
      });
    }

    // -----------------------------
    //  Testimonial Slider 
    // ----------------------------- 
    $('.testimonial-slider').slick({
      slidesToShow: 2,
      infinite: true,
      arrows: false,
      autoplay: true,
      autoplaySpeed: 2000,
      dots: true,
      responsive: [
        {
          breakpoint: 991,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    });


    // -----------------------------
    //  Video Replace
    // -----------------------------
    $('.video-box i').click(function () {
      var video = '<iframe class="border-0" allowfullscreen src="' + $(this).attr('data-video') + '"></iframe>';
      $(this).replaceWith(video);
    });


    // -----------------------------
    //  Count Down JS
    // -----------------------------
    var syoTimer = $('#simple-timer');
    if (syoTimer) {
      $('#simple-timer').syotimer({
        year: 2023,
        month: 9,
        day: 1,
        hour: 0,
        minute: 0
      });
    }


    // -----------------------------
    //  Story Slider
    // -----------------------------
    $('.about-slider').slick({
      slidesToShow: 1,
      infinite: true,
      arrows: false,
      autoplay: true,
      autoplaySpeed: 2000,
      dots: true
    });


    // -----------------------------
    //  Quote Slider
    // -----------------------------
    $('.quote-slider').slick({
      slidesToShow: 1,
      infinite: true,
      arrows: false,
      autoplay: true,
      autoplaySpeed: 2000,
      dots: true
    });


    // -----------------------------
    //  Client Slider
    // -----------------------------
    $('.client-slider').slick({
      slidesToShow: 4,
      infinite: true,
      arrows: false,
      // autoplay: true,
      autoplaySpeed: 2000,
      dots: true,
      responsive: [
        {
          breakpoint: 0,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 575,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 767,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2
          }
        },
        {
          breakpoint: 991,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 2
          }
        }
      ]
    });


    // scroll
    // $('.scrollTo').on('click', function (e) {
    //   e.preventDefault();
    //   var target = $(this).attr('href');
    //   $('html, body').animate({
    //     scrollTop: ($(target).offset().top)
    //   }, 500);
    // });

  });

})(jQuery);