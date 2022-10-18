/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createGroup, fields has property 'name'
 */

 function createGroup(fields) {
    fetch('/api/groups', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
      .then(showResponse)
      .catch(showResponse);
  }