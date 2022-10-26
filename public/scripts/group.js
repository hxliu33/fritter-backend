/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properties 'username' and 'password'
 */

 function viewGroup(fields) {
  fetch(`/api/groups/${fields.groupId}`)
    .then(showResponse)
    .catch(showResponse);
}

function viewGroupsMember(fields) {
  fetch(`/api/groups/member`)
    .then(showResponse)
    .catch(showResponse);
}

function viewGroupsAdmin(fields) {
  fetch(`/api/groups/admin`)
    .then(showResponse)
    .catch(showResponse);
}

function createGroup(fields) {
  fetch('/api/groups', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function editGroupMember(fields) {
  fetch(`/api/groups/${fields.groupId}/member`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function editGroupAdmin(fields) {
  fetch(`/api/groups/${fields.groupId}/admin`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function editGroupPost(fields) {
  fetch(`/api/groups/${fields.groupId}/post`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function editGroupPrivacy(fields) {
  fetch(`/api/groups/${fields.id}?isPrivate=${fields.isPrivate}`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function deleteGroup(fields) {
  fetch(`/api/groups/${fields.groupId}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}