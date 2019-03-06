$(function () {

  var PREVSEL = '#domain-edit-defaults > div:nth-child(10)';
  var CHECKBOXHTML = '<div class="control-group" style="margin-bottom: 5px;"><label class="control-label" for="recordings">&nbsp;</label><div class="controls"><label class="checkbox"><input type="hidden" id="DomainTranscriptionDisable_" value="0"><input type="checkbox" id="DomainTranscriptionDisable" name="transcription_disable" value="1"><span>Disable Voicemail Transcription</span></label></div></div>';

  // Select the node that will be observed for mutations
  var targetNode = document.getElementById('write-domain');

  // Options for the observer (which mutations to observe)
  var config = { attributes: true, childList: true, subtree: true };

  function disableTranscription(subscribers) {
    subscribers.map(sub => {

      var args = {
        object: 'subscriber',
        action: 'update',
        uid: sub['user'] + '@' + sub['domain'],
        vmail_transcribe: 'no',
      };

      netsapiens.api.post(args);
    });
  }

  function submitHandler() {
    // check that the right modal is open
    if ( $('#write-domain').hasClass('in') ) {
      if ( $('#DomainTranscriptionDisable').is(':checked') ) {
        var domain = $('#domain-edit-basic > div:nth-child(3) > div > span.uneditable-input')[0].innerText;
        var args = {
          domain: domain,
          action: 'read',
          object: 'subscriber',
        };

        netsapiens.api.post(args, disableTranscription);
      }
    }
  }

  // Callback function to execute when mutations are observed
  var callback = function(mutationsList, observer) {
    for(var mutation of mutationsList) {
      if (mutation.type == 'attributes') {
        if (mutation.attributeName === "class" ) {

          if ( mutation.target === document.querySelector('#write-domain.modal.hide.fade.in') ) {

            // hide the old dropdown
            var dropdown = document.querySelector('#domain-edit-defaults > div.control-group.transciptDiv');
            if (dropdown.classList) {
              dropdown.classList.add('hide');
            }
            else {
              dropdown.className += ' ' + 'hide';
            }

            var prev_checkbox = $(PREVSEL);
            prev_checkbox.css('margin-bottom', '5px');
            prev_checkbox.after(CHECKBOXHTML);

            var submit_button = document.querySelector('.saving');
            if (submit_button) {
              submit_button.addEventListener('click', submitHandler);
            }
          }
        }
      }
    }
  };

  // Create an observer instance linked to the callback function
  var observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);

});