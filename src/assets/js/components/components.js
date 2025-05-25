// // Show comment section
// $(document).ready(function () {
//     $('#show-comments').click(function () {
//         $('.hide-comments').slideToggle("slow");
//         // Alternative animation for example
//         // slideToggle("fast");
//     });
// });

// // Video.js
// $(function () {
//     var $refreshButton = $('#refresh');
//     var $results = $('#css_result');

//     function refresh() {
//         var css = $('style.cp-pen-styles').text();
//         $results.html(css);
//     }

//     refresh();
//     $refreshButton.click(refresh);

//     // Select all the contents when clicked
//     $results.click(function () {
//         $(this).select();
//     });
// });

// //Messenger page script
// $(".messages").animate({
//     scrollTop: $(document).height()
// }, "fast");

// $(".conv-img").click(function () {
//     $("#status-options").toggleClass("messenger-user-active");
// });

// $(".expand-button").click(function () {
//     $(".message-profile").toggleClass("expanded");
//     $("#contacts").toggleClass("expanded");
// });

// $("#status-options ul li").click(function () {
//     $(".conv-img").removeClass();
//     $("#status-online").removeClass("messenger-user-active");
//     $("#status-away").removeClass("messenger-user-active");
//     $("#status-busy").removeClass("messenger-user-active");
//     $("#status-offline").removeClass("messenger-user-active");
//     $(this).addClass("messenger-user-active");

//     if ($("#status-online").hasClass("messenger-user-active")) {
//         $(".conv-img").addClass("online");
//     } else if ($("#status-away").hasClass("messenger-user-active")) {
//         $(".conv-img").addClass("away");
//     } else if ($("#status-busy").hasClass("messenger-user-active")) {
//         $(".conv-img").addClass("busy");
//     } else if ($("#status-offline").hasClass("messenger-user-active")) {
//         $(".conv-img").addClass("offline");
//     } else {
//         $(".conv-img").removeClass();
//     };

//     $("#status-options").removeClass("messenger-user-active");
// });

// function newMessage() {
//     message = $(".message-input input").val();
//     if ($.trim(message) == '') {
//         return false;
//     }
//     $('<li class="message-reply"><p>' + message + '</p></li>').appendTo($('.messages ul'));
//     $('.message-input input').val(null);
//     $('.contact.active .preview').html('<span>You: </span>' + message);
//     $(".messages").animate({
//         scrollTop: $(document).height()
//     }, "fast");
// };

// $('#send-message').click(function () {
//     newMessage();
// });

// $(window).on('keydown', function (e) {
//     if (e.which == 13) {
//         newMessage();
//         return false;
//     }
// });

// // Enable tooltip
// $(function () {
//   $('[data-toggle="tooltip"]').tooltip();
// });
// Show comment section
document.addEventListener("DOMContentLoaded", function () {
  const showCommentsBtn = document.getElementById('show-comments');
  const hideComments = document.querySelector('.hide-comments');

  if (showCommentsBtn && hideComments) {
      showCommentsBtn.addEventListener('click', function () {
          if (hideComments.style.display === "none" || hideComments.style.display === "") {
              hideComments.style.display = "block";
              hideComments.style.transition = "all 0.5s";
          } else {
              hideComments.style.display = "none";
          }
      });
  }
});

// Video.js functionality
document.addEventListener("DOMContentLoaded", function () {
  const refreshButton = document.getElementById('refresh');
  const results = document.getElementById('css_result');

  function refresh() {
      const styleTag = document.querySelector('style.cp-pen-styles');
      if (styleTag && results) {
          results.textContent = styleTag.textContent;
      }
  }

  refresh();

  if (refreshButton) {
      refreshButton.addEventListener('click', refresh);
  }

  if (results) {
      results.addEventListener('click', function () {
          const range = document.createRange();
          range.selectNodeContents(results);
          const selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);
      });
  }
});

// Messenger page script
document.addEventListener("DOMContentLoaded", function () {
  const messagesContainer = document.querySelector(".messages");
  if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  const convImg = document.querySelector(".conv-img");
  const statusOptions = document.getElementById("status-options");
  const expandButton = document.querySelector(".expand-button");
  const messageProfile = document.querySelector(".message-profile");
  const contacts = document.getElementById("contacts");

  if (convImg && statusOptions) {
      convImg.addEventListener("click", function () {
          statusOptions.classList.toggle("messenger-user-active");
      });
  }

  if (expandButton && messageProfile && contacts) {
      expandButton.addEventListener("click", function () {
          messageProfile.classList.toggle("expanded");
          contacts.classList.toggle("expanded");
      });
  }

  const statusListItems = document.querySelectorAll("#status-options ul li");
  statusListItems.forEach(function (item) {
      item.addEventListener("click", function () {
          document.querySelectorAll(".conv-img").forEach(img => img.className = "conv-img");
          document.querySelectorAll("#status-options ul li").forEach(li => li.classList.remove("messenger-user-active"));

          item.classList.add("messenger-user-active");

          const convImg = document.querySelector(".conv-img");
          if (document.getElementById("status-online").classList.contains("messenger-user-active")) {
              convImg.classList.add("online");
          } else if (document.getElementById("status-away").classList.contains("messenger-user-active")) {
              convImg.classList.add("away");
          } else if (document.getElementById("status-busy").classList.contains("messenger-user-active")) {
              convImg.classList.add("busy");
          } else if (document.getElementById("status-offline").classList.contains("messenger-user-active")) {
              convImg.classList.add("offline");
          }

          statusOptions.classList.remove("messenger-user-active");
      });
  });

  function newMessage() {
      const messageInput = document.querySelector(".message-input input");
      if (!messageInput) return;

      const message = messageInput.value.trim();
      if (message === '') return;

      const ul = document.querySelector(".messages ul");
      if (ul) {
          const li = document.createElement('li');
          li.className = 'message-reply';
          li.innerHTML = `<p>${message}</p>`;
          ul.appendChild(li);

          messageInput.value = '';
          const activeContact = document.querySelector('.contact.active .preview');
          if (activeContact) {
              activeContact.innerHTML = `<span>You: </span>${message}`;
          }

          messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
  }

  const sendMessageButton = document.getElementById('send-message');
  if (sendMessageButton) {
      sendMessageButton.addEventListener('click', newMessage);
  }

  window.addEventListener('keydown', function (e) {
      if (e.key === "Enter") {
          newMessage();
          e.preventDefault();
      }
  });

  // Enable tooltip (basic implementation)
  const tooltipElements = document.querySelectorAll('[data-toggle="tooltip"]');
  tooltipElements.forEach(function (el) {
      el.addEventListener('mouseenter', function () {
          el.setAttribute('title', el.getAttribute('data-original-title') || 'Tooltip');
      });
  });
});
const element = document.getElementById('some-id');
if (element) {
  element.style.display = 'none';
}
