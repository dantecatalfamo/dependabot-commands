// ==UserScript==
// @name        Dependabot commands - github.com
// @icon        https://avatars.githubusercontent.com/u/27347476?s=200&v=4
// @namespace   Violentmonkey Scripts
// @match       https://github.com/*
// @grant       none
// @version     1.2
// @author      Dante Catalfamo <dante@lambda.cx>
// @description Adds shortcut buttons to run dependabot commands in PRs where dependabot is the author
// @downloadURL https://gist.github.com/dantecatalfamo/f53aa60d13b3882f0fc5db92401227dc/raw/dependabot-commands.user.js
// ==/UserScript==

const commands = ['rebase', 'recreate', 'merge', 'close'];

function submitComment(text) {
  const inputCommentElement = document.getElementById('new_comment_field');
  const submitCommentElement = document.querySelector('#partial-new-comment-form-actions button.btn-primary')

  inputCommentElement.value = text;
  submitCommentElement.disabled = false;
  submitCommentElement.click();
}

function dependabotCommand(command) {
  submitComment(`@dependabot ${command}`);
}

function createDependabotButton(command) {
  const div = document.createElement('div');
  div.classList = 'color-bg-secondary';
  
  const btn = document.createElement('button');
  btn.classList = 'btn';
  btn.type = 'button';
  btn.innerText = `@db ${command}`
  btn.addEventListener('click', function() {
    dependabotCommand(command);
  });
  
  div.appendChild(btn);
  return div;
}

function addDependabotButton(command) {
  const buttonContainerElement = document.querySelector('#partial-new-comment-form-actions .d-flex')
  const div = createDependabotButton(command);
  
  buttonContainerElement.lastElementChild.before(div);
}

function addDependabotButtons() {
  commands.forEach(function(command) {
    addDependabotButton(command);
  });
}

function isDependabot() {
  return document.querySelector('.TimelineItem .author').innerText === 'dependabot'
}

function maybeAddDependabotButtons() {
  if (isDependabot()) {
    addDependabotButtons();
  }
}

document.addEventListener('pjax:complete', maybeAddDependabotButtons);
maybeAddDependabotButtons();
