/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has property 'username' and 'password'
 */

function createPause(fields) {
    fetch('/api/pause', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
      .then(showResponse)
      .catch(showResponse);
  }

function viewPause(fields) {
    fetch('/api/pause')
      .then(showResponse)
      .catch(showResponse);
  }

  function editPauseMinutesActive(fields) {
    fetch(`/api/pause/minutesActive`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
      .then(showResponse)
      .catch(showResponse);
  }

  function editPauseThreshold(fields) {
    fetch(`/api/pause/threshold`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
      .then(showResponse)
      .catch(showResponse);
  }