/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

 function viewCurrentFont(fields) {
    fetch('/api/font')
      .then(showResponse)
      .catch(showResponse);
  }
  
  function viewFontList(fields) {
    fetch(`/api/font/list`)
      .then(showResponse)
      .catch(showResponse);
  }
  
  function createFontSwitch(fields) {
    fetch('/api/font/list', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
      .then(showResponse)
      .catch(showResponse);
  }
  
  function editFontRemove(fields) {
    fetch(`/api/font/remove`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
      .then(showResponse)
      .catch(showResponse);
  }
  
  function editFontAdd(fields) {
    fetch(`/api/font/new`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
      .then(showResponse)
      .catch(showResponse);
  }
  
  function changeCurrentFont(fields) {
    fetch(`/api/font/current`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
      .then(showResponse)
      .catch(showResponse);
  }
