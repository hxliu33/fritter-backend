// Show an object on the screen.
function showObject(obj) {
  const pre = document.getElementById('response');
  const preParent = pre.parentElement;
  pre.innerText = JSON.stringify(obj, null, 4);
  preParent.classList.add('flashing');
  setTimeout(() => {
    preParent.classList.remove('flashing');
  }, 300);
}

function showResponse(response) {
  response.json().then(data => {
    showObject({
      data,
      status: response.status,
      statusText: response.statusText
    });
  });
}

/**
 * IT IS UNLIKELY THAT YOU WILL WANT TO EDIT THE CODE ABOVE.
 * EDIT THE CODE BELOW TO SEND REQUESTS TO YOUR API.
 *
 * Native browser Fetch API documentation to fetch resources: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
 */

// Map form (by id) to the function that should be called on submit
const formsAndHandlers = {
  'create-user': createUser,
  'delete-user': deleteUser,
  'change-username': changeUsername,
  'change-password': changePassword,
  'sign-in': signIn,
  'sign-out': signOut,
  'view-all-freets': viewAllFreets,
  'view-freets-by-author': viewFreetsByAuthor,
  'create-freet': createFreet,
  'edit-freet': editFreet,
  'edit-freet-anon': editFreetAnon,
  'delete-freet': deleteFreet,
  'create-group': createGroup,
  'create-pause': createPause,
  'view-pause': viewPause,
  'change-minutes-active': editPauseMinutesActive,
  'change-threshold': editPauseThreshold,
  'create-fontswitch': createFontSwitch,
  'view-current-font': viewCurrentFont,
  'view-font-list': viewFontList,
  'change-fontlist-remove': editFontRemove,
  'change-current-font': changeCurrentFont,
  'change-fontlist-add': editFontAdd,
  'create-group': createGroup,
  'view-group': viewGroup,
  'view-member-groups': viewGroupsMember,
  'view-admin-groups': viewGroupsAdmin,
  'add-member': editGroupMember,
  'add-admin': editGroupAdmin,
  'add-post': editGroupPost,
  'change-privacy': editGroupPrivacy,
  'delete-group': deleteGroup,
};

// Attach handlers to forms
function init() {
  Object.entries(formsAndHandlers).forEach(([formID, handler]) => {
    const form = document.getElementById(formID);
    form.onsubmit = e => {
      e.preventDefault();
      const formData = new FormData(form);
      handler(Object.fromEntries(formData.entries()));
      return false; // Don't reload page
    };
  });
}

// Attach handlers once DOM is ready
window.onload = init;
